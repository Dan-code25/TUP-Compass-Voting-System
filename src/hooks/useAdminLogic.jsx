import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabaseClient";

export function useAdminLogic() {
  const [activeTab, setActiveTab] = useState("overview");
  const [candidates, setCandidates] = useState([]);
  const [abstainCounts, setAbstainCounts] = useState({});
  const [electionSettings, setElectionSettings] = useState({
    id: 1,
    title: "TUP MANILA COMPASS ELECTION",
    is_active: false,
    start_time: null,
    end_time: null,
  });
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState("Admin");
  const stopLock = useRef(false);

  // --- FETCH DATA ---
  const fetchData = async () => {
    if (candidates.length === 0) setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setAdminEmail(user.email);

      const { data: cData } = await supabase
        .from("candidates")
        .select("*")
        .order("position");
      const { data: sData } = await supabase
        .from("election_settings")
        .select("*")
        .single();
      const { data: abstainData } = await supabase
        .from("votes")
        .select("position")
        .is("candidate_id", null);

      const aCounts = {};
      if (abstainData) {
        abstainData.forEach((vote) => {
          aCounts[vote.position] = (aCounts[vote.position] || 0) + 1;
        });
      }

      setCandidates(cData || []);
      setAbstainCounts(aCounts);
      if (sData) setElectionSettings(sData);
    } catch (error) {
      console.error("Error fetching admin data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- SUBSCRIPTIONS ---
  useEffect(() => {
    fetchData();
    const candidatesSub = supabase
      .channel("public:candidates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "candidates" },
        () => fetchData()
      )
      .subscribe();

    const settingsSub = supabase
      .channel("public:election_settings")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "election_settings" },
        (payload) => {
          setElectionSettings(payload.new);
          // Logic: If election just stopped, show results. If reset, show overview.
          if (payload.new.is_active === false && payload.new.start_time)
            setActiveTab("results");
          if (payload.new.start_time === null) setActiveTab("overview");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(candidatesSub);
      supabase.removeChannel(settingsSub);
    };
  }, []);

  // --- AUTO-STOP LOGIC ---
  useEffect(() => {
    const checkDeadline = setInterval(async () => {
      if (stopLock.current) return;

      if (electionSettings.is_active && electionSettings.end_time) {
        const now = new Date();
        const deadline = new Date(electionSettings.end_time);

        if (now > deadline) {
          console.log("Deadline reached. Auto-stopping...");
          stopLock.current = true;
          clearInterval(checkDeadline);

          const { error } = await supabase
            .from("election_settings")
            .update({ is_active: false })
            .eq("id", 1);

          if (!error) {
            alert("⏰ The election deadline has passed. Voting is now CLOSED.");
            setElectionSettings((prev) => ({ ...prev, is_active: false }));
            setActiveTab("results");
            fetchData();
          }
          stopLock.current = false;
        }
      }
    }, 1000);
    return () => clearInterval(checkDeadline);
  }, [electionSettings]);

  // Prevent viewing results if active
  useEffect(() => {
    if (electionSettings.is_active && activeTab === "results")
      setActiveTab("overview");
  }, [electionSettings.is_active, activeTab]);

  return {
    activeTab,
    setActiveTab,
    candidates,
    abstainCounts,
    electionSettings,
    loading,
    adminEmail,
    fetchData, // Exposed for manual refresh if needed
  };
}
