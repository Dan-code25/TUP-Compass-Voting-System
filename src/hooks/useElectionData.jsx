import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export function useElectionData(userProfile) {
  const [candidates, setCandidates] = useState([]);
  const [userVotes, setUserVotes] = useState([]);
  const [pendingVotes, setPendingVotes] = useState({});
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userProfile?.id) return;
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchCandidates(),
          fetchUserVotes(userProfile.id),
          fetchSettings(),
        ]);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [userProfile?.id]);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from("election_settings")
      .select("*")
      .single();
    if (error) console.error("Error fetching settings:", error);
    setSettings(data);
  };

  const fetchCandidates = async () => {
    // UPDATED: Just select * (No parties relation)
    const { data, error } = await supabase
      .from("candidates")
      .select("*")
      .order("position");
    if (error) throw error;
    setCandidates(data || []);
  };

  const fetchUserVotes = async (userId) => {
    const { data, error } = await supabase
      .from("votes")
      .select("position, candidate_id")
      .eq("user_id", userId);
    if (error) throw error;
    setUserVotes(data || []);
  };

  // --- ACTIONS ---

  const toggleVote = (position, candidateId) => {
    if (userVotes.length > 0) return;
    setPendingVotes((prev) => ({
      ...prev,
      [position]: candidateId,
    }));
  };

  const abstainAll = () => {
    if (userVotes.length > 0) return;
    const allPositions = [...new Set(candidates.map((c) => c.position))];
    const newVotes = {};
    allPositions.forEach((pos) => {
      newVotes[pos] = null;
    });
    setPendingVotes(newVotes);
    alert("You have selected 'Abstain' for ALL positions.");
  };

  const submitBallot = async () => {
    if (!settings?.is_active) {
      alert("Submission Failed: The election is closed.");
      return { success: false };
    }

    const votesToInsert = Object.entries(pendingVotes).map(
      ([position, candidateId]) => ({
        user_id: userProfile.id,
        position: position,
        candidate_id: candidateId,
      })
    );

    try {
      const { error } = await supabase.from("votes").insert(votesToInsert);

      if (error) {
        if (error.code === "42501") throw new Error("Election is closed.");
        if (error.code === "23505") throw new Error("You already voted.");
        throw error;
      }

      await fetchUserVotes(userProfile.id);
      setPendingVotes({});
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  return {
    candidates,
    userVotes,
    pendingVotes,
    settings,
    loading,
    toggleVote,
    abstainAll,
    submitBallot,
  };
}
