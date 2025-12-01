// components/StudentDashboard/StatsSection.jsx
import React from "react";
import StatCard from "./StatsCard";

export default function StatsSection({ data: stats, isLoading }) {
  if (isLoading) return <div className="p-4">Loading stats...</div>;
  if (!stats) return <div className="p-4 text-gray-500">No stats available</div>;

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard
        label="Learning Streak"
        value={stats?.streak || 0}
        icon="local_fire_department"
        color="amber"
      />
      <StatCard
        label="Courses Completed"
        value={stats?.completed || 0}
        icon="military_tech"
        color="purple"
      />
      <StatCard
        label="Certificates Earned"
        value={stats?.certificates || 0}
        icon="workspace_premium"
        color="green"
      />
    </section>
  );
}
