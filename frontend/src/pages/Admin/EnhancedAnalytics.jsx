import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Navbar from "../../components/Navbar";
import PageContainer from "../../components/PageContainer";
import { useTheme } from "../../context/ThemeContext";

const EnhancedAnalytics = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState("subjects"); // subjects, chapters, trends
  const [hoveredRow, setHoveredRow] = useState(null);

  const { colors } = useTheme();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get("/admin/analytics/enhanced");
      setAnalytics(res.data);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      alert("Failed to fetch analytics data");
    } finally {
      setLoading(false);
    }
  };

  const renderSubjectPerformance = () => {
    if (!analytics?.subject_performance || analytics.subject_performance.length === 0) {
      return (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📊</div>
          <div style={styles.emptyText}>No subject data available</div>
        </div>
      );
    }

    return (
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeaderRow}>
              <th style={styles.tableHeader}>Subject</th>
              <th style={styles.tableHeaderCenter}>Total MCQs</th>
              <th style={styles.tableHeaderCenter}>Total Attempts</th>
              <th style={styles.tableHeaderCenter}>Avg Score</th>
              <th style={styles.tableHeaderCenter}>Pass Rate</th>
            </tr>
          </thead>
          <tbody>
            {analytics.subject_performance.map((subject, idx) => (
              <tr 
                key={idx} 
                style={{
                  ...styles.tableRow,
                  ...(hoveredRow === `subject-${idx}` ? styles.tableRowHover : {})
                }}
                onMouseEnter={() => setHoveredRow(`subject-${idx}`)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td style={styles.tableCell}>
                  <div style={styles.subjectCell}>
                    <span style={styles.subjectIcon}>📚</span>
                    <span style={styles.subjectName}>{subject.subject_name || "Unknown"}</span>
                  </div>
                </td>
                <td style={styles.tableCellCenter}>
                  <div style={styles.countBadge}>{subject.total_mcqs || 0}</div>
                </td>
                <td style={styles.tableCellCenter}>
                  <div style={styles.countBadge}>{subject.total_attempts || 0}</div>
                </td>
                <td style={styles.tableCellCenter}>
                  {subject.avg_score ? (
                    <div style={{
                      ...styles.scoreBadge,
                      backgroundColor: subject.avg_score >= 75 ? '#4CAF50' : 
                                      subject.avg_score >= 50 ? '#FF9800' : '#f44336'
                    }}>
                      {subject.avg_score}%
                    </div>
                  ) : (
                    <span style={styles.naText}>N/A</span>
                  )}
                </td>
                <td style={styles.tableCellCenter}>
                  {subject.pass_rate ? (
                    <div style={styles.passRateBadge}>
                      {subject.pass_rate}%
                    </div>
                  ) : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderChapterStatistics = () => {
    if (!analytics?.chapter_statistics || analytics.chapter_statistics.length === 0) {
      return (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📖</div>
          <div style={styles.emptyText}>No chapter data available</div>
        </div>
      );
    }

    return (
      <div style={styles.scrollableTable}>
        <table style={styles.table}>
          <thead style={styles.stickyHeader}>
            <tr style={styles.tableHeaderRow}>
              <th style={styles.tableHeader}>Subject</th>
              <th style={styles.tableHeader}>Chapter</th>
              <th style={styles.tableHeaderCenter}>MCQs</th>
              <th style={styles.tableHeaderCenter}>Attempts</th>
              <th style={styles.tableHeaderCenter}>Avg Score</th>
              <th style={styles.tableHeaderCenter}>Last Attempt</th>
            </tr>
          </thead>
          <tbody>
            {analytics.chapter_statistics.map((chapter, idx) => (
              <tr 
                key={idx}
                style={{
                  ...styles.tableRow,
                  ...(hoveredRow === `chapter-${idx}` ? styles.tableRowHover : {})
                }}
                onMouseEnter={() => setHoveredRow(`chapter-${idx}`)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td style={styles.tableCell}>
                  <div style={styles.subjectCell}>
                    <span style={styles.subjectIcon}>📚</span>
                    <span>{chapter.subject_name}</span>
                  </div>
                </td>
                <td style={styles.tableCell}>{chapter.chapter_name}</td>
                <td style={styles.tableCellCenter}>
                  <div style={styles.countBadge}>{chapter.total_mcqs}</div>
                </td>
                <td style={styles.tableCellCenter}>
                  <div style={styles.countBadge}>{chapter.total_attempts}</div>
                </td>
                <td style={styles.tableCellCenter}>
                  {chapter.avg_score ? (
                    <div style={{
                      ...styles.scoreBadge,
                      backgroundColor: chapter.avg_score >= 75 ? '#4CAF50' : 
                                      chapter.avg_score >= 50 ? '#FF9800' : '#f44336'
                    }}>
                      {chapter.avg_score}%
                    </div>
                  ) : (
                    <span style={styles.naText}>N/A</span>
                  )}
                </td>
                <td style={styles.tableCellCenter}>
                  <div style={styles.dateBadge}>
                    {chapter.last_attempt ? new Date(chapter.last_attempt).toLocaleDateString() : "Never"}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderPerformanceTrends = () => {
    if (!analytics?.performance_trends || analytics.performance_trends.length === 0) {
      return (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📈</div>
          <div style={styles.emptyText}>No trend data available for the last 30 days</div>
        </div>
      );
    }

    return (
      <div style={styles.trendsContainer}>
        <div style={styles.trendsGrid}>
          {analytics.performance_trends.map((trend, idx) => (
            <div 
              key={idx} 
              style={{
                ...styles.trendCard,
                animationDelay: `${idx * 0.05}s`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'perspective(1000px) translateZ(20px) rotateX(5deg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'perspective(1000px) translateZ(0) rotateX(0deg)';
              }}
            >
              <div style={styles.trendDate}>
                {new Date(trend.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <div style={styles.trendStats}>
                <div style={styles.trendStat}>
                  <div style={styles.trendIcon}>🎯</div>
                  <div style={styles.trendValue}>{trend.tests_taken}</div>
                  <div style={styles.trendLabel}>Tests</div>
                </div>
                <div style={styles.trendStat}>
                  <div style={styles.trendIcon}>⭐</div>
                  <div style={styles.trendValue}>{trend.avg_score}%</div>
                  <div style={styles.trendLabel}>Score</div>
                </div>
                <div style={styles.trendStat}>
                  <div style={styles.trendIcon}>👥</div>
                  <div style={styles.trendValue}>{trend.unique_students}</div>
                  <div style={styles.trendLabel}>Students</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const styles = {
    container: {
      animation: 'slideIn3d 0.8s ease-out',
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
    },
    cubeLoader: {
      width: '80px',
      height: '80px',
      position: 'relative',
      transformStyle: 'preserve-3d',
      animation: 'cubeRotate 3s infinite linear',
    },
    cubeFace1: { position: 'absolute', width: '80px', height: '80px', background: '#2196f3', transform: 'rotateY(0deg) translateZ(40px)' },
    cubeFace2: { position: 'absolute', width: '80px', height: '80px', background: '#4CAF50', transform: 'rotateY(90deg) translateZ(40px)' },
    cubeFace3: { position: 'absolute', width: '80px', height: '80px', background: '#FF9800', transform: 'rotateY(180deg) translateZ(40px)' },
    cubeFace4: { position: 'absolute', width: '80px', height: '80px', background: '#f44336', transform: 'rotateY(-90deg) translateZ(40px)' },
    cubeFace5: { position: 'absolute', width: '80px', height: '80px', background: '#9C27B0', transform: 'rotateX(90deg) translateZ(40px)' },
    cubeFace6: { position: 'absolute', width: '80px', height: '80px', background: '#FFC107', transform: 'rotateX(-90deg) translateZ(40px)' },
    loadingText: {
      marginTop: '30px',
      fontSize: '18px',
      fontWeight: '600',
      color: colors.textSecondary,
      animation: 'float3d 2s ease-in-out infinite',
    },
    backButtonTop: {
      padding: '10px 24px',
      backgroundColor: '#2196f3',
      color: '#fff',
      border: 'none',
      borderRadius: '12px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
      animation: 'popIn3d 0.6s ease-out',
    },
    tabContainer: {
      display: 'flex',
      gap: '15px',
      marginBottom: '30px',
      flexWrap: 'wrap',
    },
    tab: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '16px 32px',
      backgroundColor: colors.card,
      border: `2px solid ${colors.border}`,
      borderRadius: '16px',
      fontSize: '16px',
      fontWeight: '600',
      color: colors.textSecondary,
      cursor: 'pointer',
      transition: 'all 0.4s ease',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      animation: 'popIn3d 0.6s ease-out',
    },
    tabActive: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      borderColor: '#667eea',
      transform: 'perspective(1000px) translateZ(10px)',
      boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
      animation: 'pulse3d 2s ease-in-out infinite',
    },
    tabIcon: {
      fontSize: '22px',
      animation: 'bounce3d 2s ease-in-out infinite',
    },
    contentCard: {
      backgroundColor: colors.card,
      borderRadius: '20px',
      padding: '30px',
      boxShadow: '0 15px 40px rgba(0,0,0,0.15)',
      animation: 'zoomIn3d 0.6s ease-out',
      minHeight: '400px',
    },
    emptyState: {
      textAlign: 'center',
      padding: '80px 20px',
      animation: 'float3d 3s ease-in-out infinite',
    },
    emptyIcon: {
      fontSize: '64px',
      marginBottom: '20px',
      animation: 'wiggle3d 2s ease-in-out infinite',
    },
    emptyText: {
      fontSize: '18px',
      color: colors.textSecondary,
      fontWeight: '500',
    },
    tableContainer: {
      overflowX: 'auto',
    },
    scrollableTable: {
      maxHeight: '600px',
      overflowY: 'auto',
    },
    table: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: '0 8px',
    },
    stickyHeader: {
      position: 'sticky',
      top: 0,
      zIndex: 10,
    },
    tableHeaderRow: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    tableHeader: {
      padding: '18px 20px',
      textAlign: 'left',
      fontSize: '14px',
      fontWeight: '700',
      color: '#fff',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    tableHeaderCenter: {
      padding: '18px 20px',
      textAlign: 'center',
      fontSize: '14px',
      fontWeight: '700',
      color: '#fff',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    tableRow: {
      backgroundColor: colors.card,
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    },
    tableRowHover: {
      transform: 'perspective(1000px) translateZ(10px) scale(1.02)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      backgroundColor: colors.backgroundSecondary,
    },
    tableCell: {
      padding: '16px 20px',
      borderTop: `1px solid ${colors.border}`,
      borderBottom: `1px solid ${colors.border}`,
      fontSize: '15px',
      color: colors.text,
    },
    tableCellCenter: {
      padding: '16px 20px',
      textAlign: 'center',
      borderTop: `1px solid ${colors.border}`,
      borderBottom: `1px solid ${colors.border}`,
    },
    subjectCell: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    subjectIcon: {
      fontSize: '24px',
      animation: 'float3d 2s ease-in-out infinite',
    },
    subjectName: {
      fontWeight: '600',
      color: colors.text,
    },
    countBadge: {
      display: 'inline-block',
      padding: '6px 16px',
      backgroundColor: '#e3f2fd',
      color: '#1976d2',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: '700',
      animation: 'pulse3d 2s ease-in-out infinite',
    },
    scoreBadge: {
      display: 'inline-block',
      padding: '8px 20px',
      borderRadius: '20px',
      fontSize: '15px',
      fontWeight: '700',
      color: '#fff',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      animation: 'glow 2s ease-in-out infinite',
    },
    passRateBadge: {
      display: 'inline-block',
      padding: '6px 16px',
      backgroundColor: '#c8e6c9',
      color: '#2e7d32',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: '700',
    },
    dateBadge: {
      padding: '6px 14px',
      backgroundColor: '#fff3e0',
      color: '#e65100',
      borderRadius: '12px',
      fontSize: '13px',
      fontWeight: '600',
    },
    naText: {
      color: colors.textSecondary,
      fontStyle: 'italic',
    },
    trendsContainer: {
      padding: '20px 0',
    },
    trendsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
      gap: '20px',
    },
    trendCard: {
      padding: '25px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '16px',
      boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
      animation: 'popIn3d 0.6s ease-out forwards',
      opacity: 0,
      transition: 'transform 0.4s ease',
      cursor: 'pointer',
    },
    trendDate: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#fff',
      marginBottom: '20px',
      textAlign: 'center',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    trendStats: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    trendStat: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
      padding: '12px',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
    },
    trendIcon: {
      fontSize: '24px',
      animation: 'bounce3d 2s ease-in-out infinite',
    },
    trendValue: {
      fontSize: '20px',
      fontWeight: '800',
      color: '#fff',
    },
    trendLabel: {
      fontSize: '11px',
      fontWeight: '600',
      color: 'rgba(255, 255, 255, 0.9)',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
  };

  if (loading) {
    return (
      <Navbar>
        <PageContainer title="Enhanced Analytics" subtitle="Loading...">
          <div style={styles.loadingContainer}>
            <div style={styles.cubeLoader}>
              <div style={styles.cubeFace1}></div>
              <div style={styles.cubeFace2}></div>
              <div style={styles.cubeFace3}></div>
              <div style={styles.cubeFace4}></div>
              <div style={styles.cubeFace5}></div>
              <div style={styles.cubeFace6}></div>
            </div>
            <p style={styles.loadingText}>Loading Analytics...</p>
          </div>
        </PageContainer>
      </Navbar>
    );
  }

  return (
    <Navbar>
      <PageContainer
        title="📊 Enhanced Analytics & Reports"
        subtitle="Comprehensive performance analytics and insights"
        actions={
          <button
            onClick={() => navigate("/admin")}
            style={styles.backButtonTop}
          >
            ← Back to Dashboard
          </button>
        }
      >
        <div style={styles.container}>
          {/* 3D Tab Navigation */}
          <div style={styles.tabContainer}>
            <button
              onClick={() => setSelectedView("subjects")}
              style={{
                ...styles.tab,
                ...(selectedView === "subjects" ? styles.tabActive : {})
              }}
            >
              <span style={styles.tabIcon}>📚</span>
              Subject Performance
            </button>
            <button
              onClick={() => setSelectedView("chapters")}
              style={{
                ...styles.tab,
                ...(selectedView === "chapters" ? styles.tabActive : {})
              }}
            >
              <span style={styles.tabIcon}>📖</span>
              Chapter Statistics
            </button>
            <button
              onClick={() => setSelectedView("trends")}
              style={{
                ...styles.tab,
                ...(selectedView === "trends" ? styles.tabActive : {})
              }}
            >
              <span style={styles.tabIcon}>📈</span>
              Performance Trends
            </button>
          </div>

          {/* 3D Content Card */}
          <div style={styles.contentCard}>
            {selectedView === "subjects" && renderSubjectPerformance()}
            {selectedView === "chapters" && renderChapterStatistics()}
            {selectedView === "trends" && renderPerformanceTrends()}
          </div>
        </div>
      </PageContainer>
    </Navbar>
  );
};

export default EnhancedAnalytics;
