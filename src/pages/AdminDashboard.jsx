import { useAdminLogic } from "../hooks/useAdminLogic";
import AdminSidebar from "../components/admin/AdminSidebar";
import OverviewTab from "../components/admin/OverviewTab";
import CandidatesTab from "../components/admin/CandidatesTab";
import SettingsTab from "../components/admin/SettingsTab";
import ResultsTab from "../components/admin/ResultsTab";

export default function AdminDashboard({ onSignOut }) {
  const {
    activeTab,
    setActiveTab,
    candidates,
    abstainCounts,
    electionSettings,
    loading,
    adminEmail,
    fetchData,
  } = useAdminLogic();

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#F4F5F4]">
        Loading Admin...
      </div>
    );

  return (
    <div className="flex bg-[#F4F5F4] min-h-screen font-sans">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        electionSettings={electionSettings}
        adminEmail={adminEmail}
        onSignOut={onSignOut}
      />
      <main className="ml-64 flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {activeTab === "results" &&
            !electionSettings.is_active &&
            electionSettings.start_time && (
              <ResultsTab
                candidates={candidates}
                abstainCounts={abstainCounts}
              />
            )}
          {activeTab === "overview" && (
            <OverviewTab
              candidates={candidates}
              abstainCounts={abstainCounts}
            />
          )}
          {activeTab === "candidates" && (
            <CandidatesTab candidates={candidates} refreshData={fetchData} />
          )}
          {activeTab === "settings" && (
            <SettingsTab
              electionSettings={electionSettings}
              refreshData={fetchData}
            />
          )}
        </div>
      </main>
    </div>
  );
}
