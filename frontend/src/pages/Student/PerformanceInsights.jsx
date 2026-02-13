import { useEffect, useState } from "react";
import api from "../../api/axios";
import Navbar from "../../components/Navbar";
import PageContainer from "../../components/PageContainer";

const PerformanceInsights = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const res = await api.get("/performance/insights");
      setInsights(res.data);
    } catch (error) {
      console.error("Failed to load performance insights:", error.message);
      alert("Failed to load performance insights");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Navbar>
        <PageContainer>
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading insights...</p>
          </div>
        </PageContainer>
      </Navbar>
    );
  }

  if (!insights) {
    return (
      <Navbar>
        <PageContainer>
          <div className="text-center py-20">
            <p className="text-red-600">No data available</p>
          </div>
        </PageContainer>
      </Navbar>
    );
  }

  const stats = insights.overallStats || {};

  return (
    <Navbar>
      <PageContainer>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">📊 Performance Insights</h1>

          {/* Tabs */}
          <div className="flex space-x-4 border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'overview'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('chapters')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'chapters'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              By Chapter
            </button>
            <button
              onClick={() => setActiveTab('trends')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'trends'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Trends
            </button>
            <button
              onClick={() => setActiveTab('badges')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'badges'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Badges
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Tests"
                  value={stats.total_tests || 0}
                  icon="📝"
                  color="blue"
                />
                <StatCard
                  title="Average Score"
                  value={`${Math.round(parseFloat(stats.avg_score) || 0)}%`}
                  icon="🎯"
                  color="green"
                />
                <StatCard
                  title="Total Points"
                  value={stats.total_points || 0}
                  icon="⭐"
                  color="yellow"
                />
                <StatCard
                  title="Current Streak"
                  value={`${stats.streak_days || 0} days`}
                  icon="🔥"
                  color="red"
                />
              </div>

              {/* Weak Topics */}
              {insights?.weakTopics && insights.weakTopics.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-red-900 mb-4">
                    📉 Topics to Improve
                  </h3>
                  <div className="space-y-3">
                    {insights.weakTopics.map((topic, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white p-3 rounded">
                        <div>
                          <p className="font-medium text-gray-900">{topic.chapter_name}</p>
                          <p className="text-sm text-gray-600">{topic.subject_name}</p>
                        </div>
                        <span className="text-red-600 font-semibold">{topic.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Strong Topics */}
              {insights?.strongTopics && insights.strongTopics.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-4">
                    📈 Strong Topics
                  </h3>
                  <div className="space-y-3">
                    {insights.strongTopics.map((topic, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white p-3 rounded">
                        <div>
                          <p className="font-medium text-gray-900">{topic.chapter_name}</p>
                          <p className="text-sm text-gray-600">{topic.subject_name}</p>
                        </div>
                        <span className="text-green-600 font-semibold">{topic.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Difficulty Performance */}
              {insights?.difficultyPerformance && insights.difficultyPerformance.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Performance by Difficulty
                  </h3>
                  <div className="space-y-4">
                    {insights.difficultyPerformance.map((diff, idx) => (
                      <div key={idx}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium capitalize">{diff.difficulty}</span>
                          <span className="text-sm text-gray-600">
                            {diff.correct_answers}/{diff.total_attempted} ({diff.accuracy}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              diff.accuracy >= 80
                                ? 'bg-green-500'
                                : diff.accuracy >= 60
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${diff.accuracy}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Chapters Tab */}
          {activeTab === 'chapters' && (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chapter</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {insights?.chapterPerformance?.map((chapter, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {chapter.chapter_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {chapter.subject_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="font-medium">{chapter.score}/{chapter.total}</span>
                        <span className="text-gray-600 ml-2">({chapter.percentage}%)</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {chapter.passed ? (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Passed
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            Failed
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(chapter.attempted_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Trends Tab */}
          {activeTab === 'trends' && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Progress</h3>
              <div className="space-y-3">
                {insights?.recentProgress?.map((progress, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium text-gray-900">{progress.chapter_name}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(progress.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-indigo-600">{progress.percentage}%</p>
                      <p className="text-sm text-gray-600">
                        {progress.passed ? '✅ Passed' : '❌ Failed'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Badges Tab */}
          {activeTab === 'badges' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {insights?.badges?.map((badge, idx) => (
                <div key={idx} className="bg-white border-2 border-yellow-400 rounded-lg p-6 text-center">
                  <div className="text-5xl mb-3">🏆</div>
                  <h4 className="font-bold text-lg text-gray-900 mb-2">{badge.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{badge.description}</p>
                  <p className="text-xs text-gray-500">
                    Earned: {new Date(badge.earned_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
              {(!insights?.badges || insights.badges.length === 0) && (
                <div className="col-span-3 text-center py-12 text-gray-500">
                  <p className="text-xl mb-2">🎯</p>
                  <p>No badges earned yet. Keep practicing!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </PageContainer>
    </Navbar>
  );
};

const StatCard = ({ title, value, icon, color }) => {
  const colors = {
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    green: 'bg-green-50 border-green-200 text-green-900',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    red: 'bg-red-50 border-red-200 text-red-900',
  };

  return (
    <div className={`${colors[color]} border rounded-lg p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
};

export default PerformanceInsights;
