export const calculatePositionResult = (
  position,
  candidates,
  abstainCounts
) => {
  // 1. Filter candidates for this specific position
  const posCandidates = candidates.filter((c) => c.position === position);

  // 2. Get vote counts
  const abstainVotes = abstainCounts[position] || 0;
  const maxCandVotes = Math.max(
    ...posCandidates.map((c) => c.vote_count || 0),
    0
  );

  // 3. Determine the highest score overall
  const overallMax = Math.max(maxCandVotes, abstainVotes);

  // 4. Handle "No Votes" scenario
  if (overallMax === 0) {
    return { status: "no_votes", count: 0 };
  }

  // 5. Identify who has the high score
  const tiedCandidates = posCandidates.filter(
    (c) => (c.vote_count || 0) === overallMax
  );
  const isAbstainTied = abstainVotes === overallMax;

  // --- SCENARIO A: Abstain Wins Alone ---
  // (Abstain has the max score, and no candidate reached that score)
  if (isAbstainTied && tiedCandidates.length === 0) {
    return {
      status: "abstain_win",
      count: overallMax,
    };
  }

  // --- SCENARIO B: Draw / Tie ---
  // (Multiple candidates have max score OR 1 candidate ties with Abstain)
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

  // --- SCENARIO C: Single Winner ---
  return {
    status: "winner",
    candidate: tiedCandidates[0],
  };
};
