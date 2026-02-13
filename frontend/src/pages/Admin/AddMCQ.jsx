import { useState } from "react";
import api from "../../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import PageContainer from "../../components/PageContainer";
import { useTheme } from "../../context/ThemeContext";

const AddMCQ = () => {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [form, setForm] = useState({
    question: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_options: [],
    explanation: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleCorrectOptionToggle = (option) => {
    const currentOptions = [...form.correct_options];
    if (currentOptions.includes(option)) {
      setForm({ ...form, correct_options: currentOptions.filter(o => o !== option) });
    } else {
      setForm({ ...form, correct_options: [...currentOptions, option] });
    }
  };

  const handleSubmit = async () => {
    if (form.correct_options.length === 0) {
      alert("Please select at least one correct option");
      return;
    }
    try {
      setSubmitting(true);
      await api.post("/mcqs", { ...form, chapter_id: chapterId });
      alert("MCQ added successfully!");
      // Reset form after successful submission
      setForm({
        question: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_options: [],
        explanation: "",
      });
    } catch (err) {
      console.error("Error adding MCQ:", err);
      alert("Failed to add MCQ");
    } finally {
      setSubmitting(false);
    }
  };

  // Theme-aware styles
  const styles = {
    container: {
      animation: 'slideIn3d 0.6s ease-out',
    },
    backButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px 24px',
      backgroundColor: colors.card,
      border: `2px solid ${colors.border}`,
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      color: colors.text,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      marginBottom: '30px',
    },
    backIcon: {
      fontSize: '20px',
      animation: 'float3d 2s ease-in-out infinite',
    },
    formCard: {
      backgroundColor: colors.card,
      borderRadius: '24px',
      padding: '40px',
      boxShadow: '0 15px 40px rgba(0,0,0,0.15)',
      animation: 'popIn3d 0.8s ease-out',
    },
    section: {
      marginBottom: '40px',
    },
    sectionHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '20px',
    },
    sectionIcon: {
      fontSize: '28px',
      animation: 'bounce3d 2s ease-in-out infinite',
    },
    sectionTitle: {
      fontSize: '22px',
      fontWeight: '800',
      color: colors.text,
      margin: 0,
    },
    textarea: {
      width: '100%',
      padding: '18px 24px',
      fontSize: '16px',
      border: `2px solid ${colors.border}`,
      borderRadius: '16px',
      resize: 'vertical',
      fontFamily: 'inherit',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      outline: 'none',
      backgroundColor: colors.card,
      color: colors.text,
    },
    optionsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px',
    },
    optionCard: {
      padding: '20px',
      backgroundColor: colors.backgroundSecondary,
      borderRadius: '16px',
      border: `2px solid ${colors.border}`,
      transition: 'all 0.3s ease',
      animation: 'popIn3d 0.6s ease-out forwards',
      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
    },
    optionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px',
    },
    optionLabel: {
      fontSize: '14px',
      fontWeight: '800',
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    checkboxLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer',
    },
    checkbox: {
      width: '18px',
      height: '18px',
      cursor: 'pointer',
    },
    correctBadge: {
      padding: '4px 12px',
      backgroundColor: '#4caf50',
      color: '#fff',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '700',
      animation: 'pulse3d 2s ease-in-out infinite',
    },
    incorrectBadge: {
      padding: '4px 12px',
      backgroundColor: colors.theme === 'dark' ? '#475569' : '#e0e0e0',
      color: colors.textSecondary,
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '700',
    },
    optionInput: {
      width: '100%',
      padding: '14px 18px',
      fontSize: '15px',
      border: `2px solid ${colors.border}`,
      borderRadius: '12px',
      fontFamily: 'inherit',
      transition: 'all 0.3s ease',
      outline: 'none',
      backgroundColor: colors.card,
      color: colors.text,
    },
    submitButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      width: '100%',
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      border: 'none',
      borderRadius: '16px',
      fontSize: '18px',
      fontWeight: '800',
      cursor: 'pointer',
      transition: 'all 0.4s ease',
      boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
      animation: 'glow 2s ease-in-out infinite',
    },
    submitButtonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
    submitIcon: {
      fontSize: '24px',
    },
    loadingSpinner: {
      width: '20px',
      height: '20px',
      border: '3px solid rgba(255,255,255,0.3)',
      borderTop: '3px solid #fff',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
  };

  return (
    <Navbar>
      <PageContainer
        title="Add MCQ"
        subtitle="Create a new multiple choice question"
      >
        <div style={styles.container}>
          {/* Back Button */}
          <button onClick={() => navigate(-1)} style={styles.backButton}>
            <span style={styles.backIcon}>←</span> Back to MCQs
          </button>

          {/* Main Form Card */}
          <div style={styles.formCard}>
            {/* Question Section */}
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <span style={styles.sectionIcon}>❓</span>
                <h3 style={styles.sectionTitle}>Question</h3>
              </div>
              <textarea
                placeholder="Enter your question here..."
                value={form.question}
                onChange={(e) => setForm({ ...form, question: e.target.value })}
                style={styles.textarea}
                rows="4"
              />
            </div>

            {/* Options Section */}
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <span style={styles.sectionIcon}>📝</span>
                <h3 style={styles.sectionTitle}>Options</h3>
              </div>
              <div style={styles.optionsGrid}>
                {["a", "b", "c", "d"].map((opt, idx) => (
                  <div key={opt} style={{
                    ...styles.optionCard,
                    animationDelay: `${idx * 0.1}s`
                  }}>
                    <div style={styles.optionHeader}>
                      <span style={styles.optionLabel}>Option {opt.toUpperCase()}</span>
                      <label style={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={form.correct_options.includes(opt.toUpperCase())}
                          onChange={() => handleCorrectOptionToggle(opt.toUpperCase())}
                          style={styles.checkbox}
                        />
                        <span style={form.correct_options.includes(opt.toUpperCase()) ? styles.correctBadge : styles.incorrectBadge}>
                          {form.correct_options.includes(opt.toUpperCase()) ? '✓ Correct' : 'Incorrect'}
                        </span>
                      </label>
                    </div>
                    <input
                      type="text"
                      placeholder={`Enter option ${opt.toUpperCase()}...`}
                      value={form[`option_${opt}`]}
                      onChange={(e) =>
                        setForm({ ...form, [`option_${opt}`]: e.target.value })
                      }
                      style={styles.optionInput}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Explanation Section */}
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <span style={styles.sectionIcon}>💡</span>
                <h3 style={styles.sectionTitle}>Explanation (Optional)</h3>
              </div>
              <textarea
                placeholder="Provide an explanation for the answer..."
                value={form.explanation}
                onChange={(e) => setForm({ ...form, explanation: e.target.value })}
                style={styles.textarea}
                rows="4"
              />
            </div>

            {/* Submit Button */}
            <button 
              onClick={handleSubmit} 
              disabled={submitting}
              style={{
                ...styles.submitButton,
                ...(submitting && styles.submitButtonDisabled)
              }}
            >
              {submitting ? (
                <>
                  <span style={styles.loadingSpinner}></span>
                  Saving...
                </>
              ) : (
                <>
                  <span style={styles.submitIcon}>✓</span>
                  Save MCQ
                </>
              )}
            </button>
          </div>
        </div>
      </PageContainer>
    </Navbar>
  );
};

export default AddMCQ;