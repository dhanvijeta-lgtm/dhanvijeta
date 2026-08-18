// Simulated Financial Market Engine
export class MarketEngine {
  constructor() {
    this.basePrice = 24320.15;
    this.currentPrice = 24320.15;
    this.trend = 'BULLISH';
    this.volatility = 0.002;
    this.volume = 84.2;
    this.candles = this.generateInitialDataset();
  }

  generateInitialDataset(count = 34) {
    const candles = [];
    let price = 24100.0;
    const isMobile = window.innerWidth < 768;
    const spacingX = isMobile ? 0.95 : 0.88;

    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      
      let yBase = -3.2 + Math.pow(t, 1.75) * 7.8;
      if (i < 6) {
        yBase = -2.8 + (i * 0.05) - (Math.sin(i * 0.8) * 0.28);
      }

      const noise = (Math.sin(i * 0.7) * 15) + (Math.random() - 0.45) * 20;
      const open = price;
      const close = price + noise;
      const high = Math.max(open, close) + Math.random() * 18 + 5;
      const low = Math.min(open, close) - Math.random() * 18 - 5;
      const isGreen = close >= open || i % 4 !== 1;

      const bodyHeight = Math.max(0.35, Math.sin(i * 0.7) * 0.25 + 0.62);
      const bodyCenterY = yBase;

      const upperWickHeight = 0.28 + Math.random() * 0.35;
      const lowerWickHeight = 0.28 + Math.random() * 0.35;

      const upperWickCenterY = bodyCenterY + bodyHeight / 2 + upperWickHeight / 2;
      const lowerWickCenterY = bodyCenterY - bodyHeight / 2 - lowerWickHeight / 2;

      const posX = (i - count / 2) * spacingX;
      const posZ = Math.sin(i * 0.2) * 0.8 - t * 1.5;
      const isBreakout = i === 12 || i === 20 || i === 27 || i === 32;

      candles.push({
        id: i,
        date: `18 Aug 2026 10:${(i * 5).toString().padStart(2, '0')}`,
        open: open.toFixed(2),
        high: high.toFixed(2),
        low: low.toFixed(2),
        close: close.toFixed(2),
        volume: `${(3.5 + Math.random() * 4.2).toFixed(1)}M`,
        x: posX,
        z: posZ,
        bodyCenterY,
        bodyHeight,
        upperWickHeight,
        upperWickCenterY,
        lowerWickHeight,
        lowerWickCenterY,
        isGreen,
        color: isGreen ? '#00e5a0' : '#f43f5e',
        glowColor: isGreen ? '#00E676' : '#FF1744',
        isBreakout
      });

      price = close;
    }

    return candles;
  }
}

export default MarketEngine;
