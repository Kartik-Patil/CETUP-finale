import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import PageContainer from "../../components/PageContainer";
import { useTheme } from "../../context/ThemeContext";

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { colors } = useTheme();

  const fetchSubjects = async () => {
    try {
      const res = await api.get("/subjects");
      setSubjects(res.data);
    } catch (err) {
      console.error("Error fetching subjects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const addSubject = async () => {
    if (!name.trim()) return;
    try {
      await api.post("/subjects", { name });
      setName("");
      fetchSubjects();
    } catch (err) {
      console.error("Error adding subject:", err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addSubject();
    }
  };

  // Theme-aware styles
  const styles = {
    formCard: {
      backgroundColor: colors.card,
      borderRadius: '20px',
      padding: '30px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
      marginBottom: '30px',
      animation: 'popIn3d 0.6s ease-out',
    },
    formHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '20px',
    },
    formIcon: {
      fontSize: '28px',
      animation: 'bounce3d 2s ease-in-out infinite',
    },
    formTitle: {
      fontSize: '22px',
      fontWeight: '800',
      color: colors.text,
      margin: 0,
    },
    formInputGroup: {
      display: 'flex',
      gap: '15px',
      flexWrap: 'wrap',
    },
    input: {
      flex: 1,
      minWidth: '250px',
      padding: '16px 24px',
      fontSize: '16px',
      border: `2px solid ${colors.border}`,
      borderRadius: '14px',
      outline: 'none',
      transition: 'all 0.3s ease',
      fontFamily: 'inherit',
      backgroundColor: colors.card,
      color: colors.text,
    },
    addButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '16px 32px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      border: 'none',
      borderRadius: '14px',
      fontSize: '16px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
    },
    addButtonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    addButtonIcon: {
      fontSize: '20px',
      animation: 'bounce3d 2s ease-in-out infinite',
    },
    listCard: {
      backgroundColor: colors.card,
      borderRadius: '20px',
      padding: '30px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
      animation: 'zoomIn3d 0.8s ease-out',
    },
    listHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '30px',
    },
    listIcon: {
      fontSize: '28px',
      animation: 'float3d 2s ease-in-out infinite',
    },
    listTitle: {
      fontSize: '24px',
      fontWeight: '800',
      color: colors.text,
      margin: 0,
      flex: 1,
    },
    countBadge: {
      padding: '8px 20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      borderRadius: '20px',
      fontSize: '16px',
      fontWeight: '800',
      animation: 'pulse3d 2s ease-in-out infinite',
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
    },
    cubeLoader: {
      width: '80px',
      height: '80px',
      position: 'relative',
      transformStyle: 'preserve-3d',
      animation: 'cubeRotate 3s infinite linear',
    },
    cubeFace1: { position: 'absolute', width: '80px', height: '80px', background: '#667eea', transform: 'rotateY(0deg) translateZ(40px)' },
    cubeFace2: { position: 'absolute', width: '80px', height: '80px', background: '#f093fb', transform: 'rotateY(90deg) translateZ(40px)' },
    cubeFace3: { position: 'absolute', width: '80px', height: '80px', background: '#4facfe', transform: 'rotateY(180deg) translateZ(40px)' },
    cubeFace4: { position: 'absolute', width: '80px', height: '80px', background: '#fa709a', transform: 'rotateY(-90deg) translateZ(40px)' },
    cubeFace5: { position: 'absolute', width: '80px', height: '80px', background: '#a8edea', transform: 'rotateX(90deg) translateZ(40px)' },
    cubeFace6: { position: 'absolute', width: '80px', height: '80px', background: '#fbc2eb', transform: 'rotateX(-90deg) translateZ(40px)' },
    loadingText: {
      marginTop: '30px',
      fontSize: '18px',
      fontWeight: '600',
      color: colors.textSecondary,
      animation: 'float3d 2s ease-in-out infinite',
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
    subjectsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '24px',
    },
    subjectCard: {
      padding: '28px',
      backgroundColor: colors.backgroundSecondary,
      borderRadius: '18px',
      border: `2px solid ${colors.border}`,
      transition: 'all 0.4s ease',
      cursor: 'pointer',
      animation: 'popIn3d 0.6s ease-out forwards',
      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
    },
    subjectHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      marginBottom: '20px',
    },
    subjectEmoji: {
      fontSize: '36px',
      animation: 'float3d 2s ease-in-out infinite',
    },
    subjectName: {
      fontSize: '20px',
      fontWeight: '800',
      color: colors.text,
      margin: 0,
    },
    manageButton: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      padding: '14px 24px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      border: 'none',
      borderRadius: '12px',
      fontSize: '15px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
    },
    manageIcon: {
      fontSize: '18px',
    },
  };

  return (
    <Navbar>
      <PageContainer
        title="Subjects Management"
        subtitle="Create and manage subjects"
        actions={
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              backgroundColor: colors.card,
              border: `2px solid ${colors.border}`,
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: '600',
              color: colors.text,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = colors.hover;
              e.target.style.borderColor = '#2196f3';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = colors.card;
              e.target.style.borderColor = colors.border;
            }}
          >
            <span style={{ fontSize: '18px' }}>←</span>
            Back
          </button>
        }
      >
        {/* Add Subject Form */}
        <div style={styles.formCard}>
          <div style={styles.formHeader}>
            <span style={styles.formIcon}>➕</span>
            <h3 style={styles.formTitle}>Add New Subject</h3>
          </div>
          <div style={styles.formInputGroup}>
            <input
              type="text"
              value={name}
              placeholder="Enter subject name..."
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              style={styles.input}
            />
            <button
              onClick={addSubject}
              disabled={!name.trim()}
              style={{
                ...styles.addButton,
                ...(!name.trim() && styles.addButtonDisabled)
              }}
            >
              <span style={styles.addButtonIcon}>+</span>
              Add Subject
            </button>
          </div>
        </div>

        {/* Subjects List */}
        <div style={styles.listCard}>
          <div style={styles.listHeader}>
            <span style={styles.listIcon}>📚</span>
            <h3 style={styles.listTitle}>All Subjects</h3>
            <span style={styles.countBadge}>{subjects.length}</span>
          </div>
          
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
              <div style={styles.loadingText}>Loading subjects...</div>
            </div>
          ) : subjects.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📚</div>
              <div style={styles.emptyText}>No subjects yet. Add your first subject above.</div>
            </div>
          ) : (
            <div style={styles.subjectsGrid}>
              {subjects.map((subject, idx) => (
                <div
                  key={subject.id}
                  style={{...styles.subjectCard, animationDelay: `${idx * 0.1}s`}}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'perspective(1000px) translateZ(20px) rotateX(5deg)';
                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'perspective(1000px) translateZ(0px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
                  }}
                >
                  <div style={styles.subjectHeader}>
                    <span style={styles.subjectEmoji}>📖</span>
                    <h4 style={styles.subjectName}>{subject.name}</h4>
                  </div>
                  <button
                    onClick={() => navigate(`/admin/subjects/${subject.id}/chapters`)}
                    style={styles.manageButton}
                  >
                    <span style={styles.manageIcon}>📑</span>
                    Manage Chapters
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </PageContainer>
    </Navbar>
  );
};

export default Subjects;