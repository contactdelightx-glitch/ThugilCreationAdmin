import { Card } from "flowbite-react";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getDashboardData } from "../../Api";
import { useEffect, useRef, useState } from "react";

interface DashboardData {
  totalDesigns: number;
  totalPrice: number;
  avgPrice: number;
  freeImagesCount: number;
  uploadedImagesCount: number;
  todaySales: number;
  weeklySales: number;
  monthlySales: number;
  soldDesigns: Array<{
    id: string;
    name: string;
    final_price: number;
    timesSold: number;
  }>;
  topSoldDesigns: Array<{
    id: string;
    name: string;
    final_price: number;
    timesSold: number;
  }>;
  monthlyBreakdown: Array<{
    month: string;
    designsSold: number;
    totalRevenue: number;
  }>;
}

// Sankey chart node and link interfaces
interface SankeyNode {
  name: string;
}

interface SankeyLink {
  source: number;
  target: number;
  value: number;
}

// Skeleton Card Component for Loading State
const SkeletonCard = () => (
  <Card
    className="!bg-white shadow-sm"
    style={{ borderRadius: "0px", border: "2px solid #8c1007" }}
  >
    <div className="p-2 sm:p-3">
      <div className="mb-3 h-5 w-1/3 animate-pulse rounded-none bg-gray-200"></div>
      <div className="flex items-center gap-3">
        <div
          className="h-10 w-10 animate-pulse rounded-none"
          style={{ backgroundColor: "#fff0c4" }}
        ></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/2 animate-pulse rounded-none bg-gray-200"></div>
          <div className="h-6 w-3/4 animate-pulse rounded-none bg-gray-200"></div>
        </div>
      </div>
      {/* Placeholder for charts */}
      <div className="mt-3 h-64 w-full animate-pulse rounded-none bg-gray-200"></div>
    </div>
  </Card>
);

