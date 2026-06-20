import React from 'react';
import { useTranslation } from 'react-i18next';
import hero from '../assets/hero-trucks.jpg';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="relative h-[70vh] overflow-hidden">
      <img
        src={hero}
        alt={t('hero.welcome')}
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-950/85 via-blue-900/60 to-blue-700/25 dark:from-slate-950/80 dark:via-slate-900/65 dark:to-blue-950/30" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6">
        <div className="mx-auto max-w-2xl text-center text-white md:mx-0 md:text-left">
          <h2 className="mb-6 text-2xl font-bold leading-tight drop-shadow-lg md:text-5xl lg:text-5xl">
            {t('hero.welcome')} <br />
            <span className="text-blue-200 dark:text-blue-300">
              {t('hero.subtitle')}
            </span>
          </h2>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
            <button className="w-fit rounded-md bg-orange-500 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-orange-600 md:px-6 md:py-3 md:text-base">
              {t('hero.demoButton')}
            </button>

            <button className="w-fit rounded-md border border-white/90 px-5 py-2 text-sm text-white transition hover:bg-white hover:text-blue-900 md:px-6 md:py-3 md:text-base dark:hover:text-slate-900">
              {t('hero.learnMoreButton')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;