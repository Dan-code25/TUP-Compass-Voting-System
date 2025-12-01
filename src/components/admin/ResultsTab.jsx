import React from "react";
import { Download, Trophy, AlertTriangle, Ban } from "lucide-react";
import { exportResultsToCSV } from "../../utils/exportUtils";
import { POSITIONS } from "../../lib/constants";

export default function ResultsTab({ candidates, abstainCounts }) {
  const getResultForPosition = (pos) => {
    const posCandidates = candidates.filter((c) => c.position === pos);
    const abstainVotes = abstainCounts[pos] || 0;
    const maxCandVotes = Math.max(
      ...posCandidates.map((c) => c.vote_count || 0),
      0
    );
    const overallMax = Math.max(maxCandVotes, abstainVotes);

    if (overallMax === 0) return { status: "no_votes" };

    const tiedCandidates = posCandidates.filter(
      (c) => (c.vote_count || 0) === overallMax
    );
    const isAbstainTied = abstainVotes === overallMax;

    if (isAbstainTied && tiedCandidates.length === 0)
      return { status: "abstain_win", count: overallMax };
    if (
      tiedCandidates.length > 1 ||
      (tiedCandidates.length > 0 && isAbstainTied)
    ) {
      return {
        status: "draw",
        winners: tiedCandidates,
        abstainInvolved: isAbstainTied,
        count: overallMax,
      };
    }
    return { status: "winner", candidate: tiedCandidates[0] };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {POSITIONS.map((pos) => {
          const result = getResultForPosition(pos);
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
          /* ... Draw and Abstain logic identical to before ... */
          return null;
        })}
      </div>
    </div>
  );
}
