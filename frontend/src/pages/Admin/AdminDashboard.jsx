import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import Navbar from "../../components/Navbar";
import PageContainer from "../../components/PageContainer";
import { useTheme } from "../../context/ThemeContext";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const { colors } = useTheme();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await api.get("/admin/dashboard/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      padding: '60px 20px',
    },
    cubeLoader: {
      width: '100px',
      height: '100px',
      position: 'relative',
      transformStyle: 'preserve-3d',
      animation: 'cubeRotate 3s infinite linear',
    },
    cubeFace1: { position: 'absolute', width: '100px', height: '100px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', transform: 'rotateY(0deg) translateZ(50px)', opacity: 0.9 },
    cubeFace2: { position: 'absolute', width: '100px', height: '100px', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', transform: 'rotateY(90deg) translateZ(50px)', opacity: 0.9 },
    cubeFace3: { position: 'absolute', width: '100px', height: '100px', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', transform: 'rotateY(180deg) translateZ(50px)', opacity: 0.9 },
    cubeFace4: { position: 'absolute', width: '100px', height: '100px', background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', transform: 'rotateY(-90deg) translateZ(50px)', opacity: 0.9 },
    cubeFace5: { position: 'absolute', width: '100px', height: '100px', background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', transform: 'rotateX(90deg) translateZ(50px)', opacity: 0.9 },
    cubeFace6: { position: 'absolute', width: '100px', height: '100px', background: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)', transform: 'rotateX(-90deg) translateZ(50px)', opacity: 0.9 },
    loadingText: {
      marginTop: '40px',
      fontSize: '20px',
      fontWeight: '700',
      color: '#667eea',
      animation: 'float3d 2s ease-in-out infinite',
      letterSpacing: '1px',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '24px',
      marginBottom: '40px',
    },
    statCard: {
      backgroundColor: colors.card,
      borderRadius: '20px',
      padding: '28px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      animation: 'popIn3d 0.6s ease-out forwards',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
    },
    statCardHover: {
      transform: 'perspective(1000px) translateZ(25px) scale(1.05)',
      boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
    },
    statContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    statLabel: {
      fontSize: '14px',
      fontWeight: '600',
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: '12px',
    },
    statValue: {
      fontSize: '42px',
      fontWeight: '800',
      color: colors.text,
      lineHeight: '1',
    },
    statIcon: {
      width: '80px',
      height: '80px',
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
      animation: 'float3d 3s ease-in-out infinite',
    },
    iconText: {
      fontSize: '36px',
    },
    sectionCard: {
      backgroundColor: colors.card,
      borderRadius: '20px',
      padding: '30px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
      marginBottom: '30px',
      animation: 'zoomIn3d 0.6s ease-out',
    },
    sectionTitle: {
      fontSize: '24px',
      fontWeight: '800',
      color: colors.text,
      marginBottom: '25px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    sectionIcon: {
      fontSize: '28px',
      animation: 'bounce3d 2s ease-in-out infinite',
    },
    tableWrapper: {
      overflowX: 'auto',
    },
    table: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: '0 10px',
    },
    tableHead: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '12px',
    },
    tableHeader: {
      padding: '18px 24px',
      textAlign: 'left',
      fontSize: '14px',
      fontWeight: '700',
      color: '#fff',
      textTransform: 'uppercase',
      letterSpacing: '1.5px',
    },
    tableRow: {
      backgroundColor: colors.card,
      transition: 'all 0.3s ease',
      borderRadius: '12px',
      cursor: 'pointer',
    },
    tableCell: {
      padding: '20px 24px',
      fontSize: '15px',
      color: colors.text,
      borderTop: `1px solid ${colors.border}`,
      borderBottom: `1px solid ${colors.border}`,
    },
    subjectBadge: {
      display: 'inline-block',
      padding: '8px 18px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: '700',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
    },
    attemptsBadge: {
      display: 'inline-block',
      padding: '8px 20px',
      backgroundColor: '#e3f2fd',
      color: '#1976d2',
      borderRadius: '20px',
      fontSize: '16px',
      fontWeight: '800',
      animation: 'pulse3d 2s ease-in-out infinite',
    },
    activityContainer: {
      maxHeight: '500px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    activityCard: {
      padding: '20px',
      backgroundColor: colors.card,
      border: `2px solid ${colors.border}`,
      borderRadius: '16px',
      transition: 'all 0.4s ease',
      cursor: 'pointer',
      animation: 'slideIn3d 0.6s ease-out forwards',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    },
    activityHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      marginBottom: '15px',
    },
    activityAvatar: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: '20px',
      fontWeight: '800',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
      animation: 'pulse3d 2s ease-in-out infinite',
    },
    activityInfo: {
      flex: 1,
    },
    activityName: {
      fontSize: '16px',
      fontWeight: '700',
      color: colors.text,
      marginBottom: '4px',
    },
    activitySubject: {
      fontSize: '14px',
      color: colors.textSecondary,
      fontWeight: '600',
    },
    activityFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: '12px',
      borderTop: `1px solid ${colors.border}`,
    },
    activityScore: {
      padding: '6px 14px',
      backgroundColor: '#e8f5e9',
      color: '#2e7d32',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '700',
    },
    activityDate: {
      fontSize: '12px',
      color: colors.textSecondary,
      fontWeight: '600',
    },
    quickLinksSection: {
      marginTop: '20px',
    },
    quickLinksTitle: {
      fontSize: '28px',
      fontWeight: '800',
      color: colors.text,
      marginBottom: '25px',
    },
    quickLinksGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '24px',
    },
    linkReset: {
      textDecoration: 'none',
    },
    quickLinkCard: {
      padding: '40px',
      borderRadius: '24px',
      boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      cursor: 'pointer',
      textAlign: 'center',
      color: '#fff',
      animation: 'popIn3d 0.8s ease-out',
      position: 'relative',
      overflow: 'hidden',
    },
    quickLinkIcon: {
      fontSize: '56px',
      marginBottom: '20px',
      animation: 'bounce3d 2s ease-in-out infinite',
    },
    quickLinkTitle: {
      fontSize: '18px',
      fontWeight: '700',
      letterSpacing: '0.5px',
    },
  };

  return (
    <Navbar>
      <PageContainer
        title="Admin Dashboard"
        subtitle="Overview of platform statistics and recent activity"
      >
        {/* Statistics Cards */}
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.cubeLoader}>
              <div style={styles.cubeFace1}></div>
              <div style={styles.cubeFace2}></div>
              <div style={styles.cubeFace3}></div>
              <div style={styles.cubeFace4}></div>
              <div style={styles.cubeFace5}></div>
              <div style={styles.cubeFace6}></div>
            </div>
            <div style={styles.loadingText}>Loading dashboard statistics...</div>
          </div>
        ) : stats && (
          <>
            <div style={styles.statsGrid}>
              {/* Total Students */}
              <div style={{...styles.statCard, animationDelay: '0s'}} 
                   onMouseEnter={(e) => e.currentTarget.style.transform = styles.statCardHover.transform}
                   onMouseLeave={(e) => e.currentTarget.style.transform = 'perspective(1000px) translateZ(0px)'}>
                <div style={styles.statContent}>
                  <div>
                    <p style={styles.statLabel}>Total Students</p>
                    <p style={styles.statValue}>{stats.total_students}</p>
                  </div>
                  <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                    <span style={styles.iconText}>👥</span>
                  </div>
                </div>
              </div>

              {/* Subjects */}
              <div style={{...styles.statCard, animationDelay: '0.1s'}} 
                   onMouseEnter={(e) => e.currentTarget.style.transform = styles.statCardHover.transform}
                   onMouseLeave={(e) => e.currentTarget.style.transform = 'perspective(1000px) translateZ(0px)'}>
                <div style={styles.statContent}>
                  <div>
                    <p style={styles.statLabel}>Subjects</p>
                    <p style={styles.statValue}>{stats.total_subjects}</p>
                  </div>
                  <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>
                    <span style={styles.iconText}>📚</span>
                  </div>
                </div>
              </div>

              {/* Chapters */}
              <div style={{...styles.statCard, animationDelay: '0.2s'}} 
                   onMouseEnter={(e) => e.currentTarget.style.transform = styles.statCardHover.transform}
                   onMouseLeave={(e) => e.currentTarget.style.transform = 'perspective(1000px) translateZ(0px)'}>
                <div style={styles.statContent}>
                  <div>
                    <p style={styles.statLabel}>Chapters</p>
                    <p style={styles.statValue}>{stats.total_chapters}</p>
                  </div>
                  <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'}}>
                    <span style={styles.iconText}>📖</span>
                  </div>
                </div>
              </div>

              {/* Total MCQs */}
              <div style={{...styles.statCard, animationDelay: '0.3s'}} 
                   onMouseEnter={(e) => e.currentTarget.style.transform = styles.statCardHover.transform}
                   onMouseLeave={(e) => e.currentTarget.style.transform = 'perspective(1000px) translateZ(0px)'}>
                <div style={styles.statContent}>
                  <div>
                    <p style={styles.statLabel}>Total MCQs</p>
                    <p style={styles.statValue}>{stats.total_mcqs}</p>
                  </div>
                  <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'}}>
                    <span style={styles.iconText}>❓</span>
                  </div>
                </div>
              </div>

              {/* Tests Today */}
              <div style={{...styles.statCard, animationDelay: '0.4s'}} 
                   onMouseEnter={(e) => e.currentTarget.style.transform = styles.statCardHover.transform}
                   onMouseLeave={(e) => e.currentTarget.style.transform = 'perspective(1000px) translateZ(0px)'}>
                <div style={styles.statContent}>
                  <div>
                    <p style={styles.statLabel}>Tests Today</p>
                    <p style={styles.statValue}>{stats.attempts_today}</p>
                  </div>
                  <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'}}>
                    <span style={styles.iconText}>📈</span>
                  </div>
                </div>
              </div>

              {/* Tests This Week */}
              <div style={{...styles.statCard, animationDelay: '0.5s'}} 
                   onMouseEnter={(e) => e.currentTarget.style.transform = styles.statCardHover.transform}
                   onMouseLeave={(e) => e.currentTarget.style.transform = 'perspective(1000px) translateZ(0px)'}>
                <div style={styles.statContent}>
                  <div>
                    <p style={styles.statLabel}>Tests This Week</p>
                    <p style={styles.statValue}>{stats.attempts_week}</p>
                  </div>
                  <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'}}>
                    <span style={styles.iconText}>📊</span>
                  </div>
                </div>
              </div>

              {/* Average Score */}
              <div style={{...styles.statCard, animationDelay: '0.6s'}} 
                   onMouseEnter={(e) => e.currentTarget.style.transform = styles.statCardHover.transform}
                   onMouseLeave={(e) => e.currentTarget.style.transform = 'perspective(1000px) translateZ(0px)'}>
                <div style={styles.statContent}>
                  <div>
                    <p style={styles.statLabel}>Average Score</p>
                    <p style={styles.statValue}>{stats.avg_score}%</p>
                  </div>
                  <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)'}}>
                    <span style={styles.iconText}>⭐</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Most Attempted Chapters */}
            {stats.most_attempted && stats.most_attempted.length > 0 && (
              <div style={styles.sectionCard}>
                <h3 style={styles.sectionTitle}>
                  <span style={styles.sectionIcon}>🔥</span>
                  Most Attempted Chapters
                </h3>
                <div style={styles.tableWrapper}>
                  <table style={styles.table}>
                    <thead style={styles.tableHead}>
                      <tr>
                        <th style={styles.tableHeader}>Subject</th>
                        <th style={styles.tableHeader}>Chapter</th>
                        <th style={{...styles.tableHeader, textAlign: 'right'}}>Attempts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.most_attempted.map((item, idx) => (
                        <tr key={idx} style={styles.tableRow}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'perspective(1000px) translateZ(8px)';
                              e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'perspective(1000px) translateZ(0px)';
                              e.currentTarget.style.backgroundColor = colors.card;
                            }}>
                          <td style={styles.tableCell}>
                            <span style={styles.subjectBadge}>{item.subject}</span>
                          </td>
                          <td style={styles.tableCell}>{item.chapter}</td>
                          <td style={{...styles.tableCell, textAlign: 'right'}}>
                            <span style={styles.attemptsBadge}>{item.attempts}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Recent Activity */}
            {stats.recent_activity && stats.recent_activity.length > 0 && (
              <div style={styles.sectionCard}>
                <h3 style={styles.sectionTitle}>
                  <span style={styles.sectionIcon}>⚡</span>
                  Recent Activity
                </h3>
                <div style={styles.activityContainer}>
                  {stats.recent_activity.map((activity, idx) => (
                    <div key={idx} style={{...styles.activityCard, animationDelay: `${idx * 0.1}s`}}
                         onMouseEnter={(e) => {
                           e.currentTarget.style.transform = 'perspective(1000px) translateZ(15px) rotateY(2deg)';
                           e.currentTarget.style.boxShadow = '0 12px 32px rgba(102, 126, 234, 0.3)';
                         }}
                         onMouseLeave={(e) => {
                           e.currentTarget.style.transform = 'perspective(1000px) translateZ(0px)';
                           e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                         }}>
                      <div style={styles.activityHeader}>
                        <span style={styles.activityAvatar}>
                          {activity.student_name.charAt(0).toUpperCase()}
                        </span>
                        <div style={styles.activityInfo}>
                          <p style={styles.activityName}>{activity.student_name}</p>
                          <p style={styles.activitySubject}>
                            {activity.subject} - {activity.chapter}
                          </p>
                        </div>
                      </div>
                      <div style={styles.activityFooter}>
                        <span style={styles.activityScore}>
                          Score: {activity.score}/{activity.total}
                        </span>
                        <span style={styles.activityDate}>
                          {new Date(activity.attempted_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Quick Links */}
        <div style={styles.quickLinksSection}>
          <h2 style={styles.quickLinksTitle}>Management</h2>
          <div style={styles.quickLinksGrid}>
            <Link to="/admin/subjects" style={styles.linkReset}>
              <div style={{...styles.quickLinkCard, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}
                   onMouseEnter={(e) => {
                     e.currentTarget.style.transform = 'perspective(1000px) translateZ(30px) rotateX(5deg) rotateY(-5deg)';
                     e.currentTarget.style.boxShadow = '0 20px 50px rgba(102, 126, 234, 0.5)';
                   }}
                   onMouseLeave={(e) => {
                     e.currentTarget.style.transform = 'perspective(1000px) translateZ(0px)';
                     e.currentTarget.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.3)';
                   }}>
                <div style={styles.quickLinkIcon}>📚</div>
                <div style={styles.quickLinkTitle}>Manage Subjects & Chapters</div>
              </div>
            </Link>
            <Link to="/admin/students" style={styles.linkReset}>
              <div style={{...styles.quickLinkCard, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}
                   onMouseEnter={(e) => {
                     e.currentTarget.style.transform = 'perspective(1000px) translateZ(30px) rotateX(5deg) rotateY(-5deg)';
                     e.currentTarget.style.boxShadow = '0 20px 50px rgba(240, 147, 251, 0.5)';
                   }}
                   onMouseLeave={(e) => {
                     e.currentTarget.style.transform = 'perspective(1000px) translateZ(0px)';
                     e.currentTarget.style.boxShadow = '0 10px 30px rgba(240, 147, 251, 0.3)';
                   }}>
                <div style={styles.quickLinkIcon}>👥</div>
                <div style={styles.quickLinkTitle}>Manage Students</div>
              </div>
            </Link>
            <Link to="/admin/analytics" style={styles.linkReset}>
              <div style={{...styles.quickLinkCard, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'}}
                   onMouseEnter={(e) => {
                     e.currentTarget.style.transform = 'perspective(1000px) translateZ(30px) rotateX(5deg) rotateY(-5deg)';
                     e.currentTarget.style.boxShadow = '0 20px 50px rgba(79, 172, 254, 0.5)';
                   }}
                   onMouseLeave={(e) => {
                     e.currentTarget.style.transform = 'perspective(1000px) translateZ(0px)';
                     e.currentTarget.style.boxShadow = '0 10px 30px rgba(79, 172, 254, 0.3)';
                   }}>
                <div style={styles.quickLinkIcon}>📊</div>
                <div style={styles.quickLinkTitle}>View Analytics</div>
              </div>
            </Link>
            <Link to="/admin/analytics/enhanced" style={styles.linkReset}>
              <div style={{...styles.quickLinkCard, background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'}}
                   onMouseEnter={(e) => {
                     e.currentTarget.style.transform = 'perspective(1000px) translateZ(30px) rotateX(5deg) rotateY(-5deg)';
                     e.currentTarget.style.boxShadow = '0 20px 50px rgba(250, 112, 154, 0.5)';
                   }}
                   onMouseLeave={(e) => {
                     e.currentTarget.style.transform = 'perspective(1000px) translateZ(0px)';
                     e.currentTarget.style.boxShadow = '0 10px 30px rgba(250, 112, 154, 0.3)';
                   }}>
                <div style={styles.quickLinkIcon}>📈</div>
                <div style={styles.quickLinkTitle}>Enhanced Reports</div>
              </div>
            </Link>
          </div>
        </div>
      </PageContainer>
    </Navbar>
  );
};

export default AdminDashboard;