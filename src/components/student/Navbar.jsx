import logo from "../../assets/images/logo.svg";

export default function Navbar({ userEmail, onSignOut }) {
  const displayId = userEmail
    ? userEmail.split("@")[0].toUpperCase()
    : "Unknown User";

  return (
    // BRANDING: Background #22162E, Border #433A58
    <nav className="bg-[#22162E] border-b border-[#433A58] sticky top-0 z-40 px-4 h-16 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-2 font-bold text-xl text-[#F4F5F4]">
        <img
          src={logo}
          alt="cosvote-logo"
          className="h-[50px] "
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden md:block">
          <div className="text-sm font-bold text-[#F4F5F4]">{displayId}</div>
          <div className="text-xs text-[#B3A3DB]">Student</div>
        </div>

        <button
          onClick={onSignOut}
          // BRANDING: Text #759CE6 (Blue), Hover #F4F5F4
          className="p-2 text-[#759CE6] hover:text-[#F4F5F4] transition-colors text-sm font-medium"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}
