/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { Select, Card, Badge, Button, Spinner, Alert } from "flowbite-react";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Filter,
  Calendar,
  Download,
  ArrowUpRight,
  TrendingUp,
  Image as ImageIcon,
} from "lucide-react";
import { getFullReport } from "../../Api";

interface OrderData {
  dashboard: {
    totalDesigns: number;
    totalOrders: number;
    totalRevenue: number;
  };
  userPurchaseStats: {
    email: string;
    totalPurchases: number;
    avgPurchase: number;
    highestPurchase: number;
    lowestPurchase: number;
    purchasesByDate: {
      [date: string]: Array<{
        id: string;
        name: string;
        final_price: number;
        image_url: string;
        created_at: string;
        quantity: number;
        customer_id: number;
      }>;
    };
  };
}

interface FullReportResponse {
  totalDesigns: number;
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  customerEmails: string[];
}

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
    </div>
  </Card>
);

const OrdersDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [customerEmails, setCustomerEmails] = useState<string[]>([]);
  const [selectedCustomerEmail, setSelectedCustomerEmail] = useState(""); // Changed from selectedUserEmail
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  const fetchCustomerEmails = useCallback(async () => {
    try {
      const response = await getFullReport(); // No parameters needed to fetch customer emails
      if (response.ok) {
        const result: FullReportResponse = await response.json();
        setCustomerEmails(result.customerEmails || []);
      } else {
        throw new Error("Failed to fetch customer emails");
      }
    } catch (err) {
      setError("Error fetching customer emails");
      console.error("Error fetching customer emails:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrderData = useCallback(async (email: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await getFullReport(email); // Use customer_email parameter
      if (response.ok) {
        const result: OrderData = await response.json();
        setOrderData(result);
        const dates = Object.keys(result.userPurchaseStats.purchasesByDate);
        setAvailableDates(dates);
      } else {
        throw new Error("Failed to fetch order data");
      }
    } catch (err) {
      setError("Error fetching order data");
      console.error("Error fetching order data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomerEmails();
  }, [fetchCustomerEmails]);

  useEffect(() => {
    if (selectedCustomerEmail) {
      fetchOrderData(selectedCustomerEmail); // Changed from selectedUserEmail
    } else {
      setOrderData(null);
      setAvailableDates([]);
      setLoading(false);
    }
  }, [selectedCustomerEmail, fetchOrderData]); // Changed from selectedUserEmail

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
      className="group cursor-pointer !bg-white shadow-sm"
      style={{ borderRadius: "0px", border: "2px solid #8c1007" }}
    >
      <div className="flex items-center p-2 sm:p-3">
        <div
          className="mr-3 p-2"
          style={{ backgroundColor: "#fff0c4", borderRadius: "0px" }}
        >
          <Icon
            className="h-5 w-5 sm:h-6 sm:w-6"
            style={{ color: "#8c1007" }}
          />
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
            <p className="truncate text-xs" style={{ color: "#8c1007" }}>
              {subtitle}
            </p>
          )}
          {trend && trendValue && (
            <div
              className="mt-1 flex items-center gap-1 text-xs"
              style={{ color: "#8c1007" }}
            >
              <ArrowUpRight className="h-3 w-3" />
              <span>{trendValue}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateForDisplay = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    const target = e.target as HTMLImageElement;
    target.src = "https://via.placeholder.com/80x80?text=No+Image";
  };

  const downloadImage = async (imageUrl: string, productName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${productName.replace(/[^a-zA-Z0-9]/g, "_")}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading image:", error);
      setError("Failed to download image");
    }
  };

  const exportToCSV = () => {
    if (!orderData) return;

    const headers = [
      "Date",
      "Product ID",
      "Product Name",
      "Price",
      "Quantity",
      "Total",
      "Customer ID",
    ];
    const csvData = [];

    csvData.push(headers.join(","));

    Object.entries(orderData.userPurchaseStats.purchasesByDate).forEach(
      ([date, products]) => {
        products.forEach((product) => {
          const row = [
            date,
            product.id,
            `"${product.name}"`,
            product.final_price,
            product.quantity,
            product.final_price * product.quantity,
            product.customer_id,
          ];
          csvData.push(row.join(","));
        });
      },
    );

    const csvContent = csvData.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${selectedCustomerEmail}-${new Date().toISOString().split("T")[0]}.csv`; // Changed from selectedUserEmail
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getFilteredPurchases = () => {
    if (!orderData) return {};

    if (!selectedDate) {
      return orderData.userPurchaseStats.purchasesByDate;
    }

    const filtered: { [key: string]: any[] } = {};
    filtered[selectedDate] =
      orderData.userPurchaseStats.purchasesByDate[selectedDate] || [];
    return filtered;
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const filteredPurchases = getFilteredPurchases();

  if (loading && !orderData) {
    return (
      <div className="min-h-screen p-2 sm:p-3">
        <div className="mx-auto max-w-[1800px]">
          <div className="mb-4 sm:mb-6">
            <div className="mb-3 h-6 w-1/3 animate-pulse rounded-none bg-gray-200"></div>
            <div className="h-4 w-2/3 animate-pulse rounded-none bg-gray-200"></div>
          </div>

          <div className="mb-4 sm:mb-6">
            <Card
              className="!bg-white shadow-sm"
              style={{ borderRadius: "0px", border: "2px solid #8c1007" }}
            >
              <div className="p-2 sm:p-3">
                <div className="mb-3 h-3 w-1/4 animate-pulse rounded-none bg-gray-200"></div>
                <div className="h-10 w-full animate-pulse rounded-none bg-gray-200"></div>
              </div>
            </Card>
          </div>

          <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:mb-6 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={`metric-${index}`} />
            ))}
          </div>

          <Card
            className="!bg-white shadow-sm"
            style={{ borderRadius: "0px", border: "2px solid #8c1007" }}
          >
            <div className="p-2 sm:p-3">
              <div className="mb-4 h-5 w-1/4 animate-pulse rounded-none bg-gray-200"></div>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="h-12 w-12 animate-pulse rounded-none bg-gray-200"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 animate-pulse rounded-none bg-gray-200"></div>
                      <div className="h-3 w-1/2 animate-pulse rounded-none bg-gray-200"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2 sm:p-3">
      <div className="mx-auto max-w-[1800px]">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <h1
                className="text-lg font-bold sm:text-xl lg:text-2xl"
                style={{ color: "#3e0703" }}
              >
                Orders Dashboard
              </h1>
              <p
                className="mt-1 text-xs sm:text-sm"
                style={{ color: "#8c1007" }}
              >
                Comprehensive order tracking and customer analytics
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {orderData && (
                <Button
                  onClick={exportToCSV}
                  size="sm"
                  style={{
                    backgroundColor: "#8c1007",
                    borderRadius: "0px",
                    border: "2px solid #8c1007",
                  }}
                  className="flex items-center gap-2 transition-opacity hover:opacity-90"
                >
                  <Download className="h-4 w-4" />
                  <span className="text-xs">Export CSV</span>
                </Button>
              )}
              <div
                className="flex items-center gap-2 px-3 py-1"
                style={{ backgroundColor: "#fff0c4", borderRadius: "0px" }}
              >
                <div
                  className="h-2 w-2 animate-pulse rounded-full"
                  style={{ backgroundColor: "#8c1007" }}
                ></div>
                <span
                  className="text-xs font-medium tracking-wider"
                  style={{ color: "#8c1007" }}
                >
                  LIVE DATA
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-4 sm:mb-6">
          <Card
            className="!bg-white shadow-sm"
            style={{ borderRadius: "0px", border: "2px solid #8c1007" }}
          >
            <div className="p-2 sm:p-3">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label
                    className="mb-2 flex items-center text-xs font-medium tracking-wider uppercase"
                    style={{ color: "#3e0703" }}
                  >
                    <Filter
                      className="mr-2 h-4 w-4"
                      style={{ color: "#8c1007" }}
                    />
                    Select Customer Email
                  </label>
                  <Select
                    value={selectedCustomerEmail} // Changed from selectedUserEmail
                    onChange={(e) => setSelectedCustomerEmail(e.target.value)} // Changed from setSelectedUserEmail
                    className="w-full font-sans"
                    sizing="md"
                    style={{ borderRadius: "0px", border: "2px solid #8c1007" }}
                  >
                    <option value="">Choose a customer email</option>
                    {customerEmails.map((email) => (
                      <option key={email} value={email}>
                        {email}
                      </option>
                    ))}
                  </Select>
                </div>

                {orderData && availableDates.length > 0 && (
                  <div>
                    <label
                      className="mb-2 flex items-center text-xs font-medium tracking-wider uppercase"
                      style={{ color: "#3e0703" }}
                    >
                      <Calendar
                        className="mr-2 h-4 w-4"
                        style={{ color: "#8c1007" }}
                      />
                      Filter by Date
                    </label>
                    <Select
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full font-sans"
                      sizing="md"
                      style={{
                        borderRadius: "0px",
                        border: "2px solid #8c1007",
                      }}
                    >
                      <option value="">All Dates</option>
                      {availableDates.map((date) => (
                        <option key={date} value={date}>
                          {formatDateForDisplay(date)}
                        </option>
                      ))}
                    </Select>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {error && (
          <Alert
            color="failure"
            style={{
              borderRadius: "0px",
              marginBottom: "1rem",
              border: "2px solid #8c1007",
            }}
          >
            {error}
          </Alert>
        )}

        {orderData && !loading && (
          <>
            {/* Dashboard Metrics */}
            <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:mb-6 lg:grid-cols-4">
              <MetricCard
                title="Total Designs"
                value={orderData.dashboard.totalDesigns}
                icon={Package}
                trend="up"
                trendValue="+12%"
                subtitle="Customer's designs"
              />
              <MetricCard
                title="Total Orders"
                value={orderData.dashboard.totalOrders}
                icon={ShoppingCart}
                trend="up"
                trendValue="+8%"
                subtitle="Completed orders"
              />
              <MetricCard
                title="Total Revenue"
                value={formatCurrency(orderData.dashboard.totalRevenue)}
                icon={DollarSign}
                trend="up"
                trendValue="+15%"
                subtitle="Gross revenue"
              />
              <MetricCard
                title="Total Purchases"
                value={orderData.userPurchaseStats.totalPurchases}
                icon={TrendingUp}
                trend="up"
                trendValue="+10%"
                subtitle="Customer purchases"
              />
            </div>

            {/* Purchase Statistics */}
            <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:mb-6 lg:grid-cols-4">
              <MetricCard
                title="Average Purchase"
                value={formatCurrency(orderData.userPurchaseStats.avgPurchase)}
                icon={DollarSign}
                subtitle="Per transaction"
              />
              <MetricCard
                title="Highest Purchase"
                value={formatCurrency(
                  orderData.userPurchaseStats.highestPurchase,
                )}
                icon={TrendingUp}
                subtitle="Maximum single order"
              />
              <MetricCard
                title="Lowest Purchase"
                value={formatCurrency(
                  orderData.userPurchaseStats.lowestPurchase,
                )}
                icon={TrendingUp}
                subtitle="Minimum single order"
              />
              <MetricCard
                title="Purchase Count"
                value={orderData.userPurchaseStats.totalPurchases}
                icon={ShoppingCart}
                subtitle="Total transactions"
              />
            </div>

            {/* Orders Table */}
            <Card
              className="mb-4 !bg-white shadow-sm"
              style={{ borderRadius: "0px", border: "2px solid #8c1007" }}
            >
              <div className="p-2 sm:p-3">
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h3
                    className="text-base font-semibold sm:text-lg"
                    style={{ color: "#3e0703" }}
                  >
                    Orders by Date
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      style={{
                        backgroundColor: "#8c1007",
                        borderRadius: "0px",
                        color: "white",
                      }}
                      className="text-xs"
                    >
                      {Object.keys(filteredPurchases).length}{" "}
                      {Object.keys(filteredPurchases).length === 1
                        ? "Day"
                        : "Days"}
                    </Badge>
                    {selectedDate && (
                      <Badge
                        style={{
                          backgroundColor: "#fff0c4",
                          borderRadius: "0px",
                          color: "#8c1007",
                          border: "1px solid #8c1007",
                        }}
                        className="text-xs"
                      >
                        {formatDateForDisplay(selectedDate)}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  {Object.entries(filteredPurchases)
                    .sort(
                      ([dateA], [dateB]) =>
                        new Date(dateB).getTime() - new Date(dateA).getTime(),
                    )
                    .map(([date, products]) => (
                      <div
                        key={date}
                        className="border-l-2 pb-6 pl-4 last:pb-0"
                        style={{ borderColor: "#8c1007" }}
                      >
                        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-2">
                            <Calendar
                              className="h-4 w-4 flex-shrink-0"
                              style={{ color: "#8c1007" }}
                            />
                            <h4
                              className="truncate text-base font-semibold"
                              style={{ color: "#3e0703" }}
                              title={date}
                            >
                              {date}
                            </h4>
                          </div>
                          <Badge
                            style={{
                              backgroundColor: "#fff0c4",
                              borderRadius: "0px",
                              color: "#8c1007",
                              border: "1px solid #8c1007",
                            }}
                            className="w-fit text-xs"
                          >
                            {products.length}{" "}
                            {products.length === 1 ? "item" : "items"}
                          </Badge>
                        </div>

                        <div className="-mx-2 overflow-x-auto">
                          <table className="w-full min-w-[800px] divide-y divide-gray-200">
                            <thead style={{ backgroundColor: "#fff0c4" }}>
                              <tr>
                                <th
                                  className="px-2 py-2 text-left text-xs font-medium tracking-wider uppercase"
                                  style={{ color: "#3e0703" }}
                                >
                                  Image
                                </th>
                                <th
                                  className="px-2 py-2 text-left text-xs font-medium tracking-wider uppercase"
                                  style={{ color: "#3e0703" }}
                                >
                                  Details
                                </th>
                                <th
                                  className="px-2 py-2 text-left text-xs font-medium tracking-wider uppercase"
                                  style={{ color: "#3e0703" }}
                                >
                                  Price
                                </th>
                                <th
                                  className="px-2 py-2 text-left text-xs font-medium tracking-wider uppercase"
                                  style={{ color: "#3e0703" }}
                                >
                                  Qty
                                </th>
                                <th
                                  className="px-2 py-2 text-left text-xs font-medium tracking-wider uppercase"
                                  style={{ color: "#3e0703" }}
                                >
                                  Total
                                </th>
                                <th
                                  className="px-2 py-2 text-left text-xs font-medium tracking-wider uppercase"
                                  style={{ color: "#3e0703" }}
                                >
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                              {products.map((product) => (
                                <tr
                                  key={product.id}
                                  className="transition-colors hover:bg-gray-50"
                                >
                                  <td className="px-2 py-2 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div
                                        className="h-12 w-12 flex-shrink-0 overflow-hidden border bg-gray-100"
                                        style={{ borderColor: "#8c1007" }}
                                      >
                                        <img
                                          src={product.image_url}
                                          alt={product.name}
                                          className="h-full w-full object-cover"
                                          onError={handleImageError}
                                        />
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-2 py-2">
                                    <div className="max-w-[200px] min-w-0">
                                      <div
                                        className="mb-1 truncate text-sm font-medium text-gray-900"
                                        title={product.name}
                                      >
                                        {truncateText(product.name, 30)}
                                      </div>
                                      <div className="truncate font-mono text-xs text-gray-500">
                                        ID: {truncateText(product.id, 15)}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        Customer: {product.customer_id}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-2 py-2 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                      {formatCurrency(product.final_price)}
                                    </div>
                                  </td>
                                  <td className="px-2 py-2 whitespace-nowrap">
                                    <span
                                      className="text-sm font-medium"
                                      style={{ color: "#3e0703" }}
                                    >
                                      {product.quantity}
                                    </span>
                                  </td>
                                  <td className="px-2 py-2 whitespace-nowrap">
                                    <div
                                      className="text-sm font-medium"
                                      style={{ color: "#3e0703" }}
                                    >
                                      {formatCurrency(
                                        product.final_price * product.quantity,
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-2 py-2 whitespace-nowrap">
                                    <div className="space-y-1">
                                      <Button
                                        size="xs"
                                        style={{
                                          backgroundColor: "#8c1007",
                                          borderRadius: "0px",
                                          border: "2px solid #8c1007",
                                        }}
                                        className="flex w-full items-center gap-1 sm:w-auto"
                                        onClick={() =>
                                          downloadImage(
                                            product.image_url,
                                            product.name,
                                          )
                                        }
                                      >
                                        <ImageIcon className="h-3 w-3" />
                                        <span className="text-xs">
                                          Download
                                        </span>
                                      </Button>
                                      <div className="text-xs text-gray-500">
                                        {formatDate(product.created_at)}
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Date Summary */}
                        <div
                          className="mt-4 flex items-center justify-between border-t pt-3"
                          style={{ borderColor: "#8c1007" }}
                        >
                          <span
                            className="text-sm font-medium"
                            style={{ color: "#3e0703" }}
                          >
                            Date Total:
                          </span>
                          <span
                            className="text-lg font-bold"
                            style={{ color: "#8c1007" }}
                          >
                            {formatCurrency(
                              products.reduce(
                                (sum, product) =>
                                  sum + product.final_price * product.quantity,
                                0,
                              ),
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>

                {Object.keys(filteredPurchases).length === 0 && (
                  <div className="py-12 text-center">
                    <Calendar
                      className="mx-auto mb-3 h-12 w-12 opacity-30"
                      style={{ color: "#8c1007" }}
                    />
                    <h3
                      className="mb-2 text-lg font-semibold"
                      style={{ color: "#3e0703" }}
                    >
                      No Orders Found
                    </h3>
                    <p className="text-sm" style={{ color: "#8c1007" }}>
                      {selectedDate
                        ? "No orders found for the selected date."
                        : "No orders available for this customer."}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </>
        )}

        {/* Skeleton Loader for No Customer Selected */}
        {!selectedCustomerEmail && !loading && (
          <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:mb-6 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={`no-customer-skeleton-${index}`} />
            ))}
          </div>
        )}

        {loading && orderData && (
          <div className="py-12 text-center">
            <Spinner size="xl" style={{ color: "#8c1007" }} />
            <p className="mt-3 text-sm" style={{ color: "#8c1007" }}>
              Updating data...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersDashboard;