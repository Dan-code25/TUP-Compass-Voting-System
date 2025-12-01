import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { POSITIONS, COLORS } from "../../lib/constants";

export default function OverviewTab({ candidates, abstainCounts }) {
  const votesByPosition = {};
  const existingPositions = new Set(candidates.map((c) => c.position));
  const activePositions = POSITIONS.filter((pos) => existingPositions.has(pos));

  activePositions.forEach((pos) => {
    votesByPosition[pos] = [];
  });

  candidates.forEach((c) => {
    if (votesByPosition[c.position]) {
      votesByPosition[c.position].push({
        name: c.name,
        votes: c.vote_count || 0,
      });
    }
  });

  activePositions.forEach((pos) => {
    const count = abstainCounts[pos] || 0;
    if (votesByPosition[pos]) {
      votesByPosition[pos].push({
        name: "Abstain",
        votes: count,
        isAbstain: true,
      });
    }
  });

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-[#22162E]">Election Analytics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activePositions.length > 0 ? (
          activePositions.map((position) => (
            <div
              key={position}
              className="bg-white p-6 rounded-xl border shadow-sm border-[#B3A3DB]"
            >
              <h3 className="font-bold text-lg mb-4 text-[#433A58] uppercase">
                {position}
              </h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={votesByPosition[position]}
                    layout="vertical"
                    margin={{ left: 20, right: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={100}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip cursor={{ fill: "transparent" }} />
                    <Bar
                      dataKey="votes"
                      radius={[0, 4, 4, 0]}
                      barSize={20}
                      label={{ position: "right" }}
                    >
                      {votesByPosition[position]?.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.isAbstain
                              ? "#626672"
                              : COLORS[index % COLORS.length]
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full p-8 text-center text-[#626672] bg-[#F4F5F4] rounded-xl border border-dashed border-[#B3A3DB]">
            No candidates found. Add candidates to see graphs.
          </div>
        )}
      </div>
    </div>
  );
}
