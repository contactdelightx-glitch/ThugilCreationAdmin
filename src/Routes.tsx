import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Home from "./Pages/Home";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Home />} />
          <Route path="designs">
            <Route index element={<Home />} />
            <Route path="new" element={<Home />} />
            <Route path="list" element={<Home />} />
            <Route path="recent" element={<Home />} />
          </Route>
          <Route path="analytics">
            <Route index element={<Home />} />
            <Route path="orders" element={<Home />} />
            <Route path="reports" element={<Home />} />
            <Route path="insights" element={<Home />} />
          </Route>
          <Route path="collaboration" element={<Home />} />
          <Route path="assets" element={<Home />} />
          <Route path="settings" element={<Home />} />
          <Route path="support" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
}