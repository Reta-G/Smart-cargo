import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getHowItWorksSteps } from '../assets/data/howItWorksData.jsx';
import StepCard from './StepCard';
import InstantQuoteModal from './InstantQuoteModal';

const HowItWorks = () => {
  const { t } = useTranslation();
  const howItWorksSteps = getHowItWorksSteps(t);
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <section className="relative overflow-hidden bg-slate-50 py-20 transition-colors duration-300 dark:bg-slate-900 md:py-28">
      {/* Background blobs */}
      <motion.div
        className="absolute top-[-15%] right-[-5%] h-[400px] w-[400px] rounded-full bg-blue-400/20 blur-[100px] -z-10 dark:bg-blue-500/10"
        animate={{ rotate: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
      />
      <motion.div
        className="absolute bottom-[-10%] left-[-5%] h-[500px] w-[500px] rounded-full bg-indigo-400/20 blur-[120px] -z-10 dark:bg-indigo-500/10"
        animate={{ rotate: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
      />

      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center md:text-left"
        >
          <span className="mb-2 inline-block text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {t('howItWorks.workflow')}
          </span>
          <h2 className="mb-4 text-4xl font-extrabold leading-tight text-slate-900 dark:text-white md:text-5xl">
            {t('howItWorks.title')}{' '}
            <span className="text-blue-500 dark:text-blue-400">
              {t('howItWorks.highlight')}
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-base text-slate-600 dark:text-slate-300 md:mx-0 md:text-lg">
            {t('howItWorks.description')}
          </p>
        </motion.div>

        {/* Steps Grid — step 1 is clickable to open quote */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 md:gap-8">
          {howItWorksSteps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -6, scale: 1.03 }}
              onClick={step.id === 1 ? () => setQuoteOpen(true) : undefined}
              className={step.id === 1 ? 'cursor-pointer' : ''}
            >
              {step.id === 1 ? (
                <div className="relative">
                  <StepCard step={step} />
                  <span className="absolute top-3 right-3 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white shadow">
                    {t('howItWorks.getQuote')}
                  </span>
                </div>
              ) : (
                <StepCard step={step} />
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="relative mt-16 overflow-hidden rounded-2xl bg-slate-900 p-8 text-white shadow-xl transition-colors duration-300 dark:bg-slate-800 md:mt-20 md:p-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="absolute top-0 right-0 h-48 w-48 rounded-full bg-blue-500/10 blur-[60px]"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 15, ease: 'easeInOut' }}
          />
          <div className="relative z-10 flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <div>
              <h3 className="mb-2 text-2xl font-bold text-white md:text-3xl">
                {t('howItWorks.optimizeTitle')}
              </h3>
              <p className="text-base text-slate-300 dark:text-slate-200 md:text-lg">
                {t('howItWorks.optimizeDescription')}
              </p>
            </div>
            <div className="mt-4 flex gap-4 md:mt-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setQuoteOpen(true)}
                className="flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-bold text-white transition-all hover:bg-blue-500"
              >
                {t('howItWorks.getQuote')}
                <ChevronRight className="h-5 w-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="rounded-2xl border border-white/20 bg-white/10 px-6 py-3 font-bold text-white transition-all hover:bg-white/20"
              >
                {t('howItWorks.bookDemo')}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* AI Quote Modal */}
      <InstantQuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </section>
  );
};

export default HowItWorks;
