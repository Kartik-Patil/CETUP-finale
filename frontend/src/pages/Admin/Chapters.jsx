import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Navbar from "../../components/Navbar";
import PageContainer from "../../components/PageContainer";
import { useTheme } from "../../context/ThemeContext";

const Chapters = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const [chapters, setChapters] = useState([]);
  const [subjectName, setSubjectName] = useState("");
  const [chapterName, setChapterName] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const { colors } = useTheme();

  const fetchChapters = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/chapters/${subjectId}`);
      setChapters(res.data);
      
      // Get subject name from first chapter or fetch separately
      if (res.data.length > 0) {
        const subjectRes = await api.get(`/subjects`);
        const subject = subjectRes.data.find(s => s.id === parseInt(subjectId));
        if (subject) {
          setSubjectName(subject.name);
        }
      }
    } catch (err) {
      console.error("Error fetching chapters:", err);
    } finally {
      setLoading(false);
    }
  }, [subjectId]);

  useEffect(() => {
    fetchChapters();
  }, [fetchChapters]);

  const addChapter = async () => {
    if (!chapterName.trim()) return;

    try {
      setAdding(true);
      await api.post("/chapters", {
        subject_id: subjectId,
        name: chapterName,
      });

      setChapterName("");
      fetchChapters();
    } catch (err) {
      console.error("Error adding chapter:", err);
      alert("Failed to add chapter");
    } finally {
      setAdding(false);
    }
  };

  const deleteChapter = async (id) => {
    if (!window.confirm("Delete this chapter? This will also delete all MCQs and student attempts.")) return;

    try {
      await api.delete(`/chapters/${id}`);
      fetchChapters();
    } catch (err) {
      console.error("Error deleting chapter:", err);
      alert("Failed to delete chapter");
    }
  };

  const styles = {
    backButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px 24px',
      backgroundColor: colors.card,
      color: colors.text,
      border: `2px solid ${colors.border}`,
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    },
    backIcon: {
      fontSize: '20px',
      animation: 'float3d 2s ease-in-out infinite',
    },
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
    addIcon: {
      fontSize: '20px',
      animation: 'bounce3d 2s ease-in-out infinite',
    },
    loadingSpinner: {
      width: '16px',
      height: '16px',
      border: '2px solid rgba(255,255,255,0.3)',
      borderTop: '2px solid #fff',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 20px',
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
      backgroundColor: colors.card,
      padding: '80px 40px',
      borderRadius: '20px',
      border: `2px dashed ${colors.border}`,
      textAlign: 'center',
      animation: 'float3d 3s ease-in-out infinite',
    },
    emptyIcon: {
      fontSize: '72px',
      marginBottom: '20px',
      animation: 'wiggle3d 2s ease-in-out infinite',
    },
    emptyTitle: {
      fontSize: '24px',
      fontWeight: '800',
      color: colors.text,
      marginBottom: '10px',
    },
    emptyText: {
      fontSize: '16px',
      color: colors.textSecondary,
      fontWeight: '500',
    },
    chaptersList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    chapterCard: {
      backgroundColor: colors.card,
      padding: '30px',
      borderRadius: '20px',
      border: `2px solid ${colors.border}`,
      transition: 'all 0.4s ease',
      animation: 'popIn3d 0.6s ease-out forwards',
      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
    },
    chapterHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '24px',
      flexWrap: 'wrap',
      gap: '15px',
    },
    chapterTitleSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      flex: 1,
    },
    chapterIcon: {
      fontSize: '32px',
      animation: 'float3d 2s ease-in-out infinite',
    },
    chapterTitle: {
      fontSize: '22px',
      fontWeight: '800',
      color: colors.text,
      margin: 0,
    },
    pdfBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      backgroundColor: '#4caf50',
      color: '#fff',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: '700',
      animation: 'pulse3d 2s ease-in-out infinite',
    },
    pdfIcon: {
      fontSize: '16px',
    },
    actionsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '12px',
    },
    actionButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 20px',
      border: 'none',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      color: '#fff',
    },
    actionIcon: {
      fontSize: '16px',
    },
    actionButtonPrimary: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
    },
    actionButtonView: {
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      boxShadow: '0 4px 12px rgba(79, 172, 254, 0.3)',
    },
    actionButtonNotes: {
      background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      boxShadow: '0 4px 12px rgba(67, 233, 123, 0.3)',
    },
    actionButtonConfig: {
      background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      boxShadow: '0 4px 12px rgba(250, 112, 154, 0.3)',
    },
    actionButtonDelete: {
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      boxShadow: '0 4px 12px rgba(245, 87, 108, 0.3)',
    },
  };

  return (
    <Navbar>
      <PageContainer
        title="Chapters"
        subtitle={subjectName ? `Manage chapters for ${subjectName}` : "Manage chapters"}
        actions={
          <button
            onClick={() => navigate("/admin/subjects")}
            style={styles.backButton}
          >
            <span style={styles.backIcon}>←</span>
            Back to Subjects
          </button>
        }
      >
        {/* Add Chapter Form */}
        <div style={styles.formCard}>
          <div style={styles.formHeader}>
            <span style={styles.formIcon}>➕</span>
            <h3 style={styles.formTitle}>Add New Chapter</h3>
          </div>
          <div style={styles.formInputGroup}>
            <input
              type="text"
              placeholder="Enter chapter name..."
              value={chapterName}
              onChange={(e) => setChapterName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addChapter()}
              style={styles.input}
            />
            <button
              onClick={addChapter}
              disabled={adding || !chapterName.trim()}
              style={{
                ...styles.addButton,
                ...((adding || !chapterName.trim()) && styles.addButtonDisabled)
              }}
            >
              {adding ? (
                <>
                  <span style={styles.loadingSpinner}></span>
                  Adding...
                </>
              ) : (
                <>
                  <span style={styles.addIcon}>+</span>
                  Add Chapter
                </>
              )}
            </button>
          </div>
        </div>

        {/* Chapters List */}
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
            <div style={styles.loadingText}>Loading chapters...</div>
          </div>
        ) : chapters.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📖</div>
            <h3 style={styles.emptyTitle}>No Chapters Yet</h3>
            <p style={styles.emptyText}>Add your first chapter using the form above</p>
          </div>
        ) : (
          <div style={styles.chaptersList}>
            {chapters.map((chapter, idx) => (
              <div
                key={chapter.id}
                style={{...styles.chapterCard, animationDelay: `${idx * 0.1}s`}}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'perspective(1000px) translateZ(15px)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'perspective(1000px) translateZ(0px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
                }}
              >
                <div style={styles.chapterHeader}>
                  <div style={styles.chapterTitleSection}>
                    <span style={styles.chapterIcon}>📑</span>
                    <h3 style={styles.chapterTitle}>{chapter.name}</h3>
                  </div>
                  {chapter.notes_pdf && (
                    <span style={styles.pdfBadge}>
                      <span style={styles.pdfIcon}>📄</span>
                      PDF Available
                    </span>
                  )}
                </div>

                <div style={styles.actionsContainer}>
                  <button
                    onClick={() => navigate(`/admin/chapters/${chapter.id}/mcqs`)}
                    style={{...styles.actionButton, ...styles.actionButtonPrimary}}
                  >
                    <span style={styles.actionIcon}>➕</span>
                    Add MCQs
                  </button>
                  <button
                    onClick={() => navigate(`/admin/chapters/${chapter.id}/view-mcqs`)}
                    style={{...styles.actionButton, ...styles.actionButtonView}}
                  >
                    <span style={styles.actionIcon}>👁️</span>
                    View MCQs
                  </button>
                  <button
                    onClick={() => navigate(`/admin/chapters/${chapter.id}/notes`)}
                    style={{...styles.actionButton, ...styles.actionButtonNotes}}
                  >
                    <span style={styles.actionIcon}>📝</span>
                    Manage Notes
                  </button>
                  <button
                    onClick={() => navigate(`/admin/chapters/${chapter.id}/test-config`)}
                    style={{...styles.actionButton, ...styles.actionButtonConfig}}
                  >
                    <span style={styles.actionIcon}>⚙️</span>
                    Configure Test
                  </button>
                  <button
                    onClick={() => deleteChapter(chapter.id)}
                    style={{...styles.actionButton, ...styles.actionButtonDelete}}
                  >
                    <span style={styles.actionIcon}>🗑️</span>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </PageContainer>
    </Navbar>
  );
};

export default Chapters;