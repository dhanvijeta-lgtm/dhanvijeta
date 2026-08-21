/**
 * Dhan Vijeta Performance Manager
 * Measures GPU tier, screen width, device capability, and accessibility settings.
 */

export function detectPerformanceTier() {
  // 1. Check prefers-reduced-motion
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return {
      tier: 'REDUCED_MOTION',
      particleCount: 50,
      enableWebGL: false,
      enableShaders: false,
      fpsTarget: 30,
    };
  }

  if (typeof window === 'undefined') {
    return {
      tier: 'MEDIUM',
      particleCount: 800,
      enableWebGL: true,
      enableShaders: true,
      fpsTarget: 60,
    };
  }

  const width = window.innerWidth;
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;

  // 2. Check WebGL support & GPU renderer capabilities
  let hasWebGL = false;
  let gpuTier = 'HIGH';

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      hasWebGL = true;
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase();
        // Check for weak integrated GPUs / SwiftShader
        if (renderer.includes('swiftshader') || renderer.includes('llvmpipe') || renderer.includes('basic render')) {
          gpuTier = 'LOW';
        } else if (renderer.includes('intel') || renderer.includes('mali') || renderer.includes('adreno 506')) {
          gpuTier = 'MEDIUM';
        }
      }
    }
  } catch (e) {
    hasWebGL = false;
  }

  if (!hasWebGL) {
    return {
      tier: 'LOW',
      particleCount: 150,
      enableWebGL: false,
      enableShaders: false,
      fpsTarget: 30,
    };
  }

  // 3. Determine tier based on screen & GPU
  if (isMobile) {
    return {
      tier: 'MOBILE',
      particleCount: gpuTier === 'LOW' ? 200 : 400,
      enableWebGL: true,
      enableShaders: true,
      fpsTarget: 60,
    };
  }

  if (isTablet) {
    return {
      tier: 'MEDIUM',
      particleCount: gpuTier === 'LOW' ? 500 : 900,
      enableWebGL: true,
      enableShaders: true,
      fpsTarget: 60,
    };
  }

  // Desktop
  if (gpuTier === 'LOW') {
    return {
      tier: 'MEDIUM',
      particleCount: 800,
      enableWebGL: true,
      enableShaders: true,
      fpsTarget: 60,
    };
  }

  return {
    tier: 'HIGH',
    particleCount: 2200,
    enableWebGL: true,
    enableShaders: true,
    fpsTarget: 60,
  };
}
