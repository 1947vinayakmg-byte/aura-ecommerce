export const luxuryHover = {
  initial: { 
    scale: 1,
    letterSpacing: "0.25em"
  },
  hover: {
    scale: 1.05,
    letterSpacing: "0.3em",
    color: "#D4AF37", // luxury-gold
    transition: {
      duration: 0.6,
      ease: [0.33, 1, 0.68, 1]
    }
  }
};

export const cardHover = {
  initial: { 
    y: 0,
    boxShadow: "0 0 0 rgba(212, 175, 55, 0)"
  },
  hover: {
    y: -10,
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(212, 175, 55, 0.1)",
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

export const imageReveal = {
  initial: { scale: 1.2, opacity: 0.6 },
  hover: { 
    scale: 1, 
    opacity: 1,
    transition: {
      duration: 1.5,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};
