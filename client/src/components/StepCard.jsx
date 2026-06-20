import React from "react";
import { motion } from "framer-motion";

const StepCard = ({ step, index, stepNumber }) => {
  // Robust index/phase (prevents "NaN" if index prop isn't passed)
  const i = Number.isFinite(index)
    ? index
    : Number.isFinite(stepNumber)
    ? stepNumber - 1
    : 0;

  const phase = Number.isFinite(stepNumber) ? stepNumber : i + 1;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.8,
        delay: i * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative"
    >
      <div className="flex flex-col items-center">
        {/* Step Visual Indicator */}
        <div className="relative mb-10">
          {/* Animated Glow Backdrop */}
          <div className="pointer-events-none absolute inset-[-20px] rounded-full bg-dodgerblue-500/5 blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100 dark:bg-dodgerblue-500/10" />

          <div className="relative z-10 flex h-28 w-28 items-center justify-center">
            {/* Outer Rotating Ring (Dashed) */}
            <motion.div
              className="absolute inset-0 rounded-[2.5rem] border-[3px] border-dashed border-dodgerblue-200 dark:border-dodgerblue-400/40"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />

            {/* Main Icon Vessel */}
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-slate-200 bg-white/80 shadow-[0_20px_40px_-15px_rgba(30,144,255,0.25)] backdrop-blur transition-all duration-500 group-hover:-translate-y-3 group-hover:scale-110 group-hover:bg-white group-hover:shadow-[0_25px_50px_-12px_rgba(30,144,255,0.35)] dark:border-slate-700 dark:bg-slate-800/70 dark:shadow-black/30 dark:group-hover:bg-slate-800">
              <div className="text-dodgerblue-500 transition-all duration-500 group-hover:scale-110 dark:text-dodgerblue-300">
                {/* Important: step.icon should NOT force a dark color (like text-black).
                    Let this wrapper control the color. */}
                {step.icon}
              </div>
            </div>

            {/* Step Counter Tag */}
            <div className="absolute -bottom-3 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-slate-900 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-lg transition-all duration-500 group-hover:-translate-y-4 group-hover:bg-dodgerblue-600 dark:bg-slate-100 dark:text-slate-900 dark:group-hover:bg-dodgerblue-400 dark:group-hover:text-slate-900">
              Phase {phase}
            </div>
          </div>
        </div>

        {/* Textual Content */}
        <div className="relative px-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 + 0.4 }}
          >
            <span className="mb-4 inline-block text-[10px] font-extrabold uppercase tracking-[0.25em] text-dodgerblue-500 opacity-70 transition-all duration-300 group-hover:opacity-100 dark:text-dodgerblue-300">
              {step.tag}
            </span>

            <h3 className="mb-4 text-2xl font-bold tracking-tight text-slate-900 transition-colors group-hover:text-dodgerblue-600 dark:text-white dark:group-hover:text-dodgerblue-300">
              {step.title}
            </h3>

            <p className="text-sm font-medium leading-relaxed text-slate-600 transition-colors group-hover:text-slate-700 dark:text-slate-300 dark:group-hover:text-slate-200">
              {step.description}
            </p>
          </motion.div>
        </div>

        {/* Mobile Vertical Flow Connector */}
        <div className="mt-12 mb-4 h-16 w-[2px] bg-gradient-to-b from-dodgerblue-500/40 to-transparent lg:hidden" />
      </div>

      {/* Hover Background Accent */}
      <div className="absolute inset-x-[-20px] inset-y-[-30px] -z-10 rounded-[3rem] border border-slate-100 bg-slate-50/50 opacity-0 transition-all duration-500 group-hover:opacity-100 dark:border-slate-700 dark:bg-slate-800/40" />
    </motion.div>
  );
};

export default StepCard;