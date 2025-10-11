import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Home from "./Pages/Home";
import NewDesign from "./Pages/DesignStudio/NewDesign";
import DesignList from "./Pages/DesignStudio/DesignList";
import RecentAdded from "./Pages/DesignStudio/RecentAdded";
import DigitalAssets from "./Pages/DigitalAssets/DigitalAssets";
import Collabration from "./Pages/Collabration/Collabration";
import Support from "./Pages/Support";
import Settings from "./Pages/Settings";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="designs">
            <Route path="new" element={<NewDesign />} />
            <Route path="list" element={<DesignList />} />
            <Route path="recent" element={<RecentAdded />} />
          </Route>
          <Route path="assets" element={<DigitalAssets />} />
          <Route path="digital-assets" element={<DigitalAssets />} />
          <Route path="collaboration" element={<Collabration />} />
          <Route path="support" element={<Support />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}
