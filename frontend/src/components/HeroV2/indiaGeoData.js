import * as THREE from 'three';

// High-precision geographic boundary polygon of India [lat, lon]
export const INDIA_BOUNDARY = [
  // Kutch & Gujarat
  [23.5, 68.2], [24.0, 68.1], [24.6, 69.2], [24.8, 71.0], [24.0, 72.4],
  [22.8, 70.8], [22.2, 69.2], [20.7, 72.7], [20.2, 72.9],
  // Konkan & Goa & Malabar (West Coast)
  [19.0, 72.8], [17.5, 73.2], [15.5, 73.8], [13.5, 74.7], [11.5, 75.6], [9.5, 76.3],
  // Southernmost Tip (Kanyakumari)
  [8.0, 77.5], [8.8, 78.1],
  // Tamil Nadu & Coromandel Coast (East Coast)
  [10.0, 79.8], [11.8, 79.8], [13.1, 80.3], [14.0, 80.1],
  // Andhra Pradesh & Odisha Coast
  [15.8, 80.3], [17.0, 82.3], [17.7, 83.3], [19.2, 84.8], [19.8, 85.8], [21.5, 87.0],
  // West Bengal & Sundarbans
  [21.6, 87.8], [22.0, 89.0], [23.2, 88.9], [25.0, 88.8],
  // Northeast Region (Tripura, Mizoram, Manipur, Nagaland, Assam, Arunachal)
  [24.0, 91.4], [23.0, 91.3], [23.2, 92.8], [24.2, 93.7], [25.5, 94.6],
  [27.2, 96.8], [28.4, 96.3], [29.0, 95.0], [28.2, 94.0], [27.0, 92.5],
  [26.5, 90.0], [26.8, 88.5],
  // Sikkim & Nepal Border
  [27.8, 88.6], [27.2, 88.1], [27.5, 85.3], [28.8, 81.3], [30.0, 80.6],
  // Uttarakhand & Himachal Pradesh
  [30.8, 79.0], [31.5, 78.0], [32.5, 76.8],
  // Jammu & Kashmir / Ladakh (Northern Tip)
  [33.5, 76.2], [34.8, 77.8], [35.6, 76.8], [35.2, 74.8], [34.0, 74.0], [32.8, 74.8],
  // Punjab & Rajasthan Western Border
  [31.6, 74.6], [30.5, 73.8], [29.8, 73.0], [28.2, 70.2], [26.8, 69.8], [25.4, 69.6],
  [24.5, 68.6], [23.5, 68.2]
];

// Ray-casting Point-in-Polygon check for India
export function isInsideIndia(lat, lon) {
  let inside = false;
  const poly = INDIA_BOUNDARY;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1];
    const xj = poly[j][0], yj = poly[j][1];
    const intersect = ((yi > lon) !== (yj > lon)) &&
        (lat < (xj - xi) * (lon - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// Major Indian Financial & Tech Hub Cities
export const INDIAN_CITIES = [
  { name: 'Delhi NCR', lat: 28.6139, lng: 77.2090, importance: 1.0 },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777, importance: 1.0 },
  { name: 'Bengaluru', lat: 12.9716, lng: 77.5946, importance: 0.95 },
  { name: 'Hyderabad', lat: 17.3850, lng: 78.4867, importance: 0.9 },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707, importance: 0.85 },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639, importance: 0.85 },
  { name: 'Pune', lat: 18.5204, lng: 73.8567, importance: 0.8 },
  { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714, importance: 0.8 }
];

// Network connection pairs between Indian hubs
export const INDIA_NETWORK_PAIRS = [
  [0, 1], // Delhi - Mumbai
  [1, 2], // Mumbai - Bengaluru
  [2, 4], // Bengaluru - Chennai
  [4, 3], // Chennai - Hyderabad
  [3, 0], // Hyderabad - Delhi
  [0, 5], // Delhi - Kolkata
  [5, 3], // Kolkata - Hyderabad
  [1, 7], // Mumbai - Ahmedabad
  [2, 6], // Bengaluru - Pune
  [1, 6], // Mumbai - Pune
  [7, 0]  // Ahmedabad - Delhi
];

