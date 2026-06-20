import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';

const Navbar = ({ onSearch }) => {
  return (
    <header className="bg-white h-16 border-b border-slate-200 flex items-center justify-between px-8 shadow-sm shrink-0">
      <div className="relative w-96">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          type="text"
          onChange={(e) => onSearch(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Search orders, vehicles, users..."
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-slate-500 hover:text-blue-600 transition-colors">
          <Bell size={22} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
            3
          </span>
        </button>

        <div className="flex items-center gap-3 border-l pl-6 border-slate-200">
          <img
            src="https://picsum.photos/seed/john/40/40"
            alt="User profile"
            className="w-10 h-10 rounded-full border-2 border-blue-100"
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-800">John Admin</span>
            <span className="text-[11px] text-slate-400 font-medium">System Admin</span>
          </div>
          <ChevronDown size={16} className="text-slate-400 ml-1 cursor-pointer" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;