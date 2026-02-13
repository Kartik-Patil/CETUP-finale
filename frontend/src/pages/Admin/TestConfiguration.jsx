import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

const TestConfiguration = () => {
  const navigate = useNavigate();
  const { chapterId } = useParams();
  const [chapter, setChapter] = useState(null);
  const [config, setConfig] = useState({
    time_limit: null,
    passing_percentage: 50,
    is_active: true,
    randomize_questions: false,
    randomize_options: false,
    questions_per_test: null,
  });
  const [loading, setLoading] = useState(true);

  const fetchTestConfig = useCallback(async () => {
    try {
      const res = await api.get(`/chapters/${chapterId}/test-config`);
      if (res.data.chapter) {
        setChapter(res.data.chapter);
        const configData = {
          time_limit: res.data.time_limit,
          passing_percentage: res.data.passing_percentage || 50,
          is_active: res.data.is_active !== false,
          randomize_questions: res.data.randomize_questions || false,
          randomize_options: res.data.randomize_options || false,
          questions_per_test: res.data.questions_per_test,
        };
        setConfig(configData);
      }
    } catch (err) {
      console.error("Error fetching test config:", err);
      alert("Failed to fetch test configuration");
    } finally {
      setLoading(false);
    }
  }, [chapterId]);

  useEffect(() => {
    fetchTestConfig();
  }, [fetchTestConfig]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/chapters/${chapterId}/test-config`, config);
      alert("Test configuration updated successfully!");
    } catch (err) {
      console.error("Error updating test config:", err);
      alert("Failed to update test configuration");
    }
  };

  const handleChange = (field, value) => {
    setConfig({ ...config, [field]: value });
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading configuration...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button onClick={() => navigate(-1)} style={styles.backButton}>
            <span style={styles.backIcon}>←</span>
            Back
          </button>
          <h1 style={styles.title}>Test Configuration</h1>
        </div>
      </div>

      {/* Chapter Info Card */}
      {chapter && (
        <div style={styles.chapterCard}>
          <div style={styles.chapterIcon}>📖</div>
          <div style={styles.chapterInfo}>
            <h2 style={styles.chapterName}>{chapter.chapter_name}</h2>
            <p style={styles.subjectName}>Subject: {chapter.subject_name}</p>
          </div>
        </div>
      )}

      {/* Configuration Form */}
      <form onSubmit={handleSubmit} style={styles.formCard}>
        <div style={styles.formHeader}>
          <span style={styles.formIcon}>⚙️</span>
          <h3 style={styles.formTitle}>Test Settings</h3>
        </div>

        <div style={styles.formGrid}>
          {/* Time Limit */}
          <div style={styles.formSection}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionIcon}>⏱️</span>
              <h4 style={styles.sectionTitle}>Time Management</h4>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Time Limit (minutes)
              </label>
              <input
                type="number"
                min="0"
                value={config.time_limit || ""}
                onChange={(e) => handleChange("time_limit", e.target.value ? parseInt(e.target.value) : null)}
                placeholder="No time limit"
                style={styles.input}
              />
              <span style={styles.hint}>
                Leave empty for unlimited time
              </span>
            </div>
          </div>

          {/* Passing Percentage */}
          <div style={styles.formSection}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionIcon}>🎯</span>
              <h4 style={styles.sectionTitle}>Passing Criteria</h4>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Passing Percentage (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={config.passing_percentage}
                onChange={(e) => handleChange("passing_percentage", parseInt(e.target.value))}
                required
                style={styles.input}
              />
              <div style={styles.percentageDisplay}>
                <div style={styles.percentageBar}>
                  <div 
                    style={{
                      ...styles.percentageFill,
                      width: `${config.passing_percentage}%`,
                    }}
                  ></div>
                </div>
                <span style={styles.percentageText}>{config.passing_percentage}%</span>
              </div>
              <span style={styles.hint}>
                Minimum score required to pass
              </span>
            </div>
          </div>

          {/* Questions Per Test */}
          <div style={styles.formSection}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionIcon}>📝</span>
              <h4 style={styles.sectionTitle}>Question Count</h4>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Questions Per Test
              </label>
              <input
                type="number"
                min="1"
                value={config.questions_per_test || ""}
                onChange={(e) => handleChange("questions_per_test", e.target.value ? parseInt(e.target.value) : null)}
                placeholder="All questions"
                style={styles.input}
              />
              <span style={styles.hint}>
                Leave empty to include all questions
              </span>
            </div>
          </div>

          {/* Toggle Options */}
          <div style={styles.formSection}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionIcon}>🎲</span>
              <h4 style={styles.sectionTitle}>Randomization & Status</h4>
            </div>
            
            <div style={styles.toggleGroup}>
              <label style={styles.toggleCard}>
                <div style={styles.toggleContent}>
                  <div style={styles.toggleIcon}>
                    {config.is_active ? '✓' : '✗'}
                  </div>
                  <div style={styles.toggleText}>
                    <div style={styles.toggleTitle}>Chapter Active</div>
                    <div style={styles.toggleDesc}>
                      {config.is_active 
                        ? 'Students can access this chapter'
                        : 'Chapter is hidden from students'}
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.is_active}
                  onChange={(e) => handleChange("is_active", e.target.checked)}
                  style={styles.toggleInput}
                />
                <div style={{
                  ...styles.toggleSwitch,
                  backgroundColor: config.is_active ? '#4CAF50' : '#ccc'
                }}>
                  <div style={{
                    ...styles.toggleKnob,
                    transform: config.is_active ? 'translateX(24px)' : 'translateX(0)',
                  }}></div>
                </div>
              </label>

              <label style={styles.toggleCard}>
                <div style={styles.toggleContent}>
                  <div style={styles.toggleIcon}>🔀</div>
                  <div style={styles.toggleText}>
                    <div style={styles.toggleTitle}>Randomize Questions</div>
                    <div style={styles.toggleDesc}>
                      Questions appear in random order
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.randomize_questions}
                  onChange={(e) => handleChange("randomize_questions", e.target.checked)}
                  style={styles.toggleInput}
                />
                <div style={{
                  ...styles.toggleSwitch,
                  backgroundColor: config.randomize_questions ? '#2196f3' : '#ccc'
                }}>
                  <div style={{
                    ...styles.toggleKnob,
                    transform: config.randomize_questions ? 'translateX(24px)' : 'translateX(0)',
                  }}></div>
                </div>
              </label>

              <label style={styles.toggleCard}>
                <div style={styles.toggleContent}>
                  <div style={styles.toggleIcon}>🎯</div>
                  <div style={styles.toggleText}>
                    <div style={styles.toggleTitle}>Randomize Options</div>
                    <div style={styles.toggleDesc}>
                      Answer options appear in random order
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.randomize_options}
                  onChange={(e) => handleChange("randomize_options", e.target.checked)}
                  style={styles.toggleInput}
                />
                <div style={{
                  ...styles.toggleSwitch,
                  backgroundColor: config.randomize_options ? '#2196f3' : '#ccc'
                }}>
                  <div style={{
                    ...styles.toggleKnob,
                    transform: config.randomize_options ? 'translateX(24px)' : 'translateX(0)',
                  }}></div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={styles.actionButtons}>
          <button
            type="submit"
            style={styles.saveButton}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <span style={styles.buttonIcon}>💾</span>
            Save Configuration
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={styles.cancelButton}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#555'}
            onMouseLeave={(e) => e.target.style.backgroundColor = styles.cancelButton.backgroundColor}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    maxWidth: '1400px',
    margin: '0 auto',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid #f3f3f3',
    borderTop: '5px solid #2196f3',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '20px',
    fontSize: '18px',
    color: '#666',
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
    backgroundColor: '#fff',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    color: '#333',
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
    color: '#1a1a1a',
    margin: 0,
  },
  chapterCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '25px',
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    marginBottom: '30px',
    border: '2px solid #e3f2fd',
  },
  chapterIcon: {
    fontSize: '48px',
    width: '70px',
    height: '70px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e3f2fd',
    borderRadius: '12px',
  },
  chapterInfo: {
    flex: 1,
  },
  chapterName: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1a1a1a',
    margin: '0 0 8px 0',
  },
  subjectName: {
    fontSize: '16px',
    color: '#666',
    margin: 0,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '30px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  formHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '3px solid #f0f0f0',
  },
  formIcon: {
    fontSize: '32px',
  },
  formTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1a1a1a',
    margin: 0,
  },
  formGrid: {
    display: 'grid',
    gap: '30px',
  },
  formSection: {
    padding: '25px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    border: '1px solid #e0e0e0',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  sectionIcon: {
    fontSize: '24px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#333',
    margin: 0,
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  input: {
    padding: '14px 16px',
    fontSize: '16px',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    backgroundColor: '#fff',
    transition: 'all 0.3s ease',
    outline: 'none',
  },
  hint: {
    fontSize: '13px',
    color: '#666',
    fontStyle: 'italic',
  },
  percentageDisplay: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginTop: '5px',
  },
  percentageBar: {
    flex: 1,
    height: '12px',
    backgroundColor: '#e0e0e0',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  percentageFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    transition: 'width 0.3s ease',
  },
  percentageText: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#4CAF50',
    minWidth: '50px',
  },
  toggleGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  toggleCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    border: '2px solid #e0e0e0',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  toggleContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    flex: 1,
  },
  toggleIcon: {
    fontSize: '32px',
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: '10px',
  },
  toggleText: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '4px',
  },
  toggleDesc: {
    fontSize: '13px',
    color: '#666',
  },
  toggleInput: {
    display: 'none',
  },
  toggleSwitch: {
    position: 'relative',
    width: '52px',
    height: '28px',
    borderRadius: '14px',
    transition: 'background-color 0.3s ease',
  },
  toggleKnob: {
    position: 'absolute',
    top: '2px',
    left: '2px',
    width: '24px',
    height: '24px',
    backgroundColor: '#fff',
    borderRadius: '50%',
    transition: 'transform 0.3s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
  actionButtons: {
    display: 'flex',
    gap: '15px',
    marginTop: '30px',
    paddingTop: '30px',
    borderTop: '2px solid #f0f0f0',
  },
  saveButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '18px',
    backgroundColor: '#4CAF50',
    border: 'none',
    borderRadius: '12px',
    fontSize: '18px',
    fontWeight: '700',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 8px rgba(76, 175, 80, 0.3)',
  },
  cancelButton: {
    flex: 1,
    padding: '18px',
    backgroundColor: '#666',
    border: 'none',
    borderRadius: '12px',
    fontSize: '18px',
    fontWeight: '600',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  buttonIcon: {
    fontSize: '20px',
  },
};

export default TestConfiguration;
