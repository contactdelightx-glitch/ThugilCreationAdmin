import { useState } from "react";
import {
  Settings as SettingsIcon,
  Shield,
  Bell,
  Palette,
  Database,
  Network,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Download,
  Key,
  Server,
  FileText,
  BarChart3,
  Cpu,
  CheckCircle,
  AlertTriangle,
  Clock,
  Zap,
} from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    // General Settings
    siteName: "Thugil Creation Admin",
    siteDescription: "Enterprise Management Platform",
    timezone: "Asia/Kolkata",
    language: "en",
    dateFormat: "DD/MM/YYYY",

    // Security Settings
    twoFactorAuth: true,
    sessionTimeout: 30,
    passwordPolicy: "strong",
    loginAttempts: 5,
    ipWhitelist: [],

    // Notification Settings
    emailNotifications: true,
    pushNotifications: false,
    smsAlerts: true,
    securityAlerts: true,
    performanceReports: true,

    // Appearance Settings
    theme: "light",
    primaryColor: "#8c1007",
    sidebarStyle: "expanded",
    density: "comfortable",

    // System Settings
    maintenanceMode: false,
    backupFrequency: "daily",
    logRetention: 30,
    apiRateLimit: 1000,

    // Integration Settings
    webhooksEnabled: true,
    apiAccess: true,
    thirdPartyIntegrations: false,
  });

  const [showSecretKey, setShowSecretKey] = useState(false);
  const [saved, setSaved] = useState(true);

  const tabs = [
    {
      id: "general",
      name: "General",
      icon: <SettingsIcon className="h-4 w-4" />,
      description: "Basic platform configuration"
    },
    { 
      id: "security", 
      name: "Security", 
      icon: <Shield className="h-4 w-4" />,
      description: "Access controls and protection"
    },
    {
      id: "notifications",
      name: "Notifications",
      icon: <Bell className="h-4 w-4" />,
      description: "Alert and communication settings"
    },
    {
      id: "appearance",
      name: "Appearance",
      icon: <Palette className="h-4 w-4" />,
      description: "UI and theme customization"
    },
    { 
      id: "system", 
      name: "System", 
      icon: <Server className="h-4 w-4" />,
      description: "Infrastructure and performance"
    },
    {
      id: "integrations",
      name: "Integrations",
      icon: <Network className="h-4 w-4" />,
      description: "Third-party services and API"
    },
  ];

  const systemStatus = {
    overall: "operational",
    components: [
      {
        name: "Database",
        status: "operational",
        icon: <Database className="h-4 w-4" />,
      },
      {
        name: "API Server",
        status: "operational",
        icon: <Cpu className="h-4 w-4" />,
      },
      {
        name: "File Storage",
        status: "operational",
        icon: <FileText className="h-4 w-4" />,
      },
      {
        name: "Cache Layer",
        status: "degraded",
        icon: <BarChart3 className="h-4 w-4" />,
      },
    ],
  };

  const securityMetrics = [
    { name: "Last Login", value: "2 hours ago", status: "normal", icon: <Clock className="h-4 w-4" /> },
    { name: "Failed Attempts", value: "0", status: "normal", icon: <AlertTriangle className="h-4 w-4" /> },
    { name: "Active Sessions", value: "3", status: "normal", icon: <CheckCircle className="h-4 w-4" /> },
    { name: "Security Score", value: "98%", status: "excellent", icon: <Shield className="h-4 w-4" /> },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      operational: "bg-emerald-100 text-emerald-800 border-emerald-200",
      degraded: "bg-amber-100 text-amber-800 border-amber-200",
      maintenance: "bg-blue-100 text-blue-800 border-blue-200",
      normal: "bg-gray-100 text-gray-800 border-gray-200",
      excellent: "bg-emerald-100 text-emerald-800 border-emerald-200",
      warning: "bg-amber-100 text-amber-800 border-amber-200",
    };

    const icons = {
      operational: <CheckCircle className="h-3 w-3" />,
      degraded: <AlertTriangle className="h-3 w-3" />,
      maintenance: <Clock className="h-3 w-3" />,
      normal: <CheckCircle className="h-3 w-3" />,
      excellent: <Zap className="h-3 w-3" />,
      warning: <AlertTriangle className="h-3 w-3" />,
    };

    return (
      <span
        className={`inline-flex items-center gap-1 border px-2 py-1 text-xs font-medium ${styles[status as keyof typeof styles]}`}
        style={{ borderRadius: "0px" }}
      >
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleSaveSettings = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    console.log("Saving settings:", settings);
  };

  const handleResetSettings = () => {
    console.log("Resetting settings");
  };

  const handleExportSettings = () => {
    console.log("Exporting settings");
  };

  const ToggleSwitch = ({ enabled, onChange, label, description }: { enabled: boolean; onChange: (enabled: boolean) => void; label: string; description?: string }) => (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1 min-w-0">
        <label className="text-sm font-medium text-gray-900 block">{label}</label>
        {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 ${
          enabled ? 'bg-[var(--color-primary)]' : 'bg-gray-200'
        }`}
        style={{ borderRadius: "0px" }}
      >
        <span
          className={`inline-block h-4 w-4 transform bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
          style={{ borderRadius: "0px" }}
        />
      </button>
    </div>
  );

  const SettingSection = ({ title, description, children, className = "" }: { title: string; description: string; children: React.ReactNode; className?: string }) => (
    <div className={`border border-gray-200 bg-white p-4 sm:p-6 ${className}`} style={{ borderRadius: "0px" }}>
      <div className="mb-4 sm:mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div
        className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6 sm:py-5"
        style={{ borderRadius: "0px" }}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <div
              className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center bg-[var(--color-primary)] text-white"
              style={{ borderRadius: "0px" }}
            >
              <SettingsIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl truncate">
                System Settings
              </h1>
              <p className="text-sm text-gray-600 mt-1 truncate">
                Configure your Thugil Creation Admin platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {!saved && (
              <span className="text-sm text-amber-600 font-medium">Unsaved changes</span>
            )}
            {saved && (
              <span className="text-sm text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                Settings saved
              </span>
            )}
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${
                  systemStatus.overall === "operational"
                    ? "bg-emerald-500"
                    : "bg-amber-500"
                }`}
              />
              <span className="text-sm font-medium text-gray-900 hidden sm:block">
                System Status
              </span>
              {getStatusBadge(systemStatus.overall)}
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4 lg:p-6">
        {/* System Status Bar */}
        <div
          className="mb-4 sm:mb-6 border border-gray-200 bg-white p-3 sm:p-4"
          style={{ borderRadius: "0px" }}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
                Component Status
              </span>
              <div className="flex flex-wrap gap-2 sm:gap-4">
                {systemStatus.components.map((component, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {component.icon}
                    <span className="text-sm text-gray-600 whitespace-nowrap">
                      {component.name}
                    </span>
                    {getStatusBadge(component.status)}
                  </div>
                ))}
              </div>
            </div>
            <span className="text-sm text-gray-500 whitespace-nowrap sm:pl-4">
              Updated just now
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-4">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="space-y-3 sm:space-y-4">
              {/* Navigation Tabs */}
              <div
                className="border border-gray-200 bg-white p-3 sm:p-4"
                style={{ borderRadius: "0px" }}
              >
                <h3 className="mb-3 font-semibold text-gray-900 text-sm sm:text-base">
                  Configuration
                </h3>
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex w-full items-start gap-3 p-2 sm:p-3 text-left transition-colors ${
                        activeTab === tab.id
                          ? "border-l-4 border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                      style={{ borderRadius: "0px" }}
                    >
                      <div className="flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center mt-0.5 flex-shrink-0">
                        {tab.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm sm:text-base">{tab.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5 hidden sm:block">
                          {tab.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Quick Actions */}
              <div
                className="border border-gray-200 bg-white p-3 sm:p-4"
                style={{ borderRadius: "0px" }}
              >
                <h3 className="mb-3 font-semibold text-gray-900 text-sm sm:text-base">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={handleSaveSettings}
                    disabled={saved}
                    className={`flex w-full items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
                      saved 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]'
                    }`}
                    style={{ borderRadius: "0px" }}
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </button>
                  <button
                    onClick={handleResetSettings}
                    className="flex w-full items-center justify-center gap-2 border border-gray-300 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    style={{ borderRadius: "0px" }}
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset to Defaults
                  </button>
                  <button
                    onClick={handleExportSettings}
                    className="flex w-full items-center justify-center gap-2 border border-gray-300 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    style={{ borderRadius: "0px" }}
                  >
                    <Download className="h-4 w-4" />
                    Export Configuration
                  </button>
                </div>
              </div>

              {/* Security Metrics */}
              <div
                className="border border-gray-200 bg-white p-3 sm:p-4"
                style={{ borderRadius: "0px" }}
              >
                <h3 className="mb-3 font-semibold text-gray-900 text-sm sm:text-base">
                  Security Overview
                </h3>
                <div className="space-y-3">
                  {securityMetrics.map((metric, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {metric.icon}
                        <span className="text-sm text-gray-600 truncate">
                          {metric.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 pl-2">
                        <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
                          {metric.value}
                        </span>
                        {getStatusBadge(metric.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* General Settings */}
            {activeTab === "general" && (
              <div className="space-y-4 sm:space-y-6">
                <SettingSection 
                  title="General Settings" 
                  description="Configure basic platform settings and preferences"
                >
                  <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-900">
                        Site Name
                      </label>
                      <input
                        type="text"
                        value={settings.siteName}
                        onChange={(e) =>
                          setSettings({ ...settings, siteName: e.target.value })
                        }
                        className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary)]"
                        style={{ borderRadius: "0px" }}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-900">
                        Timezone
                      </label>
                      <select
                        value={settings.timezone}
                        onChange={(e) =>
                          setSettings({ ...settings, timezone: e.target.value })
                        }
                        className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary)]"
                        style={{ borderRadius: "0px" }}
                      >
                        <option value="Asia/Kolkata">
                          IST (India Standard Time)
                        </option>
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">
                          EST (Eastern Time)
                        </option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-900">
                        Language
                      </label>
                      <select
                        value={settings.language}
                        onChange={(e) =>
                          setSettings({ ...settings, language: e.target.value })
                        }
                        className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary)]"
                        style={{ borderRadius: "0px" }}
                      >
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="ta">Tamil</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-900">
                        Date Format
                      </label>
                      <select
                        value={settings.dateFormat}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            dateFormat: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary)]"
                        style={{ borderRadius: "0px" }}
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>
                </SettingSection>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <div className="space-y-4 sm:space-y-6">
                <SettingSection 
                  title="Security Settings" 
                  description="Configure security protocols and access controls"
                >
                  <div className="space-y-4 sm:space-y-6">
                    <ToggleSwitch
                      enabled={settings.twoFactorAuth}
                      onChange={(enabled) =>
                        setSettings({
                          ...settings,
                          twoFactorAuth: enabled,
                        })
                      }
                      label="Two-Factor Authentication"
                      description="Add an extra layer of security to your account"
                    />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-4 border-t border-gray-200">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-900">
                          Session Timeout (minutes)
                        </label>
                        <input
                          type="number"
                          value={settings.sessionTimeout}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              sessionTimeout: parseInt(e.target.value),
                            })
                          }
                          className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary)]"
                          style={{ borderRadius: "0px" }}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-900">
                          Password Policy
                        </label>
                        <select
                          value={settings.passwordPolicy}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              passwordPolicy: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary)]"
                          style={{ borderRadius: "0px" }}
                        >
                          <option value="basic">Basic</option>
                          <option value="strong">Strong</option>
                          <option value="enterprise">Enterprise</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
                        API Access Keys
                      </h4>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Secret Key
                          </label>
                          <div className="flex">
                            <input
                              type={showSecretKey ? "text" : "password"}
                              value="sk_live_xxxxxxxxxxxxxxxxxxxxxxxx"
                              readOnly
                              className="flex-1 border border-r-0 border-gray-300 px-3 py-2 text-sm min-w-0"
                              style={{ borderRadius: "0px" }}
                            />
                            <button
                              onClick={() => setShowSecretKey(!showSecretKey)}
                              className="border border-l-0 border-gray-300 bg-gray-50 px-3 py-2 hover:bg-gray-100 transition-colors flex-shrink-0"
                              style={{ borderRadius: "0px" }}
                            >
                              {showSecretKey ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        <button
                          className="bg-[var(--color-primary)] px-4 py-2 text-white transition-colors hover:bg-[var(--color-primary-dark)] flex items-center gap-2 justify-center sm:justify-start flex-shrink-0"
                          style={{ borderRadius: "0px" }}
                        >
                          <Key className="h-4 w-4" />
                          <span className="hidden sm:block">Regenerate</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </SettingSection>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === "notifications" && (
              <div className="space-y-4 sm:space-y-6">
                <SettingSection 
                  title="Notification Settings" 
                  description="Configure how and when you receive alerts and updates"
                >
                  <div className="space-y-4">
                    {[
                      {
                        key: "emailNotifications",
                        label: "Email Notifications",
                        description: "Receive important updates via email",
                      },
                      {
                        key: "pushNotifications",
                        label: "Push Notifications",
                        description: "Get real-time alerts in your browser",
                      },
                      {
                        key: "smsAlerts",
                        label: "SMS Alerts",
                        description: "Critical alerts via SMS",
                      },
                      {
                        key: "securityAlerts",
                        label: "Security Alerts",
                        description: "Immediate security notifications",
                      },
                      {
                        key: "performanceReports",
                        label: "Performance Reports",
                        description: "Weekly system performance reports",
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="border border-gray-200 p-3 sm:p-4"
                        style={{ borderRadius: "0px" }}
                      >
                        <ToggleSwitch
                          enabled={settings[item.key as keyof typeof settings] as boolean}
                          onChange={(enabled) =>
                            setSettings({
                              ...settings,
                              [item.key]: enabled,
                            })
                          }
                          label={item.label}
                          description={item.description}
                        />
                      </div>
                    ))}
                  </div>
                </SettingSection>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === "appearance" && (
              <div className="space-y-4 sm:space-y-6">
                <SettingSection 
                  title="Appearance Settings" 
                  description="Customize the look and feel of your admin panel"
                >
                  <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-900">
                        Theme
                      </label>
                      <select
                        value={settings.theme}
                        onChange={(e) =>
                          setSettings({ ...settings, theme: e.target.value })
                        }
                        className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary)]"
                        style={{ borderRadius: "0px" }}
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-900">
                        Sidebar Style
                      </label>
                      <select
                        value={settings.sidebarStyle}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            sidebarStyle: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary)]"
                        style={{ borderRadius: "0px" }}
                      >
                        <option value="expanded">Expanded</option>
                        <option value="collapsed">Collapsed</option>
                        <option value="floating">Floating</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-900">
                        Density
                      </label>
                      <select
                        value={settings.density}
                        onChange={(e) =>
                          setSettings({ ...settings, density: e.target.value })
                        }
                        className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary)]"
                        style={{ borderRadius: "0px" }}
                      >
                        <option value="comfortable">Comfortable</option>
                        <option value="compact">Compact</option>
                        <option value="spacious">Spacious</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-900">
                        Primary Color
                      </label>
                      <div className="flex items-center gap-3">
                        <div
                          className="h-8 w-8 border border-gray-300 flex-shrink-0"
                          style={{
                            backgroundColor: settings.primaryColor,
                            borderRadius: "0px",
                          }}
                        />
                        <input
                          type="text"
                          value={settings.primaryColor}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              primaryColor: e.target.value,
                            })
                          }
                          className="flex-1 border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary)] min-w-0"
                          style={{ borderRadius: "0px" }}
                        />
                      </div>
                    </div>
                  </div>
                </SettingSection>
              </div>
            )}

            {/* System Settings */}
            {activeTab === "system" && (
              <div className="space-y-4 sm:space-y-6">
                <SettingSection 
                  title="System Settings" 
                  description="Configure system behavior and maintenance settings"
                >
                  <div className="space-y-4 sm:space-y-6">
                    <div className="border border-gray-200 p-3 sm:p-4" style={{ borderRadius: "0px" }}>
                      <ToggleSwitch
                        enabled={settings.maintenanceMode}
                        onChange={(enabled) =>
                          setSettings({
                            ...settings,
                            maintenanceMode: enabled,
                          })
                        }
                        label="Maintenance Mode"
                        description="Put the system in maintenance mode"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-4 border-t border-gray-200">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-900">
                          Backup Frequency
                        </label>
                        <select
                          value={settings.backupFrequency}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              backupFrequency: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary)]"
                          style={{ borderRadius: "0px" }}
                        >
                          <option value="hourly">Hourly</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-900">
                          Log Retention (days)
                        </label>
                        <input
                          type="number"
                          value={settings.logRetention}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              logRetention: parseInt(e.target.value),
                            })
                          }
                          className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary)]"
                          style={{ borderRadius: "0px" }}
                        />
                      </div>
                    </div>
                  </div>
                </SettingSection>
              </div>
            )}

            {/* Integration Settings */}
            {activeTab === "integrations" && (
              <div className="space-y-4 sm:space-y-6">
                <SettingSection 
                  title="Integration Settings" 
                  description="Configure third-party integrations and API access"
                >
                  <div className="space-y-4">
                    {[
                      {
                        key: "webhooksEnabled",
                        label: "Webhooks",
                        description:
                          "Enable webhook notifications for system events",
                      },
                      {
                        key: "apiAccess",
                        label: "API Access",
                        description:
                          "Allow external applications to access your data",
                      },
                      {
                        key: "thirdPartyIntegrations",
                        label: "Third-Party Integrations",
                        description:
                          "Enable integration with external services",
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="border border-gray-200 p-3 sm:p-4"
                        style={{ borderRadius: "0px" }}
                      >
                        <ToggleSwitch
                          enabled={settings[item.key as keyof typeof settings] as boolean}
                          onChange={(enabled) =>
                            setSettings({
                              ...settings,
                              [item.key]: enabled,
                            })
                          }
                          label={item.label}
                          description={item.description}
                        />
                      </div>
                    ))}
                  </div>
                </SettingSection>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}