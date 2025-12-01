import { POSITIONS } from "../lib/constants";

export const exportResultsToCSV = (candidates, abstainCounts) => {
  // Helper to calculate result for a specific position
  const getResult = (pos) => {
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
      return { status: "draw", count: overallMax }; // Simplified for CSV
    }
    return { status: "winner", candidate: tiedCandidates[0] };
  };

  let csvContent =
    "data:text/csv;charset=utf-8,Position,Result,Details,Votes\n";

  POSITIONS.forEach((pos) => {
    const result = getResult(pos);
    let row = `${pos},`;

    if (result.status === "winner") {
      row += `WINNER,${result.candidate.name},${result.candidate.vote_count}`;
    } else if (result.status === "draw") {
      row += `DRAW,Tie Detected,${result.count}`;
    } else if (result.status === "abstain_win") {
      row += `ABSTAIN,Majority Abstained,${result.count}`;
    } else {
      row += `NO VOTES,-,0`;
    }
    csvContent += row + "\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "compass_election_results.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
