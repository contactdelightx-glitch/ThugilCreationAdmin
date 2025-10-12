import { useState } from "react";
import {
  Phone,
  Mail,
  MessageCircle,
  Users,
  Settings,
  FileText,
  Shield,
  Bell,
  Zap,
  Clock,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  Video,
  Download,
  Search,
  BarChart3,
  Cloud,
  Database,
  Server,
} from "lucide-react";

export default function HelpSupport() {
  const [activeSection, setActiveSection] = useState("about");
  const [searchQuery, setSearchQuery] = useState("");

  const sections = {
    about: {
      title: "Enterprise Admin Portal",
      icon: <Server className="h-4 w-4" />,
      content:
        "Thugil Creation Enterprise Admin Suite is a robust, scalable management platform designed for modern business operations. Leverage advanced tools to streamline workflows, enhance security, and drive operational excellence across your organization.",
    },
    help: {
      title: "Knowledge Base",
      icon: <BookOpen className="h-4 w-4" />,
      content:
        "Access comprehensive documentation, tutorials, and best practices to maximize your admin capabilities and optimize platform performance.",
    },
    support: {
      title: "Enterprise Support",
      icon: <Shield className="h-4 w-4" />,
      content:
        "24/7 dedicated support channels with enterprise-grade response times and specialized technical assistance for your organization.",
    },
  };

  const systemStatus = {
    overall: "operational",
    components: [
      {
        name: "Admin Dashboard",
        status: "operational",
        icon: <BarChart3 className="h-4 w-4" />,
      },
      {
        name: "User Management",
        status: "operational",
        icon: <Users className="h-4 w-4" />,
      },
      {
        name: "Content API",
        status: "degraded",
        icon: <Database className="h-4 w-4" />,
      },
      {
        name: "File Storage",
        status: "operational",
        icon: <Cloud className="h-4 w-4" />,
      },
      {
        name: "Security Layer",
        status: "operational",
        icon: <Shield className="h-4 w-4" />,
      },
    ],
  };

  const adminFeatures = [
    {
      icon: <Users className="h-5 w-5" />,
      title: "User Lifecycle Management",
      description:
        "End-to-end user administration with advanced permission controls and audit trails",
      badges: ["RBAC", "Audit Logs", "Bulk Actions"],
      status: "active",
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: "Content Orchestration",
      description:
        "Advanced content management with version control and workflow automation",
      badges: ["Versioning", "Workflows", "SEO Tools"],
      status: "active",
    },
    {
      icon: <Settings className="h-5 w-5" />,
      title: "Design System Manager",
      description:
        "Centralized design controls with real-time preview and A/B testing capabilities",
      badges: ["A/B Testing", "Real-time", "Templates"],
      status: "active",
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Security Command Center",
      description:
        "Comprehensive security monitoring, threat detection, and compliance management",
      badges: ["SOC2", "GDPR", "2FA"],
      status: "active",
    },
    {
      icon: <Bell className="h-5 w-5" />,
      title: "Smart Notifications",
      description:
        "AI-powered notification system with smart routing and escalation protocols",
      badges: ["AI Routing", "Escalation", "Analytics"],
      status: "beta",
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Performance Analytics",
      description:
        "Real-time performance metrics and predictive analytics for system optimization",
      badges: ["Real-time", "Predictive", "KPI"],
      status: "active",
    },
  ];

  const supportTiers = [
    {
      level: "Enterprise",
      icon: <Shield className="h-5 w-5" />,
      response: "15 min",
      availability: "24/7/365",
      channels: ["Dedicated Manager", "Phone", "Email", "Chat", "Screen Share"],
      features: ["Priority Routing", "SLA Guarantee", "Advanced Diagnostics"],
    },
    {
      level: "Business",
      icon: <Clock className="h-5 w-5" />,
      response: "2 hours",
      availability: "24/7",
      channels: ["Phone", "Email", "Chat"],
      features: ["Standard SLA", "Phone Support", "Email Support"],
    },
  ];

  const quickResources = [
    {
      title: "Admin Handbook",
      description: "Complete administrator guide",
      icon: <BookOpen className="h-4 w-4" />,
      type: "PDF",
      size: "2.4 MB",
    },
    {
      title: "Video Tutorials",
      description: "Step-by-step video guides",
      icon: <Video className="h-4 w-4" />,
      type: "Video",
      size: "15 min",
    },
    {
      title: "API Documentation",
      description: "REST API references",
      icon: <Database className="h-4 w-4" />,
      type: "Web",
      size: "Latest",
    },
    {
      title: "Security Protocols",
      description: "Security best practices",
      icon: <Shield className="h-4 w-4" />,
      type: "PDF",
      size: "1.8 MB",
    },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      operational: "bg-emerald-100 text-emerald-800 border-emerald-200",
      degraded: "bg-amber-100 text-amber-800 border-amber-200",
      maintenance: "bg-blue-100 text-blue-800 border-blue-200",
      beta: "bg-purple-100 text-purple-800 border-purple-200",
      active: "bg-emerald-100 text-emerald-800 border-emerald-200",
    };

    const icons = {
      operational: <CheckCircle className="h-3 w-3" />,
      degraded: <AlertTriangle className="h-3 w-3" />,
      maintenance: <Clock className="h-3 w-3" />,
      beta: <Zap className="h-3 w-3" />,
      active: <CheckCircle className="h-3 w-3" />,
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
              <Shield className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                Enterprise Support
              </h1>
              <p className="text-sm text-gray-600 mt-1 truncate">
                Thugil Creation Admin Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 lg:w-80">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <input
                type="text"
                placeholder="Search knowledge base..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 bg-white px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary)]"
                style={{ borderRadius: "0px" }}
              />
            </div>
            {getStatusBadge(systemStatus.overall)}
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
              {/* Navigation Cards */}
              <div
                className="border border-gray-200 bg-white p-3 sm:p-4"
                style={{ borderRadius: "0px" }}
              >
                <h3 className="mb-3 font-semibold text-sm sm:text-base text-gray-900">
                  Support Portal
                </h3>
                <nav className="space-y-1">
                  {Object.entries(sections).map(([key, section]) => (
                    <button
                      key={key}
                      onClick={() => setActiveSection(key)}
                      className={`flex w-full items-start gap-3 p-2 sm:p-3 text-left transition-colors ${
                        activeSection === key
                          ? "border-l-4 border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                      style={{ borderRadius: "0px" }}
                    >
                      <div className="flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center mt-0.5 flex-shrink-0">
                        {section.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm sm:text-base">{section.title}</div>
                        <div className="text-xs text-gray-500 mt-0.5 hidden sm:block">
                          {section.content.substring(0, 50) + "..."}
                        </div>
                      </div>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Quick Resources */}
              <div
                className="border border-gray-200 bg-white p-3 sm:p-4"
                style={{ borderRadius: "0px" }}
              >
                <h3 className="mb-3 font-semibold text-sm sm:text-base text-gray-900">
                  Quick Resources
                </h3>
                <div className="space-y-2">
                  {quickResources.map((resource, index) => (
                    <a
                      key={index}
                      href="#"
                      className="group flex items-center gap-3 border border-gray-200 p-3 transition-colors hover:border-[var(--color-primary)]"
                      style={{ borderRadius: "0px" }}
                    >
                      <div className="flex h-8 w-8 items-center justify-center bg-gray-50 text-gray-600 group-hover:bg-[var(--color-primary-light)] group-hover:text-[var(--color-primary-dark)]">
                        {resource.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-gray-900 truncate">
                          {resource.title}
                        </div>
                        <div className="text-xs text-gray-600 mt-0.5 truncate">
                          {resource.description}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 whitespace-nowrap">
                        {resource.type} • {resource.size}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* About Section */}
            {activeSection === "about" && (
              <div className="space-y-4 sm:space-y-6">
                <div
                  className="border border-gray-200 bg-white p-4 sm:p-6"
                  style={{ borderRadius: "0px" }}
                >
                  <div className="mb-4 sm:mb-6 flex items-center gap-3">
                    {sections.about.icon}
                    <h2 className="text-lg font-semibold text-gray-900">
                      {sections.about.title}
                    </h2>
                  </div>
                  <p className="mb-4 sm:mb-6 text-sm text-gray-600 leading-relaxed">
                    {sections.about.content}
                  </p>

                  <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {adminFeatures.map((feature, index) => (
                      <div
                        key={index}
                        className="group border border-gray-200 p-4 transition-colors hover:border-[var(--color-primary)]"
                        style={{ borderRadius: "0px" }}
                      >
                        <div className="mb-3 flex items-start justify-between">
                          <div className="flex h-8 w-8 items-center justify-center bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] transition-colors group-hover:bg-[var(--color-primary)] group-hover:text-white">
                            {feature.icon}
                          </div>
                          {getStatusBadge(feature.status)}
                        </div>
                        <h3 className="mb-2 text-sm font-medium text-gray-900">
                          {feature.title}
                        </h3>
                        <p className="mb-3 text-sm text-gray-600">
                          {feature.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {feature.badges.map((badge, badgeIndex) => (
                            <span
                              key={badgeIndex}
                              className="bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700"
                              style={{ borderRadius: "0px" }}
                            >
                              {badge}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Help Section */}
            {activeSection === "help" && (
              <div className="space-y-4 sm:space-y-6">
                <div
                  className="border border-gray-200 bg-white p-4 sm:p-6"
                  style={{ borderRadius: "0px" }}
                >
                  <div className="mb-4 sm:mb-6 flex items-center gap-3">
                    {sections.help.icon}
                    <h2 className="text-lg font-semibold text-gray-900">
                      {sections.help.title}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-gray-900">
                        Getting Started
                      </h3>
                      {quickResources.map((resource, index) => (
                        <a
                          key={index}
                          href="#"
                          className="group flex items-center gap-3 border border-gray-200 p-3 transition-colors hover:border-[var(--color-primary)]"
                          style={{ borderRadius: "0px" }}
                        >
                          <div className="flex h-8 w-8 items-center justify-center bg-gray-50 text-gray-600 group-hover:bg-[var(--color-primary-light)] group-hover:text-[var(--color-primary-dark)]">
                            {resource.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {resource.title}
                            </div>
                            <div className="text-xs text-gray-600 mt-0.5 truncate">
                              {resource.description}
                            </div>
                          </div>
                          <Download className="h-4 w-4 text-gray-400 group-hover:text-[var(--color-primary)] flex-shrink-0" />
                        </a>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-gray-900">
                        Video Guides
                      </h3>
                      <div className="space-y-2">
                        {[
                          "User Management",
                          "Security Setup",
                          "API Integration",
                          "Performance Tuning",
                        ].map((title, index) => (
                          <a
                            key={index}
                            href="#"
                            className="group flex items-center gap-3 border border-gray-200 p-3 transition-colors hover:border-[var(--color-primary)]"
                            style={{ borderRadius: "0px" }}
                          >
                            <div className="flex h-8 w-8 items-center justify-center bg-red-50 text-red-600">
                              <Video className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {title}
                              </div>
                              <div className="text-xs text-gray-600 mt-0.5">
                                Watch tutorial →
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Support Section */}
            {activeSection === "support" && (
              <div className="space-y-4 sm:space-y-6">
                <div
                  className="border border-gray-200 bg-white p-4 sm:p-6"
                  style={{ borderRadius: "0px" }}
                >
                  <div className="mb-4 sm:mb-6 flex items-center gap-3">
                    {sections.support.icon}
                    <h2 className="text-lg font-semibold text-gray-900">
                      {sections.support.title}
                    </h2>
                  </div>

                  {/* Support Tiers */}
                  <div className="mb-6 sm:mb-8 grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
                    {supportTiers.map((tier, index) => (
                      <div
                        key={index}
                        className="relative border border-gray-200 p-4 sm:p-6"
                        style={{ borderRadius: "0px" }}
                      >
                        {tier.level === "Enterprise" && (
                          <div className="absolute -top-2 left-6">
                            <span
                              className="bg-[var(--color-primary)] px-2 py-1 text-xs font-medium text-white"
                              style={{ borderRadius: "0px" }}
                            >
                              RECOMMENDED
                            </span>
                          </div>
                        )}
                        <div className="mb-4 flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]">
                            {tier.icon}
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">
                              {tier.level} Tier
                            </h3>
                            <p className="text-xs text-gray-600 mt-0.5">
                              Response: {tier.response}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h4 className="mb-2 text-sm font-medium text-gray-900">
                              Channels
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {tier.channels.map((channel, channelIndex) => (
                                <span
                                  key={channelIndex}
                                  className="bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700"
                                  style={{ borderRadius: "0px" }}
                                >
                                  {channel}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="mb-2 text-sm font-medium text-gray-900">
                              Features
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {tier.features.map((feature, featureIndex) => (
                                <span
                                  key={featureIndex}
                                  className="bg-[var(--color-primary-light)] px-2 py-1 text-xs font-medium text-[var(--color-primary-dark)]"
                                  style={{ borderRadius: "0px" }}
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Contact Cards */}
                  <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
                    <a
                      href="mailto:thugilcreation@gmail.com"
                      className="group border border-gray-200 p-4 text-center transition-colors hover:border-[var(--color-primary)]"
                      style={{ borderRadius: "0px" }}
                    >
                      <Mail className="mx-auto mb-3 h-6 w-6 text-gray-400 group-hover:text-[var(--color-primary)]" />
                      <h3 className="mb-1 text-sm font-medium text-gray-900">
                        Email Support
                      </h3>
                      <p className="mb-2 text-xs text-gray-600">
                        Enterprise priority
                      </p>
                      <div className="text-sm font-medium text-[var(--color-primary)] truncate">
                        thugilcreation@gmail.com
                      </div>
                    </a>

                    <a
                      href="tel:+918838008499"
                      className="group border border-gray-200 p-4 text-center transition-colors hover:border-[var(--color-primary)]"
                      style={{ borderRadius: "0px" }}
                    >
                      <Phone className="mx-auto mb-3 h-6 w-6 text-gray-400 group-hover:text-[var(--color-primary)]" />
                      <h3 className="mb-1 text-sm font-medium text-gray-900">
                        Phone Support
                      </h3>
                      <p className="mb-2 text-xs text-gray-600">
                        24/7 dedicated line
                      </p>
                      <div className="text-sm font-medium text-[var(--color-primary)]">
                        +91 8838008499
                      </div>
                    </a>

                    <a
                      href="https://wa.me/918838008499"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group border border-gray-200 p-4 text-center transition-colors hover:border-[var(--color-primary)]"
                      style={{ borderRadius: "0px" }}
                    >
                      <MessageCircle className="mx-auto mb-3 h-6 w-6 text-gray-400 group-hover:text-[var(--color-primary)]" />
                      <h3 className="mb-1 text-sm font-medium text-gray-900">
                        WhatsApp Business
                      </h3>
                      <p className="mb-2 text-xs text-gray-600">
                        Instant messaging
                      </p>
                      <div className="text-sm font-medium text-[var(--color-primary)]">
                        +91 8838008499
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}