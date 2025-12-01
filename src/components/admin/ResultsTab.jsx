import React from "react";
import { Download, Trophy, AlertTriangle, Ban } from "lucide-react";
import { exportResultsToCSV } from "../../utils/exportUtils";
import { calculatePositionResult } from "../../utils/electionHelpers"; // <--- Import Helper
import { POSITIONS } from "../../lib/constants";

export default function ResultsTab({ candidates, abstainCounts }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* HEADER CARD */}
      <div className="bg-gradient-to-r from-[#759CE6] to-[#887AB8] p-6 rounded-xl border border-[#B3A3DB] text-center shadow-sm relative">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-[#F4F5F4]/20 rounded-full">
            <Trophy size={48} className="text-[#F4F5F4]" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-[#F4F5F4] mb-2">
          Official COMPASS Results
        </h2>
        <p className="text-[#F4F5F4]/90 mb-6">
          The election has ended. Here are the newly elected officers.
        </p>
        <button
          onClick={() => exportResultsToCSV(candidates, abstainCounts)}
          className="flex items-center gap-2 mx-auto bg-[#22162E] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#4338ca] transition-colors shadow-md"
        >
          <Download size={18} /> Export Results (CSV)
        </button>
      </div>

      {/* RESULTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {POSITIONS.map((pos) => {
          // Use the centralized helper
          const result = calculatePositionResult(
            pos,
            candidates,
            abstainCounts
          );

          // --- 1. WINNER ---
          if (result.status === "winner") {
            return (
              <div
                key={pos}
                className="bg-white rounded-xl shadow-sm border border-[#B3A3DB] overflow-hidden relative"
              >
                <div className="bg-[#22162E] text-[#F4F5F4] text-center py-2 text-sm font-bold uppercase tracking-wider">
                  {pos}
                </div>
                <div className="p-6 flex flex-col items-center">
                  <img
                    src={result.candidate.photo_url}
                    alt={result.candidate.name}
                    className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[#759CE6] to-[#887AB8] mb-4 shadow-md object-cover"
                  />
                  <h3 className="text-xl font-bold text-[#22162E] text-center">
                    {result.candidate.name}
                  </h3>
                  <div className="w-full bg-[#F4F5F4] rounded-lg py-3 px-4 flex justify-between items-center border border-[#EFD8ED] mt-4">
                    <span className="text-[#626672] text-sm font-bold">
                      Total Votes
                    </span>
                    <span className="text-2xl font-bold text-[#759CE6]">
                      {result.candidate.vote_count}
                    </span>
                  </div>
                </div>
              </div>
            );
          }

          // --- 2. DRAW (TIE) ---
          if (result.status === "draw") {
            // Build list of names involved in the tie
            const names = result.winners.map((w) => w.name);
            if (result.abstainInvolved) names.push("Abstain");

            return (
              <div
                key={pos}
                className="bg-white rounded-xl shadow-sm border-2 border-[#887AB8] overflow-hidden relative"
              >
                <div className="bg-[#887AB8] text-white text-center py-2 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2">
                  <AlertTriangle size={16} /> {pos} (DRAW)
                </div>
                <div className="p-6">
                  {/* Avatars of tied candidates */}
                  <div className="flex justify-center -space-x-4 mb-4">
                    {result.winners.map((w, i) => (
                      <img
                        key={i}
                        src={w.photo_url}
                        alt={w.name}
                        className="w-16 h-16 rounded-full border-2 border-white bg-slate-200 object-cover"
                        title={w.name}
                      />
                    ))}
                    {result.abstainInvolved && (
                      <div
                        className="w-16 h-16 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs"
                        title="Abstain"
                      >
                        N/A
                      </div>
                    )}
                  </div>

                  <div className="text-center mb-6">
                    <p className="text-xs text-[#626672] font-bold uppercase mb-1">
                      Tie Between
                    </p>
                    <p className="text-md font-bold text-[#22162E] leading-tight">
                      {names.join(" & ")}
                    </p>
                  </div>

                  <div className="w-full bg-[#EFD8ED] rounded-lg py-3 px-4 flex justify-between items-center border border-[#B3A3DB]">
                    <span className="text-[#433A58] text-sm font-bold">
                      Tied Score
                    </span>
                    <span className="text-2xl font-bold text-[#433A58]">
                      {result.count}
                    </span>
                  </div>
                </div>
              </div>
            );
          }

          // --- 3. ABSTAIN WIN ---
          if (result.status === "abstain_win") {
            return (
              <div
                key={pos}
                className="bg-white rounded-xl shadow-sm border border-[#B3A3DB] overflow-hidden relative opacity-75"
              >
                <div className="bg-[#626672] text-white text-center py-2 text-sm font-bold uppercase tracking-wider">
                  {pos}
                </div>
                <div className="p-6 flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-[#F4F5F4] mb-4 flex items-center justify-center">
                    <Ban size={40} className="text-[#626672]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#22162E] text-center">
                    Abstain
                  </h3>
                  <p className="text-sm text-[#626672] font-medium mb-4">
                    Majority Vote
                  </p>
                  <div className="w-full bg-[#F4F5F4] rounded-lg py-3 px-4 flex justify-between items-center border border-[#EFD8ED]">
                    <span className="text-[#626672] text-sm font-bold">
                      Votes
                    </span>
                    <span className="text-2xl font-bold text-[#626672]">
                      {result.count}
                    </span>
                  </div>
                </div>
              </div>
            );
          }

          // --- 4. NO VOTES ---
          return (
            <div
              key={pos}
              className="bg-[#F4F5F4] rounded-xl border border-dashed border-[#B3A3DB] p-8 flex flex-col items-center justify-center text-center opacity-70"
            >
              <p className="font-bold text-[#22162E] mb-1">{pos}</p>
              <span className="text-xs text-[#626672]">No votes cast</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
