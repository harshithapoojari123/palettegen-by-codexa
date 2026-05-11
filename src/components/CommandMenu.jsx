import { AnimatePresence, motion } from "framer-motion";
import { Command, Download, Heart, Palette, Search, X } from "lucide-react";
import React, { useMemo, useState } from "react";

export default function CommandMenu({ open, onClose, onDownload, onGenerate, onOpenFavorites, onSave }) {
  const [query, setQuery] = useState("");
  const actions = useMemo(
    () => [
      { label: "Generate new palette", icon: Palette, run: onGenerate },
      { label: "Save current palette", icon: Heart, run: onSave },
      { label: "Open favorites dashboard", icon: Command, run: onOpenFavorites },
      { label: "Download PNG", icon: Download, run: onDownload }
    ],
    [onDownload, onGenerate, onOpenFavorites, onSave]
  );
  const filtered = actions.filter((action) => action.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] bg-slate-950/55 px-4 pt-24 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -24, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.96, y: -12, filter: "blur(6px)" }}
            transition={{ type: "spring", stiffness: 360, damping: 26 }}
            className="glass mx-auto max-w-2xl overflow-hidden rounded-3xl"
          >
            <div className="flex items-center gap-3 border-b border-slate-200/60 px-5 py-4 dark:border-white/10">
              <Search size={19} className="text-slate-500" />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search commands..."
                className="min-w-0 flex-1 bg-transparent text-base font-semibold text-slate-950 outline-none placeholder:text-slate-400 dark:text-white"
              />
              <motion.button
                type="button"
                onClick={onClose}
                aria-label="Close command menu"
                whileHover={{ scale: 1.1, rotate: 8 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={19} />
              </motion.button>
            </div>
            <div className="p-3">
              {filtered.map(({ label, icon: Icon, run }) => (
                <motion.button
                  key={label}
                  type="button"
                  onClick={() => {
                    run();
                    onClose();
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left font-bold text-slate-800 transition hover:bg-white/70 dark:text-white dark:hover:bg-white/10"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 5, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 360, damping: 24 }}
                >
                  <Icon size={18} />
                  {label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
