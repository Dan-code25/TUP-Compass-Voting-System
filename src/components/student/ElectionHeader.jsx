import React from "react";
import { format } from "date-fns";

export default function ElectionHeader({ endTime }) {
  return (
    <div className="mb-8 flex justify-between items-end">
      <div>
        <h1 className="text-3xl font-bold text-[#22162E]">
          TUP MANILA COMPASS ELECTION
        </h1>
        <p className="text-[#626672]">Vote wisely.</p>
      </div>
      {endTime && (
        <div className="text-right hidden md:block">
          <p className="text-xs font-bold text-[#B3A3DB] uppercase">Deadline</p>
          <p className="text-sm font-bold text-[#433A58]">
            {format(new Date(endTime), "MMM d, h:mm:ss a")}
          </p>
        </div>
      )}
    </div>
  );
}
