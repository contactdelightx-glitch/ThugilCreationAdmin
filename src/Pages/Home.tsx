import { Outlet } from "react-router-dom";
import Sidebar from "../UI/Sidebar";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-16 flex-1 overflow-hidden p-0 lg:ml-80">
        <Outlet />
      </main>
    </div>
  );
}