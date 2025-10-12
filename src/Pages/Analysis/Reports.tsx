import { useState, useEffect, useCallback } from "react";
import { Select, Spinner } from "flowbite-react";
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
} from "lucide-react";
import { getFullReport } from "../../Api";

interface ReportData {
  totalDesigns: number;
  totalOrders: number;
  totalRevenue: number;
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
    <div
      className="bg-white p-4 shadow-lg transition-all duration-300 hover:shadow-2xl"
      style={{ borderRadius: "0px" }}
    >
      <div className="mb-3 flex items-center justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center bg-red-50"
          style={{ borderRadius: "0px" }}
        >
          <Icon className="h-5 w-5 text-red-900" />
        </div>
        {trend && trendValue && (
          <div
            className="flex items-center gap-1 bg-green-50 px-2 py-1"
            style={{ borderRadius: "0px" }}
          >
            <ArrowUpRight className="h-3 w-3 text-green-700" />
            <span className="text-xs font-semibold text-green-700">
              {trendValue}
            </span>
          </div>
        )}
      </div>
      <div>
        <p className="mb-1 font-sans text-xs font-semibold tracking-wide text-gray-500 uppercase">
          {title}
        </p>
        <h3 className="font-sans text-2xl font-bold text-gray-900">{value}</h3>
        {subtitle && (
          <p className="mt-1 font-sans text-xs text-gray-500">{subtitle}</p>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spinner size="xl" style={{ fill: "#991b1b" }} />
          <p className="mt-3 font-sans text-sm font-medium text-gray-600">
            Loading Analytics...
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Package className="mx-auto mb-3 h-14 w-14 text-gray-400" />
          <p className="font-sans text-base font-semibold text-gray-700">
            No data available
          </p>
          <p className="mt-1 font-sans text-sm text-gray-500">
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

  // Prepare data for Gantt chart - Fixed to show proper timeline
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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-[1800px]">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-1 font-sans text-3xl font-bold text-gray-900">
                Report Dashboard
              </h1>
              <p className="font-sans text-sm text-gray-600">
                Real-time analytics and performance metrics
              </p>
            </div>
            <div
              className="flex items-center gap-2 bg-green-50 px-3 py-1"
              style={{ borderRadius: "0px" }}
            >
              <div className="h-2 w-2 animate-pulse bg-green-600"></div>
              <span className="font-sans text-xs font-semibold text-green-900">
                LIVE DATA
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div
            className="bg-white p-4 shadow-md"
            style={{ borderRadius: "0px" }}
          >
            <label className="mb-2 flex items-center font-sans text-xs font-bold tracking-wide text-gray-700 uppercase">
              <Filter className="mr-2 h-4 w-4" />
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
        </div>

        {/* Metrics Grid */}
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
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
            title="Customers"
            value={data.totalCustomers || 0}
            icon={Users}
            trend="up"
            trendValue="+5%"
            subtitle="Active users"
          />
          <MetricCard
            title="Monthly"
            value={data.monthlySales || 0}
            icon={Activity}
            trend="up"
            trendValue="+18%"
            subtitle="This month"
          />
        </div>

        {/* KPI Cards */}
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
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
        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Revenue Trend */}
          <div
            className="bg-white p-4 shadow-md"
            style={{ borderRadius: "0px" }}
          >
            <h3 className="mb-4 font-sans text-base font-bold text-gray-900">
              Revenue Trend Analysis
            </h3>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={data.monthlyBreakdown || []}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#991b1b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#991b1b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  stroke="#6b7280"
                  style={{ fontSize: "12px", fontFamily: "sans-serif" }}
                />
                <YAxis
                  stroke="#555"
                  style={{ fontSize: "12px", fontFamily: "sans-serif" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    fontFamily: "sans-serif",
                  }}
                  formatter={(value) => [`₹${value}`, "Revenue"]}
                />
                <Area
                  type="monotone"
                  dataKey="totalRevenue"
                  stroke="#991b1b"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Performance Analysis */}
          <div
            className="bg-white p-4 shadow-md"
            style={{ borderRadius: "0px" }}
          >
            <h3 className="mb-4 font-sans text-base font-bold text-gray-900">
              Top Products Performance
            </h3>
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={performanceData.slice(0, 6)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  stroke="#6b7280"
                  angle={-30}
                  textAnchor="end"
                  height={80}
                  style={{ fontSize: "11px", fontFamily: "sans-serif" }}
                />
                <YAxis
                  yAxisId="left"
                  stroke="#6b7280"
                  style={{ fontSize: "12px", fontFamily: "sans-serif" }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#6b7280"
                  style={{ fontSize: "12px", fontFamily: "sans-serif" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    fontFamily: "sans-serif",
                  }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="sales"
                  fill="#991b1b"
                  barSize={28}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ fill: "#f59e0b", r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gantt Chart - Fixed */}
        <div className="mb-6">
          <div
            className="bg-white p-4 shadow-md"
            style={{ borderRadius: "0px" }}
          >
            <h3 className="mb-4 font-sans text-base font-bold text-gray-900">
              Sales Timeline (Recent Sales)
            </h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={ganttData}
                layout="vertical"
                barSize={20}
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  type="number"
                  stroke="#6b7280"
                  style={{ fontSize: "12px", fontFamily: "sans-serif" }}
                  label={{ value: 'Revenue (₹)', position: 'insideBottom', offset: -5 }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#6b7280"
                  width={100}
                  style={{ fontSize: "12px", fontFamily: "sans-serif" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    fontFamily: "sans-serif",
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === "revenue") {
                      return [`₹${value.toLocaleString("en-IN")}`, "Revenue"];
                    }
                    return [value, name];
                  }}
                  labelFormatter={(label) => `Product: ${label}`}
                />
                <Bar dataKey="revenue" fill="#991b1b" minPointSize={5}>
                  {ganttData?.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill="#991b1b" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Sales Overview */}
          <div
            className="bg-white p-4 shadow-md"
            style={{ borderRadius: "0px" }}
          >
            <h3 className="mb-4 font-sans text-base font-bold text-gray-900">
              Sales Overview
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={salesData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  type="number"
                  stroke="#6b7280"
                  style={{ fontSize: "12px", fontFamily: "sans-serif" }}
                />
                <YAxis
                  dataKey="period"
                  type="category"
                  stroke="#6b7280"
                  width={80}
                  style={{ fontSize: "12px", fontFamily: "sans-serif" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    fontFamily: "sans-serif",
                  }}
                />
                <Bar dataKey="sales" fill="#991b1b" barSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Breakdown */}
          <div
            className="bg-white p-4 shadow-md"
            style={{ borderRadius: "0px" }}
          >
            <h3 className="mb-4 font-sans text-base font-bold text-gray-900">
              Monthly Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={data.monthlyBreakdown?.slice(-6) || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  stroke="#6b7280"
                  style={{ fontSize: "11px", fontFamily: "sans-serif" }}
                />
                <YAxis
                  stroke="#6b7280"
                  style={{ fontSize: "12px", fontFamily: "sans-serif" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    fontFamily: "sans-serif",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="designsSold"
                  stroke="#991b1b"
                  strokeWidth={2}
                  dot={{ fill: "#991b1b", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top Products */}
          <div
            className="bg-white p-4 shadow-md"
            style={{ borderRadius: "0px" }}
          >
            <h3 className="mb-4 font-sans text-base font-bold text-gray-900">
              Top Selling Products
            </h3>
            <div className="space-y-3">
              {data.topSoldDesigns?.slice(0, 5).map((design, index) => (
                <div
                  key={design.id}
                  className="flex items-center justify-between bg-gray-50 p-2 transition-all hover:bg-gray-100"
                  style={{ borderRadius: "0px" }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-9 w-9 flex-shrink-0 items-center justify-center bg-red-900 font-sans text-xs font-bold text-white"
                      style={{ borderRadius: "0px" }}
                    >
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-sans text-xs font-semibold text-gray-900">
                        {design.name}
                      </p>
                      <p className="font-sans text-xs text-gray-500">
                        {design.timesSold} units
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-sans text-xs font-bold text-gray-900">
                      ₹{design.final_price.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;