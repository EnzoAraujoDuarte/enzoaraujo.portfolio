---
title: "My business card was out of date. So I redid the whole art direction."
description: "I have been studying Awwwards sites to understand how they pull off 3D and transitions. This is the result: typography, a hero shader, purposeful motion — and what I chose not to do."
date: 2026-08-07
tags: ["Design", "Motion", "WebGL", "Front-end"]
---

There is a specific kind of irony in being a developer with a broken personal site. You spend the day optimising other people's stores, and your own business card goes out of date.

That is roughly what I realised when I finally sat down to look at this site as a designer instead of a programmer.

## Where the push came from

For a while now I have been browsing [Awwwards](https://www.awwwards.com/sites) almost the way other people read a magazine. Not to copy layouts — to work out how those things are made.

The same things always catch me: 3D elements that react to the mouse, page transitions that do not feel like loading, text that arrives in a way you cannot quite explain but immediately register as different. From the outside it looks like magic. And magic is a terrible place to stop, because either you decide it is out of reach, or you copy it without understanding it.

So I turned my own site into a lab. The rule I set myself was simple: an effect only ships if I can explain it. If I do not know why it works, I cannot fix it when it breaks.

This article is what survived that filter.

## The diagnosis

The site was not ugly. It was generic — which is worse.

The About page was a set of tabs: Introduction, Skills, Education, Career, Goals. Skills showed up as percentage bars. Every section was a rounded card inside another rounded card. The backgrounds were flat. There was no footer at all — every page simply ended in nothing.

None of that is technically wrong. It is just what a portfolio looks like when it was assembled from tutorials. Recognisable from three metres away.

## Typography as a system, not a choice

The first step was to stop treating type as decoration.

I split it into two jobs. **Space Grotesk** for display — headings, numbers, labels. **Inter** for reading — paragraphs, descriptions. That is not an arbitrary aesthetic call: Space Grotesk has strong personality at large sizes and tires the eye in body copy; Inter is the reverse.

Then the details nobody notices consciously but everybody feels:

**Negative tracking on display.** Large type needs less space between letters, not more. The hero name uses `-0.045em`. Without it, a big headline looks stretched.

**Fluid scale.** Instead of stepping between breakpoints, the title interpolates:

```css
font-size: clamp(2.5rem, 9vw, 7.5rem);
```

**Positive tracking on labels.** The opposite of display. Small uppercase text needs air: `0.28em`. That is what makes a label look intentional instead of merely small.

## The 3D element: what actually happens in the hero

The homepage background is WebGL — a plane with a custom shader, through three.js. It was the first thing I wanted to genuinely understand, because it is exactly the kind of effect that used to look like magic to me.

It is not. It is one idea, and it fits in a paragraph.

There are **two textures**. The first is the image you see. The second is invisible: a tiny 10-by-10 grid where each cell stores two numbers — a horizontal and a vertical offset.

The fragment shader does one thing. Before reading a pixel from the image, it consults the grid and shifts the read coordinate:

```glsl
vec4 offset = texture2D(uDataTexture, vUv);
gl_FragColor = texture2D(uTexture, uv - 0.02 * offset.rg);
```

That is all. If the cell holds zero, the pixel is read from the right place and the image looks untouched. If it holds a value, the pixel is read from a slightly shifted place — and the image bends there.

What gives it life is whatever writes into that grid. Every frame, the code does two things:

1. **Multiplies every value by 0.9.** Each cell loses 10% of its offset per frame. That is what makes the distortion relax back to nothing on its own.
2. **Injects the mouse velocity into the cells near the cursor.** Not the position — the *velocity*. A still mouse distorts nothing, no matter where it sits.

Decaying distortion plus energy injected by movement. The whole effect is that.

Understanding the mechanism changed how I look at the sites I admire. It is nearly always a simple idea applied with rigour, not a secret technique.

### How to ship 3D without regretting it

Learning to build it was half the job. The other half was learning to **ship** it.

A WebGL canvas runs an animation loop at 60 frames per second. If nothing tells it to stop, it never does: you scroll to the footer and it keeps drawing; you switch tabs and the work stays scheduled. On a laptop that is fan noise. On a phone it is battery.

So the loop only runs when it makes sense — an `IntersectionObserver` pauses it when the canvas leaves the screen, and `visibilitychange` pauses it when the tab goes to the background.

And the rule I now carry: **an ornament must never be able to take down the page.** Creating a WebGL context can fail — old GPU, blocklisted driver, privacy setting. When it does, the component falls back to a static background using the same image. It loses the interaction and keeps the site standing.

## Transitions and motion

This is the part that changed the most.

The site already had animation. The problem was that it was always the same one: fade in and rise a little. Everything entered identically, so nothing had hierarchy. Motion without hierarchy is noise.

### Two curves, not four

I found four different easing curves scattered through the code, each picked in the moment with no relation to the others. I cut it to two, each with a job:

```js
export const EASE = {
  // decelerates into place — ordinary entrances
  out: [0.25, 0.46, 0.45, 0.94],
  // launches and settles long — expressive reveals
  expressive: [0.16, 1, 0.3, 1],
};
```

It sounds minor. It is not. When everything decelerates the same way, the whole thing gains a motion signature — and you feel it without knowing why.

### Masked reveals

The hero name used to scramble its letters before resolving. I removed it: it delayed the most important information on the page to deliver an effect that stopped being new around 2021.

In its place, the text rises from behind its own bounds:

```jsx
<span className="block overflow-hidden">
  <motion.span
    initial={{ y: '110%' }}
    animate={{ y: '0%' }}
    transition={{ duration: 0.9, ease: EASE.expressive }}
  >
    {children}
  </motion.span>
</span>
```

The trick is `overflow-hidden` on the parent. The text exists; it is just hidden behind the edge. When it rises, it feels like it was always there.

### Images arrive by cut, not by opacity

Fading an image in is the lazy answer. Cutting is better:

```js
export const clipReveal = {
  hidden: { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.06 },
  visible: { clipPath: 'inset(0% 0% 0% 0%)', scale: 1 },
};
```

The image is wiped in from the bottom while easing down from a slightly larger scale. Together they read as a camera settling.

### Where scroll becomes the narrator

Every site I admire has one typographic gesture you remember afterwards. Mine is a sentence — the one that defines how I work — that lights up word by word as you scroll. Each word gets its own slice of progress:

```jsx
const opacity = useTransform(progress, [start, end], [0.15, 1]);
```

With a dimmed copy underneath, so the sentence never appears from nothing: it is already there, just unread. Scroll stops being navigation and becomes pacing.

### Layers at different speeds

Depth does not come from shadows. It comes from things moving at different rates. The backdrop drifts 12% over the page. Project images drift inside their own frames. Hero content rises slightly faster as it leaves.

None of those movements is noticeable on its own. The combination is what creates the sense of space.

### The page transition

This was the hardest to get right, and the one that taught me the most.

The idea is simple: a panel slides up to cover the outgoing page and keeps going to reveal the incoming one. One continuous sweep.

My first version animated scale together with transform origin — growing from the bottom to cover, then shrinking toward the top. It kept freezing halfway.

The fix was to drop scale and use a single-axis translate. And that is the part I liked: **the animation corrects itself.** If the new route resolves before the cover finishes, the reveal simply continues the same upward motion instead of fighting it. The panel never needs to know which phase it is in — it just goes up.

One detail that matters more than it looks: the panel is `pointer-events: none`. Even if something goes wrong, it can never swallow a click.

### And for people who do not want motion

All of this respects `prefers-reduced-motion`. One warning that cost me time: the CSS guard does not reach animation driven by JavaScript. If the motion is computed in code, you have to check the preference in code too — otherwise you think you respected it and you did not.

## Fewer boxes, more rules

A rounded card is the fastest way to group information. It is also the most predictable. I replaced nearly all of them with a hairline and space — a one-pixel line and enough room separate just as well as a border with a fill and a shadow, and they do not shout "component library".

The percentage bars went with them. "React 70%", "Python 55%" — numbers nobody measures, inviting a comparison that does not flatter me. Listing Pandas and Selenium says more about what I do with Python than any invented percentage.

## Texture and the footer that did not exist

Flat `#111` is too digital. I added SVG-generated grain at 3.5% opacity. You do not see it — you feel it. It is the difference between a surface and a colour.

And the most obvious thing, which I had missed: the site had no footer at all. Every page ended in nothing, with no closing and no way to reach me. Now it ends with a large sentence and the site's paths.

## What I chose not to do

Two things almost every award-winning site has, and that I left out on purpose.

**A custom cursor.** Replacing the system cursor hurts anyone who depends on it, breaks click affordance, and adds nothing but showmanship.

**An intro loading screen.** It exists to manufacture a sense of weight. But I had just made the site light — inventing a wait to look sophisticated would undo that work in the most visible place possible.

Art direction is also what you choose to refuse.

## What I take from this

The gap between a generic portfolio and one that looks decided is almost never about having more effects. It is about coherence: two typefaces with clear jobs, two motion curves, one way to reveal an image, one way to separate a section.

And the bigger lesson came from the shader: what looked out of reach was a grid of numbers decaying 10% per frame. There is still plenty I cannot do — real geometry, lighting, a scene with actual depth. But now I know where to start asking.

If you also look at those sites and assume it is another level entirely: pick one effect, just one, and stay with it until you understand why it works. It is simpler than it looks, and the sense of magic disappears — which is exactly the point.
