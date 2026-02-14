import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Navbar from "../../components/Navbar";
import PageContainer from "../../components/PageContainer";

const Practice = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      fetchChapters(selectedSubject.id);
    }
  }, [selectedSubject]);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const res = await api.get("/subjects");
      setSubjects(res.data);
    } catch (err) {
      console.error("Error fetching subjects:", err);
      alert("Failed to load subjects");
    } finally {
      setLoading(false);
    }
  };

  const fetchChapters = async (subjectId) => {
    try {
      setLoading(true);
      const res = await api.get(`/chapters/${subjectId}`);
      setChapters(res.data);
    } catch (err) {
      console.error("Error fetching chapters:", err);
      setChapters([]);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = (chapterId) => {
    navigate(`/chapters/${chapterId}/test`);
  };

  return (
    <Navbar>
      <PageContainer
        title="Practice Tests"
        subtitle="Select a subject and chapter to start practicing"
        actions={
          <button
            onClick={() => navigate('/student')}
            className="px-4 py-2 bg-background text-text-primary rounded-lg hover:bg-border/30 transition-colors font-medium"
          >
            Back to Dashboard
          </button>
        }
      >
        {loading && !selectedSubject ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Subject Selection */}
            <div className="lg:col-span-4">
              <div className="bg-card p-6 rounded-xl border border-border shadow-sm sticky top-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Select Subject
                </h3>
                <div className="space-y-2">
                  {subjects.map(subject => (
                    <button
                      key={subject.id}
                      onClick={() => {
                        setSelectedSubject(subject);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                        selectedSubject?.id === subject.id
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-background text-text-primary hover:bg-border/30'
                      }`}
                    >
                      <div className="font-medium">{subject.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chapter Selection */}
            <div className="lg:col-span-8">
              {!selectedSubject ? (
                <div className="bg-card p-12 rounded-xl border border-border text-center">
                  <svg className="w-16 h-16 mx-auto mb-4 text-text-muted opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                  <h3 className="text-xl font-semibold text-text-primary mb-2">Select a Subject</h3>
                  <p className="text-text-muted">Choose a subject from the left to view available chapters</p>
                </div>
              ) : loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : chapters.length === 0 ? (
                <div className="bg-card p-12 rounded-xl border border-border text-center">
                  <svg className="w-16 h-16 mx-auto mb-4 text-text-muted opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-text-primary mb-2">No Chapters Available</h3>
                  <p className="text-text-muted">No chapters found for {selectedSubject.name}</p>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-text-primary mb-4">
                    {selectedSubject.name} - Chapters
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {chapters.map(chapter => (
                      <div
                        key={chapter.id}
                        className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <h4 className="text-lg font-semibold text-text-primary flex-1">
                            {chapter.name}
                          </h4>
                        </div>
                        
                        {/* MCQ Count Badge */}
                        {chapter.mcq_count > 0 && (
                          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            {chapter.mcq_count} Questions in this test
                          </div>
                        )}
                        
                        <div className="flex gap-3 mt-4">
                          {chapter.notes_pdf && (
                            <button
                              onClick={() => navigate(`/chapters/${chapter.id}/notes`)}
                              className="flex-1 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-medium inline-flex items-center justify-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Notes
                            </button>
                          )}
                          <button
                            onClick={() => startQuiz(chapter.id)}
                            disabled={!chapter.mcq_count || chapter.mcq_count === 0}
                            className={`flex-1 px-4 py-2 rounded-lg transition-colors font-medium inline-flex items-center justify-center gap-2 ${
                              chapter.mcq_count > 0 
                                ? 'bg-primary text-white hover:bg-primary/90'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                            title={chapter.mcq_count === 0 ? 'No questions available' : `Start test with ${chapter.mcq_count} questions`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                            {chapter.mcq_count > 0 ? 'Start Test' : 'No Questions'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </PageContainer>
    </Navbar>
  );
};

export default Practice;
