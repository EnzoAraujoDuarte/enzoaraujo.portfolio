import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Observer } from 'gsap/dist/Observer';
import { Draggable } from 'gsap/dist/Draggable';
import { SplitText } from 'gsap/dist/SplitText';
import { Flip } from 'gsap/dist/Flip';

// Registration is idempotent, but it must not run during SSR.
if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, ScrollTrigger, Observer, Draggable, SplitText, Flip);
}

export { gsap, useGSAP, ScrollTrigger, Observer, Draggable, SplitText, Flip };
