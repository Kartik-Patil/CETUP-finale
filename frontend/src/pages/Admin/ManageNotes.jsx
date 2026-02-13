import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useTheme } from "../../context/ThemeContext";

const ManageNotes = () => {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [chapterInfo, setChapterInfo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [googleDriveLink, setGoogleDriveLink] = useState("");

  const fetchChapterInfo = useCallback(async () => {
    try {
      const res = await api.get(`/chapters/${chapterId}`);
      const chaptersRes = await api.get(`/notes/chapters/${chapterId}/check`);
      setChapterInfo({ ...res.data, ...chaptersRes.data });
    } catch (err) {
      console.error("Error fetching chapter info:", err.message);
      if (err.code === 'ERR_NETWORK') {
        alert('Cannot connect to backend server. Please ensure it is running on port 5000.');
      }
    }
  }, [chapterId]);

  useEffect(() => {
    fetchChapterInfo();
  }, [fetchChapterInfo]);

  const handleGoogleDriveLinkSave = async () => {
    if (!googleDriveLink.trim()) {
      alert("Please enter a Google Drive link");
      return;
    }

    // Basic validation
    if (!googleDriveLink.includes("drive.google.com")) {
      alert("Please enter a valid Google Drive link");
      return;
    }

    setUploading(true);
    try {
      await api.post(`/notes/chapters/${chapterId}/google-drive-link`, {
        googleDriveLink: googleDriveLink
      });

      alert("🔗 Google Drive link saved successfully!\n\nStudents can now view this PDF without seeing the link.");
      setGoogleDriveLink("");
      fetchChapterInfo();
    } catch (err) {
      console.error("Error saving Google Drive link:", err.message);
      alert(err.response?.data?.message || "Failed to save Google Drive link");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this PDF?")) return;

    try {
      await api.delete(`/notes/chapters/${chapterId}/pdf`);
      alert("PDF deleted successfully!");
      fetchChapterInfo();
    } catch (err) {
      console.error("Error deleting PDF:", err.message);
      alert("Failed to delete PDF");
    }
  };

  const handleViewPDF = async () => {
    try {
      // For Google Drive PDFs, open with token in URL (backend will redirect)
      const token = localStorage.getItem("token");
      const viewUrl = `${api.defaults.baseURL}/notes/chapters/${chapterId}/view?token=${token}`;
      window.open(viewUrl, '_blank');
    } catch (err) {
      console.error("Error viewing PDF:", err.message);
      alert("Failed to load PDF preview");
    }
  };

  // Generate theme-aware styles
  const styles = {
    container: {
      padding: '30px',
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: colors.background,
      minHeight: '100vh',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
    },
    backButton: {
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
    },
    backIcon: {
      fontSize: '18px',
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      color: colors.text,
      margin: 0,
    },
    mainCard: {
      backgroundColor: colors.card,
      borderRadius: '16px',
      boxShadow: colors.theme === 'dark' ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)',
      overflow: 'hidden',
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      padding: '30px',
      backgroundColor: colors.theme === 'dark' ? colors.backgroundSecondary : 'transparent',
      borderBottom: `1px solid ${colors.border}`,
    },
    iconContainer: {
      width: '60px',
      height: '60px',
      backgroundColor: colors.card,
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    icon: {
      fontSize: '32px',
    },
    cardTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: colors.text,
      margin: '0 0 5px 0',
    },
    cardSubtitle: {
      fontSize: '14px',
      color: colors.textSecondary,
      margin: 0,
    },
    pdfExistsContainer: {
      padding: '30px',
    },
    successBanner: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      padding: '25px',
      backgroundColor: colors.success,
      borderRadius: '12px',
      border: `2px solid ${colors.successText}`,
      marginBottom: '25px',
    },
    successIcon: {
      width: '50px',
      height: '50px',
      backgroundColor: colors.successText,
      color: 'white',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '28px',
      fontWeight: 'bold',
      flexShrink: 0,
    },
    successContent: {
      flex: 1,
    },
    successTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: colors.successText,
      marginBottom: '8px',
    },
    fileName: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '15px',
      color: colors.successText,
      fontWeight: '500',
    },
    fileIcon: {
      fontSize: '18px',
    },
    actionButtons: {
      display: 'flex',
      gap: '15px',
      marginBottom: '25px',
    },
    previewButton: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      padding: '16px',
      backgroundColor: colors.primary,
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      color: 'white',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: `0 4px 6px ${colors.theme === 'dark' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(33, 150, 243, 0.3)'}`,
    },
    previewButtonHover: {
      backgroundColor: colors.primaryDark,
    },
    deleteButton: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      padding: '16px',
      backgroundColor: colors.dangerText,
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      color: 'white',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: `0 4px 6px ${colors.theme === 'dark' ? 'rgba(248, 113, 113, 0.3)' : 'rgba(255, 82, 82, 0.3)'}`,
    },
    deleteButtonHover: {
      backgroundColor: colors.theme === 'dark' ? '#dc2626' : '#e53935',
    },
    buttonIcon: {
      fontSize: '20px',
    },
    infoBox: {
      backgroundColor: colors.info,
      padding: '20px',
      borderRadius: '12px',
      border: `1px solid ${colors.infoText}`,
    },
    infoTitle: {
      fontSize: '16px',
      fontWeight: '700',
      color: colors.infoText,
      marginBottom: '12px',
    },
    infoList: {
      margin: '0',
      paddingLeft: '20px',
      color: colors.textSecondary,
    },
    uploadContainer: {
      padding: '30px',
    },
    uploadButton: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      padding: '18px',
      backgroundColor: colors.successText,
      border: 'none',
      borderRadius: '12px',
      fontSize: '18px',
      fontWeight: '700',
      color: 'white',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: `0 4px 8px ${colors.theme === 'dark' ? 'rgba(52, 211, 153, 0.3)' : 'rgba(76, 175, 80, 0.3)'}`,
    },
    uploadButtonDisabled: {
      backgroundColor: colors.textMuted,
      cursor: 'not-allowed',
      boxShadow: 'none',
    },
    spinner: {
      fontSize: '20px',
      animation: 'spin 1s linear infinite',
    },
    securityPanel: {
      margin: '0 30px 30px 30px',
      padding: '25px',
      backgroundColor: colors.warning,
      borderRadius: '12px',
      border: `2px solid ${colors.warningText}`,
    },
    securityHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '20px',
    },
    securityIcon: {
      fontSize: '24px',
    },
    securityTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: colors.warningText,
    },
    securityGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px',
    },
    securityItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '15px',
      backgroundColor: colors.theme === 'dark' ? colors.backgroundSecondary : '#fffde7',
      borderRadius: '8px',
    },
    securityItemIcon: {
      fontSize: '28px',
    },
    securityItemText: {
      flex: 1,
    },
    securityItemTitle: {
      fontSize: '14px',
      fontWeight: '700',
      color: colors.warningText,
      marginBottom: '2px',
    },
    securityItemDesc: {
      fontSize: '12px',
      color: colors.textSecondary,
    },
    linkInputContainer: {
      display: 'flex',
      gap: '20px',
      padding: '25px',
      backgroundColor: colors.backgroundTertiary,
      borderRadius: '12px',
      border: `2px dashed ${colors.border}`,
      marginBottom: '20px',
    },
    linkIcon: {
      fontSize: '40px',
    },
    linkInputWrapper: {
      flex: 1,
    },
    linkLabel: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: colors.text,
      marginBottom: '10px',
    },
    linkInput: {
      width: '100%',
      padding: '12px 16px',
      fontSize: '14px',
      border: `2px solid ${colors.border}`,
      borderRadius: '8px',
      outline: 'none',
      transition: 'border-color 0.3s ease',
      backgroundColor: colors.card,
      color: colors.text,
    },
    linkHint: {
      marginTop: '12px',
      fontSize: '13px',
      color: colors.textSecondary,
      lineHeight: '1.6',
    },
    linkSteps: {
      marginTop: '8px',
      marginLeft: '20px',
      paddingLeft: '0',
      color: colors.textSecondary,
    },
    benefitsBox: {
      padding: '20px',
      backgroundColor: colors.success,
      borderRadius: '12px',
      border: `1px solid ${colors.successText}`,
      marginTop: '20px',
    },
    benefitsTitle: {
      fontSize: '15px',
      fontWeight: '700',
      color: colors.successText,
      marginBottom: '12px',
    },
    benefitsList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      color: colors.textSecondary,
    },
    uploadInfo: {
      marginTop: '20px',
      padding: '15px',
      backgroundColor: colors.backgroundTertiary,
      borderRadius: '8px',
      border: `1px solid ${colors.border}`,
    },
    uploadInfoTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: colors.text,
      marginBottom: '8px',
    },
    uploadInfoText: {
      fontSize: '13px',
      color: colors.textSecondary,
      margin: 0,
    },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button onClick={() => navigate(-1)} style={styles.backButton}>
            <span style={styles.backIcon}>←</span>
            Back
          </button>
          <h1 style={styles.title}>Manage PDF Notes</h1>
        </div>
      </div>

      {/* Main Content Card */}
      <div style={styles.mainCard}>
        <div style={styles.cardHeader}>
          <div style={styles.iconContainer}>
            <span style={styles.icon}>📚</span>
          </div>
          <div>
            <h2 style={styles.cardTitle}>Chapter PDF Notes</h2>
            <p style={styles.cardSubtitle}>
              Link Google Drive PDFs for students to view online
            </p>
          </div>
        </div>

        {chapterInfo?.hasPDF ? (
          /* PDF Exists - Show Preview & Actions */
          <div style={styles.pdfExistsContainer}>
            <div style={styles.successBanner}>
              <div style={styles.successIcon}>✓</div>
              <div style={styles.successContent}>
                <div style={styles.successTitle}>Google Drive PDF Linked</div>
                <div style={styles.fileName}>
                  <span style={styles.fileIcon}>🔗</span>
                  Google Drive PDF
                </div>
                {/* Storage Type Badge */}
                <div style={{
                  display: 'inline-block',
                  marginTop: '8px',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  backgroundColor: '#dbeafe',
                  color: '#1e40af',
                  border: '1px solid #93c5fd'
                }}>
                  🔗 Google Drive
                </div>
              </div>
            </div>

            <div style={styles.actionButtons}>
              <button 
                onClick={handleViewPDF}
                style={styles.previewButton}
                onMouseEnter={(e) => e.target.style.backgroundColor = styles.previewButtonHover.backgroundColor}
                onMouseLeave={(e) => e.target.style.backgroundColor = styles.previewButton.backgroundColor}
              >
                <span style={styles.buttonIcon}>👁️</span>
                Preview PDF
              </button>
              <button 
                onClick={handleDelete}
                style={styles.deleteButton}
                onMouseEnter={(e) => e.target.style.backgroundColor = styles.deleteButtonHover.backgroundColor}
                onMouseLeave={(e) => e.target.style.backgroundColor = styles.deleteButton.backgroundColor}
              >
                <span style={styles.buttonIcon}>🗑️</span>
                Delete PDF
              </button>
            </div>

            <div style={styles.infoBox}>
              <div style={styles.infoTitle}>ℹ️ PDF Information</div>
              <ul style={styles.infoList}>
                <li>Students can view this PDF online via Google Drive</li>
                <li>Direct link is hidden from students</li>
                <li>Fast loading via Google CDN</li>
                <li>Free unlimited storage</li>
              </ul>
            </div>
          </div>
        ) : (
          /* No PDF - Show Google Drive Link UI */
          <div style={styles.uploadContainer}>
            <div style={styles.linkInputContainer}>
              <div style={styles.linkIcon}>🔗</div>
              <div style={styles.linkInputWrapper}>
                <label style={styles.linkLabel}>
                  Google Drive Share Link
                </label>
                <input
                  type="text"
                  value={googleDriveLink}
                  onChange={(e) => setGoogleDriveLink(e.target.value)}
                  placeholder="https://drive.google.com/file/d/..."
                  style={styles.linkInput}
                />
                <div style={styles.linkHint}>
                  📌 How to get link:
                  <ol style={styles.linkSteps}>
                    <li>Upload PDF to Google Drive</li>
                    <li>Right-click → Share → Anyone with the link</li>
                    <li>Copy link and paste above</li>
                  </ol>
                </div>
              </div>
            </div>

            <button
              onClick={handleGoogleDriveLinkSave}
              disabled={!googleDriveLink.trim() || uploading}
              style={{
                ...styles.uploadButton,
                ...((!googleDriveLink.trim() || uploading) ? styles.uploadButtonDisabled : {})
              }}
            >
              {uploading ? (
                <>
                  <span style={styles.spinner}>⌛</span>
                  Saving...
                </>
              ) : (
                <>
                  <span style={styles.buttonIcon}>✓</span>
                  Save Google Drive Link
                </>
              )}
            </button>

            <div style={styles.benefitsBox}>
              <div style={styles.benefitsTitle}>✨ Benefits of Google Drive:</div>
              <ul style={styles.benefitsList}>
                <li>✅ Free unlimited storage</li>
                <li>✅ No upload restrictions</li>
                <li>✅ Fast Google CDN</li>
                <li>✅ Link hidden from students</li>
              </ul>
            </div>

            <div style={styles.uploadInfo}>
              <div style={styles.uploadInfoTitle}>📋 Note</div>
              <p style={styles.uploadInfoText}>
                Students will NOT see the Google Drive link - they'll just see 'View Notes' button.
              </p>
            </div>
          </div>
        )}

        {/* Security Info Panel */}
        <div style={styles.securityPanel}>
          <div style={styles.securityHeader}>
            <span style={styles.securityIcon}>🔒</span>
            <span style={styles.securityTitle}>Google Drive Features</span>
          </div>
          <div style={styles.securityGrid}>
            <div style={styles.securityItem}>
              <div style={styles.securityItemIcon}>🔗</div>
              <div style={styles.securityItemText}>
                <div style={styles.securityItemTitle}>Hidden Links</div>
                <div style={styles.securityItemDesc}>Students can't see URL</div>
              </div>
            </div>
            <div style={styles.securityItem}>
              <div style={styles.securityItemIcon}>☁️</div>
              <div style={styles.securityItemText}>
                <div style={styles.securityItemTitle}>Free Storage</div>
                <div style={styles.securityItemDesc}>Unlimited Google Drive</div>
              </div>
            </div>
            <div style={styles.securityItem}>
              <div style={styles.securityItemIcon}>⚡</div>
              <div style={styles.securityItemText}>
                <div style={styles.securityItemTitle}>Fast CDN</div>
                <div style={styles.securityItemDesc}>Google's global network</div>
              </div>
            </div>
            <div style={styles.securityItem}>
              <div style={styles.securityItemIcon}>👥</div>
              <div style={styles.securityItemText}>
                <div style={styles.securityItemTitle}>Easy Access</div>
                <div style={styles.securityItemDesc}>Browser viewing only</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageNotes;
