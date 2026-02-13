import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useTheme } from "../../context/ThemeContext";

const Analytics = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  const { colors } = useTheme();

  useEffect(() => {
    api.get("/results/analytics")
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  const getScoreColor = (score) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FF9800';
    if (score >= 40) return '#FFC107';
    return '#f44336';
  };

  const styles = {
    container: {
      padding: '30px',
      maxWidth: '1600px',
      margin: '0 auto',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    cubeLoader: {
      width: '100px',
      height: '100px',
      position: 'relative',
      transformStyle: 'preserve-3d',
      animation: 'cubeRotate 3s infinite linear',
    },
    cubeFace1: { position: 'absolute', width: '100px', height: '100px', background: '#2196f3', transform: 'rotateY(0deg) translateZ(50px)' },
    cubeFace2: { position: 'absolute', width: '100px', height: '100px', background: '#4CAF50', transform: 'rotateY(90deg) translateZ(50px)' },
    cubeFace3: { position: 'absolute', width: '100px', height: '100px', background: '#FF9800', transform: 'rotateY(180deg) translateZ(50px)' },
    cubeFace4: { position: 'absolute', width: '100px', height: '100px', background: '#f44336', transform: 'rotateY(-90deg) translateZ(50px)' },
    cubeFace5: { position: 'absolute', width: '100px', height: '100px', background: '#9C27B0', transform: 'rotateX(90deg) translateZ(50px)' },
    cubeFace6: { position: 'absolute', width: '100px', height: '100px', background: '#FFC107', transform: 'rotateX(-90deg) translateZ(50px)' },
    loadingText: {
      marginTop: '40px',
      fontSize: '24px',
      color: '#fff',
      fontWeight: '700',
      animation: 'float3d 2s ease-in-out infinite',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '40px',
      animation: 'slideIn3d 0.8s ease-out',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '25px',
    },
    backButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px 24px',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '15px',
      fontSize: '16px',
      fontWeight: '600',
      color: '#fff',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    },
    backIcon: {
      fontSize: '20px',
    },
    title: {
      fontSize: '42px',
      fontWeight: '800',
      color: '#fff',
      margin: 0,
      textShadow: '0 4px 12px rgba(0,0,0,0.2)',
      animation: 'float3d 3s ease-in-out infinite',
    },
    statsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '25px',
      marginBottom: '40px',
    },
    statCard: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      padding: '30px',
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '20px',
      boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
      animation: 'popIn3d 0.6s ease-out forwards',
      opacity: 0,
      transition: 'transform 0.3s ease',
      cursor: 'pointer',
    },
    statIcon: {
      fontSize: '52px',
      animation: 'bounce3d 2s ease-in-out infinite',
    },
    statContent: {
      flex: 1,
    },
    statValue: {
      fontSize: '38px',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '5px',
    },
    statLabel: {
      fontSize: '14px',
      color: '#666',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    cardsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '30px',
    },
    analyticsCard: {
      position: 'relative',
      background: 'rgba(255, 255, 255, 0.98)',
      borderRadius: '24px',
      padding: '30px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
      animation: 'zoomIn3d 0.6s ease-out forwards',
      opacity: 0,
      transition: 'transform 0.4s ease, box-shadow 0.4s ease',
      cursor: 'pointer',
      overflow: 'hidden',
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '25px',
    },
    cardNumber: {
      fontSize: '18px',
      fontWeight: '800',
      color: '#667eea',
      backgroundColor: 'rgba(102, 126, 234, 0.1)',
      padding: '8px 16px',
      borderRadius: '12px',
    },
    scoreCircle: {
      width: '90px',
      height: '90px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      animation: 'flip3d 4s ease-in-out infinite',
    },
    scoreInner: {
      width: '70px',
      height: '70px',
      borderRadius: '50%',
      backgroundColor: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
    scoreValue: {
      fontSize: '24px',
      fontWeight: '800',
      color: colors.text,
    },
    scorePercent: {
      fontSize: '12px',
      fontWeight: '600',
      color: colors.textSecondary,
    },
    cardContent: {
      marginBottom: '25px',
    },
    subjectBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      borderRadius: '12px',
      fontSize: '13px',
      fontWeight: '700',
      marginBottom: '15px',
      animation: 'glow 2s ease-in-out infinite',
    },
    subjectIcon: {
      fontSize: '16px',
    },
    chapterName: {
      fontSize: '22px',
      fontWeight: '700',
      color: colors.text,
      margin: 0,
      lineHeight: '1.4',
    },
    cardFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: '25px',
      borderTop: `2px solid ${colors.border}`,
    },
    footerItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flex: 1,
    },
    footerIcon: {
      fontSize: '28px',
      animation: 'wiggle3d 1.5s ease-in-out infinite',
    },
    footerContent: {
      flex: 1,
    },
    footerValue: {
      fontSize: '24px',
      fontWeight: '800',
      color: colors.text,
      lineHeight: '1',
    },
    footerLabel: {
      fontSize: '11px',
      color: colors.textSecondary,
      fontWeight: '600',
      textTransform: 'uppercase',
      marginTop: '4px',
    },
    footerDivider: {
      width: '2px',
      height: '50px',
      background: `linear-gradient(180deg, transparent, ${colors.border}, transparent)`,
      margin: '0 15px',
    },
    cardGloss: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '50%',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%)',
      borderRadius: '24px 24px 0 0',
      pointerEvents: 'none',
    },
    emptyState: {
      textAlign: 'center',
      padding: '100px 20px',
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '24px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      animation: 'popIn3d 0.8s ease-out',
    },
    emptyIcon: {
      fontSize: '80px',
      marginBottom: '25px',
      animation: 'float3d 3s ease-in-out infinite',
    },
    emptyTitle: {
      fontSize: '32px',
      fontWeight: '700',
      color: colors.text,
      marginBottom: '15px',
    },
    emptyText: {
      fontSize: '18px',
      color: colors.textSecondary,
    },
  };

  if (loading) {
    return (
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
    );
  }

  return (
    <div style={styles.container}>
      {/* 3D Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button onClick={() => navigate(-1)} style={styles.backButton}>
            <span style={styles.backIcon}>←</span>
            Back
          </button>
          <h1 style={styles.title}>📊 Analytics Dashboard</h1>
        </div>
      </div>

      {/* Floating Stats Summary */}
      <div style={styles.statsContainer}>
        <div style={{...styles.statCard, animationDelay: '0s'}}>
          <div style={styles.statIcon}>📈</div>
          <div style={styles.statContent}>
            <div style={styles.statValue}>{data.length}</div>
            <div style={styles.statLabel}>Total Chapters</div>
          </div>
        </div>
        <div style={{...styles.statCard, animationDelay: '0.1s'}}>
          <div style={styles.statIcon}>🎯</div>
          <div style={styles.statContent}>
            <div style={styles.statValue}>
              {data.reduce((sum, d) => sum + d.attempts, 0)}
            </div>
            <div style={styles.statLabel}>Total Attempts</div>
          </div>
        </div>
        <div style={{...styles.statCard, animationDelay: '0.2s'}}>
          <div style={styles.statIcon}>⭐</div>
          <div style={styles.statContent}>
            <div style={styles.statValue}>
              {data.length > 0 
                ? Math.round(data.reduce((sum, d) => sum + parseFloat(d.avg_score), 0) / data.length)
                : 0}%
            </div>
            <div style={styles.statLabel}>Average Score</div>
          </div>
        </div>
      </div>

      {/* 3D Cards Grid */}
      {data.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📊</div>
          <h3 style={styles.emptyTitle}>No Analytics Data Yet</h3>
          <p style={styles.emptyText}>Start by having students attempt some tests!</p>
        </div>
      ) : (
        <div style={styles.cardsGrid}>
          {data.map((d, i) => {
            const avgScore = parseFloat(d.avg_score);
            return (
              <div
                key={i}
                style={{
                  ...styles.analyticsCard,
                  animationDelay: `${i * 0.1}s`,
                  transform: hoveredCard === i ? 'perspective(1000px) translateZ(20px) rotateX(5deg)' : 'perspective(1000px) translateZ(0) rotateX(0deg)',
                }}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Card Header */}
                <div style={styles.cardHeader}>
                  <div style={styles.cardNumber}>#{i + 1}</div>
                  <div style={{
                    ...styles.scoreCircle,
                    background: `conic-gradient(${getScoreColor(avgScore)} ${avgScore * 3.6}deg, #e0e0e0 0deg)`
                  }}>
                    <div style={styles.scoreInner}>
                      <span style={styles.scoreValue}>{avgScore.toFixed(0)}</span>
                      <span style={styles.scorePercent}>%</span>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div style={styles.cardContent}>
                  <div style={styles.subjectBadge}>
                    <span style={styles.subjectIcon}>📚</span>
                    {d.subject}
                  </div>
                  <h3 style={styles.chapterName}>{d.chapter}</h3>
                </div>

                {/* Card Footer */}
                <div style={styles.cardFooter}>
                  <div style={styles.footerItem}>
                    <span style={styles.footerIcon}>🎯</span>
                    <div style={styles.footerContent}>
                      <div style={styles.footerValue}>{d.attempts}</div>
                      <div style={styles.footerLabel}>Attempts</div>
                    </div>
                  </div>
                  <div style={styles.footerDivider}></div>
                  <div style={styles.footerItem}>
                    <span style={styles.footerIcon}>⭐</span>
                    <div style={styles.footerContent}>
                      <div style={styles.footerValue}>{avgScore.toFixed(1)}</div>
                      <div style={styles.footerLabel}>Avg Score</div>
                    </div>
                  </div>
                </div>

                {/* 3D Gloss Effect */}
                <div style={styles.cardGloss}></div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Analytics;