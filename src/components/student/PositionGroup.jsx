import CandidateCard from "./CandidateCard"; // Adjust path
import AbstainCard from "./AbstainCard"; // Adjust path

export default function PositionGroup({
  position,
  candidates,
  userVotes,
  pendingVotes,
  hasSubmitted,
  onVote,
}) {
  const positionCandidates = candidates.filter((c) => c.position === position);
  const confirmedVote = userVotes.find((v) => v.position === position);
  const pendingSelection = pendingVotes[position];
  const isFilledLocally = pendingVotes.hasOwnProperty(position);

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-6 border-b border-[#B3A3DB] pb-4">
        <div
          className={`h-8 w-1 rounded-full ${
            isFilledLocally || hasSubmitted ? "bg-[#759CE6]" : "bg-[#B3A3DB]"
          }`}
        ></div>
        <h2 className="text-2xl font-bold text-[#22162E] uppercase">
          {position}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {positionCandidates.map((candidate) => {
          const isSelected = hasSubmitted
            ? confirmedVote?.candidate_id === candidate.id
            : pendingSelection === candidate.id;

          return (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              isSelected={isSelected}
              hasVotedForPos={hasSubmitted}
              onVote={(pos, id) => onVote(pos, id)}
            />
          );
        })}

        <AbstainCard
          position={position}
          isAbstained={
            hasSubmitted
              ? confirmedVote?.candidate_id === null
              : pendingSelection === null
          }
          hasVotedForPos={hasSubmitted}
          onVote={(pos) => onVote(pos, null)}
        />
      </div>
    </section>
  );
}
