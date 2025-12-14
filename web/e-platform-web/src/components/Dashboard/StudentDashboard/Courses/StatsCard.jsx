// components/StudentDashboard/StatCard.jsx
// Now uses shared StatsCard component for consistency
import React from "react";
import StatsCard from "../../../shared/StatsCard";

export default function StatCard({ label, value, icon, color }) {
  return <StatsCard label={label} value={value} icon={icon} color={color} variant="colored" />;
}
