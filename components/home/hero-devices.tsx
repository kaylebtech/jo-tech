"use client";

import { motion } from "motion/react";

function float(duration: number, delay = 0) {
  return {
    animate: { y: [0, -18, 0], rotate: [0, 1.5, 0] },
    transition: { duration, delay, repeat: Infinity, ease: "easeInOut" as const },
  };
}

export function HeroDevices() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md lg:max-w-lg">
      {/* Ambient gradient glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[85%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-primary/30 via-accent/25 to-success/20 blur-3xl" />
      </div>

      {/* Phone */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="absolute left-[8%] top-[10%] w-[38%]"
      >
        <motion.div {...float(5)} className="relative">
          <div className="aspect-[9/19] rounded-[1.75rem] border border-white/40 bg-gradient-to-b from-primary to-primary/70 p-1.5 shadow-2xl shadow-primary/30 backdrop-blur-xl">
            <div className="flex h-full flex-col gap-1.5 rounded-[1.4rem] bg-gradient-to-b from-white/25 to-white/5 p-2.5">
              <div className="h-1.5 w-8 self-center rounded-full bg-white/40" />
              <div className="mt-2 flex-1 rounded-xl bg-white/10" />
              <div className="h-2 w-2/3 rounded-full bg-white/30" />
              <div className="h-2 w-1/2 rounded-full bg-white/20" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Laptop */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="absolute bottom-[8%] left-[22%] w-[62%]"
      >
        <motion.div {...float(6, 0.4)}>
          <div className="aspect-[16/10.5] rounded-2xl border border-white/40 bg-gradient-to-br from-foreground/90 to-foreground/70 p-1.5 shadow-2xl shadow-black/20">
            <div className="h-full rounded-xl bg-gradient-to-br from-accent/40 to-primary/40 p-3">
              <div className="grid h-full grid-cols-3 gap-1.5">
                <div className="col-span-2 rounded-lg bg-white/15" />
                <div className="flex flex-col gap-1.5">
                  <div className="flex-1 rounded-lg bg-white/15" />
                  <div className="flex-1 rounded-lg bg-white/10" />
                </div>
              </div>
            </div>
          </div>
          <div className="mx-auto h-1.5 w-[85%] rounded-b-xl bg-foreground/60" />
        </motion.div>
      </motion.div>

      {/* Smart watch */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="absolute right-[6%] top-[6%] w-[26%]"
      >
        <motion.div {...float(4.5, 0.2)}>
          <div className="aspect-square rounded-[1.4rem] border border-white/40 bg-gradient-to-br from-success to-success/70 p-2 shadow-xl shadow-success/30">
            <div className="flex h-full flex-col items-center justify-center gap-1 rounded-xl bg-white/15">
              <div className="size-6 rounded-full border-2 border-white/50" />
              <div className="h-1 w-6 rounded-full bg-white/40" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* AirPods */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="absolute bottom-[30%] right-[4%] w-[22%]"
      >
        <motion.div {...float(5.5, 0.6)}>
          <div className="flex aspect-[4/3] items-center justify-center gap-2 rounded-2xl border border-white/40 bg-white/80 shadow-xl shadow-black/10 backdrop-blur-xl dark:bg-white/15">
            <span className="h-6 w-2.5 rounded-full bg-foreground/20" />
            <span className="h-6 w-2.5 rounded-full bg-foreground/20" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
