import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaVideo, FaShieldAlt } from 'react-icons/fa';

export function GDriveTest() {
  const fileId = '1O74WPokaXOheCg2y_2ONOKrzy9cs2KPR';
  const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 px-4">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-amber-400 transition bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl"
          >
            <FaArrowLeft size={12} />
            <span>Back to Home</span>
          </Link>
          <span className="text-gray-600">/</span>
          <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
            <FaVideo /> Google Drive Video Test
          </span>
        </div>

        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full font-bold">
          TEST ROUTE MODE
        </span>
      </div>

      {/* METADATA INFO BOX */}
      <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-2">
        <h1 className="text-xl font-black text-white flex items-center gap-2">
          <FaShieldAlt className="text-amber-400" /> Google Drive Stream Verification
        </h1>
        <p className="text-xs text-gray-300 font-light">
          Testing native Google Drive embed iframe player performance and responsiveness.
        </p>
        <div className="text-[11px] font-mono text-gray-400 pt-1 space-y-1">
          <div>File ID: <span className="text-amber-300 font-bold">{fileId}</span></div>
          <div>Embed URL: <span className="text-emerald-400 font-bold">{embedUrl}</span></div>
        </div>
      </div>

      {/* RESPONSIVE VIDEO PLAYER CONTAINER */}
      <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/15 shadow-[0_0_30px_rgba(245,158,11,0.25)]">
        <iframe
          id="gdrive-test-iframe"
          src={embedUrl}
          title="Google Drive Video Test Player"
          className="w-full h-full border-0"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
        {/* TOP RIGHT POP-OUT PROTECTIVE SHIELD BLOCKER */}
        <div
          className="absolute top-0 right-0 w-24 h-16 z-30 pointer-events-auto bg-transparent cursor-default select-none"
          title="Direct link disabled for security"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        />
      </div>

      {/* VERIFICATION CHECKLIST */}
      <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
          Verification Checklist
        </h3>
        <ul className="text-xs text-gray-300 space-y-2 font-mono">
          <li className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">✓</span> Responsive 16:9 Container (Desktop & Mobile)
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">✓</span> Native Google Drive Preview Player iFrame
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">✓</span> Native Controls: Play / Pause / Seek / Fullscreen
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">✓</span> Zero Server File Storage / Zero API Keys Required
          </li>
        </ul>
      </div>
    </div>
  );
}

export default GDriveTest;
