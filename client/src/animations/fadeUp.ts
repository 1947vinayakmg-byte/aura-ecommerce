export const fadeUp = {
  hidden: { 
    opacity: 0, 
    y: 40 
  },
  visible: (custom: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      delay: custom,
      ease: [0.16, 1, 0.3, 1] // Custom luxury ease
    }
  })
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: (custom: number = 0) => ({
    opacity: 1,
    transition: {
      duration: 1.5,
      delay: custom,
      ease: "easeOut"
    }
  })
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};
