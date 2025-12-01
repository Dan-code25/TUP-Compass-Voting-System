import React from "react";
import { Ban } from "lucide-react";

export default function AbstainAllSection({ onAbstainAll }) {
  return (
    <div className="mb-12">
      <div className="bg-[#EFD8ED] p-6 rounded-xl border border-[#B3A3DB] shadow-sm hover:shadow-md transition-all relative overflow-hidden group max-w-sm">
        <div className="absolute top-0 left-0 w-2 h-full bg-[#887AB8]"></div>
        <div className="flex items-center gap-2 mb-2 ml-2">
          <Ban className="text-[#887AB8]" />
          <h3 className="text-lg font-bold text-[#22162E]">Abstain All</h3>
        </div>
        <p className="text-sm text-[#626672] ml-2 italic mb-4">
          "I choose not to vote for any position."
        </p>
        <button
          onClick={onAbstainAll}
          className="w-full py-2 bg-white border border-[#887AB8] text-[#887AB8] rounded-lg text-sm font-bold hover:bg-[#887AB8] hover:text-white transition-colors ml-2"
        >
          Select Abstain All
        </button>
      </div>
    </div>
  );
}