// Convert spherical Lat/Lon to 3D Vector3
export function latLonToVector3(lat, lon, radius, offset = 0.05) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const r = radius + offset;
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

// Generate high-density golden particles for India (Boundary + Dotted Interior)
export function generateIndiaParticleData(radius, isMobile = false) {
  const positions = [];
  const colors = [];

  const targetCount = isMobile ? 2200 : 5000;
  const r = radius + 0.06;

  // 1. Sharp Golden Boundary Particles
  const boundaryPoly = INDIA_BOUNDARY;
  const boundaryStepsPerSegment = isMobile ? 12 : 24;

  for (let i = 0; i < boundaryPoly.length; i++) {
    const nextIdx = (i + 1) % boundaryPoly.length;
    const p1 = boundaryPoly[i];
    const p2 = boundaryPoly[nextIdx];

    for (let s = 0; s < boundaryStepsPerSegment; s++) {
      const t = s / boundaryStepsPerSegment;
      const lat = p1[0] + (p2[0] - p1[0]) * t + (Math.random() - 0.5) * 0.12;
      const lon = p1[1] + (p2[1] - p1[1]) * t + (Math.random() - 0.5) * 0.12;

      const v = latLonToVector3(lat, lon, r, (Math.random() - 0.5) * 0.02);
      positions.push(v.x, v.y, v.z);

      // Super bright outline highlight (#FFF3A3 to #FFD21F)
      if (Math.random() > 0.4) {
        colors.push(1.0, 0.95, 0.64); // Bright light gold
      } else {
        colors.push(1.0, 0.82, 0.12); // Deep rich gold
      }
    }
  }

  // 2. Interior Point Cloud Grid with Radial Core Brightness
  const step = isMobile ? 0.28 : 0.18;
  let interiorAdded = 0;

  for (let lat = 8.0; lat <= 35.5; lat += step) {
    for (let lon = 68.0; lon <= 96.0; lon += step) {
      // Check if point is inside India
      const jitterLat = lat + (Math.random() - 0.5) * step * 0.75;
      const jitterLon = lon + (Math.random() - 0.5) * step * 0.75;

      if (isInsideIndia(jitterLat, jitterLon)) {
        const v = latLonToVector3(jitterLat, jitterLon, r, (Math.random() - 0.5) * 0.03);
        positions.push(v.x, v.y, v.z);

        // Core distance for radial glow intensity (centered around Nagpur 21°N, 79°E)
        const distFromCenter = Math.hypot(jitterLat - 21.0, jitterLon - 79.0);
        const centerFactor = Math.max(0, 1 - distFromCenter / 15.0);

        if (centerFactor > 0.55 || Math.random() < 0.25) {
          // Core bright gold / white-yellow (#FFF3A3)
          colors.push(1.0, 0.95, 0.64);
        } else if (Math.random() > 0.3) {
          // Primary Gold (#FFD21F)
          colors.push(1.0, 0.82, 0.12);
        } else {
          // Warm Amber (#F59E0B)
          colors.push(0.96, 0.62, 0.04);
        }
        interiorAdded++;
      }
    }
  }

  // Fill additional random interior jitter particles if needed to hit target count
  while (positions.length / 3 < targetCount) {
    const lat = 8.0 + Math.random() * 27.5;
    const lon = 68.0 + Math.random() * 28.5;
    if (isInsideIndia(lat, lon)) {
      const v = latLonToVector3(lat, lon, r, (Math.random() - 0.5) * 0.04);
      positions.push(v.x, v.y, v.z);
      colors.push(1.0, 0.82 + Math.random() * 0.15, 0.15 + Math.random() * 0.3);
    }
  }

  return {
    positions: new Float32Array(positions),
    colors: new Float32Array(colors)
  };
}
