import React, { useState } from "react";
import { CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

export default function CandidateCard({
  candidate,
  isSelected,
  hasVotedForPos,
  onVote,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Safety check: ensure achievements is an array
  let achievementList = [];
  if (Array.isArray(candidate.achievements)) {
    achievementList = candidate.achievements;
  } else if (typeof candidate.achievements === "string") {
    // If somehow it comes back as a string, split it
    achievementList = candidate.achievements.split("\n");
  }

  return (
    <div
      className={`
      bg-white rounded-2xl border transition-all flex flex-col h-fit
      ${
        isSelected
          ? "ring-2 ring-green-500 border-green-500 shadow-md"
          : "border-slate-200 hover:shadow-lg"
      } 
      ${hasVotedForPos && !isSelected ? "opacity-50 grayscale-[0.5]" : ""}
    `}
    >
      <div className="p-6 flex-1">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={candidate.photo_url}
            alt={candidate.name}
            className="w-16 h-16 rounded-full bg-slate-100 object-cover border border-slate-100"
          />
          <div>
            <h3 className="font-bold text-lg leading-tight">
              {candidate.name}
            </h3>
            {/* Display Party Name */}
            {candidate.parties ? (
              <span
                className="text-xs font-bold px-2 py-0.5 rounded text-white"
                style={{
                  backgroundColor: candidate.parties.color_hex || "#000",
                }}
              >
                {candidate.parties.name}
              </span>
            ) : (
              <span className="text-xs font-bold text-slate-500">
                Independent
              </span>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg italic border border-slate-100">
            "{candidate.platform}"
          </div>

          {achievementList.length > 0 && (
            <div className="text-xs text-slate-500">
              <div className="flex justify-between items-end mb-1">
                <strong className="text-slate-700 uppercase tracking-wide text-[10px]">
                  Achievements
                </strong>
                {achievementList.length > 2 && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-1 text-[#9A0E23] hover:text-red-800 font-semibold transition-colors cursor-pointer"
                  >
                    {isExpanded ? "Show Less" : "View All"}
                    {isExpanded ? (
                      <ChevronUp size={12} />
                    ) : (
                      <ChevronDown size={12} />
                    )}
                  </button>
                )}
              </div>
              <ul className="space-y-1 list-disc list-inside text-slate-600">
                {(isExpanded
                  ? achievementList
                  : achievementList.slice(0, 2)
                ).map((ach, i) => (
                  <li key={i} className="leading-relaxed">
                    {ach.replace(/^[•\-\*]\s*/, "")}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
        <button
          onClick={() =>
            onVote(candidate.position, candidate.id, candidate.name)
          }
          disabled={hasVotedForPos}
          className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer 
              ${
                isSelected
                  ? "bg-green-600 text-white"
                  : hasVotedForPos
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-[#2f283d] hover:bg-[#443a59] text-white"
              }
            `}
        >
          {isSelected ? (
            <>
              <CheckCircle2 size={16} /> Voted
            </>
          ) : (
            "Vote"
          )}
        </button>
      </div>
    </div>
  );
}