const Dashboard = () => {
  const [data, setData] = useState<DashboardData>({
    totalDesigns: 0,
    totalPrice: 0,
    avgPrice: 0,
    freeImagesCount: 0,
    uploadedImagesCount: 0,
    todaySales: 0,
    weeklySales: 0,
    monthlySales: 0,
    soldDesigns: [],
    topSoldDesigns: [],
    monthlyBreakdown: [],
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
        const tokenPayload = JSON.parse(atob(token.split(".")[1]));
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
        setError(
          err instanceof Error ? err.message : "Failed to fetch dashboard data",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate accurate metrics from the actual data
  const totalMonthlyRevenue = data.monthlyBreakdown.reduce(
    (total, month) => total + month.totalRevenue,
    0,
  );

  // Calculate total sales from sold designs (sum of timesSold for all designs)
  const totalSalesFromDesigns = data.soldDesigns.reduce(
    (total, design) => total + design.timesSold,
    0,
  );

  // Calculate TOTAL REVENUE (all time) from sold designs
  const totalRevenueFromDesigns = data.soldDesigns.reduce(
    (total, design) => total + design.final_price * design.timesSold,
    0,
  );

  // Use the backend provided monthlySales for monthly data
  const monthlySales = data.monthlySales;

  // For total revenue, use the calculated value from designs or fallback to monthly breakdown
  const totalRevenue = totalRevenueFromDesigns > 0 ? totalRevenueFromDesigns : totalMonthlyRevenue;

  // Prepare chart data from backend data - Use accurate values
  const salesDistributionData = [
    {
      name: "Today",
      sales: data.todaySales,
      revenue: data.todaySales * data.avgPrice,
    },
    {
      name: "This Week",
      sales: data.weeklySales,
      revenue: data.weeklySales * data.avgPrice,
    },
    {
      name: "This Month",
      sales: monthlySales,
      revenue: totalMonthlyRevenue,
    },
    {
      name: "All Time",
      sales: totalSalesFromDesigns,
      revenue: totalRevenue,
    },
  ];

  const monthlySalesData = data.monthlyBreakdown.map((item) => ({
    month: item.month,
    sales: item.designsSold,
    revenue: item.totalRevenue,
  }));

  // Top Selling Designs Data - use actual sold designs data
  const allSoldDesignsData = data.soldDesigns
    .slice(0, 10)
    .map((design) => ({
      name:
        design.name.length > 8
          ? `${design.name.substring(0, 8)}...`
          : design.name,
      fullName: design.name,
      sales: design.timesSold,
      revenue: design.final_price * design.timesSold,
      price: design.final_price,
    }));

  // Sankey Chart Data for Price Analysis - use accurate values
  const sankeyData = {
    nodes: [
      { name: "Total Designs" },
      { name: "Paid Designs" },
      { name: "Free Designs" },
      { name: "Sold Designs" },
      { name: "Total Revenue" },
      { name: "Avg Price" },
    ],
    links: [
      { source: 0, target: 1, value: data.totalDesigns - data.freeImagesCount },
      { source: 0, target: 2, value: data.freeImagesCount },
      { source: 1, target: 3, value: monthlySales },
      { source: 3, target: 4, value: totalRevenue },
      { source: 1, target: 5, value: data.avgPrice },
    ],
  };

  const SankeyChart = ({
    data,
  }: {
    data: { nodes: SankeyNode[]; links: SankeyLink[] };
  }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);

    useEffect(() => {
      const updateSize = () => {
        if (containerRef.current) {
          setContainerWidth(containerRef.current.offsetWidth);
        }
      };
      updateSize();
      window.addEventListener("resize", updateSize);
      return () => window.removeEventListener("resize", updateSize);
    }, []);

    const totalValue = data.links.reduce((sum, link) => sum + link.value, 0);
    const nodeHeight = 40;
    const nodeWidth = containerWidth > 0 ? containerWidth / 3 : 140;
    const chartHeight = data.nodes.length * (nodeHeight + 20);
    const horizontalSpacing = containerWidth > 0 ? containerWidth / 2 : 200;

    return (
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: chartHeight,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Draw links */}
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
          viewBox={`0 0 ${containerWidth} ${chartHeight}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {data.links.map((_, index) => (
              <linearGradient
                key={index}
                id={`gradient-${index}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#8c1007" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3e0703" stopOpacity="0.8" />
              </linearGradient>
            ))}
          </defs>
          {data.links.map((link, index) => {
            const sourceX = link.source % 2 === 0 ? 0 : horizontalSpacing;
            const targetX = link.target % 2 === 0 ? 0 : horizontalSpacing;
            const sourceY = link.source * (nodeHeight + 20);
            const targetY = link.target * (nodeHeight + 20);
            const linkWidth = Math.max((link.value / totalValue) * 20, 2);

            return (
              <path
                key={index}
                d={`M ${sourceX + nodeWidth} ${sourceY + nodeHeight / 2}
                  C ${sourceX + nodeWidth + 80} ${sourceY + nodeHeight / 2}
                    ${targetX - 80} ${targetY + nodeHeight / 2}
                    ${targetX} ${targetY + nodeHeight / 2}`}
                stroke={`url(#gradient-${index})`}
                strokeWidth={linkWidth}
                fill="none"
                strokeOpacity="0.7"
              />
            );
          })}
        </svg>

        {/* Draw nodes */}
        {data.nodes.map((node, index) => {
          const xPos = index % 2 === 0 ? 0 : horizontalSpacing;
          const yPos = index * (nodeHeight + 20);

          const nodeValue =
            data.links
              .filter((link) => link.source === index)
              .reduce((sum, link) => sum + link.value, 0) ||
            data.links
              .filter((link) => link.target === index)
              .reduce((sum, link) => sum + link.value, 0);

          return (
            <div
              key={index}
              style={{
                position: "absolute",
                left: xPos,
                top: yPos,
                width: nodeWidth,
                height: nodeHeight,
                backgroundColor: "#8c1007",
                border: "2px solid #3e0703",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold",
                fontSize: "11px",
                textAlign: "center",
                padding: "6px",
                borderRadius: "4px",
                boxShadow: "2px 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              <div>
                <div style={{ fontSize: "10px", marginBottom: "2px" }}>
                  {node.name}
                </div>
                <div
                  style={{
                    fontSize: "9px",
                    opacity: 0.9,
                    fontWeight: "normal",
                  }}
                >
                  {index === 4 || index === 5 ? "₹" : ""}
                  {nodeValue.toLocaleString()}
                  {index <= 3 ? " units" : ""}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Calculate derived metrics from backend data
  const designUtilizationRate =
    data.uploadedImagesCount > 0
      ? Math.round((data.uploadedImagesCount / data.totalDesigns) * 100)
      : 0;

  const paidDesignsCount = data.totalDesigns - data.freeImagesCount;

  // Calculate conversion rate based on unique sold designs vs total designs
  const conversionRate =
    data.totalDesigns > 0
      ? Math.round((data.soldDesigns.length / data.totalDesigns) * 100)
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen p-2 sm:p-3 lg:p-4">
        {/* Header Skeleton */}
        <div className="mb-4 sm:mb-6">
          <div className="h-6 w-1/3 animate-pulse rounded-none bg-gray-200"></div>
          <div className="mt-1 h-4 w-2/3 animate-pulse rounded-none bg-gray-200"></div>
        </div>

        {/* Main Stats Grid Skeleton */}
        <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:mb-6 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonCard key={`stats-${index}`} />
          ))}
        </div>

        {/* First Row Charts Skeleton */}
        <div className="mb-4 grid grid-cols-1 gap-3 lg:mb-6 lg:grid-cols-2 lg:gap-4">
          <SkeletonCard key="chart-1" />
          <SkeletonCard key="chart-2" />
        </div>

        {/* Second Row Charts Skeleton */}
        <div className="mb-4 grid grid-cols-1 gap-3 lg:mb-6 lg:grid-cols-2 lg:gap-4">
          <SkeletonCard key="chart-3" />
          <SkeletonCard key="chart-4" />
        </div>

        {/* Analytics Section Skeleton */}
        <div className="mb-4 grid grid-cols-1 gap-3 lg:mb-6 lg:grid-cols-2 lg:gap-4">
          <SkeletonCard key="analytics-1" />
          <SkeletonCard key="analytics-2" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-2 sm:p-3 lg:p-4">
        <div className="text-center">
          <div className="mb-4 text-red-600">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-[#3e0703]">
            Error Loading Dashboard
          </h3>
          <p className="text-[#8c1007]">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-[#8c1007] px-4 py-2 text-white transition-colors hover:bg-[#3e0703]"
            style={{ borderRadius: "0px" }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2 sm:p-3 lg:p-4">
      {/* Header - Simplified without the metrics */}
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

      {/* Main Stats Grid - Using accurate data calculations */}
      <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:mb-6 lg:grid-cols-5">
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

        {/* Total Portfolio Value */}
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
                Portfolio Value
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

        {/* Total Revenue */}
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
                Total Revenue
              </p>
              <p
                className="truncate text-lg font-bold sm:text-xl"
                style={{ color: "#3e0703" }}
              >
                ₹{totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        {/* Monthly Revenue */}
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
                Monthly Revenue
              </p>
              <p
                className="truncate text-lg font-bold sm:text-xl"
                style={{ color: "#3e0703" }}
              >
                ₹{totalMonthlyRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        {/* Total Sales */}
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
                Total Sales
              </p>
              <p
                className="truncate text-lg font-bold sm:text-xl"
                style={{ color: "#3e0703" }}
              >
                {totalSalesFromDesigns}
              </p>
              <p className="text-xs text-[#8c1007]">
                {data.soldDesigns.length} unique designs
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* First Row - 2 Charts */}
      <div className="mb-4 grid grid-cols-1 gap-3 lg:mb-6 lg:grid-cols-2 lg:gap-4">
        {/* Sales Distribution Chart */}
        <Card
          className="!bg-white shadow-sm"
          style={{ borderRadius: "0px", border: "2px solid #8c1007" }}
        >
          <div className="p-2 sm:p-3">
            <h3
              className="mb-3 text-base font-semibold sm:text-lg"
              style={{ color: "#3e0703" }}
            >
              Sales Distribution & Revenue
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesDistributionData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#8c1007"
                  opacity={0.2}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#3e0703", fontSize: 12 }}
                />
                <YAxis
                  tick={{ fill: "#3e0703", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff0c4",
                    border: "2px solid #8c1007",
                    borderRadius: "0px",
                  }}
                  formatter={(value, name) => [
                    name === "revenue"
                      ? `₹${Number(value).toLocaleString()}`
                      : value,
                    name === "revenue" ? "Revenue" : "Sales",
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: "12px", color: "#3e0703" }} />
                <Bar
                  dataKey="sales"
                  fill="#8c1007"
                  name="Sales (Units)"
                  barSize={30}
                />
                <Bar
                  dataKey="revenue"
                  fill="#3e0703"
                  name="Revenue (₹)"
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Monthly Revenue Trend */}
        <Card
          className="!bg-white shadow-sm"
          style={{ borderRadius: "0px", border: "2px solid #8c1007" }}
        >
          <div className="p-2 sm:p-3">
            <h3
              className="mb-3 text-base font-semibold sm:text-lg"
              style={{ color: "#3e0703" }}
            >
              Monthly Revenue Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlySalesData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#8c1007"
                  opacity={0.2}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#3e0703", fontSize: 12 }}
                />
                <YAxis
                  tick={{ fill: "#3e0703", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff0c4",
                    border: "2px solid #8c1007",
                    borderRadius: "0px",
                  }}
                  formatter={(value, name) => [
                    name === "revenue"
                      ? `₹${Number(value).toLocaleString()}`
                      : value,
                    name === "revenue" ? "Revenue" : "Sales",
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: "12px", color: "#3e0703" }} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8c1007"
                  fill="#8c1007"
                  fillOpacity={0.3}
                  name="Revenue (₹)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#3e0703"
                  fill="#3e0703"
                  fillOpacity={0.3}
                  name="Sales (Units)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Second Row - 2 Charts */}
      <div className="mb-4 grid grid-cols-1 gap-3 lg:mb-6 lg:grid-cols-2 lg:gap-4">
        {/* Sankey Chart for Price Analysis */}
        <Card
          className="!bg-white shadow-sm"
          style={{ borderRadius: "0px", border: "2px solid #8c1007" }}
        >
          <div className="p-2 sm:p-3">
            <h3
              className="mb-3 text-base font-semibold sm:text-lg"
              style={{ color: "#3e0703" }}
            >
              Business Flow Analysis
            </h3>
            <div className="mb-4 text-xs text-[#8c1007]">
              Visualizing the flow from designs to revenue generation
            </div>
            <SankeyChart data={sankeyData} />
          </div>
        </Card>

        {/* Top Selling Designs */}
        <Card
          className="!bg-white shadow-sm"
          style={{ borderRadius: "0px", border: "2px solid #8c1007" }}
        >
          <div className="p-2 sm:p-3">
            <h3
              className="mb-3 text-base font-semibold sm:text-lg"
              style={{ color: "#3e0703" }}
            >
              Top Selling Designs Performance
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={allSoldDesignsData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#8c1007"
                  opacity={0.2}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#3e0703", fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  tick={{ fill: "#3e0703", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff0c4",
                    border: "2px solid #8c1007",
                    borderRadius: "0px",
                  }}
                  formatter={(value, name) => [
                    name === "revenue"
                      ? `₹${Number(value).toLocaleString()}`
                      : name === "price"
                        ? `₹${value}`
                        : value,
                    name === "revenue"
                      ? "Revenue"
                      : name === "price"
                        ? "Price"
                        : "Times Sold",
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: "12px", color: "#3e0703" }} />
                <Bar
                  dataKey="sales"
                  fill="#8c1007"
                  name="Times Sold"
                  barSize={20}
                />
                <Bar
                  dataKey="revenue"
                  fill="#3e0703"
                  name="Revenue (₹)"
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Analytics Section - Performance & Financial Summary */}
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
                    Sales Conversion Rate
                  </p>
                  <p className="truncate text-xs" style={{ color: "#8c1007" }}>
                    Unique designs sold vs total portfolio
                  </p>
                </div>
                <span
                  className="ml-2 text-sm font-bold sm:text-base"
                  style={{ color: "#3e0703" }}
                >
                  {conversionRate}%
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
                    Average Price per Design
                  </p>
                  <p className="truncate text-xs" style={{ color: "#8c1007" }}>
                    Average listing price
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
                    Total Revenue (All Time)
                  </p>
                  <p className="truncate text-xs" style={{ color: "#8c1007" }}>
                    Lifetime income from sales
                  </p>
                </div>
                <span
                  className="ml-2 text-sm font-bold sm:text-base"
                  style={{ color: "#3e0703" }}
                >
                  ₹{totalRevenue.toLocaleString()}
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
                    Monthly Revenue
                  </p>
                  <p className="truncate text-xs" style={{ color: "#8c1007" }}>
                    Total income this month
                  </p>
                </div>
                <span
                  className="ml-2 text-sm font-bold sm:text-base"
                  style={{ color: "#3e0703" }}
                >
                  ₹{totalMonthlyRevenue.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p
                    className="truncate text-sm font-medium"
                    style={{ color: "#3e0703" }}
                  >
                    Revenue per Sale
                  </p>
                  <p className="truncate text-xs" style={{ color: "#8c1007" }}>
                    Average revenue per transaction
                  </p>
                </div>
                <span
                  className="ml-2 text-sm font-bold sm:text-base"
                  style={{ color: "#8c1007" }}
                >
                  ₹
                  {totalSalesFromDesigns > 0
                    ? Math.round(totalRevenue / totalSalesFromDesigns)
                    : 0}
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