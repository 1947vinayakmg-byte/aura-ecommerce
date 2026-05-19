export const pageTransition = {
  initial: { 
    opacity: 0,
    filter: "blur(10px)",
    scale: 1.02
  },
  animate: {
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
    transition: {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1]
    }
  },
  exit: {
    opacity: 0,
    filter: "blur(10px)",
    scale: 0.98,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

export const slideUpTransition = {
  initial: { y: "100%" },
  animate: { 
    y: 0,
    transition: {
      duration: 1.5,
      ease: [0.16, 1, 0.3, 1]
    }
  },
  exit: { 
    y: "-100%",
    transition: {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};
