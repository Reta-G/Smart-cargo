import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = ({ className = '' }) => {
  const { i18n } = useTranslation();
  const current = i18n.language && i18n.language.startsWith('am') ? 'am' : 'en';

  const change = (lng) => {
    i18n.changeLanguage(lng);
    try { localStorage.setItem('i18nextLng', lng); } catch (e) {}
  };

  return (
    <div className={`inline-flex items-center ${className}`}>
      <button onClick={() => change('en')} className={`px-2 py-1 text-sm ${current === 'en' ? 'font-semibold' : 'opacity-70'}`}>EN</button>
      <span className="px-1">|</span>
      <button onClick={() => change('am')} className={`px-2 py-1 text-sm ${current === 'am' ? 'font-semibold' : 'opacity-70'}`}>አማ</button>
    </div>
  );
};

export default LanguageSwitcher;
