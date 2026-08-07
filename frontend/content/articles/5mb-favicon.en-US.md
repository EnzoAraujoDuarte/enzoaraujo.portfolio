---
title: "My portfolio weighed 9 MB. The favicon alone was 5."
description: "I audited my own site and found a 5 MB profile photo being served as the favicon on every page. What I learned cutting 99.4% of the asset weight."
date: 2026-08-07
tags: ["Performance", "Next.js", "Web"]
---

There is a specific kind of irony in being a developer with a broken personal site. You spend the day optimising other people's stores, and your own business card ships 9 MB of images.

That is roughly what I found when I finally sat down to audit this site.

## The finding that hurts

The file `novafotoperfil.png` was **5,071,432 bytes**. Five megabytes. A 1933×1875 photo rendered at most 320 pixels wide.

That alone would be bad. But the real problem was three lines below, in `_document.js`:

```html
<link rel="icon" href="/Images/novafotoperfil.png" />
<link rel="apple-touch-icon" href="/Images/novafotoperfil.png" />
```

The favicon pointed at the 5 MB photo.

A favicon is fetched on **every** navigation, on every page. Anyone opening any route was downloading 5 MB to paint a 16-pixel icon — which, at 16 pixels, turned into an unrecognisable brown smudge.

And there was a third layer. The About page did this:

```html
<link rel="preload" as="image" href="/Images/novafotoperfil.png" />
```

A manual preload of the original file, running in parallel with the `next/image` pipeline that was already serving an optimised version. The browser downloaded the huge image **and** the processed one. A preload written with good intentions and the opposite effect: instead of speeding things up, it doubled the work.

Add a 4.5 MB background PNG and those two files came to **9.19 MB**.

## The fix was almost embarrassingly simple

I converted both images to WebP at dimensions that match their actual use:

| File | Before | After |
|---|---|---|
| Profile photo | 5,071 KB | 40 KB |
| Background | 4,461 KB | 11 KB |
| Favicon | 5,071 KB | 0.6 KB |

The background dropped 99.7%. That is not magic: it is a smooth purple-on-black gradient, and gradients are exactly what lossy compression handles well. The PNG was storing, with mathematical precision, an image that needed no precision at all.

The favicon became an SVG monogram I wrote by hand — three white bars forming an "E" on a purple square. 600 bytes. And unlike a face, it stays legible at 16 pixels.

I enabled AVIF in `next.config.js`, which Next does not turn on by default:

```js
images: {
  formats: ['image/avif', 'image/webp'],
  minimumCacheTTL: 60 * 60 * 24 * 365,
}
```

At its real render size, the photo now ships as **17.7 KB** of AVIF. Against 5 MB. That is a 99.7% cut on the single most requested file on the site.

Total: from 9.19 MB to 55.6 KB. **−99.4%.**

## The loop that never stopped

Assets are the obvious problem. The interesting one was in the JavaScript.

The homepage has a WebGL distortion effect behind the hero. The component ran like this:

```js
const animate = () => {
  requestAnimationFrame(animate);
  // ...per-frame maths + render
};
animate();
```

Nothing in that code stops. `requestAnimationFrame` reschedules itself forever. Scroll to the footer — it keeps running at 60 fps. Switch tabs — the browser throttles it, but the work stays scheduled. On a laptop that is fan noise. On a phone it is battery.

The fix is to pause when nobody is watching:

```js
const visibilityObserver = new IntersectionObserver(([entry]) => {
  isOnScreen = entry.isIntersecting;
  isOnScreen ? startLoop() : stopLoop();
});
visibilityObserver.observe(container);

document.addEventListener('visibilitychange', handleVisibilityChange);
```

`IntersectionObserver` stops it when the canvas leaves the viewport, `visibilitychange` stops it when the tab goes to the background. Two native APIs, no dependencies.

## The bug I only found because I tested wrong

While taking screenshots with headless Chrome to check my work, the homepage came back like this:

> Application error: a client-side exception has occurred.

My first reaction was to assume I had broken something. I checked the console:

```
THREE.WebGLRenderer: Error creating WebGL context.
```

Headless Chrome runs with the GPU disabled. No GPU, no WebGL context. And then:

```js
const renderer = new THREE.WebGLRenderer({ ... });
```

That line **throws**. There was no try/catch and no error boundary. The exception bubbled up, React unmounted the whole tree, and the page became an error screen.

I checked out the previous commit and confirmed it: the bug predated anything I had touched. It was not a regression — it was a real failure, waiting for the right user.

And there is a right user: an old device, a GPU on the browser blocklist, an outdated driver, a privacy setting that disables WebGL. For all of them, the homepage did not load with a plain background. The homepage **did not load**.

```js
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ ... });
} catch {
  setIsWebGLAvailable(false);
  return;
}
```

Without WebGL the component falls back to a static background using the same image. It loses the interaction and keeps the page.

The lesson: **a decorative effect should never be able to take down the whole page.** If the ornament fails, the content has to stay standing.

## Three smaller things that add up

**The universal selector.** The global CSS had this:

```css
* {
  @apply transition-colors duration-200;
}
```

A colour transition on *every* element in the document. Every `<div>`, every `<span>`, every node. Style and compositing cost spread across the entire tree to animate a handful of hovers. I removed it and applied transitions where they are actually used.

**The font nobody used.** The `<head>` loaded Inter, Poppins and Space Grotesk from Google Fonts. I searched the codebase for "Poppins": zero occurrences outside the import tag itself. Three weights downloaded on every visit for nothing.

I moved everything to `next/font`, which self-hosts the files, generates the preload, and removes the two render-blocking round trips to Google's domain.

**The chat in the homepage bundle.** A 568-line widget imported statically on the landing page. It became a `dynamic()` import. The route went from 9.05 kB to 4.51 kB.

## The part that is not about performance

With the house tidy, I rewrote the About page. It used to be a set of tabs — Introduction, Skills, Education, Career, Goals.

Tabs look like organisation. In practice they hide content. In my case they hid it completely: the inactive tabs did not exist in the DOM at all. They were not merely invisible — they were not there. They did not show up in a page search, screen readers could not reach them without interaction, and search engines saw a fraction of the content.

Switching to a continuous scroll solved an accessibility problem for free: the tab widget had no `role="tablist"`, no arrow-key navigation, and on mobile it turned into a horizontal scroller with a "swipe to see more" hint. With no tabs, none of that has to exist.

I also took the chance to kill the percentage bars. You have seen them: "React 70%", "Python 55%". They imply a precision that does not exist — nobody measures that — and they invite a comparison that does not flatter you. "Python 55%" says less than simply listing Pandas and Selenium and letting the reader draw their own conclusion.

## What I take from this

None of these problems were hard. None required an expensive tool, a big refactor, or a complicated architectural decision. A photo at the wrong size. An `href` pointing at the wrong file. A loop with no stop condition. A missing `try`.

What they had in common is that nobody had looked.

A personal site is the project we postpone the most. There is no client chasing you, no production alert, nobody complaining that it is slow — because visitors do not complain, they just close the tab.

If you have one, open DevTools on the Network tab right now. Sort by size. You will probably find something as silly as my 5 MB favicon.

*This site is still under construction. Coming up: removing the dead theme system, fixing SSR that always renders in the wrong language, and — maybe the most fun — a `border-radius` bug I found after writing this, where 27 elements use a CSS variable that was never defined.*
