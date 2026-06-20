import React from "react";

const StatsCard = () => {
  return (
    <div className="w-64 space-y-4 rounded-2xl border border-gray-50 bg-white p-6 shadow-2xl transition-colors duration-300 dark:border-slate-700 dark:bg-slate-800 dark:shadow-black/20">
      <div className="flex items-start justify-between">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          120,000+
        </h3>

        <span className="flex items-center text-sm font-bold text-green-500 dark:text-green-400">
          <svg
            className="mr-1 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M5 15l7-7 7 7"
            />
          </svg>
        </span>
      </div>

      <p className="text-[10px] font-semibold uppercase leading-tight tracking-widest text-gray-400 dark:text-slate-300">
        በ2024 ዓ.ም የተከናወኑ ጭነቶች፣ 99.9% በሰዓቱ የደረሱ
      </p>

      <div className="flex -space-x-2 pt-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <img
            key={i}
            className="h-8 w-8 rounded-full border-2 border-white ring-2 ring-transparent dark:border-slate-800"
            src={`https://i.pravatar.cc/100?u=${i + 10}`}
            alt="ተጠቃሚ"
          />
        ))}

        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-purple-100 text-[8px] font-bold text-blue-600 dark:border-slate-800 dark:bg-slate-700 dark:text-blue-300">
          +4k
        </div>
      </div>
    </div>
  );
};

export default StatsCard;