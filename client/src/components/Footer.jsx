import React from "react";
import { useTranslation } from 'react-i18next';
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 shadow-inner mt-8">
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Left: Logo & Tagline */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-xl font-bold text-blue-800 dark:text-blue-400">Smart Transport & Cargo</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('footer.tagline')}
          </p>
        </div>

        {/* Center: Quick Links */}
        <div className="flex flex-col space-y-2">
          <h2 className="font-semibold mb-2">{t('footer.quickLinks')}</h2>
          <ul className="space-y-1 text-sm">
            <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">{t('footer.dashboard')}</li>
            <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">{t('footer.fleetManagement')}</li>
            <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">{t('footer.shipments')}</li>
            <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">{t('footer.userManagement')}</li>
            <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">{t('footer.support')}</li>
            <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">{t('footer.privacy')}</li>
          </ul>
        </div>

        {/* Right: Socials & Status */}
        <div className="flex flex-col space-y-2">
          <h2 className="font-semibold mb-2">{t('footer.connectStatus')}</h2>
          <div className="flex space-x-3 mb-2">
            <FaFacebookF className="text-blue-600 hover:text-blue-800 cursor-pointer"/>
            <FaTwitter className="text-blue-400 hover:text-blue-600 cursor-pointer"/>
            <FaLinkedinIn className="text-blue-700 hover:text-blue-900 cursor-pointer"/>
          </div>
          <p className="text-sm">{t('footer.systemOnline')} <span className="text-green-500">●</span></p>
          <p className="text-sm">{t('footer.version')}</p>
        </div>

      </div>

      {/* Bottom Row */}
      <div className="border-t border-gray-300 dark:border-gray-700 mt-4 py-4 text-center text-xs text-gray-500 dark:text-gray-400">
        {t('footer.copyright')}
      </div>
    </footer>
  );
}
