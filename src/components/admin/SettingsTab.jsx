import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { format } from "date-fns";
import { Clock, PlayCircle, StopCircle, AlertOctagon } from "lucide-react";

export default function SettingsTab({ electionSettings, refreshData }) {
  const [dateInput, setDateInput] = useState("");
  const [timeInput, setTimeInput] = useState("");

  const updateStatus = async (isActive) => {
    if (
      !confirm(
        `Are you sure you want to ${isActive ? "START" : "STOP"} the election?`
      )
    )
      return;
    const updates = { is_active: isActive };
    if (isActive) updates.start_time = new Date().toISOString();
    const { error } = await supabase
      .from("election_settings")
      .update(updates)
      .eq("id", 1);
    if (error) alert(error.message);
    else refreshData();
  };

  const handleSetDeadline = async (e) => {
    e.preventDefault();
    if (!dateInput || !timeInput) return alert("Please select date and time.");
    const combinedDate = new Date(`${dateInput}T${timeInput}`);
    const { error } = await supabase
      .from("election_settings")
      .update({ end_time: combinedDate.toISOString() })
      .eq("id", 1);
    if (error) alert(error.message);
    else {
      alert("Deadline updated!");
      refreshData();
    }
  };

  const handleResetElection = async () => {
    if (
      !confirm(
        "🚨 DANGER ZONE 🚨\n\nThis will PERMANENTLY DELETE:\n- All Candidates\n- All Votes\n\nAre you sure?"
      )
    )
      return;
    if (!confirm("This action CANNOT be undone.")) return;

    try {
      await supabase.from("votes").delete().neq("id", 0);
      await supabase.from("candidates").delete().neq("id", 0);
      const { error: sError } = await supabase
        .from("election_settings")
        .update({ is_active: false, start_time: null, end_time: null })
        .eq("id", 1);
      if (sError) throw sError;
      alert("Success: Election has been fully reset.");
      refreshData();
    } catch (error) {
      alert("Reset Failed: " + error.message);
    }
  };

  const deadlineDisplay = electionSettings.end_time
    ? format(new Date(electionSettings.end_time), "MMMM d, yyyy h:mm a")
    : "Not set";

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold text-[#22162E]">Election Settings</h2>

      <div
        className={`p-6 rounded-xl border shadow-sm flex items-center justify-between ${
          electionSettings.is_active
            ? "bg-[#EFD8ED] border-[#B3A3DB]"
            : "bg-[#F4F5F4] border-[#B3A3DB]"
        }`}
      >
        <div className="flex items-center gap-4">
          {electionSettings.is_active ? (
            <PlayCircle className="text-[#759CE6]" size={40} />
          ) : (
            <StopCircle className="text-[#433A58]" size={40} />
          )}
          <div>
            <h3
              className={`font-bold text-lg ${
                electionSettings.is_active ? "text-[#433A58]" : "text-[#22162E]"
              }`}
            >
              {electionSettings.is_active
                ? "Election is LIVE"
                : "Election is STOPPED"}
            </h3>
            <p
              className={`text-sm opacity-75 ${
                electionSettings.is_active ? "text-[#626672]" : "text-[#626672]"
              }`}
            >
              {electionSettings.is_active
                ? "Students can currently vote."
                : "Voting is disabled."}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {!electionSettings.is_active && (
            <button
              onClick={() => updateStatus(true)}
              className="bg-[#759CE6] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#887AB8] transition-colors cursor-pointer"
            >
              Start Election
            </button>
          )}
          {electionSettings.is_active && (
            <button
              onClick={() => updateStatus(false)}
              className="bg-[#433A58] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#22162E] transition-colors"
            >
              Stop Election
            </button>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm border-[#B3A3DB]">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-[#433A58]">
          <Clock size={20} /> Election Deadline
        </h3>
        <div className="mb-6 p-4 bg-[#F4F5F4] rounded-lg border border-[#EFD8ED]">
          <p className="text-sm text-[#626672] uppercase font-bold">
            Current Deadline
          </p>
          <p className="text-xl font-mono font-bold text-[#22162E]">
            {deadlineDisplay}
          </p>
        </div>
        <form onSubmit={handleSetDeadline} className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-[#626672]">Date</label>
            <input
              type="date"
              className="w-full border border-[#B3A3DB] p-2 rounded mt-1 text-[#22162E] focus:outline-none focus:ring-2 focus:ring-[#759CE6]"
              onChange={(e) => setDateInput(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs font-bold text-[#626672]">Time</label>
            <input
              type="time"
              className="w-full border border-[#B3A3DB] p-2 rounded mt-1 text-[#22162E] focus:outline-none focus:ring-2 focus:ring-[#759CE6]"
              onChange={(e) => setTimeInput(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="col-span-2 bg-[#22162E] text-white py-2 rounded font-bold hover:bg-[#433A58] transition-colors cursor-pointer"
          >
            {electionSettings.end_time
              ? "Extend / Update Deadline"
              : "Set Deadline"}
          </button>
        </form>
      </div>

      <div className="bg-[#FFF5F5] p-6 rounded-xl border border-red-200 mt-8">
        <h3 className="font-bold text-lg text-red-800 mb-2 flex items-center gap-2">
          <AlertOctagon size={20} /> Danger Zone
        </h3>
        <p className="text-sm text-red-600 mb-4">
          Resetting the election will <strong>permanently delete</strong> all
          candidates and voting history.
        </p>
        <button
          onClick={handleResetElection}
          className="w-full bg-white border-2 border-red-200 text-red-600 font-bold py-3 rounded-lg hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
        >
          RESET ELECTION (Wipe All Data)
        </button>
      </div>
    </div>
  );
}
