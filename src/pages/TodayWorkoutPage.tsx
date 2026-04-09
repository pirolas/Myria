import { Navigate } from "react-router-dom";
import { useMiryaApp } from "@/hooks/useMiryaApp";

export function TodayWorkoutPage() {
  const { data } = useMiryaApp();

  if (!data?.todayPlanDay) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to={`/session/${data.todayPlanDay.id}`} replace />;
}
