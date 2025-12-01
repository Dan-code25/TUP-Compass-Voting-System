import { useState, useEffect } from "react";
import { useElectionData } from "./useElectionData";
import { POSITIONS } from "../lib/constants"; // Make sure constants.js exists from previous step

export function useStudentLogic(userProfile) {
  const electionData = useElectionData(userProfile);
  const { candidates, pendingVotes, userVotes, settings, submitBallot } =
    electionData;

  // --- LIVE TIMER ---
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- STATUS CHECK ---
  const isManuallyStopped = settings && !settings.is_active;
  const isDeadlinePassed =
    settings?.end_time && now > new Date(settings.end_time);
  const isElectionClosed = isManuallyStopped || isDeadlinePassed;

  // --- FILTER POSITIONS ---
  const availablePositions = POSITIONS.filter((pos) =>
    candidates.some((c) => c.position === pos)
  );

  const allPositionsFilled =
    availablePositions.length > 0 &&
    availablePositions.every((pos) => pendingVotes.hasOwnProperty(pos));

  const hasSubmitted = userVotes.length > 0;

  // --- HANDLERS ---
  const handleFinalSubmit = async () => {
    if (isDeadlinePassed) {
      alert("Sorry! The election deadline just passed.");
      window.location.reload();
      return;
    }
    if (
      !confirm("Are you sure? You cannot change your votes after submitting.")
    )
      return;

    const result = await submitBallot();
    if (result.success) {
      alert("Ballot submitted successfully!");
      window.scrollTo(0, 0);
    } else {
      alert("Failed to submit: " + result.message);
    }
  };

  return {
    ...electionData,
    availablePositions,
    allPositionsFilled,
    hasSubmitted,
    isElectionClosed,
    handleFinalSubmit,
  };
}
