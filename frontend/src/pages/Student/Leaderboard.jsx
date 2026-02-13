import { useEffect, useState } from "react";
import api from "../../api/axios";
import Navbar from "../../components/Navbar";
import PageContainer from "../../components/PageContainer";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await api.get("/leaderboard?limit=100");
      setLeaderboard(res.data.leaderboard || res.data || []);
      setCurrentUser(res.data.currentUserRank);
    } catch (error) {
      console.error("Failed to load leaderboard:", error.message);
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
            <p className="mt-4 text-gray-600">Loading leaderboard...</p>
          </div>
        </PageContainer>
      </Navbar>
    );
  }

  const getRankIcon = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return "bg-yellow-100 border-yellow-400 text-yellow-900";
    if (rank === 2) return "bg-gray-100 border-gray-400 text-gray-900";
    if (rank === 3) return "bg-orange-100 border-orange-400 text-orange-900";
    return "bg-white border-gray-200 text-gray-900";
  };

  return (
    <Navbar>
      <PageContainer>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">🏆 Leaderboard</h1>

          {/* Current User Card */}
          {currentUser && (
            <div className="bg-indigo-50 border-2 border-indigo-300 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-indigo-600 font-medium mb-1">Your Rank</p>
                  <p className="text-3xl font-bold text-indigo-900">
                    {getRankIcon(currentUser.rank || 0)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Points</p>
                  <p className="text-2xl font-bold text-indigo-900">{currentUser.total_points || 0}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Avg Score</p>
                  <p className="text-2xl font-bold text-indigo-900">
                    {Math.round(currentUser.avg_score || 0)}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Streak</p>
                  <p className="text-2xl font-bold text-orange-600">
                    🔥 {currentUser.streak_days || 0}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Top 3 Podium */}
          {leaderboard.length >= 3 && (
            <div className="grid grid-cols-3 gap-4 mb-8">
              {/* 2nd Place */}
              <div className="mt-8">
                <div className="bg-gray-100 border-2 border-gray-400 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-2">🥈</div>
                  <p className="font-bold text-lg text-gray-900">{leaderboard[1]?.name}</p>
                  <p className="text-2xl font-bold text-gray-600 mt-2">
                    {leaderboard[1]?.total_points}
                  </p>
                  <p className="text-sm text-gray-600">points</p>
                </div>
              </div>

              {/* 1st Place */}
              <div>
                <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-6 text-center">
                  <div className="text-5xl mb-2">🥇</div>
                  <p className="font-bold text-xl text-yellow-900">{leaderboard[0]?.name}</p>
                  <p className="text-3xl font-bold text-yellow-700 mt-2">
                    {leaderboard[0]?.total_points}
                  </p>
                  <p className="text-sm text-yellow-700">points</p>
                  <div className="mt-3 flex items-center justify-center space-x-2">
                    <span className="text-sm">🔥 {leaderboard[0]?.streak_days} days</span>
                    <span className="text-sm">🏅 {leaderboard[0]?.badges_earned} badges</span>
                  </div>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="mt-8">
                <div className="bg-orange-100 border-2 border-orange-400 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-2">🥉</div>
                  <p className="font-bold text-lg text-orange-900">{leaderboard[2]?.name}</p>
                  <p className="text-2xl font-bold text-orange-600 mt-2">
                    {leaderboard[2]?.total_points}
                  </p>
                  <p className="text-sm text-orange-600">points</p>
                </div>
              </div>
            </div>
          )}

          {/* Full Leaderboard Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Points</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tests</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Streak</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Badges</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaderboard.map((student, idx) => {
                  const isCurrentUser = student.id === currentUser?.id;
                  return (
                    <tr
                      key={student.id}
                      className={`${
                        isCurrentUser ? 'bg-indigo-50' : idx < 3 ? getRankColor(idx + 1) : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-lg font-bold">
                          {getRankIcon(idx + 1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {student.name}
                            {isCurrentUser && (
                              <span className="ml-2 text-xs bg-indigo-600 text-white px-2 py-1 rounded">
                                You
                              </span>
                            )}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-lg font-bold text-indigo-600">
                          {student.total_points || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {student.total_tests || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {Math.round(student.avg_score || 0)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm">
                          {student.streak_days > 0 ? `🔥 ${student.streak_days}` : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm">
                          {student.badges_earned > 0 ? `🏅 ${student.badges_earned}` : '-'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {leaderboard.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p className="text-xl mb-2">📊</p>
                <p>No rankings yet. Be the first to take a test!</p>
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    </Navbar>
  );
};

export default Leaderboard;
