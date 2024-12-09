export const transitions = {
  spring: "spring",
  duration: 0.3,
  bounce: 0.2,
  ease: [0.23, 1, 0.32, 1], // Apple's custom cubic-bezier
};

export const scaleUp = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.95, opacity: 0 },
  transition: {
    type: transitions.spring,
    duration: transitions.duration,
    bounce: transitions.bounce,
  },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: {
    duration: 0.2,
    ease: transitions.ease,
  },
};

export const slideUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: 20, opacity: 0 },
  transition: {
    duration: transitions.duration,
    ease: transitions.ease,
  },
}; 