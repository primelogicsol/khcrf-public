"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  FaUsers,
  FaFileContract,
  FaBuilding,
  FaBriefcase,
  FaHandHoldingHeart,
  FaCertificate,
  FaBook,
  FaMoneyBillWave,
  FaHandshake,
  FaUniversity,
  FaChartLine,
  FaExclamationTriangle,
} from "react-icons/fa";
import StatCard from "@/components/dashboard/StatCard";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import { adminApi } from "@/lib/api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { useAuth } from "@/context/AuthContext";
import { ROLES } from "@/config/dashboard";

type DashboardStats = {
  counts: {
    users: number;
    partners: number;
    grants: number;
    jobApplications: number;
    accreditations: number;
    evaluations: number;
    legislativeOffices: number;
    listings: number;
    contactSubmissions: number;
  };
  revenue: {
    total: number;
    donations: number;
    onlineDonations: number;
    offlineDonations: number;
    certifications: number;
    publications: number;
    memberships: number;
    other: number;
  };
  graphs: {
    revenue: Record<string, number>[];
    applications: Record<string, number>[];
  };
  monthOverMonth: string;
};

const EMPTY_DASHBOARD_STATS: DashboardStats = {
  counts: {
    users: 0,
    partners: 0,
    grants: 0,
    jobApplications: 0,
    accreditations: 0,
    evaluations: 0,
    legislativeOffices: 0,
    listings: 0,
    contactSubmissions: 0,
  },
  revenue: {
    total: 0,
    donations: 0,
    onlineDonations: 0,
    offlineDonations: 0,
    certifications: 0,
    publications: 0,
    memberships: 0,
    other: 0,
  },
  graphs: {
    revenue: [],
    applications: [],
  },
  monthOverMonth: '0%',
};

