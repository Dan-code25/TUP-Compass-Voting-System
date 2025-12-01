import Navbar from "./Navbar";
import { AlertCircle } from "lucide-react";

export default function ElectionClosed({ userProfile, signOut }) {
  return (
    <div className="min-h-screen bg-[#F4F5F4] font-sans">
      <Navbar userEmail={userProfile.email} onSignOut={signOut} />
      <div className="flex flex-col items-center justify-center h-[80vh] px-4 text-center">
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-[#B3A3DB] max-w-lg w-full">
          <div className="w-20 h-20 bg-[#EFD8ED] rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={40} className="text-[#887AB8]" />
          </div>
          <h1 className="text-3xl font-bold text-[#22162E] mb-2">
            Election Has Ended
          </h1>
          <p className="text-[#626672] mb-0">
            Voting is currently disabled. Thank you for your participation.
          </p>
        </div>
      </div>
    </div>
  );
}
