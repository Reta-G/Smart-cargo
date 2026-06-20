import React from 'react';
import { useTranslation } from 'react-i18next';

const Stats = () => {
  const { t } = useTranslation();

  const stats = [
    { value: "50k+", label: t('stats.successfulServices') },
    { value: "256", label: t('stats.routes') },
    { value: "25+", label: t('stats.workLocations') },
    { value: "125", label: t('stats.vehicles') },
  ];

  return (
    <section className="bg-gradient-to-r from-blue-900 to-blue-800 py-12 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-col-2 gap-8 text-center md:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="rounded-xl bg-white/10 py-6 text-white backdrop-blur-md dark:bg-white/5"
            >
              <h3 className="text-3xl font-bold">{stat.value}</h3>
              <p className="mt-2 text-sm text-gray-200 dark:text-slate-300">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;