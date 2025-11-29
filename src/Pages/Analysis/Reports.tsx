import { useState, useEffect, useCallback } from "react";
import { Select, Card } from "flowbite-react";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Cell,
} from "recharts";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Filter,
  Activity,
  ArrowUpRight,
  Image,
  Calendar,
} from "lucide-react";
import { getFullReport } from "../../Api";

interface ReportData {
  totalDesigns: number;
  totalOrders: number;
  totalRevenue: number;
  thisMonthRevenue: number;
  totalCustomers: number;
  customerEmails: string[];
  userEmails: string[];
  avgPrice: number;
  freeImagesCount: number;
  uploadedImagesCount: number;
  todaySales: number;
  weeklySales: number;
  monthlySales: number;
  soldDesigns: Design[];
  topSoldDesigns: Design[];
  monthlyBreakdown: MonthlyData[];
}

interface Design {
  id: string;
  name: string;
  final_price: number;
  timesSold: number;
  image_url: string;
  created_at: string;
  quantity: number;
  customer_id?: number;
}

interface MonthlyData {
  month: string;
  designsSold: number;
  totalRevenue: number;
}

// Skeleton Card Component
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
      <div className="mt-3 h-64 w-full animate-pulse rounded-none bg-gray-200"></div>
    </div>
  </Card>
);

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ReportData | null>(null);
  const [selectedUserEmail, setSelectedUserEmail] = useState("");

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getFullReport(
        undefined,
        undefined,
        selectedUserEmail || undefined,
      );
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedUserEmail]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const MetricCard = ({
    title,
    value,
    icon: Icon,
    trend,
    trendValue,
    subtitle,
  }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    trend?: "up" | "down";
    trendValue?: string;
    subtitle?: string;
  }) => (
    <Card
      className="!bg-white shadow-sm"
      style={{ borderRadius: "0px", border: "2px solid #8c1007" }}
    >
      <div className="flex items-center p-2 sm:p-3">
        <div
          className="mr-3 p-2"
          style={{ backgroundColor: "#fff0c4", borderRadius: "0px" }}
        >
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: "#8c1007" }} />
        </div>
        <div className="min-w-0 flex-1">
          <p
            className="text-xs font-medium tracking-wide uppercase sm:text-sm"
            style={{ color: "#8c1007" }}
          >
            {title}
          </p>
          <p
            className="truncate text-lg font-bold sm:text-xl"
            style={{ color: "#3e0703" }}
          >
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs sm:text-sm" style={{ color: "#8c1007" }}>
              {subtitle}
            </p>
          )}
          {trend && trendValue && (
            <div
              className="mt-1 flex items-center gap-1"
              style={{ color: "#8c1007" }}
            >
              <ArrowUpRight className="h-3 w-3" />
              <span className="text-xs font-semibold">{trendValue}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen p-2 sm:p-3 lg:p-4">
        {/* Header Skeleton */}
        <div className="mb-4 sm:mb-6">
          <div className="h-5 w-1/3 animate-pulse rounded-none bg-gray-200"></div>
          <div className="mt-1 h-3 w-2/3 animate-pulse rounded-none bg-gray-200"></div>
        </div>

        {/* Filter Skeleton */}
        <div className="mb-4 sm:mb-6">
          <Card
            className="!bg-white shadow-sm"
            style={{ borderRadius: "0px", border: "2px solid #8c1007" }}
          >
            <div className="p-2 sm:p-3">
              <div className="mb-2 h-3 w-1/4 animate-pulse rounded-none bg-gray-200"></div>
              <div className="h-10 w-full animate-pulse rounded-none bg-gray-200"></div>
            </div>
          </Card>
        </div>

        {/* Metrics Grid Skeleton */}
        <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:mb-6 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={`metric-${index}`} />
          ))}
        </div>

        {/* KPI Cards Skeleton */}
        <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:mb-6 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonCard key={`kpi-${index}`} />
          ))}
        </div>

        {/* Charts Section Skeleton */}
        <div className="mb-4 grid grid-cols-1 gap-2 sm:gap-3 lg:mb-6 lg:grid-cols-2 lg:gap-4">
          <SkeletonCard key="chart-1" />
          <SkeletonCard key="chart-2" />
        </div>

        {/* Gantt Chart Skeleton */}
        <div className="mb-4 sm:mb-6">
          <SkeletonCard key="gantt-chart" />
        </div>

        {/* Bottom Section Skeleton */}
        <div className="mb-4 grid grid-cols-1 gap-2 sm:gap-3 lg:mb-6 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonCard key={`bottom-${index}`} />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center p-2 sm:p-3 lg:p-4">
        <div className="text-center">
          <Package className="mx-auto mb-3 h-12 w-12" style={{ color: "#8c1007" }} />
          <p className="text-sm font-semibold" style={{ color: "#3e0703" }}>
            No data available
          </p>
          <p className="mt-1 text-xs" style={{ color: "#8c1007" }}>
            Please try again later
          </p>
        </div>
      </div>
    );
  }

  const performanceData =
    data.topSoldDesigns?.map((design) => ({
      name: design.name.substring(0, 12),
      sales: design.timesSold,
      revenue: design.final_price * design.timesSold,
    })) || [];

  const salesData = [
    { period: "Today", sales: data.todaySales || 0 },
    { period: "Week", sales: data.weeklySales || 0 },
    { period: "Month", sales: data.monthlySales || 0 },
  ];

  const ganttData = data.soldDesigns
    ?.map((design) => {
      const createdDate = new Date(design.created_at);
      return {
        name: design.name.substring(0, 12),
        date: createdDate.getTime(),
        revenue: design.final_price * design.timesSold,
        dateLabel: createdDate.toLocaleDateString(),
      };
    })
    .sort((a, b) => a.date - b.date)
    .slice(0, 10);

  return (
    <div className="min-h-screen p-2 sm:p-3 lg:p-4">
      <div className="mx-auto max-w-[1800px]">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-lg font-bold sm:text-xl"
                style={{ color: "#3e0703" }}
              >
                Report Dashboard
              </h1>
              <p className="mt-1 text-xs sm:text-sm" style={{ color: "#8c1007" }}>
                Real-time analytics and performance metrics
              </p>
            </div>
            <div
              className="flex items-center gap-2 px-2 py-1"
              style={{ backgroundColor: "#fff0c4", borderRadius: "0px" }}
            >
              <div
                className="h-2 w-2 animate-pulse"
                style={{ backgroundColor: "#8c1007" }}
              ></div>
              <span
                className="text-xs font-semibold sm:text-sm"
                style={{ color: "#8c1007" }}
              >
                LIVE DATA
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4 sm:mb-6">
          <Card
            className="!bg-white shadow-sm"
            style={{ borderRadius: "0px", border: "2px solid #8c1007" }}
          >
            <div className="p-2 sm:p-3">
              <label
                className="mb-2 flex items-center text-xs font-bold tracking-wide uppercase sm:text-sm"
                style={{ color: "#3e0703" }}
              >
                <Filter
                  className="mr-2 h-3 w-3 sm:h-4 sm:w-4"
                  style={{ color: "#8c1007" }}
                />
                Filter by Tenant
              </label>
              <Select
                value={selectedUserEmail}
                onChange={(e) => setSelectedUserEmail(e.target.value)}
                className="w-full font-sans"
                sizing="md"
                style={{ borderRadius: "0px" }}
              >
                <option value="">All Tenants</option>
                {data.userEmails?.map((email) => (
                  <option key={email} value={email}>
                    {email}
                  </option>
                ))}
              </Select>
            </div>
          </Card>
        </div>

        {/* Metrics Grid */}
        <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:mb-6 lg:grid-cols-6">
          <MetricCard
            title="Total Designs"
            value={data.totalDesigns || 0}
            icon={Package}
            trend="up"
            trendValue="+12%"
            subtitle="Active catalog"
          />
          <MetricCard
            title="Total Orders"
            value={data.totalOrders || 0}
            icon={ShoppingCart}
            trend="up"
            trendValue="+8%"
            subtitle="Completed"
          />
          <MetricCard
            title="Total Revenue"
            value={`₹${(data.totalRevenue || 0).toLocaleString("en-IN")}`}
            icon={DollarSign}
            trend="up"
            trendValue="+15%"
            subtitle="Gross sales"
          />
          <MetricCard
            title="This Month Revenue"
            value={`₹${(data.thisMonthRevenue || 0).toLocaleString("en-IN")}`}
            icon={Calendar}
            trend="up"
            trendValue="+18%"
            subtitle="Current month"
          />
          <MetricCard
            title="Customers"
            value={data.totalCustomers || 0}
            icon={Users}
            trend="up"
            trendValue="+5%"
            subtitle="Active users"
          />
          <MetricCard
            title="Monthly Sales"
            value={data.monthlySales || 0}
            icon={Activity}
            trend="up"
            trendValue="+18%"
            subtitle="This month"
          />
        </div>

        {/* KPI Cards */}
        <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:mb-6 lg:grid-cols-3">
          <MetricCard
            title="Average Price"
            value={`₹${(data.avgPrice || 0).toLocaleString("en-IN")}`}
            icon={DollarSign}
            trend="up"
            trendValue="+10%"
            subtitle="Per design"
          />
          <MetricCard
            title="Free Images"
            value={data.freeImagesCount || 0}
            icon={Image}
            trend="up"
            trendValue="+2%"
            subtitle="Available"
          />
          <MetricCard
            title="Uploaded Images"
            value={data.uploadedImagesCount || 0}
            icon={Image}
            trend="up"
            trendValue="+5%"
            subtitle="Total uploaded"
          />
        </div>

        {/* Charts Section */}
        <div className="mb-4 grid grid-cols-1 gap-2 sm:gap-3 lg:mb-6 lg:grid-cols-2 lg:gap-4">
          {/* Revenue Trend */}
          <Card
            className="!bg-white shadow-sm"
            style={{ borderRadius: "0px", border: "2px solid #8c1007" }}
          >
            <div className="p-2 sm:p-3">
              <h3
                className="mb-3 text-base font-semibold sm:text-lg"
                style={{ color: "#3e0703" }}
              >
                Revenue Trend Analysis
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={data.monthlyBreakdown || []}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8c1007" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8c1007" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#8c1007"
                    opacity={0.2}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#3e0703", fontSize: 11 }}
                  />
                  <YAxis tick={{ fill: "#3e0703", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff0c4",
                      border: "2px solid #8c1007",
                      borderRadius: "0px",
                    }}
                    formatter={(value) => [`₹${value}`, "Revenue"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="totalRevenue"
                    stroke="#8c1007"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Performance Analysis */}
          <Card
            className="!bg-white shadow-sm"
            style={{ borderRadius: "0px", border: "2px solid #8c1007" }}
          >
            <div className="p-2 sm:p-3">
              <h3
                className="mb-3 text-base font-semibold sm:text-lg"
                style={{ color: "#3e0703" }}
              >
                Top Products Performance
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={performanceData.slice(0, 6)}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#8c1007"
                    opacity={0.2}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#3e0703", fontSize: 10 }}
                    angle={-30}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fill: "#3e0703", fontSize: 11 }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: "#3e0703", fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff0c4",
                      border: "2px solid #8c1007",
                      borderRadius: "0px",
                    }}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="sales"
                    fill="#8c1007"
                    barSize={24}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3e0703"
                    strokeWidth={2}
                    dot={{ fill: "#3e0703", r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Gantt Chart */}
        <div className="mb-4 sm:mb-6">
          <Card
            className="!bg-white shadow-sm"
            style={{ borderRadius: "0px", border: "2px solid #8c1007" }}
          >
            <div className="p-2 sm:p-3">
              <h3
                className="mb-3 text-base font-semibold sm:text-lg"
                style={{ color: "#3e0703" }}
              >
                Sales Timeline (Recent Sales)
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={ganttData}
                  layout="vertical"
                  barSize={18}
                  margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#8c1007"
                    opacity={0.2}
                  />
                  <XAxis
                    type="number"
                    tick={{ fill: "#3e0703", fontSize: 11 }}
                    label={{
                      value: "Revenue (₹)",
                      position: "insideBottom",
                      offset: -5,
                      fill: "#3e0703",
                    }}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fill: "#3e0703", fontSize: 11 }}
                    width={90}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff0c4",
                      border: "2px solid #8c1007",
                      borderRadius: "0px",
                    }}
                    formatter={(value: number, name: string) => {
                      if (name === "revenue") {
                        return [`₹${value.toLocaleString("en-IN")}`, "Revenue"];
                      }
                      return [value, name];
                    }}
                    labelFormatter={(label) => `Product: ${label}`}
                  />
                  <Bar dataKey="revenue" fill="#8c1007" minPointSize={4}>
                    {ganttData?.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill="#8c1007" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="mb-4 grid grid-cols-1 gap-2 sm:gap-3 lg:mb-6 lg:grid-cols-3">
          {/* Sales Overview */}
          <Card
            className="!bg-white shadow-sm"
            style={{ borderRadius: "0px", border: "2px solid #8c1007" }}
          >
            <div className="p-2 sm:p-3">
              <h3
                className="mb-3 text-base font-semibold sm:text-lg"
                style={{ color: "#3e0703" }}
              >
                Sales Overview
              </h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={salesData} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#8c1007"
                    opacity={0.2}
                  />
                  <XAxis
                    type="number"
                    tick={{ fill: "#3e0703", fontSize: 11 }}
                  />
                  <YAxis
                    dataKey="period"
                    type="category"
                    tick={{ fill: "#3e0703", fontSize: 11 }}
                    width={70}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff0c4",
                      border: "2px solid #8c1007",
                      borderRadius: "0px",
                    }}
                  />
                  <Bar dataKey="sales" fill="#8c1007" barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Monthly Breakdown */}
          <Card
            className="!bg-white shadow-sm"
            style={{ borderRadius: "0px", border: "2px solid #8c1007" }}
          >
            <div className="p-2 sm:p-3">
              <h3
                className="mb-3 text-base font-semibold sm:text-lg"
                style={{ color: "#3e0703" }}
              >
                Monthly Breakdown
              </h3>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={data.monthlyBreakdown?.slice(-6) || []}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#8c1007"
                    opacity={0.2}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#3e0703", fontSize: 10 }}
                  />
                  <YAxis tick={{ fill: "#3e0703", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff0c4",
                      border: "2px solid #8c1007",
                      borderRadius: "0px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="designsSold"
                    stroke="#8c1007"
                    strokeWidth={2}
                    dot={{ fill: "#8c1007", r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Top Products */}
          <Card
            className="!bg-white shadow-sm"
            style={{ borderRadius: "0px", border: "2px solid #8c1007" }}
          >
            <div className="p-2 sm:p-3">
              <h3
                className="mb-3 text-base font-semibold sm:text-lg"
                style={{ color: "#3e0703" }}
              >
                Top Selling Products
              </h3>
              <div className="space-y-2">
                {data.topSoldDesigns?.slice(0, 5).map((design, index) => (
                  <div
                    key={design.id}
                    className="flex items-center justify-between bg-gray-50 p-2 transition-all hover:bg-gray-100"
                    style={{ borderRadius: "0px" }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center text-xs font-bold"
                        style={{
                          backgroundColor: "#8c1007",
                          color: "white",
                          borderRadius: "0px",
                        }}
                      >
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className="truncate text-xs font-semibold sm:text-sm"
                          style={{ color: "#3e0703" }}
                        >
                          {design.name}
                        </p>
                        <p
                          className="text-xs sm:text-sm"
                          style={{ color: "#8c1007" }}
                        >
                          {design.timesSold} units
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className="text-xs font-bold sm:text-sm"
                        style={{ color: "#3e0703" }}
                      >
                        ₹{design.final_price.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reports;