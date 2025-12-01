import Navbar from "../components/student/Navbar";
import { useStudentLogic } from "../hooks/useStudentLogic";

import ElectionClosed from "../components/student/ElectionClosed";
import ElectionHeader from "../components/student/ElectionHeader";
import AbstainAllSection from "../components/student/AbstainAllSection";
import PositionGroup from "../components/student/PositionGroup";
import SubmitBar from "../components/student/SubmitBar";

export default function Dashboard({ userProfile, signOut }) {
  const {
    candidates,
    userVotes,
    pendingVotes,
    settings,
    loading,
    toggleVote,
    abstainAll,
    handleFinalSubmit,
    availablePositions,
    allPositionsFilled,
    hasSubmitted,
    isElectionClosed,
  } = useStudentLogic(userProfile);

  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F5F4] text-[#626672]">
        Loading Election Data...
      </div>
    );
  }

  // 2. Election Closed State
  if (isElectionClosed) {
    return <ElectionClosed userProfile={userProfile} signOut={signOut} />;
  }

  // 3. Active Voting Dashboard
  return (
    <div className="min-h-screen bg-[#F4F5F4] font-sans pb-32">
      <Navbar userEmail={userProfile.email} onSignOut={signOut} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <ElectionHeader endTime={settings?.end_time} />

        {/* Abstain All Option */}
        {!hasSubmitted && availablePositions.length > 0 && (
          <AbstainAllSection onAbstainAll={abstainAll} />
        )}

        {/* Render Position Groups */}
        <div className="space-y-12">
          {availablePositions.length > 0 ? (
            availablePositions.map((position) => (
              <PositionGroup
                key={position}
                position={position}
                candidates={candidates}
                userVotes={userVotes}
                pendingVotes={pendingVotes}
                hasSubmitted={hasSubmitted}
                onVote={toggleVote}
              />
            ))
          ) : (
            <div className="text-center py-20 text-[#626672]">
              <p className="text-xl">No active positions to vote for yet.</p>
              <p className="text-sm">
                Please wait for the admin to add candidates.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Bar */}
      {!hasSubmitted && availablePositions.length > 0 && (
        <SubmitBar isReady={allPositionsFilled} onSubmit={handleFinalSubmit} />
      )}
    </div>
  );
}
