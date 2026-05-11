import { Check, Copy, Lock, Unlock } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { contrastRatio, readableTextColor } from "../lib/palette.js";

export default function ColorCard({ color, index, locked, copied, onCopy, onOpenDetails, onToggleLock }) {
  const textColor = readableTextColor(color);
  const ratio = contrastRatio(textColor, color);
  const accessible = ratio >= 4.5;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 28, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: [0.96, 1.025, 1] }}
      whileHover={{
        y: -12,
        scale: 1.025,
        rotateX: 3,
        rotateY: -3,
        boxShadow: "0 28px 90px rgba(15, 23, 42, 0.22)"
      }}
      whileTap={{ scale: 0.985, y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 23 }}
      className="glass overflow-hidden rounded-2xl [transform-style:preserve-3d] will-change-transform"
    >
      <motion.div
        role="button"
        tabIndex={0}
        onClick={onOpenDetails}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") onOpenDetails();
        }}
        className="relative block min-h-64 w-full text-left sm:min-h-80"
        style={{
          background: `linear-gradient(160deg, ${color}, ${color}cc)`
        }}
        whileTap={{ scale: 0.985 }}
        transition={{ type: "spring", stiffness: 360, damping: 24 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,255,255,0.38),transparent_26%)]" />
        <span className="absolute left-4 top-4 rounded-full bg-black/20 px-3 py-1 text-xs font-black text-white backdrop-blur">
          0{index + 1}
        </span>
        <motion.button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onToggleLock();
          }}
          className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/24 text-white backdrop-blur transition hover:scale-105 hover:bg-white/34"
          aria-label={locked ? "Unlock color" : "Lock color"}
          title={locked ? "Unlock color" : "Lock color"}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.86, rotate: locked ? -24 : 24 }}
          animate={{
            rotate: locked ? [0, -12, 12, 0] : 0,
            scale: locked ? [1, 1.16, 1] : 1
          }}
          transition={{ type: "spring", stiffness: 420, damping: 18 }}
        >
          {locked ? <Lock size={18} /> : <Unlock size={18} />}
        </motion.button>
        <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/20 p-4 backdrop-blur">
          <p className="text-sm font-black" style={{ color: textColor }}>
            Brand text preview
          </p>
          <p className="mt-1 text-xs font-bold" style={{ color: textColor }}>
            WCAG {ratio}:1
          </p>
        </div>
      </motion.div>
      <div className="flex items-center justify-between gap-3 p-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Hex</p>
          <p className="text-xl font-black text-slate-950 dark:text-white">{color}</p>
          <p
            className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-black ${
              accessible
                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                : "bg-rose-500/15 text-rose-700 dark:text-rose-300"
            }`}
          >
            {accessible ? "Accessible" : "Low Contrast"}
          </p>
        </div>
        <motion.button
          type="button"
          onClick={onCopy}
          className="grid h-11 w-11 place-items-center rounded-full bg-slate-950 text-white transition hover:scale-105 dark:bg-white dark:text-slate-950"
          aria-label={`Copy ${color}`}
          title="Copy HEX"
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.82 }}
          animate={copied ? { scale: [1, 1.24, 1], rotate: [0, -8, 8, 0] } : { scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 520, damping: 18 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={copied ? "check" : "copy"}
              initial={{ opacity: 0, scale: 0.45, rotate: -18 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.45, rotate: 18 }}
              transition={{ type: "spring", stiffness: 520, damping: 20 }}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.article>
  );
}
