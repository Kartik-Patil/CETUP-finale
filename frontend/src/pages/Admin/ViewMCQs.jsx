import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const ViewMCQs = () => {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const [mcqs, setMcqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMCQs = async () => {
    try {
      const res = await api.get(`/mcqs/admin/${chapterId}`);
      setMcqs(res.data);
    } catch (err) {
      console.error("Error fetching MCQs:", err);
      const errorMsg = err.response?.data?.message || err.message || "Failed to fetch MCQs";
      alert(`Error: ${errorMsg}\n\nPlease check:\n1. Backend server is running\n2. Database has correct_options and explanation columns\n3. You have admin permissions`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMCQs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterId]);

  const deleteMCQ = async (mcqId) => {
    if (!window.confirm("Are you sure you want to delete this MCQ?")) return;

    try {
      await api.delete(`/mcqs/${mcqId}`);
      alert("MCQ deleted successfully");
      fetchMCQs();
    } catch (err) {
      console.error("Error deleting MCQ:", err);
      alert("Failed to delete MCQ");
    }
  };

  const filteredMCQs = mcqs.filter((mcq) =>
    mcq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mcq.option_a?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mcq.option_b?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mcq.option_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mcq.option_d?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading MCQs...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button onClick={() => navigate(-1)} style={styles.backButton}>
            <span style={styles.backIcon}>←</span>
            Back
          </button>
          <h1 style={styles.title}>MCQ Management</h1>
        </div>
        <button 
          onClick={() => navigate(`/admin/chapters/${chapterId}/mcqs`)}
          style={styles.addButton}
        >
          <span style={styles.addIcon}>+</span>
          Add New MCQ
        </button>
      </div>

      {/* Stats Bar */}
      <div style={styles.statsBar}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{mcqs.length}</div>
          <div style={styles.statLabel}>Total Questions</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{filteredMCQs.length}</div>
          <div style={styles.statLabel}>Filtered Results</div>
        </div>
      </div>

      {/* Search Bar */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="🔍 Search questions, options..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm("")} style={styles.clearButton}>
            ✕
          </button>
        )}
      </div>

      {/* MCQs List */}
      {filteredMCQs.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📝</div>
          <h3 style={styles.emptyTitle}>
            {searchTerm ? "No MCQs found" : "No MCQs yet"}
          </h3>
          <p style={styles.emptyText}>
            {searchTerm 
              ? "Try adjusting your search terms"
              : "Get started by adding your first MCQ!"}
          </p>
          {!searchTerm && (
            <button 
              onClick={() => navigate(`/admin/chapters/${chapterId}/mcqs`)}
              style={styles.emptyButton}
            >
              Add Your First MCQ
            </button>
          )}
        </div>
      ) : (
        <div style={styles.mcqGrid}>
          {filteredMCQs.map((mcq, index) => {
            // Handle both PostgreSQL (returns array/object) and MySQL (returns string)
            const correctOptions = typeof mcq.correct_options === 'string'
              ? JSON.parse(mcq.correct_options || "[]")
              : mcq.correct_options || [];
            
            return (
              <div key={mcq.id} style={styles.mcqCard}>
                {/* Card Header */}
                <div style={styles.cardHeader}>
                  <div style={styles.questionNumber}>Question #{index + 1}</div>
                  <button 
                    onClick={() => deleteMCQ(mcq.id)}
                    style={styles.deleteButton}
                    onMouseEnter={(e) => e.target.style.backgroundColor = styles.deleteButtonHover.backgroundColor}
                    onMouseLeave={(e) => e.target.style.backgroundColor = styles.deleteButton.backgroundColor}
                  >
                    <span style={styles.deleteIcon}>🗑️</span>
                    Delete
                  </button>
                </div>

                {/* Question */}
                <div style={styles.questionSection}>
                  <div style={styles.questionLabel}>Question:</div>
                  <div style={styles.questionText}>{mcq.question}</div>
                </div>

                {/* Options */}
                <div style={styles.optionsContainer}>
                  {["A", "B", "C", "D"].map((opt) => {
                    const isCorrect = correctOptions.includes(opt);
                    return (
                      <div 
                        key={opt} 
                        style={{
                          ...styles.optionItem,
                          ...(isCorrect ? styles.correctOption : {})
                        }}
                      >
                        <div style={styles.optionLetter}>{opt}</div>
                        <div style={styles.optionText}>
                          {mcq[`option_${opt.toLowerCase()}`]}
                        </div>
                        {isCorrect && (
                          <div style={styles.correctBadge}>✓ Correct</div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Answer Summary */}
                <div style={styles.answerSummary}>
                  <span style={styles.answerLabel}>Correct Answer(s):</span>
                  <span style={styles.answerValue}>{correctOptions.join(", ")}</span>
                </div>

                {/* Explanation */}
                {mcq.explanation && (
                  <div style={styles.explanationSection}>
                    <div style={styles.explanationLabel}>
                      💡 Explanation:
                    </div>
                    <div style={styles.explanationText}>{mcq.explanation}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
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
    flexWrap: 'wrap',
    gap: '15px',
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
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 28px',
    backgroundColor: '#4CAF50',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(76, 175, 80, 0.3)',
  },
  addIcon: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
  statsBar: {
    display: 'flex',
    gap: '20px',
    marginBottom: '25px',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    textAlign: 'center',
  },
  statValue: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#2196f3',
    marginBottom: '5px',
  },
  statLabel: {
    fontSize: '14px',
    color: '#666',
    fontWeight: '500',
  },
  searchContainer: {
    position: 'relative',
    marginBottom: '30px',
  },
  searchInput: {
    width: '100%',
    padding: '16px 50px 16px 20px',
    fontSize: '16px',
    border: '2px solid #e0e0e0',
    borderRadius: '12px',
    backgroundColor: '#fff',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    outline: 'none',
  },
  clearButton: {
    position: 'absolute',
    right: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: '#ff5252',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '28px',
    height: '28px',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '20px',
  },
  emptyTitle: {
    fontSize: '24px',
    color: '#333',
    marginBottom: '10px',
  },
  emptyText: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '30px',
  },
  emptyButton: {
    padding: '14px 32px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  mcqGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(600px, 1fr))',
    gap: '25px',
  },
  mcqCard: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '25px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    border: '1px solid #e0e0e0',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '2px solid #f0f0f0',
  },
  questionNumber: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#2196f3',
    backgroundColor: '#e3f2fd',
    padding: '8px 16px',
    borderRadius: '8px',
  },
  deleteButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    backgroundColor: '#ff5252',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  deleteButtonHover: {
    backgroundColor: '#e53935',
  },
  deleteIcon: {
    fontSize: '16px',
  },
  questionSection: {
    marginBottom: '20px',
  },
  questionLabel: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '8px',
  },
  questionText: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a1a1a',
    lineHeight: '1.6',
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px',
  },
  optionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    border: '2px solid #e0e0e0',
    transition: 'all 0.3s ease',
  },
  correctOption: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4CAF50',
    boxShadow: '0 2px 6px rgba(76, 175, 80, 0.2)',
  },
  optionLetter: {
    width: '36px',
    height: '36px',
    backgroundColor: '#2196f3',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: '700',
    flexShrink: 0,
  },
  optionText: {
    flex: 1,
    fontSize: '15px',
    color: '#333',
  },
  correctBadge: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
  },
  answerSummary: {
    display: 'flex',
    gap: '10px',
    padding: '12px 16px',
    backgroundColor: '#fff3e0',
    borderRadius: '8px',
    marginBottom: '15px',
    border: '1px solid #ffb74d',
  },
  answerLabel: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#f57c00',
  },
  answerValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#e65100',
  },
  explanationSection: {
    backgroundColor: '#f0f4ff',
    padding: '16px',
    borderRadius: '10px',
    border: '1px solid #bbdefb',
  },
  explanationLabel: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1976d2',
    marginBottom: '8px',
  },
  explanationText: {
    fontSize: '14px',
    color: '#424242',
    lineHeight: '1.6',
    fontStyle: 'italic',
  },
};

export default ViewMCQs;
