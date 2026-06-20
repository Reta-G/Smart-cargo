import React from 'react';
import { useTranslation } from 'react-i18next';
import { getServices } from '../assets/data/servicesData';

const Services = () => {
  const { t } = useTranslation();
  const services = getServices(t);

  return (
    <section className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-20 transition-colors duration-300 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-14 text-center">
          <span className="text-2xl font-semibold uppercase text-blue-500 dark:text-blue-400">
            {t('services.title')}
          </span>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
            {t('services.subtitle')}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-300">
            {t('services.description')}
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl dark:bg-slate-800 dark:shadow-black/20"
            >
              <img
                src={service.image}
                alt={service.title}
                className="h-56 w-full object-cover"
              />

              <div className="p-6">
                <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
                  {service.title}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;