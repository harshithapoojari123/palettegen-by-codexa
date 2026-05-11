import { AnimatePresence, motion } from "framer-motion";
import { Copy, Pencil, Trash2, X } from "lucide-react";
import React from "react";

export default function FavoritesModal({ favorites, onClose, onCopy, onDelete, onLoad, onRename }) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[65] overflow-y-auto bg-slate-950/55 px-4 py-8 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.92, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: 16, scale: 0.96, filter: "blur(6px)" }}
          transition={{ type: "spring", stiffness: 340, damping: 27 }}
          className="glass mx-auto max-w-5xl rounded-3xl p-5 sm:p-7"
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Favorites Dashboard
              </p>
              <h2 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">Saved palettes</h2>
            </div>
            <motion.button
              type="button"
              onClick={onClose}
              className="grid h-10 w-10 place-items-center rounded-full bg-white/70 text-slate-700 dark:bg-white/10 dark:text-white"
              aria-label="Close favorites"
              whileHover={{ scale: 1.1, rotate: 8 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={18} />
            </motion.button>
          </div>

          {favorites.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300/80 p-10 text-center dark:border-white/10">
              <p className="text-xl font-black text-slate-950 dark:text-white">No favorites yet</p>
              <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                Save palettes you want to reuse, rename, or share with clients.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {favorites.map((favorite) => (
                <motion.article
                  key={favorite.id}
                  className="rounded-3xl bg-white/55 p-4 dark:bg-white/10"
                  initial={{ opacity: 0, y: 16, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  whileHover={{ y: -5, scale: 1.015 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                >
                  <motion.button
                    type="button"
                    onClick={() => onLoad(favorite.colors)}
                    className="mb-4 grid h-28 w-full grid-cols-5 overflow-hidden rounded-2xl"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {favorite.colors.map((color) => (
                      <span key={`${favorite.id}-${color}`} style={{ backgroundColor: color }} />
                    ))}
                  </motion.button>
                  <div className="flex items-center gap-2">
                    <input
                      value={favorite.name}
                      onChange={(event) => onRename(favorite.id, event.target.value)}
                      className="min-w-0 flex-1 rounded-full border border-white/40 bg-white/65 px-4 py-2 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-slate-950/20 dark:border-white/10 dark:bg-white/10 dark:text-white"
                      aria-label="Rename favorite palette"
                    />
                    <Pencil size={17} className="text-slate-500 dark:text-slate-400" />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <motion.button
                      type="button"
                      onClick={() => onCopy(favorite.colors.join(", "), "Favorite palette copied")}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white dark:bg-white dark:text-slate-950"
                      whileHover={{ scale: 1.04, y: -2 }}
                      whileTap={{ scale: 0.94 }}
                    >
                      <Copy size={16} />
                      Copy
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => onDelete(favorite.id)}
                      className="grid h-10 w-10 place-items-center rounded-full bg-white/65 text-rose-600 dark:bg-white/10"
                      aria-label="Delete favorite"
                      whileHover={{ scale: 1.1, rotate: -6 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