function normalizeDashboardStats(payload: Record<string, unknown>): DashboardStats {
  const raw = (payload as Record<string, Record<string, unknown>>);
  const source: Record<string, unknown> = (raw?.data?.data as Record<string, unknown>) ?? (raw?.data as Record<string, unknown>) ?? payload ?? {};
  
  return {
    counts: {
      users: Number(source?.counts?.users ?? 0),
      partners: Number(source?.counts?.partners ?? 0),
      grants: Number(source?.counts?.grants ?? 0),
      jobApplications: Number(source?.counts?.jobApplications ?? 0),
      accreditations: Number(source?.counts?.accreditations ?? 0),
      evaluations: Number(source?.counts?.evaluations ?? 0),
      legislativeOffices: Number(source?.counts?.legislativeOffices ?? 0),
      listings: Number(source?.counts?.listings ?? 0),
      contactSubmissions: Number(source?.counts?.contactSubmissions ?? 0),
    },
    revenue: {
      total: Number(source?.revenue?.total ?? 0),
      donations: Number(source?.revenue?.donations ?? 0),
      onlineDonations: Number(source?.revenue?.onlineDonations ?? 0),
      offlineDonations: Number(source?.revenue?.offlineDonations ?? 0),
      certifications: Number(source?.revenue?.certifications ?? 0),
      publications: Number(source?.revenue?.publications ?? 0),
      memberships: Number(source?.revenue?.memberships ?? 0),
      other: Number(source?.revenue?.other ?? 0),
    },
    graphs: {
      revenue: Array.isArray(source?.graphs?.revenue) ? source.graphs.revenue : [],
      applications: Array.isArray(source?.graphs?.applications) ? source.graphs.applications : [],
    },
    monthOverMonth: typeof source?.monthOverMonth === 'string' ? source.monthOverMonth : '0%',
  };
}

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>(EMPTY_DASHBOARD_STATS);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const handleExportReport = useCallback(async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const url = `${process.env.NEXT_PUBLIC_API_BASE || ''}/api/donation/management/export-csv`;
      const a = document.createElement('a');
      a.href = token ? `${url}?token=${encodeURIComponent(token)}` : url;
      a.download = `hcrf_donations_${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Export failed:', err);
    }
  }, []);

  const loadStats = useCallback(async () => {
    setLoading(true);
    setIsError(false);
    try {
      const data = await adminApi.getStats();
      setStats(normalizeDashboardStats(data));
    } catch (error: any) {
      console.error("[DASHBOARD RENDER ERROR]", {
        message: error?.message,
        stack: error?.stack,
      });
      setStats(EMPTY_DASHBOARD_STATS);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center p-8 bg-red-50 rounded-2xl border border-red-100 max-w-md">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="text-red-500" size={20} />
          </div>
          <h2 className="text-xl font-black text-red-700 mb-2">Dashboard Unavailable</h2>
          <p className="text-red-600 text-sm font-medium mb-4">
            Could not load dashboard data. The request may have been blocked before reaching the server. Check browser privacy extensions or network filtering, then try again.
          </p>
          <button onClick={() => loadStats()}
            className="px-5 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all text-sm">
            Retry
          </button>
        </div>
      </div>
    );
  }



  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const userRole = user?.role || ROLES.USER;
  const isAdmin = user?.isAdmin || userRole === ROLES.ADMIN;

  // Helper to check access
  const hasAccess = (allowedRoles: string[]) => {
    if (isAdmin) return true;
    return allowedRoles.includes(userRole);
  };

  // Define visibility for sections
  const showRevenueSection = hasAccess([
    ROLES.MODERATOR_DONATION,
    ROLES.MODERATOR_CERTIFICATIONS,
    ROLES.MODERATOR_EBOOKS,
    ROLES.COLLABORATOR_EBOOKS,
  ]); // Simplified: if they have access to ANY revenue related item, show section, but filter cards inside.

  const showTotalRevenue = isAdmin;
  const showDonations = hasAccess([ROLES.MODERATOR_DONATION]);
  const showCertificationsRevenue = hasAccess([ROLES.MODERATOR_CERTIFICATIONS]);
  const showPublicationsRevenue = hasAccess([
    ROLES.MODERATOR_EBOOKS,
    ROLES.COLLABORATOR_EBOOKS,
  ]);

  const showCharts = isAdmin; // Only admin sees the big charts for now

  // Application Metrics Visibility
  const showMetricsSection = hasAccess([
    ROLES.MODERATOR_MEMBERSHIP,
    ROLES.MODERATOR_CAREER,
    ROLES.MODERATOR_ACCREDITATION,
    ROLES.COLLABORATOR_LOBBYING,
  ]);

  const showUsers = hasAccess([ROLES.MODERATOR_MEMBERSHIP]); // Registered Users
  const showPartners = isAdmin; // Partner Requests
  const showGrants = isAdmin; // Grant Seekers
  const showJobSeekers = hasAccess([ROLES.MODERATOR_CAREER]);
  const showAccreditations = hasAccess([ROLES.MODERATOR_ACCREDITATION]);
  const showEvaluations = isAdmin;
  const showLegislative = hasAccess([ROLES.COLLABORATOR_LOBBYING]);
  const showListings = isAdmin;

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 mt-1 font-medium">
            Welcome back, {user?.name}.
            {isAdmin ? " Global overview." : " Here is your activity summary."}
          </p>
        </div>
        {isAdmin && (
          <div className="flex gap-3">
            <button
              onClick={handleExportReport}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-all text-sm"
            >
              Export Report
            </button>
            <button
              onClick={() => router.push('/dashboard/donations')}
              className="px-4 py-2 bg-brand-primary text-white font-bold rounded-xl shadow-lg shadow-brand-primary/20 hover:bg-brand-secondary transition-all text-sm"
            >
              View Analytics
            </button>
          </div>
        )}
      </header>

      {/* Top Revenue Stats */}
      {showRevenueSection && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FaMoneyBillWave className="text-green-600" /> Revenue & Financial
            </h2>
            {isAdmin && (
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                stats.monthOverMonth.startsWith('+') && stats.monthOverMonth !== '+0.0%'
                  ? 'text-green-600 bg-green-50 border-green-100'
                  : stats.monthOverMonth.startsWith('-')
                  ? 'text-red-600 bg-red-50 border-red-100'
                  : 'text-gray-500 bg-gray-50 border-gray-100'
              }`}>
                {stats.monthOverMonth} vs last month
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {showTotalRevenue && (
              <StatCard
                title="Total Revenue"
                value={formatCurrency(stats?.revenue.total || 0)}
                icon={FaMoneyBillWave}
                trend="Total"
                trendUp={true}
                description="All sources combined"
                color="green"
              />
            )}
            {showDonations && (
              <StatCard
                title="Donations"
                value={formatCurrency(stats?.revenue.donations || 0)}
                icon={FaHandHoldingHeart}
                trend="Gifts"
                trendUp={true}
                description="Philanthropic support"
                color="blue"
              />
            )}
            {showCertificationsRevenue && (
              <StatCard
                title="Certifications"
                value={formatCurrency(stats?.revenue.certifications || 0)}
                icon={FaCertificate}
                trend="Fees"
                trendUp={true}
                description="Professional verifications"
                color="purple"
              />
            )}
            {showPublicationsRevenue && (
              <StatCard
                title="Publication Sales"
                value={formatCurrency(stats?.revenue.publications || 0)}
                icon={FaBook}
                trend="Sales"
                trendUp={true}
                description="Books & E-books"
                color="orange"
              />
            )}
          </div>
        </section>
      )}

      {/* Charts Section */}
      {showCharts && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Graph */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Revenue Trend
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  6 Month Performance
                </p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg text-green-600">
                <FaChartLine />
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={stats?.graphs?.revenue || []}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#9CA3AF" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#9CA3AF" }}
                    tickFormatter={(val) => `₹${val / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                    formatter={(value: number | undefined) => [
                      formatCurrency(value || 0),
                      "Revenue",
                    ]}
                  />
                  <CartesianGrid vertical={false} stroke="#F3F4F6" />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10B981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Applications Graph */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Application Volume
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  Partners vs Grants
                </p>
              </div>
              <div data-ui-icon className="p-2 bg-brand-primary/10 rounded-lg ">
                <FaFileContract />
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats?.graphs?.applications || []}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#9CA3AF" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#9CA3AF" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                    cursor={{ fill: "#F9FAFB" }}
                  />
                  <Legend iconType="circle" />
                  <Bar
                    dataKey="partners"
                    name="Partners"
                    fill="#8B5CF6"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                  <Bar
                    dataKey="grants"
                    name="Grants"
                    fill="#F59E0B"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Application Forms Stats */}
      {showMetricsSection && (
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaFileContract data-ui-icon  className="" /> Application
            Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {showUsers && (
              <StatCard
                title="Registered Users"
                value={`${stats?.counts.users ?? 0}`}
                icon={FaUsers}
                trend="New"
                trendUp={true}
                description="New accounts this month"
              />
            )}
            {showPartners && (
              <StatCard
                title="Partner Requests"
                value={`${stats?.counts.partners ?? 0}`}
                icon={FaHandshake}
                trend="Pending"
                trendUp={true}
                description="Awaiting review"
              />
            )}
            {showGrants && (
              <StatCard
                title="Grant Seekers"
                value={`${stats?.counts.grants ?? 0}`}
                icon={FaFileContract}
                trend="Active"
                trendUp={true}
                description="Applications in pipeline"
              />
            )}
            {showJobSeekers && (
              <StatCard
                title="Job Seekers"
                value={`${stats?.counts.jobApplications ?? 0}`}
                icon={FaBriefcase}
                trend="High"
                trendUp={true}
                description="Talent pool growth"
              />
            )}
            {showAccreditations && (
              <StatCard
                title="Accreditations"
                value={`${stats?.counts.accreditations ?? 0}`}
                icon={FaCertificate}
                trend="Steady"
                trendUp={true}
                description="Business verifications"
              />
            )}
            {showEvaluations && (
              <StatCard
                title="Evaluations"
                value={`${stats?.counts.evaluations ?? 0}`}
                icon={FaBuilding}
                trend="Review"
                trendUp={true}
                description="Self-assessments"
              />
            )}
            {showLegislative && (
              <StatCard
                title="Govt Offices"
                value={`${stats?.counts.legislativeOffices ?? 0}`}
                icon={FaUniversity}
                trend="Official"
                trendUp={true}
                description="Legislative bodies"
              />
            )}
            {showListings && (
              <StatCard
                title="Directory Listings"
                value={`${stats?.counts.listings ?? 0}`}
                icon={FaBuilding}
                trend="Public"
                trendUp={true}
                description="Live profiles"
              />
            )}
          </div>
        </section>
      )}

      <div className="w-full">
        <ActivityFeed />
      </div>
    </div>
  );
}
