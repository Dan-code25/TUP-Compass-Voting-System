
import Login from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard"; // 👈 Import this
import { useAuth } from "./hooks/useAuth";

export default function App() {
  const { session, userProfile, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-slate-500 font-sans">
        Loading System...
      </div>
    );
  }

  // 1. Not Logged In
  if (!session) {
    return <Login />;
  }

  // 2. Is Admin? -> Show Admin Dashboard
  if (userProfile?.role === "admin") {
    return <AdminDashboard onSignOut={signOut} />;
  }

  // 3. Is Student? -> Show Student Ballot
  return <Dashboard userProfile={userProfile || {}} signOut={signOut} />;
}
