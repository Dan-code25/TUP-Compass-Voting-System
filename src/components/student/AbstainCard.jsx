import React from "react";
import { Ban } from "lucide-react";

export default function AbstainCard({
  position,
  isAbstained,
  hasVotedForPos,
  onVote,
}) {
  return (
    <div
      className={`
      bg-slate-50 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-6
      ${
        isAbstained
          ? "ring-2 ring-slate-500 border-slate-500 bg-slate-100 opacity-100"
          : "border-slate-300 opacity-75 hover:opacity-100 hover:border-slate-400"
      }
    `}
    >
      <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mb-3 text-slate-500">
        <Ban size={24} />
      </div>
      <h3 className="font-bold text-slate-600 text-lg mb-1">Abstain</h3>
      <p className="text-xs text-slate-400 text-center mb-6 px-4">
        Select this if you do not wish to vote for any {position}.
      </p>
      <button
        onClick={() => onVote(position, null, "Abstain")}
        disabled={hasVotedForPos}
        className={`px-6 py-2 rounded-lg text-sm font-bold border transition-colors cursor-pointer
           ${
             isAbstained
               ? "bg-slate-600 text-white border-slate-600"
               : hasVotedForPos
               ? "bg-transparent text-slate-300 border-slate-200 cursor-not-allowed"
               : "bg-white text-slate-600 border-slate-300 hover:border-slate-500 hover:text-slate-800"
           }
         `}
      >
        {isAbstained ? "Abstained" : "Select Abstain"}
      </button>
    </div>
  );
}
