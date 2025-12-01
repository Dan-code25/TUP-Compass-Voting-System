import React from "react";
import {
  LayoutGrid,
  Users,
  Settings,
  LogOut,
  Trophy,
  UserCircle,
} from "lucide-react";
import logo from "../../assets/images/logo.svg";

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  electionSettings,
  adminEmail,
  onSignOut,
}) {
  const NavButton = ({ tab, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        activeTab === tab
          ? "bg-[#4338ca] text-white" // Active
          : "hover:bg-[#312e81] text-slate-300" // Inactive
      }`}
    >
      <Icon size={18} /> {label}
    </button>
  );

  return (
    <aside className="w-64 bg-[#22162E] text-[#B3A3DB] h-screen fixed left-0 top-0 flex flex-col z-50">
      <div className="p-6 text-[#F4F5F4] font-bold text-xl flex items-center gap-2">
        <img src={logo} alt="logo" className="ml-[-10px] mb-[-20px] h-[60px]" />
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {!electionSettings.is_active && electionSettings.start_time && (
          <button
            onClick={() => setActiveTab("results")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "results"
                ? "bg-gradient-to-r from-[#759CE6] to-[#887AB8] text-white"
                : "hover:bg-slate-800/50 text-[#a5b4fc]"
            }`}
          >
            <Trophy size={18} /> Official Results
          </button>
        )}

        <NavButton tab="overview" icon={LayoutGrid} label="Overview" />
        <NavButton tab="candidates" icon={Users} label="Candidates" />
        <NavButton tab="settings" icon={Settings} label="Settings" />
      </nav>

      <div className="p-4 border-t border-[#433A58]">
        <div className="flex items-center gap-3 mb-4 px-2">
          <UserCircle className="text-[#759CE6]" size={24} />
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-[#F4F5F4] truncate w-32">
              {adminEmail.split("@")[0].toUpperCase()}
            </p>
            <p className="text-xs text-[#759CE6]">Admin</p>
          </div>
        </div>
        <button
          onClick={onSignOut}
          className="flex items-center gap-2 text-sm text-[#B3A3DB] hover:text-[#F4F5F4] transition-colors w-full px-2"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
