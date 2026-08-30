import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCoins, FaEthereum, FaGem, FaBitcoin } from 'react-icons/fa';

function CountUp({ target, decimals = 2, delay = 0.3, duration = 1600 }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now();
      const animate = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - (1 - progress) ** 3;
        setValue(target * eased);
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [target, delay, duration]);

  return (
    <span>
      {value.toLocaleString('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      })}
    </span>
  );
}

const MARKET_ASSETS = [
  {
    id: 'gold',
    name: 'GOLD',
    price: 7245.60,
    decimals: 2,
    change: '+0.78%',
    isUp: true,
    icon: FaCoins,
    iconColor: '#f59e0b',
    sparkline: 'M0 16 Q 25 4, 50 14 T 100 2',
    strokeColor: '#00e5a0',
    delay: 0.3,
    top: '12%',
    right: '22%'
  },
  {
    id: 'ethereum',
    name: 'ETHEREUM',
    price: 182540.30,
    decimals: 2,
    change: '+2.35%',
    isUp: true,
    icon: FaEthereum,
    iconColor: '#00e5ff',
    sparkline: 'M0 18 Q 30 6, 60 14 T 100 3',
    strokeColor: '#00e5ff',
    delay: 0.45,
    top: '12%',
    right: '4%'
  },
  {
    id: 'silver',
    name: 'SILVER',
    price: 89.65,
    decimals: 2,
    change: '+0.56%',
    isUp: true,
    icon: FaGem,
    iconColor: '#e2e8f0',
    sparkline: 'M0 15 Q 20 18, 55 8 T 100 4',
    strokeColor: '#00e5a0',
    delay: 0.6,
    top: '32%',
    right: '6%'
  },
  {
    id: 'bitcoin',
    name: 'BITCOIN',
    price: 6345210.80,
    decimals: 2,
    change: '+1.62%',
    isUp: true,
    icon: FaBitcoin,
    iconColor: '#f59e0b',
    sparkline: 'M0 17 Q 35 3, 65 12 T 100 2',
    strokeColor: '#00e5a0',
    delay: 0.75,
    top: '52%',
    right: '18%'
  }
];

export function HudGlassCards({ pointer = { x: 0, y: 0 } }) {
  const [assetState, setAssetState] = useState(
    MARKET_ASSETS.reduce((acc, a) => {
      acc[a.id] = { val: a.price, change: a.change, flash: false, isUp: true };
      return acc;
    }, {})
  );

  // Subtle live micro-ticks simulation (demo visualization)
  useEffect(() => {
    const interval = setInterval(() => {
      const targetAsset = MARKET_ASSETS[Math.floor(Math.random() * MARKET_ASSETS.length)];
      const isUp = Math.random() > 0.35;
      const deltaFactor = (Math.random() * 0.004 * (isUp ? 1 : -1));

      setAssetState((prev) => {
        const curr = prev[targetAsset.id];
        const newVal = Math.max(1, curr.val * (1 + deltaFactor));
        const pct = ((deltaFactor >= 0 ? '+' : '') + (parseFloat(curr.change) + deltaFactor * 100).toFixed(2) + '%');
        return {
          ...prev,
          [targetAsset.id]: {
            val: parseFloat(newVal.toFixed(2)),
            change: pct,
            flash: true,
            isUp
          }
        };
      });

      setTimeout(() => {
        setAssetState((prev) => ({
          ...prev,
          [targetAsset.id]: { ...prev[targetAsset.id], flash: false }
        }));
      }, 500);
    }, 3800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="absolute inset-0 pointer-events-none z-10 hidden lg:block overflow-hidden"
      style={{ transform: `translate(${pointer.x * 0.8}px, ${pointer.y * 0.8}px)` }}
    >
      {MARKET_ASSETS.map((asset) => {
        const state = assetState[asset.id] || { val: asset.price, change: asset.change, isUp: true };
        const IconComponent = asset.icon;

        return (
          <motion.div
            key={asset.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: asset.delay, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'absolute', top: asset.top, right: asset.right }}
            className="pointer-events-auto group cursor-pointer"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5 + asset.delay * 2, repeat: Infinity, ease: 'easeInOut', delay: asset.delay }}
              className={`bg-[#090d16]/80 backdrop-blur-md border border-white/10 group-hover:border-[#00e5a0]/50 rounded-xl p-3.5 shadow-[0_15px_35px_rgba(0,0,0,0.6)] w-52 sm:w-56 transition-all duration-300 transform group-hover:-translate-y-1.5 group-hover:shadow-[0_20px_40px_rgba(0,229,160,0.25)] ${
                state.flash
                  ? state.isUp
                    ? 'border-emerald-500/60 bg-emerald-950/30'
                    : 'border-rose-500/60 bg-rose-950/30'
                  : ''
              }`}
            >
              {/* Header: Asset Icon & Name */}
              <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                <span className="flex items-center gap-2 font-bold tracking-wider text-gray-300">
                  <span
                    className="p-1 rounded-md bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-300"
                    style={{ color: asset.iconColor }}
                  >
                    <IconComponent size={13} />
                  </span>
                  {asset.name}
                </span>
                <span className="text-[9px] text-gray-500 font-semibold tracking-widest uppercase">
                  FINTECH
                </span>
              </div>

              {/* Price & Change */}
              <div className="flex items-baseline justify-between my-0.5">
                <span className="text-base sm:text-lg font-extrabold text-white tracking-tight font-mono">
                  ₹<CountUp target={state.val} decimals={asset.decimals} delay={asset.delay + 0.2} />
                </span>
                <span
                  className={`text-xs font-bold font-mono px-1.5 py-0.5 rounded ${
                    state.isUp ? 'text-[#00e5a0] bg-[#00e5a0]/10' : 'text-rose-400 bg-rose-500/10'
                  }`}
                >
                  {state.change}
                </span>
              </div>

              {/* Animated Sparkline */}
              <svg className="w-full h-5 mt-1 overflow-visible" viewBox="0 0 100 25">
                <motion.path
                  d={asset.sparkline}
                  fill="none"
                  stroke={asset.strokeColor}
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.4, delay: asset.delay + 0.3 }}
                />
              </svg>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default HudGlassCards;

