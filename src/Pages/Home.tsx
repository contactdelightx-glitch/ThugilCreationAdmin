import { useState } from "react";
import Sidebar from "../UI/Sidebar";
import DesignList from "../Pages/DesignStudio/DesignList";
import { mainNavItems } from "../Constants/navItems";

// Mock pages for routes
function Dashboard() {
  return <div className="p-6">Dashboard Content</div>;
}

function NewDesigns() {
  return <div className="p-6">New Designs Content</div>;
}

function RecentAdded() {
  return <div className="p-6">Recent Added Content</div>;
}

function OrderAnalysis() {
  return <div className="p-6">Order Analysis Content</div>;
}

function Reports() {
  return <div className="p-6">Reports Content</div>;
}

function Insights() {
  return <div className="p-6">Insights Content</div>;
}

function Collaboration() {
  return <div className="p-6">Collaboration Content</div>;
}

function DigitalAssets() {
  return <div className="p-6">Digital Assets Content</div>;
}

function Settings() {
  return <div className="p-6">Settings Content</div>;
}

function Support() {
  return <div className="p-6">Help & Support Content</div>;
}

function DefaultPage({ title }: { title: string }) {
  return <div className="p-6">Welcome to {title}</div>;
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  // Function to render the current page based on navigation
  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "new-designs":
        return <NewDesigns />;
      case "designs-list":
        return <DesignList />;
      case "recent-added":
        return <RecentAdded />;
      case "orders":
        return <OrderAnalysis />;
      case "reports":
        return <Reports />;
      case "insights":
        return <Insights />;
      case "collaboration":
        return <Collaboration />;
      case "assets":
        return <DigitalAssets />;
      case "settings":
        return <Settings />;
      case "support":
        return <Support />;
      case "designs": // Handle parent menu item
        return <DefaultPage title="Design Studio" />;
      case "analytics": // Handle parent menu item
        return <DefaultPage title="Analytics" />;
      default:
        const navItem = mainNavItems.find((item) => item.id === currentPage);
        return <DefaultPage title={navItem?.name || "Page"} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onNavigate={setCurrentPage} />
      <main className="ml-16 flex-1 p-0 lg:ml-80 overflow-hidden">
        {renderCurrentPage()}
      </main>
    </div>
  );
}