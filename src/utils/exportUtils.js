import { POSITIONS } from "../lib/constants";
import { calculatePositionResult } from "./electionHelpers"; // <--- Import Helper

export const exportResultsToCSV = (candidates, abstainCounts) => {
  let csvContent =
    "data:text/csv;charset=utf-8,Position,Result,Details,Votes\n";

  POSITIONS.forEach((pos) => {
    // Use the exact same calculation as the dashboard
    const result = calculatePositionResult(pos, candidates, abstainCounts);

    let row = `${pos},`;

    if (result.status === "winner") {
      row += `WINNER,${result.candidate.name},${result.candidate.vote_count}`;
    } else if (result.status === "draw") {
      const names = result.winners.map((w) => w.name);
      if (result.abstainInvolved) names.push("Abstain");
      // Join names with " & " for readability in CSV
      row += `DRAW,${names.join(" & ")},${result.count}`;
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
