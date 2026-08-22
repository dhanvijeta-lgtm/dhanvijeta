// Performance & Device Detection Manager for Animated Background System

export class PerformanceManager {
  constructor() {
    this.isMobile = false;
    this.isTablet = false;
    this.isDesktop = true;
    this.prefersReducedMotion = false;
    this.isTabVisible = true;
    this.fpsTier = 'HIGH'; // 'HIGH' | 'MEDIUM' | 'LOW'

    this.init();
  }

  init() {
    if (typeof window === 'undefined') return;

    // Detect Reduced Motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.prefersReducedMotion = motionQuery.matches;
    motionQuery.addEventListener('change', (e) => {
      this.prefersReducedMotion = e.matches;
    });

    // Detect Viewport Device Type
    const updateDeviceType = () => {
      const width = window.innerWidth;
      this.isMobile = width < 768;
      this.isTablet = width >= 768 && width < 1024;
      this.isDesktop = width >= 1024;

      if (this.isMobile) {
        this.fpsTier = 'LOW';
      } else if (this.isTablet) {
        this.fpsTier = 'MEDIUM';
      } else {
        this.fpsTier = 'HIGH';
      }
    };

    updateDeviceType();
    window.addEventListener('resize', updateDeviceType, { passive: true });

    // Track Tab Visibility (pause background loops when tab is hidden)
    document.addEventListener('visibilitychange', () => {
      this.isTabVisible = !document.hidden;
    });
  }

  getParticleCount(variant = 'home') {
    if (this.prefersReducedMotion) return 0;
    if (this.isMobile) return 15;
    if (this.isTablet) return 30;

    switch (variant) {
      case 'home':
        return 65;
      case 'courses':
        return 40;
      case 'demo':
        return 45;
      case 'blog':
        return 35;
      case 'about':
        return 50;
      case 'contact':
        return 40;
      case 'batch':
        return 45;
      default:
        return 40;
    }
  }

  shouldEnableMouseParallax() {
    return this.isDesktop && !this.prefersReducedMotion;
  }
}

export const perfManager = new PerformanceManager();
export default perfManager;
