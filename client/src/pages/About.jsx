import React from 'react';
import { useTranslation } from 'react-i18next';
import StatsCard from '../components/StatsCard';
import cargo from '../assets/cargo.avif'

const About = () => {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-32 pb-24 transition-colors duration-300 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
      {/* Background Decor */}
      <div className="absolute top-1/4 right-0 h-96 w-96 rounded-full bg-purple-50 opacity-50 blur-3xl -z-10 dark:bg-blue-500/10"></div>
      <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-blue-50 opacity-30 blur-3xl -z-10 dark:bg-sky-400/10"></div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
          {/* Left Side: Visual Collage */}
          <div className="relative lg:col-span-7">
            <div className="relative z-10 grid grid-cols-2 gap-6">
              {/* Floating Stat Card */}
              <div className="absolute -top-12 right-12 z-20 hidden md:block animate-bounce-slow">
                <StatsCard />
              </div>

              {/* Main Image 1 */}
              <div className="mt-12">
                <div className="aspect-[4/5] overflow-hidden rounded-[40px] bg-blue-100 shadow-2xl shadow-purple-200/50 transition-transform duration-500 hover:rotate-0 dark:bg-slate-700 dark:shadow-black/20 transform -rotate-2">
                  <img
                    src={cargo}
                    alt={t('about.modernLogistics')}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Main Image 2 */}
              <div className="relative">
                <div className="aspect-[4/5] overflow-hidden rounded-[40px] bg-blue-200 shadow-2xl shadow-purple-200/50 transition-transform duration-500 hover:rotate-0 dark:bg-slate-600 dark:shadow-black/20 transform rotate-3">
                  <img
                    src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaad5b?auto=format&fit=crop&q=80&w=800"
                    alt={t('about.digitalLogistics')}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Overlay Brand Name */}
                <div className="absolute bottom-8 left-8 text-white">
                  <span className="text-2xl font-bold uppercase tracking-widest opacity-30">
                    Smart.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Content */}
          <div className="flex flex-col justify-center text-left lg:col-span-5">
            <div className="space-y-6">
              <span className="text-sm font-bold uppercase tracking-[0.25em] text-blue-500 dark:text-blue-400">
                {t('about.tagline')}
              </span>

              <h2 className="text-5xl font-extrabold uppercase leading-tight tracking-tight text-gray-900 dark:text-white md:text-6xl">
                {t('about.title')}
              </h2>

              <div className="h-1.5 w-20 rounded-full bg-blue-500"></div>

              <p className="max-w-lg text-lg leading-relaxed text-gray-500 dark:text-slate-300">
                {t('about.description')}
              </p>

              <div className="pt-8">
                <button className="group relative overflow-hidden">
                  <div className="flex items-center rounded-lg bg-blue-500 py-5 px-12 text-sm font-bold uppercase tracking-widest text-white shadow-xl shadow-blue-200 transition-all group-hover:scale-105 group-hover:bg-blue-600 group-active:scale-95 dark:shadow-black/20">
                    {t('about.learnMore')}
                    <svg
                      className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default About;