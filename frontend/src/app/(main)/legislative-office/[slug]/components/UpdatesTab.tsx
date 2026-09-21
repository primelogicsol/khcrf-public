"use client";

import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaFileAlt,
  FaAward,
  FaBullhorn,
  FaHandshake,
} from "react-icons/fa";
import PostSummary from "./PostSummary";
import PostCard from "./PostCard";

export default function UpdatesTab({
  pinnedPosts,
  regularPosts,
  office,
  handleReportClick,
  meetings,
  policies,
  notices,
  clusterVisits,
}: any) {
  return (
    <div className="space-y-12 animate-fadeIn">
      {/* SECTION B: Verified Updates */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-brand-secondary text-white rounded-lg">
            <FaBullhorn />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 font-playfair">
              Legislative Artisan Desk (LCAD)
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              Official public communications and verifying updates.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* --- Left Column: Feed --- */}
          <div className="lg:col-span-2 space-y-8">
            {/* Pinned / Important */}
            {pinnedPosts.length > 0 && (
              <div className="mb-8 bg-yellow-50 border border-yellow-100 rounded-xl p-6">
                <h3 className="text-xs font-bold text-yellow-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <FaAward /> Priority Notice
                </h3>
                {pinnedPosts.map((post: any) => (
                  <div key={post.id} className="mb-6 last:mb-0">
                    <PostSummary post={post} />
                  </div>
                ))}
              </div>
            )}

            {/* Feed */}
            <div className="space-y-6">
              {regularPosts.length > 0 ? (
                regularPosts.map((post: any) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    office={office}
                    onReport={handleReportClick}
                  />
                ))
              ) : (
                <div className="p-12 text-center bg-white rounded-xl border border-dashed border-gray-300 text-gray-400">
                  <p>No verified updates published yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* --- Right Column: Sidebar --- */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <FaHandshake data-ui-icon  className="" />
                <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">
                  Meeting Alerts
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {(meetings || []).length > 0 ? (
                  meetings.map((m: any, i: number) => (
                    <div
                      key={i}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-50 text-blue-600 p-2 rounded text-center min-w-[50px]">
                          <div className="text-xs font-bold uppercase">
                            {new Date(m.date).toLocaleString("default", {
                              month: "short",
                            })}
                          </div>
                          <div className="text-lg font-bold">
                            {new Date(m.date).getDate()}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 leading-tight mb-1">
                            {m.title}
                          </h4>
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide bg-gray-100 px-1.5 py-0.5 rounded">
                            {m.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-gray-400 font-medium">
                    No meeting alerts.
                  </div>
                )}
              </div>
              <button className="w-full py-3 text-xs font-bold text-gray-500 uppercase tracking-wide border-t border-gray-100 hover:text-brand-primary hover:bg-gray-50 transition-colors">
                View All Meetings
              </button>
            </div>

            {/* Policy Statements */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <FaFileAlt data-ui-icon  className="" />
                <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">
                  Policy Statements
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {(policies || []).length > 0 ? (
                  policies.map((m: any, i: number) => (
                    <div
                      key={i}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="bg-brand-secondary/10 text-brand-secondary p-2 rounded text-center min-w-[50px]">
                          <div className="text-xs font-bold uppercase">
                            {new Date(m.date).toLocaleString("default", {
                              month: "short",
                            })}
                          </div>
                          <div className="text-lg font-bold">
                            {new Date(m.date).getDate()}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 leading-tight mb-1">
                            {m.title}
                          </h4>
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide bg-gray-100 px-1.5 py-0.5 rounded">
                            {m.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-gray-400 font-medium">
                    No policy statements.
                  </div>
                )}
              </div>
              <button className="w-full py-3 text-xs font-bold text-gray-500 uppercase tracking-wide border-t border-gray-100 hover:text-brand-secondary hover:bg-gray-50 transition-colors">
                View All Policies
              </button>
            </div>

            {/* Public Notice */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <FaBullhorn data-ui-icon  className="" />
                <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">
                  Public Notice
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {(notices || []).length > 0 ? (
                  notices.map((m: any, i: number) => (
                    <div
                      key={i}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="bg-brand-primary/10 text-brand-primary p-2 rounded text-center min-w-[50px]">
                          <div className="text-xs font-bold uppercase">
                            {new Date(m.date).toLocaleString("default", {
                              month: "short",
                            })}
                          </div>
                          <div className="text-lg font-bold">
                            {new Date(m.date).getDate()}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 leading-tight mb-1">
                            {m.title}
                          </h4>
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide bg-gray-100 px-1.5 py-0.5 rounded">
                            {m.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-gray-400 font-medium">
                    No public notices.
                  </div>
                )}
              </div>
              <button className="w-full py-3 text-xs font-bold text-gray-500 uppercase tracking-wide border-t border-gray-100 hover:text-brand-primary hover:bg-gray-50 transition-colors">
                View All Notices
              </button>
            </div>

            {/* Cluster Visits */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <FaMapMarkerAlt className="text-gray-700" />
                <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">
                  Recent Cluster Visits
                </h3>
              </div>
              <div className="p-6 space-y-6">
                {(clusterVisits || []).length > 0 ? (
                  clusterVisits.map((v: any, i: number) => (
                    <div
                      key={i}
                      className="relative pl-4 border-l-2 border-gray-100"
                    >
                      <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-gray-300 border-2 border-white"></div>
                      <h4 className="text-sm font-bold text-gray-900">
                        {v.location}
                      </h4>
                      <p className="text-xs text-gray-500 mb-1">
                        {new Date(v.date).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-sm text-gray-700">
                        {v.outcome || v.detail}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-sm text-gray-400 font-medium py-4">
                    No recent cluster visits.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
