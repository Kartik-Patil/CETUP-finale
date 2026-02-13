import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Navbar from "../../components/Navbar";
import PageContainer from "../../components/PageContainer";

const Results = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const res = await api.get("/results/my-results");
      setResults(res.data);
    } catch (err) {
      console.error("Error fetching results:", err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-blue-600";
    if (percentage >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreBgColor = (percentage) => {
    if (percentage >= 80) return "bg-green-100";
    if (percentage >= 60) return "bg-blue-100";
    if (percentage >= 40) return "bg-orange-100";
    return "bg-red-100";
  };

  const getStatusBadge = (percentage) => {
    if (percentage >= 40) {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          ✓ Passed
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
        ✗ Failed
      </span>
    );
  };

  return (
    <Navbar>
      <PageContainer
        title="My Results"
        subtitle="View all your quiz attempts and performance"
        actions={
          <button
            onClick={() => navigate("/student")}
            className="px-4 py-2 bg-background text-text-primary rounded-lg hover:bg-border/30 transition-colors font-medium"
          >
            Back to Dashboard
          </button>
        }
      >
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : results.length === 0 ? (
          <div className="bg-card p-12 rounded-xl border border-border text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-text-muted opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <h3 className="text-xl font-semibold text-text-primary mb-2">No Quiz Attempts Yet</h3>
            <p className="text-text-muted mb-6">Start practicing to see your results here</p>
            <button
              onClick={() => navigate("/practice")}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Start Practice
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result) => {
              const percentage = Math.round((result.score / result.total_marks) * 100);
              return (
                <div
                  key={result.id}
                  className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-text-primary">
                          {result.subject_name} - {result.chapter_name}
                        </h3>
                        {getStatusBadge(percentage)}
                      </div>
                      <div className="flex items-center gap-4 text-text-muted text-sm">
                        <p>
                          <span className="font-medium">\ud83d\udccb Test:</span> {result.total_marks} Questions
                        </p>
                        <p>
                          <span className="font-medium">\ud83d\udcc5 Date:</span>{" "}
                          {new Date(result.attempted_at).toLocaleString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className={`text-3xl font-bold ${getScoreColor(percentage)}`}>
                          {percentage}%
                        </div>
                        <div className="text-sm text-text-muted">Percentage</div>
                      </div>

                      <div className="text-center">
                        <div className="text-3xl font-bold text-text-primary">
                          {result.score}/{result.total_marks}
                        </div>
                        <div className="text-sm text-text-muted">Score</div>
                      </div>

                      <div className={`w-20 h-20 rounded-full flex items-center justify-center ${getScoreBgColor(percentage)}`}>
                        <span className={`text-2xl font-bold ${getScoreColor(percentage)}`}>
                          {result.score}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </PageContainer>
    </Navbar>
  );
};

export default Results;