require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Course = require('../models/Course');
const DemoVideo = require('../models/DemoVideo');
const Blog = require('../models/Blog');

const seedRealData = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/dhanvijeta';
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB for seeding real Dhan Vijeta data...');

    // 1. Seed Real Demo Videos
    const demoVideosData = [
      {
        title: '🔥 FX Pro Indicator – REAL 1 WEEK BACKTEST ON GOLD (XAUUSD)',
        videoUrl: 'https://www.youtube.com/embed/OmMHWD2iL1o',
        description: 'Real 1 week backtest results of FX Pro indicator on Gold (XAUUSD). Learn how to analyze indicator accuracy for intraday & swing setups.',
        category: 'Forex & Indicators',
        thumbnail: 'https://img.youtube.com/vi/OmMHWD2iL1o/hqdefault.jpg'
      },
      {
        title: 'BOS, CHoCH, IDM Explained on Real Chart 💯 | SMC Hindi Course EP-2',
        videoUrl: 'https://www.youtube.com/embed/JxMy7Dk9cCw',
        description: 'Learn Break of Structure (BOS), Change of Character (CHoCH), and Inducement (IDM) on live charts. Master valid vs invalid swing points.',
        category: 'Smart Money Concepts',
        thumbnail: 'https://img.youtube.com/vi/JxMy7Dk9cCw/hqdefault.jpg'
      },
      {
        title: 'SMC Lecture EP-1 🚀 Market Structure A to Z Explained for Beginners',
        videoUrl: 'https://www.youtube.com/embed/rsUKHQeMm64',
        description: 'Complete A to Z beginner guide on market structure, trend identification, and higher timeframe bias by Dhan Vijeta.',
        category: 'Smart Money Concepts',
        thumbnail: 'https://img.youtube.com/vi/rsUKHQeMm64/hqdefault.jpg'
      },
      {
        title: 'Liquidity Ka Complete Knowledge 🔥 90% TRADERS don\'t know !',
        videoUrl: 'https://www.youtube.com/embed/9MjP-4EumQQ',
        description: 'Understand liquidity pools, buy-side & sell-side liquidity grabs, and ICT + SMC liquidity sweeps before entering high-probability trades.',
        category: 'Liquidity & Price Action',
        thumbnail: 'https://img.youtube.com/vi/9MjP-4EumQQ/hqdefault.jpg'
      },
      {
        title: 'The Funded Room Prop Firm Full Guide 🔥 | Account Kaise Buy Kare?',
        videoUrl: 'https://www.youtube.com/embed/RevtKQMMeAk',
        description: 'Complete step-by-step guide to passing funded prop firm evaluation challenges (1 step & 2 step) with real risk management rules.',
        category: 'Prop Firm Guide',
        thumbnail: 'https://img.youtube.com/vi/RevtKQMMeAk/hqdefault.jpg'
      },
      {
        title: 'Best Forex Broker 2026 🔥 | Vantage vs Exness vs XM vs Pepperstone',
        videoUrl: 'https://www.youtube.com/embed/iaVnDgMORjo',
        description: 'Detailed comparison of top Forex brokers (Vantage, Exness, XM, Pepperstone) analyzing spreads, leverage, deposit/withdrawal speed, and regulations.',
        category: 'Broker Comparison',
        thumbnail: 'https://img.youtube.com/vi/iaVnDgMORjo/hqdefault.jpg'
      }
    ];

    await DemoVideo.deleteMany({});
    await DemoVideo.insertMany(demoVideosData);
    console.log(`Inserted ${demoVideosData.length} real Demo Videos successfully.`);

    // 2. Seed Real Blog Posts
    const blogData = [
      {
        title: 'SMC Structure Mapping: BOS, CHoCH & Inducement Explained',
        slug: 'smc-structure-mapping-bos-choch-idm',
        thumbnail: 'https://img.youtube.com/vi/JxMy7Dk9cCw/hqdefault.jpg',
        author: 'Dhan Vijeta',
        tags: ['Smart Money Concepts', 'Price Action'],
        publishedDate: new Date('2026-08-01'),
        seoMeta: { title: 'SMC Structure Mapping Guide', description: 'Master market structure mapping using Smart Money Concepts. Learn BOS, CHoCH, and Inducement.' },
        content: `
          <h2>Smart Money Concepts (SMC) Structure Mapping</h2>
          <p>Structure mapping is the foundation of Smart Money Concepts (SMC). Before placing any trade, you must identify whether the market is making true higher highs or inducing retail traders into early entries.</p>
          <h3>1. Inducement (IDM) – The Retail Trap</h3>
          <p>Inducement is the internal pullback high or low that entices retail traders to enter prematurely.</p>
          <h3>2. Break of Structure (BOS) vs Change of Character (CHoCH)</h3>
          <p><b>BOS:</b> Trend continuation in primary direction. <b>CHoCH:</b> Potential trend reversal.</p>
        `
      },
      {
        title: 'Liquidity Sweeps & Order Blocks: ICT + SMC Complete Guide',
        slug: 'liquidity-sweeps-ict-smc-guide',
        thumbnail: 'https://img.youtube.com/vi/9MjP-4EumQQ/hqdefault.jpg',
        author: 'Dhan Vijeta',
        tags: ['Liquidity', 'ICT & SMC'],
        publishedDate: new Date('2026-07-20'),
        seoMeta: { title: 'Liquidity Sweeps & Order Blocks Guide', description: 'Understand buy-side and sell-side liquidity grabs and institutional order blocks.' },
        content: `
          <h2>Understanding Institutional Liquidity</h2>
          <p>Smart money institutions require massive volume to execute their positions. They create artificial support/resistance levels to accumulate retail stop-losses.</p>
        `
      },
      {
        title: 'Prop Firm Evaluation Guide: Passing 1-Step & 2-Step Challenges',
        slug: 'funded-room-prop-firm-evaluation-guide',
        thumbnail: 'https://img.youtube.com/vi/RevtKQMMeAk/hqdefault.jpg',
        author: 'Dhan Vijeta',
        tags: ['Prop Firm', 'Risk Management'],
        publishedDate: new Date('2026-07-05'),
        seoMeta: { title: 'Pass Prop Firm Evaluation Accounts', description: 'Step-by-step blueprint to passing prop firm challenges with strict risk management.' },
        content: `
          <h2>Passing Prop Firm Accounts with Strict Risk Rules</h2>
          <p>Learn how to pass evaluation accounts with 0.5% to 1% risk per trade while targeting high R:R setups.</p>
        `
      }
    ];

    await Blog.deleteMany({});
    await Blog.insertMany(blogData);
    console.log(`Inserted ${blogData.length} real Blog posts successfully.`);

    // 3. Seed Real Courses
    const coursesData = [
      {
        title: 'Smart Money Concepts (SMC) & Institutional Price Action Blueprint',
        slug: 'smart-money-concepts-smc-masterclass',
        description: 'Complete course decoding institutional market structure, Break of Structure (BOS), Change of Character (CHoCH), Inducement (IDM), Order Blocks, and Liquidity Sweeps.',
        instructor: 'Dhan Vijeta',
        duration: '14 Hours',
        price: 2999,
        discount: 50, // 50% discount
        rating: 4.9,
        thumbnail: 'https://img.youtube.com/vi/rsUKHQeMm64/hqdefault.jpg',
        category: 'Price Action',
        isPublished: true,
        benefits: [
          'Master BOS, CHoCH, and Inducement mapping on live charts',
          'Identify high-probability Order Blocks and Imbalance (FVG)',
          'Trade Forex (XAUUSD / Gold) and Crypto with institutional precision',
          'Access downloadable SMC checklists and entry rule models'
        ],
        sections: [
          {
            title: 'Module 1: Market Structure Mastery',
            lessons: [
              {
                title: 'Market Structure A to Z Explained for Beginners',
                description: 'Understanding swing highs, swing lows, and trend structure.',
                videoProvider: 'external',
                videoUrl: 'https://www.youtube.com/embed/rsUKHQeMm64',
                videoDuration: 1800,
                thumbnail: 'https://img.youtube.com/vi/rsUKHQeMm64/hqdefault.jpg'
              },
              {
                title: 'BOS, CHoCH, and Inducement (IDM) Mapping',
                description: 'Valid vs Invalid Swings and spotting retail traps.',
                videoProvider: 'external',
                videoUrl: 'https://www.youtube.com/embed/JxMy7Dk9cCw',
                videoDuration: 2100,
                thumbnail: 'https://img.youtube.com/vi/JxMy7Dk9cCw/hqdefault.jpg'
              }
            ]
          },
          {
            title: 'Module 2: Liquidity & Order Blocks',
            lessons: [
              {
                title: 'Liquidity Ka Complete Knowledge: ICT + SMC',
                description: 'Buy-side & Sell-side liquidity grabs masterclass.',
                videoProvider: 'external',
                videoUrl: 'https://www.youtube.com/embed/9MjP-4EumQQ',
                videoDuration: 2400,
                thumbnail: 'https://img.youtube.com/vi/9MjP-4EumQQ/hqdefault.jpg'
              }
            ]
          }
        ]
      },
      {
        title: 'Forex & Gold (XAUUSD) Intraday Trading & Indicator Backtest Mastery',
        slug: 'forex-gold-xauusd-intraday-mastery',
        description: 'Learn high-probability intraday and swing trading strategies for Gold (XAUUSD), weekly bias analysis, Candle Range Theory (CRT), and broker setup.',
        instructor: 'Dhan Vijeta',
        duration: '10 Hours',
        price: 3499,
        discount: 40, // 40% discount
        rating: 4.8,
        thumbnail: 'https://img.youtube.com/vi/OmMHWD2iL1o/hqdefault.jpg',
        category: 'Swing Trading',
        isPublished: true,
        benefits: [
          'Backtested Forex indicator strategies for Gold (XAUUSD)',
          'Weekly bias determination using Candle Range Theory (CRT)',
          'Broker comparison & regulation safety guide (Vantage, Exness)',
          'Passing Prop Firm challenges with strict 1% risk rules'
        ],
        sections: [
          {
            title: 'Module 1: Gold Analysis & Indicators',
            lessons: [
              {
                title: 'FX Pro Indicator Real 1 Week Backtest on Gold',
                description: 'Live backtest breakdown on XAUUSD chart.',
                videoProvider: 'external',
                videoUrl: 'https://www.youtube.com/embed/OmMHWD2iL1o',
                videoDuration: 1500,
                thumbnail: 'https://img.youtube.com/vi/OmMHWD2iL1o/hqdefault.jpg'
              },
              {
                title: 'XAUUSD & Bitcoin Next Week Bias Analysis',
                description: 'Candle Range Theory (CRT) applied to Gold & Crypto.',
                videoProvider: 'external',
                videoUrl: 'https://www.youtube.com/embed/1ltlnK8BEFg',
                videoDuration: 1600,
                thumbnail: 'https://img.youtube.com/vi/1ltlnK8BEFg/hqdefault.jpg'
              }
            ]
          }
        ]
      }
    ];

    await Course.deleteMany({});
    await Course.insertMany(coursesData);
    console.log(`Inserted ${coursesData.length} real Courses successfully.`);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Failed to seed real data:', err.message);
    process.exit(1);
  }
};

seedRealData();
