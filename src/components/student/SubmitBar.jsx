import React from "react";

export default function SubmitBar({ isReady, onSubmit }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#B3A3DB] p-4 shadow-xl z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="text-[#626672] text-sm">
          {isReady ? "Ballot Ready" : "Please fill all positions"}
        </div>
        <button
          onClick={onSubmit}
          disabled={!isReady}
          className={`px-6 py-2 rounded-lg font-bold text-white transition-colors ${
            isReady ? "bg-[#759CE6] hover:bg-[#887AB8]" : "bg-[#B3A3DB]"
          }`}
        >
          Submit Ballot
        </button>
      </div>
    </div>
  );
}
