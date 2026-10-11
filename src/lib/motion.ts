/** Whether the visitor has asked for less motion. Read when needed, so a change in settings applies straight away. */
export const lessMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Smooth scrolling, unless the visitor has asked for less motion. */
export const scrollBehaviour = (): ScrollBehavior => (lessMotion() ? "auto" : "smooth");
