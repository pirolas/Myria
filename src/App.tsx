import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { MiryaAppProvider, useMiryaApp } from "@/hooks/useMiryaApp";
import { ActiveWorkoutPage } from "@/pages/ActiveWorkoutPage";
import { AuthPage } from "@/pages/AuthPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { OnboardingPage } from "@/pages/OnboardingPage";
import { PlanPage } from "@/pages/PlanPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { ProgressPage } from "@/pages/ProgressPage";
import { TodayWorkoutPage } from "@/pages/TodayWorkoutPage";
import { WelcomePage } from "@/pages/WelcomePage";

function RootEntry() {
  const { status: authStatus } = useAuth();
  const { data, status: appStatus } = useMiryaApp();

  if (
    authStatus === "loading" ||
    (authStatus === "signed_in" &&
      !data &&
      (appStatus === "idle" || appStatus === "loading" || appStatus === "saving"))
  ) {
    return <FullScreenStatus message="Stiamo preparando il tuo spazio Mirya..." />;
  }

  if (authStatus === "missing_config" || authStatus === "signed_out") {
    return <WelcomePage />;
  }

  if (!data?.onboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}

function RequireSignedIn() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return <FullScreenStatus message="Stiamo verificando il tuo accesso..." />;
  }

  if (status === "missing_config") {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  if (status === "signed_out") {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

function RequireOnboarding() {
  const { data, status } = useMiryaApp();
  const location = useLocation();

  if (!data && (status === "idle" || status === "loading" || status === "saving")) {
    return <FullScreenStatus message="Stiamo caricando il tuo percorso..." />;
  }

  if (!data?.onboarding) {
    return <Navigate to="/onboarding" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootEntry />} />
      <Route path="/auth" element={<AuthPage />} />

      <Route element={<RequireSignedIn />}>
        <Route path="/onboarding" element={<OnboardingPage />} />

        <Route element={<RequireOnboarding />}>
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/today" element={<TodayWorkoutPage />} />
            <Route path="/session/:planDayId" element={<ActiveWorkoutPage />} />
            <Route path="/plan" element={<PlanPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function FullScreenStatus({ message }: { message: string }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[440px] items-center px-4">
      <div className="surface-strong w-full px-5 py-6">
        <div className="eyebrow">Mirya</div>
        <div className="mt-3 font-serif text-[1.9rem] leading-tight text-ink">
          {message}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MiryaAppProvider>
        <AppRoutes />
      </MiryaAppProvider>
    </AuthProvider>
  );
}
