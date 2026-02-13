import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const StudentManagement = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: "", email: "", password: "" });
  const [addingStudent, setAddingStudent] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = students.filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [searchTerm, students]);

  const fetchStudents = async () => {
    try {
      const res = await api.get("/admin/students");
      setStudents(res.data);
      setFilteredStudents(res.data);
    } catch (err) {
      console.error("Error fetching students:", err);
      alert("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const viewStudentDetails = async (studentId) => {
    try {
      const res = await api.get(`/admin/students/${studentId}`);
      setSelectedStudent(res.data);
    } catch (err) {
      console.error("Error fetching student details:", err);
      alert("Failed to fetch student details");
    }
  };

  const toggleStudentStatus = async (studentId, currentStatus) => {
    try {
      await api.put(`/admin/students/${studentId}/status`, {
        is_active: !currentStatus,
      });
      alert("Student status updated successfully");
      fetchStudents();
      if (selectedStudent && selectedStudent.student.id === studentId) {
        setSelectedStudent(null);
      }
    } catch (err) {
      console.error("Error updating student status:", err);
      alert("Failed to update student status");
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setAddingStudent(true);
    try {
      await api.post("/auth/register", {
        ...newStudent,
        role: "student"
      });
      alert("Student added successfully!");
      setShowAddModal(false);
      setNewStudent({ name: "", email: "", password: "" });
      fetchStudents();
    } catch (err) {
      console.error("Error adding student:", err);
      alert(err.response?.data?.message || "Failed to add student");
    } finally {
      setAddingStudent(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading students...</p>
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
          <h1 style={styles.title}>Student Management</h1>
        </div>
        <button onClick={() => setShowAddModal(true)} style={styles.addButton}>
          <span style={styles.addIcon}>+</span>
          Add Student
        </button>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>👥</div>
          <div style={styles.statContent}>
            <div style={styles.statValue}>{students.length}</div>
            <div style={styles.statLabel}>Total Students</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>✅</div>
          <div style={styles.statContent}>
            <div style={styles.statValue}>
              {students.filter(s => s.is_active).length}
            </div>
            <div style={styles.statLabel}>Active Students</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📊</div>
          <div style={styles.statContent}>
            <div style={styles.statValue}>
              {students.reduce((sum, s) => sum + (s.total_attempts || 0), 0)}
            </div>
            <div style={styles.statLabel}>Total Test Attempts</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🎯</div>
          <div style={styles.statContent}>
            <div style={styles.statValue}>
              {Math.round(
                students.reduce((sum, s) => sum + (parseFloat(s.avg_score) || 0), 0) / 
                (students.filter(s => s.avg_score).length || 1)
              )}%
            </div>
            <div style={styles.statLabel}>Average Score</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="🔍 Search by name or email..."
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

      {/* Main Content Area */}
      <div style={styles.mainContent}>
        {/* Students Table */}
        <div style={styles.tableContainer}>
          {filteredStudents.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>👨‍🎓</div>
              <h3 style={styles.emptyTitle}>
                {searchTerm ? "No students found" : "No students yet"}
              </h3>
              <p style={styles.emptyText}>
                {searchTerm 
                  ? "Try adjusting your search terms"
                  : "Add your first student to get started!"}
              </p>
              {!searchTerm && (
                <button onClick={() => setShowAddModal(true)} style={styles.emptyButton}>
                  Add First Student
                </button>
              )}
            </div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeaderRow}>
                    <th style={styles.tableHeader}>Student Info</th>
                    <th style={styles.tableHeaderCenter}>Tests</th>
                    <th style={styles.tableHeaderCenter}>Avg Score</th>
                    <th style={styles.tableHeaderCenter}>Status</th>
                    <th style={styles.tableHeaderCenter}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id} style={styles.tableRow}>
                      <td style={styles.tableCell}>
                        <div style={styles.studentInfo}>
                          <div style={styles.avatar}>
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <div style={styles.studentDetails}>
                            <div style={styles.studentName}>{student.name}</div>
                            <div style={styles.studentEmail}>{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={styles.tableCellCenter}>
                        <div style={styles.badge}>
                          {student.total_attempts || 0}
                        </div>
                      </td>
                      <td style={styles.tableCellCenter}>
                        <div style={{
                          ...styles.scoreBadge,
                          backgroundColor: 
                            !student.avg_score ? '#e0e0e0' :
                            student.avg_score >= 70 ? '#4CAF50' :
                            student.avg_score >= 50 ? '#FF9800' : '#f44336'
                        }}>
                          {student.avg_score ? `${Math.round(student.avg_score)}%` : "N/A"}
                        </div>
                      </td>
                      <td style={styles.tableCellCenter}>
                        <span style={{
                          ...styles.statusBadge,
                          backgroundColor: student.is_active ? '#e8f5e9' : '#ffebee',
                          color: student.is_active ? '#2e7d32' : '#c62828',
                        }}>
                          {student.is_active ? "● Active" : "● Inactive"}
                        </span>
                      </td>
                      <td style={styles.tableCellCenter}>
                        <div style={styles.actionButtons}>
                          <button
                            onClick={() => viewStudentDetails(student.id)}
                            style={styles.viewButton}
                            onMouseEnter={(e) => e.target.style.backgroundColor = styles.viewButtonHover.backgroundColor}
                            onMouseLeave={(e) => e.target.style.backgroundColor = styles.viewButton.backgroundColor}
                          >
                            👁️
                          </button>
                          <button
                            onClick={() => toggleStudentStatus(student.id, student.is_active)}
                            style={{
                              ...styles.toggleButton,
                              backgroundColor: student.is_active ? '#ff5252' : '#4CAF50'
                            }}
                            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                            onMouseLeave={(e) => e.target.style.opacity = '1'}
                          >
                            {student.is_active ? "🚫" : "✓"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Student Details Panel */}
        {selectedStudent && (
          <div style={styles.detailsPanel}>
            <div style={styles.detailsHeader}>
              <h3 style={styles.detailsTitle}>Student Profile</h3>
              <button onClick={() => setSelectedStudent(null)} style={styles.closeButton}>
                ✕
              </button>
            </div>

            <div style={styles.detailsCard}>
              <div style={styles.profileSection}>
                <div style={styles.avatarLarge}>
                  {selectedStudent.student.name.charAt(0).toUpperCase()}
                </div>
                <div style={styles.profileInfo}>
                  <h4 style={styles.profileName}>{selectedStudent.student.name}</h4>
                  <p style={styles.profileEmail}>{selectedStudent.student.email}</p>
                </div>
              </div>

              <div style={styles.infoGrid}>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Status</span>
                  <span style={{
                    ...styles.infoValue,
                    color: selectedStudent.student.is_active ? '#4CAF50' : '#f44336'
                  }}>
                    {selectedStudent.student.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Joined</span>
                  <span style={styles.infoValue}>
                    {new Date(selectedStudent.student.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div style={styles.historySection}>
              <h4 style={styles.historyTitle}>📊 Test History</h4>
              {selectedStudent.test_history.length === 0 ? (
                <p style={styles.noHistory}>No tests attempted yet</p>
              ) : (
                <div style={styles.historyList}>
                  {selectedStudent.test_history.map((test, idx) => (
                    <div key={idx} style={styles.historyCard}>
                      <div style={styles.historyHeader}>
                        <div style={styles.historySubject}>{test.subject}</div>
                        <div style={{
                          ...styles.historyPassBadge,
                          backgroundColor: test.passed ? '#4CAF50' : '#f44336'
                        }}>
                          {test.passed ? "PASS" : "FAIL"}
                        </div>
                      </div>
                      <div style={styles.historyChapter}>{test.chapter}</div>
                      <div style={styles.historyScore}>
                        Score: <strong>{test.score}/{test.total}</strong> ({test.percentage}%)
                      </div>
                      <div style={styles.historyDate}>
                        {new Date(test.attempted_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div style={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>➕ Add New Student</h2>
              <button onClick={() => setShowAddModal(false)} style={styles.modalClose}>
                ✕
              </button>
            </div>
            <form onSubmit={handleAddStudent} style={styles.modalForm}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Full Name</label>
                <input
                  type="text"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                  required
                  style={styles.formInput}
                  placeholder="Enter student's full name"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Email Address</label>
                <input
                  type="email"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                  required
                  style={styles.formInput}
                  placeholder="student@example.com"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Password</label>
                <input
                  type="password"
                  value={newStudent.password}
                  onChange={(e) => setNewStudent({...newStudent, password: e.target.value})}
                  required
                  minLength="6"
                  style={styles.formInput}
                  placeholder="Minimum 6 characters"
                />
              </div>
              <div style={styles.modalActions}>
                <button
                  type="submit"
                  disabled={addingStudent}
                  style={{
                    ...styles.submitButton,
                    ...(addingStudent ? styles.submitButtonDisabled : {})
                  }}
                >
                  {addingStudent ? "Adding..." : "Add Student"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={styles.cancelModalButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    maxWidth: '1600px',
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
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '25px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  statIcon: {
    fontSize: '48px',
    width: '70px',
    height: '70px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f4ff',
    borderRadius: '12px',
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: '32px',
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
    marginBottom: '25px',
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
  mainContent: {
    display: 'flex',
    gap: '25px',
    alignItems: 'flex-start',
  },
  tableContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
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
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeaderRow: {
    backgroundColor: '#f5f7fa',
  },
  tableHeader: {
    padding: '18px 20px',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: '700',
    color: '#333',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '2px solid #e0e0e0',
  },
  tableHeaderCenter: {
    padding: '18px 20px',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: '700',
    color: '#333',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '2px solid #e0e0e0',
  },
  tableRow: {
    transition: 'all 0.2s ease',
    borderBottom: '1px solid #f0f0f0',
  },
  tableCell: {
    padding: '16px 20px',
  },
  tableCellCenter: {
    padding: '16px 20px',
    textAlign: 'center',
  },
  studentInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  avatar: {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    backgroundColor: '#2196f3',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '700',
    flexShrink: 0,
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '4px',
  },
  studentEmail: {
    fontSize: '13px',
    color: '#666',
  },
  badge: {
    display: 'inline-block',
    padding: '6px 14px',
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
  },
  scoreBadge: {
    display: 'inline-block',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '700',
    color: 'white',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
  },
  actionButtons: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
  },
  viewButton: {
    width: '36px',
    height: '36px',
    backgroundColor: '#2196f3',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
  },
  viewButtonHover: {
    backgroundColor: '#1976d2',
  },
  toggleButton: {
    width: '36px',
    height: '36px',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
  },
  detailsPanel: {
    width: '400px',
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    maxHeight: '800px',
    overflowY: 'auto',
    position: 'sticky',
    top: '20px',
  },
  detailsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 25px',
    borderBottom: '2px solid #f0f0f0',
  },
  detailsTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1a1a1a',
    margin: 0,
  },
  closeButton: {
    width: '32px',
    height: '32px',
    backgroundColor: '#ff5252',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsCard: {
    padding: '25px',
    borderBottom: '2px solid #f0f0f0',
  },
  profileSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '25px',
  },
  avatarLarge: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    backgroundColor: '#2196f3',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1a1a1a',
    margin: '0 0 8px 0',
  },
  profileEmail: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
  },
  infoItem: {
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  infoLabel: {
    fontSize: '12px',
    color: '#666',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#333',
  },
  historySection: {
    padding: '25px',
  },
  historyTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '15px',
  },
  noHistory: {
    fontSize: '14px',
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: '20px',
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  historyCard: {
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    border: '1px solid #e0e0e0',
  },
  historyHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  historySubject: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#333',
  },
  historyPassBadge: {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '700',
    color: 'white',
  },
  historyChapter: {
    fontSize: '13px',
    color: '#666',
    marginBottom: '8px',
  },
  historyScore: {
    fontSize: '14px',
    color: '#333',
    marginBottom: '8px',
  },
  historyDate: {
    fontSize: '12px',
    color: '#999',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '25px 30px',
    borderBottom: '2px solid #f0f0f0',
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1a1a1a',
    margin: 0,
  },
  modalClose: {
    width: '32px',
    height: '32px',
    backgroundColor: '#ff5252',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalForm: {
    padding: '30px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  formLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px',
  },
  formInput: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '15px',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '30px',
  },
  submitButton: {
    flex: 1,
    padding: '14px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  submitButtonDisabled: {
    backgroundColor: '#bdbdbd',
    cursor: 'not-allowed',
  },
  cancelModalButton: {
    flex: 1,
    padding: '14px',
    backgroundColor: '#666',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default StudentManagement;
