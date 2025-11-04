
    document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // --- Smooth scroll (Lenis) ---
  const lenis = new Lenis({ 
    smooth: true, 
    lerp: 0.1,
    syncTouch: true 
  });
  
  let lastTime = 0;
  function raf(time) {
    if (time - lastTime > 16) {
      lenis.raf(time);
      ScrollTrigger.update();
      lastTime = time;
    }
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // --- Cache elements ---
  const cards = gsap.utils.toArray(".card");
  let mainContainer = document.querySelector(".mainContainer")
  const container = document.querySelector(".page1");
  const lineMover = document.querySelector(".lineMover");
  
  // Get initial positions for calculations
  const containerRect = container.getBoundingClientRect();
  const cardRects = cards.map(card => card.getBoundingClientRect());

  // --- Dynamic math values ---
  const containerCenterY = containerRect.height / 2;
  const cardHeight = cards[0]?.offsetHeight || 0;
  const cardCenterOffset = (containerCenterY - cardHeight / 2);

  // Calculate initial positions relative to container
  const initialPositions = cards.map((card, index) => {
    const rect = cardRects[index];
    return {
      x: rect.left - containerRect.left,
      y: rect.top - containerRect.top
    };
  });

  // --- Precomputed animation math ---
  const moveY = cardHeight * 1.4;
  const offsetX = containerRect.width *0.5; // proportional horizontal shift
  
  // Card animations with proper sequencing
  const cardAnimations = [
    { 
      y: `-=${moveY}`, 
      x: `+=${offsetX}`, 
      rotation: 45,
      scale: 1,
      duration: 1
    },
    { 
      y: `-=${moveY * 0.85}`, 
      rotation: 0,
      scale: 1,
      duration: 1
    },
    { 
      y: `-=${moveY * 2.2}`, 
      x: `+=${offsetX}`,
      rotation: 45,
      scale: 1,
      duration: 1
    },
    { 
      y: `-=${moveY * 1.7}`, 
      rotation: 0,
      scale: 1,
      duration: 1
    }
  ];

  // Line mover positions based on card movements
  const linePositions = [
    { x: 100, duration: 1 },
    { x: 210, duration: 1 },
    { x: 220, duration: 1 },
    // { x: 500, duration: 1 }
  ];

  // --- Timeline with improved sequencing ---
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".page1",
      start: "top top",
      end: "+=1500",
      scrub: 1,
      pin: true,
      anticipatePin: 1,
      markers: false // Set to true for debugging
    },
    defaults: {
      ease: "power2.inOut"
    }
  });

  // Master animation sequence
  tl
    // First card movement with line
    .to(cards[0], cardAnimations[0])
    .to(lineMover, linePositions[0], "<")
    // .to(".mainContainer",{backgroundColor:"red"})
    // Second card enters with slight delay
    .to(cards[1], cardAnimations[1], "-=0.7")
     .to(".mainContainer",{backgroundColor:"#B87C4C"},"<")
    // Second card continues movement with line
    .to(cards[1], cardAnimations[2])
    .to(lineMover, linePositions[1], "<")
    
    // Third card enters
    .to(cards[2], cardAnimations[3], "-=0.7")
     .to(".mainContainer",{backgroundColor:"#305669"},"-=0.7")
  // --- Enhanced visual effects ---
  // Add parallax and depth effects
  cards.forEach((card, index) => {
    // Initial setup for better performance
    gsap.set(card, { 
      willChange: "transform", 
      transformStyle: "preserve-3d",
      z: 0
    });
    
    
  });

  // Line mover enhancements
  gsap.set(lineMover, {
    willChange: "transform",
    transformOrigin: "left center"
  });

  // --- Performance optimizations ---
  ScrollTrigger.addEventListener("refresh", () => {
    cards.forEach(card => {
      card.style.willChange = "transform";
    });
    lineMover.style.willChange = "transform";
  });

  ScrollTrigger.addEventListener("refreshInit", () => {
    // Recalculate positions on refresh
    const updatedContainerRect = container.getBoundingClientRect();
    const updatedCardRects = cards.map(card => card.getBoundingClientRect());
    
    // Update timeline if needed
    tl.progress(0);
  });

  // --- Responsive handling ---
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
      // Re-initialize positions for responsive behavior
      const newContainerRect = container.getBoundingClientRect();
      const newCardRects = cards.map(card => card.getBoundingClientRect());
    }, 250);
  });


  // Expose cleanup for framework integration if needed
  window.cleanupScrollAnimations = cleanup;
});
