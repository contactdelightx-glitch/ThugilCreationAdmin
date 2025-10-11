import { Card } from "flowbite-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getDashboardData } from "../../Api";
import { useEffect, useState } from "react";

interface DashboardData {
  totalDesigns: number;
  totalPrice: number;
  avgPrice: number;
  freeImagesCount: number;
  uploadedImagesCount: number;
}

const Dashboard = () => {
  const [data, setData] = useState<DashboardData>({
    totalDesigns: 0,
    totalPrice: 0,
    avgPrice: 0,
    freeImagesCount: 0,
    uploadedImagesCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        if (!token) {
          throw new Error("No authentication token found");
        }

        // Decode token to get email
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const userEmail = tokenPayload.email;

        if (!userEmail) {
          throw new Error("No email found in token");
        }

        console.log("Fetching dashboard data for email:", userEmail);

        // Pass an object with email property as expected by the API function
        const dashboardData = await getDashboardData({ email: userEmail });
        console.log("Dashboard data received:", dashboardData);
        
        setData(dashboardData);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Chart data (keeping as mock data since no backend data available)
  const monthlyData = [
    { month: "Jan", designs: 45, revenue: 7650 },
    { month: "Feb", designs: 52, revenue: 8850 },
    { month: "Mar", designs: 48, revenue: 8160 },
    { month: "Apr", designs: 55, revenue: 9350 },
    { month: "May", designs: 62, revenue: 10540 },
    { month: "Jun", designs: 58, revenue: 9860 },
    { month: "Jul", designs: 65, revenue: 11050 },
    { month: "Aug", designs: 58, revenue: 9860 },
  ];

  // Calculate derived metrics from backend data
  const designUtilizationRate = data.uploadedImagesCount > 0 ? 
    Math.round((data.uploadedImagesCount / data.totalDesigns) * 100) : 0;
  
  const paidDesignsCount = data.totalDesigns - data.freeImagesCount;
  const assetCoverageRatio = data.totalDesigns > 0 ? 
    `${data.uploadedImagesCount}:${data.totalDesigns}` : "0:0";

  if (loading) {
    return (
      <div className="min-h-screen p-2 sm:p-3 lg:p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8c1007] mx-auto"></div>
          <p className="mt-4 text-[#3e0703]">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-2 sm:p-3 lg:p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#3e0703] mb-2">Error Loading Dashboard</h3>
          <p className="text-[#8c1007]">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#8c1007] text-white hover:bg-[#3e0703] transition-colors"
            style={{ borderRadius: "0px" }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-2 sm:p-3 lg:p-4"
    >
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1
          className="text-lg font-bold sm:text-xl lg:text-2xl"
          style={{ color: "#3e0703" }}
        >
          Design Portfolio Dashboard
        </h1>
        <p className="mt-1 text-xs sm:text-sm" style={{ color: "#8c1007" }}>
          Comprehensive overview of your design assets and performance metrics
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:mb-6 lg:grid-cols-4">
        {/* Total Designs */}
        <Card
          className="!bg-white shadow-sm"
          style={{ borderRadius: "0px", border: "2px solid #8c1007" }}
        >
          <div className="flex items-center p-2">
            <div
              className="mr-3 p-2"
              style={{ backgroundColor: "#fff0c4", borderRadius: "0px" }}
            >
              <svg
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill="none"
                stroke="#8c1007"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p
                className="text-xs font-medium tracking-wide uppercase sm:text-sm"
                style={{ color: "#8c1007" }}
              >
                Total Designs
              </p>
              <p
                className="truncate text-lg font-bold sm:text-xl"
                style={{ color: "#3e0703" }}
              >
                {data.totalDesigns}
              </p>
            </div>
          </div>
        </Card>

        {/* Total Price */}
        <Card
          className="!bg-white shadow-sm"
          style={{ borderRadius: "0px", border: "2px solid #8c1007" }}
        >
          <div className="flex items-center p-2">
            <div
              className="mr-3 p-2"
              style={{ backgroundColor: "#fff0c4", borderRadius: "0px" }}
            >
              <svg
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill="none"
                stroke="#8c1007"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p
                className="text-xs font-medium tracking-wide uppercase sm:text-sm"
                style={{ color: "#8c1007" }}
              >
                Total Value
              </p>
              <p
                className="truncate text-lg font-bold sm:text-xl"
                style={{ color: "#3e0703" }}
              >
                ₹{data.totalPrice.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        {/* Average Price */}
        <Card
          className="!bg-white shadow-sm"
          style={{ borderRadius: "0px", border: "2px solid #8c1007" }}
        >
          <div className="flex items-center p-2">
            <div
              className="mr-3 p-2"
              style={{ backgroundColor: "#fff0c4", borderRadius: "0px" }}
            >
              <svg
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill="none"
                stroke="#8c1007"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p
                className="text-xs font-medium tracking-wide uppercase sm:text-sm"
                style={{ color: "#8c1007" }}
              >
                Avg. Price
              </p>
              <p
                className="truncate text-lg font-bold sm:text-xl"
                style={{ color: "#3e0703" }}
              >
                ₹{data.avgPrice.toFixed(0)}
              </p>
            </div>
          </div>
        </Card>

        {/* Uploaded Images */}
        <Card
          className="!bg-white shadow-sm"
          style={{ borderRadius: "0px", border: "2px solid #8c1007" }}
        >
          <div className="flex items-center p-2">
            <div
              className="mr-3 p-2"
              style={{ backgroundColor: "#fff0c4", borderRadius: "0px" }}
            >
              <svg
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill="none"
                stroke="#8c1007"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p
                className="text-xs font-medium tracking-wide uppercase sm:text-sm"
                style={{ color: "#8c1007" }}
              >
                Images
              </p>
              <p
                className="truncate text-lg font-bold sm:text-xl"
                style={{ color: "#3e0703" }}
              >
                {data.uploadedImagesCount}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="mb-4 grid grid-cols-1 gap-3 lg:mb-6 lg:grid-cols-2 lg:gap-4">
        {/* Monthly Performance Chart */}
        <Card
          className="!bg-white shadow-sm"
          style={{ borderRadius: "0px", border: "2px solid #8c1007" }}
        >
          <div className="p-2 sm:p-3">
            <h3
              className="mb-3 text-base font-semibold sm:text-lg"
              style={{ color: "#3e0703" }}
            >
              Monthly Performance
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#8c1007"
                  opacity={0.2}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#3e0703", fontSize: 12 }}
                />
                <YAxis tick={{ fill: "#3e0703", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff0c4",
                    border: "2px solid #8c1007",
                    borderRadius: "0px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", color: "#3e0703" }} />
                <Bar dataKey="designs" fill="#8c1007" name="Designs" />
                <Bar dataKey="revenue" fill="#3e0703" name="Revenue (₹)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Revenue Trend Chart */}
        <Card
          className="!bg-white shadow-sm"
          style={{ borderRadius: "0px", border: "2px solid #8c1007" }}
        >
          <div className="p-2 sm:p-3">
            <h3
              className="mb-3 text-base font-semibold sm:text-lg"
              style={{ color: "#3e0703" }}
            >
              Revenue Trend
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#8c1007"
                  opacity={0.2}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#3e0703", fontSize: 12 }}
                />
                <YAxis tick={{ fill: "#3e0703", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff0c4",
                    border: "2px solid #8c1007",
                    borderRadius: "0px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", color: "#3e0703" }} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8c1007"
                  strokeWidth={3}
                  name="Revenue (₹)"
                />
                <Line
                  type="monotone"
                  dataKey="designs"
                  stroke="#3e0703"
                  strokeWidth={2}
                  name="Designs"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Analytics Section */}
      <div className="mb-4 grid grid-cols-1 gap-3 lg:mb-6 lg:grid-cols-2 lg:gap-4">
        {/* Performance Metrics */}
        <Card
          className="!bg-white shadow-sm"
          style={{ borderRadius: "0px", border: "2px solid #8c1007" }}
        >
          <div className="p-2 sm:p-3">
            <h3
              className="mb-3 text-base font-semibold sm:text-lg"
              style={{ color: "#3e0703" }}
            >
              Performance Metrics
            </h3>
            <div className="space-y-3">
              <div
                className="flex items-center justify-between pb-2"
                style={{ borderBottom: "1px solid #8c1007" }}
              >
                <div className="min-w-0 flex-1">
                  <p
                    className="truncate text-sm font-medium"
                    style={{ color: "#3e0703" }}
                  >
                    Design Utilization Rate
                  </p>
                  <p className="truncate text-xs" style={{ color: "#8c1007" }}>
                    Percentage of designs with images
                  </p>
                </div>
                <span
                  className="ml-2 text-sm font-bold sm:text-base"
                  style={{ color: "#8c1007" }}
                >
                  {designUtilizationRate}%
                </span>
              </div>
              <div
                className="flex items-center justify-between pb-2"
                style={{ borderBottom: "1px solid #8c1007" }}
              >
                <div className="min-w-0 flex-1">
                  <p
                    className="truncate text-sm font-medium"
                    style={{ color: "#3e0703" }}
                  >
                    Free Image Allocation
                  </p>
                  <p className="truncate text-xs" style={{ color: "#8c1007" }}>
                    Available free images
                  </p>
                </div>
                <span
                  className="ml-2 text-sm font-bold sm:text-base"
                  style={{ color: "#3e0703" }}
                >
                  {data.freeImagesCount}
                </span>
              </div>
              <div
                className="flex items-center justify-between pb-2"
                style={{ borderBottom: "1px solid #8c1007" }}
              >
                <div className="min-w-0 flex-1">
                  <p
                    className="truncate text-sm font-medium"
                    style={{ color: "#3e0703" }}
                  >
                    Paid Design Portfolio
                  </p>
                  <p className="truncate text-xs" style={{ color: "#8c1007" }}>
                    Revenue generating designs
                  </p>
                </div>
                <span
                  className="ml-2 text-sm font-bold sm:text-base"
                  style={{ color: "#8c1007" }}
                >
                  {paidDesignsCount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p
                    className="truncate text-sm font-medium"
                    style={{ color: "#3e0703" }}
                  >
                    Average Revenue per Design
                  </p>
                  <p className="truncate text-xs" style={{ color: "#8c1007" }}>
                    Monetization efficiency
                  </p>
                </div>
                <span
                  className="ml-2 text-sm font-bold sm:text-base"
                  style={{ color: "#8c1007" }}
                >
                  ₹{data.avgPrice.toFixed(0)}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Financial Summary */}
        <Card
          className="!bg-white shadow-sm"
          style={{ borderRadius: "0px", border: "2px solid #8c1007" }}
        >
          <div className="p-2 sm:p-3">
            <h3
              className="mb-3 text-base font-semibold sm:text-lg"
              style={{ color: "#3e0703" }}
            >
              Financial Summary
            </h3>
            <div className="space-y-3">
              <div
                className="flex items-center justify-between pb-2"
                style={{ borderBottom: "1px solid #8c1007" }}
              >
                <div className="min-w-0 flex-1">
                  <p
                    className="truncate text-sm font-medium"
                    style={{ color: "#3e0703" }}
                  >
                    Total Portfolio Valuation
                  </p>
                  <p className="truncate text-xs" style={{ color: "#8c1007" }}>
                    Combined value of all designs
                  </p>
                </div>
                <span
                  className="ml-2 text-sm font-bold sm:text-base"
                  style={{ color: "#8c1007" }}
                >
                  ₹{data.totalPrice.toLocaleString()}
                </span>
              </div>
              <div
                className="flex items-center justify-between pb-2"
                style={{ borderBottom: "1px solid #8c1007" }}
              >
                <div className="min-w-0 flex-1">
                  <p
                    className="truncate text-sm font-medium"
                    style={{ color: "#3e0703" }}
                  >
                    Average Design Price
                  </p>
                  <p className="truncate text-xs" style={{ color: "#8c1007" }}>
                    Mean price across portfolio
                  </p>
                </div>
                <span
                  className="ml-2 text-sm font-bold sm:text-base"
                  style={{ color: "#3e0703" }}
                >
                  ₹{data.avgPrice.toFixed(0)}
                </span>
              </div>
              <div
                className="flex items-center justify-between pb-2"
                style={{ borderBottom: "1px solid #8c1007" }}
              >
                <div className="min-w-0 flex-1">
                  <p
                    className="truncate text-sm font-medium"
                    style={{ color: "#3e0703" }}
                  >
                    Design Inventory
                  </p>
                  <p className="truncate text-xs" style={{ color: "#8c1007" }}>
                    Total design count
                  </p>
                </div>
                <span
                  className="ml-2 text-sm font-bold sm:text-base"
                  style={{ color: "#3e0703" }}
                >
                  {data.totalDesigns}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p
                    className="truncate text-sm font-medium"
                    style={{ color: "#3e0703" }}
                  >
                    Asset Coverage Ratio
                  </p>
                  <p className="truncate text-xs" style={{ color: "#8c1007" }}>
                    Images per design
                  </p>
                </div>
                <span
                  className="ml-2 text-sm font-bold sm:text-base"
                  style={{ color: "#8c1007" }}
                >
                  {assetCoverageRatio}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;