import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard/Dashboard";
import NewDesign from "./Pages/DesignStudio/NewDesign";
import DesignList from "./Pages/DesignStudio/DesignList";
import RecentAdded from "./Pages/DesignStudio/RecentAdded";
import DigitalAssets from "./Pages/DigitalAssets/DigitalAssets";
import Collabration from "./Pages/Collabration/Collabration";
import Reports from "./Pages/Analysis/Reports";
import Support from "./Pages/Support";
import Settings from "./Pages/Settings";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<Login />} />

        {/* Home layout routes */}
        <Route path="/home" element={<Home />}>
          {/* Default dashboard */}
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* Design Studio routes */}
          <Route path="designs">
            <Route path="new" element={<NewDesign />} />
            <Route path="list" element={<DesignList />} />
            <Route path="recent" element={<RecentAdded />} />
          </Route>

          {/* Digital Assets */}
          <Route path="assets" element={<DigitalAssets />} />
          <Route path="digital-assets" element={<DigitalAssets />} />

          {/* Collaboration */}
          <Route path="collaboration" element={<Collabration />} />

          {/* Analytics / Reports */}
          <Route path="analytics">
            <Route path="reports" element={<Reports />} />
          </Route>

          {/* Support and Settings */}
          <Route path="support" element={<Support />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Optional: fallback route for 404 */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </Router>
  );
}
