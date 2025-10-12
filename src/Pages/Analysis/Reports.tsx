import { useState, useEffect } from "react";
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
} from "recharts";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Filter,
  Activity,
  ArrowUpRight,
  Download,
} from "lucide-react";
import { getFullReport } from "../../Api";

interface ReportData {
  totalDesigns: number;
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  customerEmails: string[];
  userEmails: string[];
  todaySales: number;
  weeklySales: number;
  monthlySales: number;
  soldDesigns: Design[];
  topSoldDesigns: Design[];
  monthlyBreakdown: MonthlyData[];
  customerPurchaseGallery: CustomerPurchase[];
}

interface Design {
  id: string;
  name: string;
  final_price: number;
  timesSold: number;
  image_url: string;
}

interface MonthlyData {
  month: string;
  designsSold: number;
  totalRevenue: number;
}

interface CustomerPurchase {
  customer_id: number;
  email: string;
  mobile_number: string;
  purchases: Purchase[];
}

interface Purchase {
  id: string;
  name: string;
  final_price: number;
  image_url: string;
  created_at: string;
}

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ReportData | null>(null);
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [selectedCustomerEmail, setSelectedCustomerEmail] = useState("");

  useEffect(() => {
    fetchReports();
  }, [selectedUserEmail, selectedCustomerEmail]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await getFullReport(
        selectedCustomerEmail || undefined,
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
  };

  const groupPurchasesByDate = (purchases: Purchase[]) => {
    const grouped: { [key: string]: Purchase[] } = {};
    purchases.forEach((purchase) => {
      const date = new Date(purchase.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(purchase);
    });
    return grouped;
  };

  const downloadGalleryData = () => {
    if (!data?.customerPurchaseGallery) return;

    const csvContent = [
      ["Customer Email", "Mobile", "Product Name", "Price", "Date"],
      ...data.customerPurchaseGallery.flatMap((customer) =>
        customer.purchases.map((purchase) => [
          customer.email,
          customer.mobile_number,
          purchase.name,
          purchase.final_price,
          new Date(purchase.created_at).toLocaleDateString(),
        ]),
      ),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `customer-purchases-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

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
    <div className="bg-white p-4 shadow-lg transition-all duration-300 hover:shadow-2xl">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center bg-red-50">
          <Icon className="h-5 w-5 text-red-900" />
        </div>
        {trend && trendValue && (
          <div className="flex items-center gap-1 bg-green-50 px-2 py-1">
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

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-[1800px]">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-1 font-sans text-3xl font-bold text-gray-900">
                Business Intelligence Dashboard
              </h1>
              <p className="font-sans text-sm text-gray-600">
                Real-time analytics and performance metrics
              </p>
            </div>
            <div className="flex items-center gap-2 bg-green-50 px-3 py-1">
              <div className="h-2 w-2 animate-pulse bg-green-600"></div>
              <span className="font-sans text-xs font-semibold text-green-900">
                LIVE DATA
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="bg-white p-4 shadow-md">
            <label className="mb-2 flex items-center font-sans text-xs font-bold tracking-wide text-gray-700 uppercase">
              <Filter className="mr-2 h-4 w-4" />
              Filter by Tenant
            </label>
            <Select
              value={selectedUserEmail}
              onChange={(e) => setSelectedUserEmail(e.target.value)}
              className="w-full font-sans"
              sizing="md"
            >
              <option value="">All Tenants</option>
              {data.userEmails?.map((email) => (
                <option key={email} value={email}>
                  {email}
                </option>
              ))}
            </Select>
          </div>

          <div className="bg-white p-4 shadow-md">
            <label className="mb-2 flex items-center font-sans text-xs font-bold tracking-wide text-gray-700 uppercase">
              <Users className="mr-2 h-4 w-4" />
              Filter by Customer
            </label>
            <Select
              value={selectedCustomerEmail}
              onChange={(e) => setSelectedCustomerEmail(e.target.value)}
              className="w-full font-sans"
              sizing="md"
            >
              <option value="">All Customers</option>
              {data.customerEmails?.map((email) => (
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

        {/* Charts Section */}
        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Revenue Trend */}
          <div className="bg-white p-4 shadow-md">
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
                  stroke="#6b7280"
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
          <div className="bg-white p-4 shadow-md">
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

        {/* Bottom Section */}
        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Sales Overview */}
          <div className="bg-white p-4 shadow-md">
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
          <div className="bg-white p-4 shadow-md">
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
          <div className="bg-white p-4 shadow-md">
            <h3 className="mb-4 font-sans text-base font-bold text-gray-900">
              Top Selling Products
            </h3>
            <div className="space-y-3">
              {data.topSoldDesigns?.slice(0, 5).map((design, index) => (
                <div
                  key={design.id}
                  className="flex items-center justify-between bg-gray-50 p-2 transition-all hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center bg-red-900 font-sans text-xs font-bold text-white">
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

        {/* Customer Purchase Gallery */}
        {selectedCustomerEmail && (
          <div className="bg-white p-4 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-sans text-base font-bold text-gray-900">
                Customer Purchase History
              </h3>
              <div className="flex items-center gap-3">
                <div className="bg-red-900 px-3 py-1 font-sans text-xs font-semibold text-white">
                  {selectedCustomerEmail}
                </div>
                <button
                  onClick={downloadGalleryData}
                  className="flex items-center gap-2 bg-gray-900 px-3 py-1 font-sans text-xs font-semibold text-white transition-all hover:bg-gray-800"
                >
                  <Download className="h-3 w-3" />
                  Download
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {data.customerPurchaseGallery
                ?.filter((customer) => customer.email === selectedCustomerEmail)
                .map((customer) => {
                  const groupedPurchases = groupPurchasesByDate(
                    customer.purchases,
                  );
                  return (
                    <div key={customer.customer_id}>
                      <div className="mb-3 flex items-center justify-between bg-gray-100 p-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-10 w-10 items-center justify-center bg-red-900 font-sans text-base font-bold text-white">
                            {customer.email?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-sans text-sm font-semibold text-gray-900">
                              {customer.email}
                            </h4>
                            <p className="font-sans text-xs text-gray-600">
                              {customer.mobile_number}
                            </p>
                          </div>
                        </div>
                        <span className="bg-gray-900 px-3 py-1 font-sans text-xs font-bold text-white">
                          {customer.purchases.length} Items
                        </span>
                      </div>

                      {Object.entries(groupedPurchases).map(
                        ([date, purchases]) => (
                          <div key={date} className="mb-4">
                            <div className="mb-2 bg-gray-50 px-3 py-2">
                              <h5 className="font-sans text-xs font-bold text-gray-700">
                                {date}
                              </h5>
                            </div>
                            <div className="grid grid-cols-4 gap-3 md:grid-cols-6 lg:grid-cols-10">
                              {purchases.map((purchase) => (
                                <div
                                  key={purchase.id}
                                  className="group cursor-pointer"
                                >
                                  <div className="relative aspect-square overflow-hidden bg-gray-200">
                                    <img
                                      src={purchase.image_url}
                                      alt={purchase.name || "Product"}
                                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                      onError={(e) => {
                                        e.currentTarget.src =
                                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23f3f4f6' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='sans-serif' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";
                                      }}
                                    />
                                  </div>
                                  <div className="mt-1">
                                    <p className="truncate font-sans text-xs font-semibold text-gray-900">
                                      {purchase.name || "Unnamed"}
                                    </p>
                                    <p className="font-sans text-xs font-bold text-red-900">
                                      ₹
                                      {purchase.final_price.toLocaleString(
                                        "en-IN",
                                      )}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
