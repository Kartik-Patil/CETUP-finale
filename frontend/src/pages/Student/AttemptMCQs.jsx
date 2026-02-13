import { useEffect, useState, useCallback } from "react";
import api from "../../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import PageContainer from "../../components/PageContainer";

const AttemptMCQs = () => {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState('quiz'); // 'quiz' or 'result'
  const [mcqs, setMcqs] = useState([]);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [chapterInfo, setChapterInfo] = useState(null);
  const [alreadyAttempted, setAlreadyAttempted] = useState(false);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      
      // Check if already attempted
      const attemptRes = await api.get(`/mcqs/${chapterId}/check-attempt`);
      
      if (attemptRes.data.attempted) {
        setAlreadyAttempted(true);
        setResults(attemptRes.data.previousResult);
        setStep('result');
        // Load MCQs for review
        const mcqRes = await api.get(`/mcqs/${chapterId}`);
        setMcqs(mcqRes.data);
        
        // Get chapter info
        try {
          setChapterInfo({ name: "Chapter Quiz" });
        } catch (e) {
          setChapterInfo({ name: "Chapter Quiz" });
        }
      } else {
        // Load fresh quiz
        const mcqRes = await api.get(`/mcqs/${chapterId}`);
        const questions = mcqRes.data;
        
        if (questions.length === 0) {
          alert("No questions available for this chapter");
          navigate(-1);
          return;
        }
        
        setMcqs(questions);
        // Set timer: 2 minutes per question
        setTimeLeft(questions.length * 120);
        setChapterInfo({ name: "Chapter Quiz" });
      }
    } catch (err) {
      console.error("Error loading quiz:", err);
      alert("Failed to load quiz");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterId]);

  const handleAnswer = (questionId, option) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const handleNext = () => {
    if (currentQuestion < mcqs.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (Object.keys(answers).length === 0) {
      if (!window.confirm("You haven't answered any questions. Submit anyway?")) {
        return;
      }
    }

    if (!alreadyAttempted && !window.confirm(`Are you sure you want to submit? You have answered ${Object.keys(answers).length} out of ${mcqs.length} questions.`)) {
      return;
    }

    const answersArray = mcqs.map(mcq => ({
      mcqId: mcq.id,
      selected: answers[mcq.id] ? [answers[mcq.id]] : []
    }));
    
    try {
      const res = await api.post(`/mcqs/${chapterId}/submit`, { answers: answersArray });
      setResults(res.data);
      setStep('result');
      setAlreadyAttempted(true);
    } catch (err) {
      console.error("Submit error:", err);
      alert(err.response?.data?.message || "Failed to submit test");
    }
  }, [answers, mcqs, chapterId, alreadyAttempted]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft === 0 || step === 'result') return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(); // Auto-submit when time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, step, handleSubmit]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return "text-success";
    if (percentage >= 60) return "text-accent";
    if (percentage >= 40) return "text-orange-500";
    return "text-red-500";
  };

  if (loading) {
    return (
      <Navbar>
        <PageContainer title="Loading Quiz...">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </PageContainer>
      </Navbar>
    );
  }

  if (step === 'result' && results) {
    const percentage = Math.round((results.score / results.total) * 100);
    const correctCount = results.score || 0;
    const incorrectCount = results.total - results.score || 0;

    return (
      <Navbar>
        <PageContainer
          title="Test Results"
          subtitle={`${chapterInfo?.name || 'Chapter Test'} - ${results.total} Questions`}
          actions={
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/practice')}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Take Another Test
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-background text-text-primary rounded-lg hover:bg-border/30 transition-colors font-medium border border-border"
              >
                Back to Dashboard
              </button>
            </div>
          }
        >
          {alreadyAttempted && (
            <div className="bg-accent/10 border border-accent text-accent px-4 py-3 rounded-lg mb-6">
              <strong>⚠️ Note:</strong> You have already attempted this test. Only one attempt is allowed.
            </div>
          )}

          {/* Score Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-card p-6 rounded-xl border border-border text-center">
              <div className={`text-4xl font-bold ${getScoreColor(percentage)}`}>
                {percentage}%
              </div>
              <div className="text-sm text-text-muted mt-2">Overall Score</div>
            </div>
            <div className="bg-card p-6 rounded-xl border border-border text-center">
              <div className="text-4xl font-bold text-primary">
                {results.score}/{results.total}
              </div>
              <div className="text-sm text-text-muted mt-2">Marks Obtained</div>
            </div>
            <div className="bg-card p-6 rounded-xl border border-border text-center">
              <div className="text-4xl font-bold text-success">
                {correctCount}
              </div>
              <div className="text-sm text-text-muted mt-2">Correct Answers</div>
            </div>
            <div className="bg-card p-6 rounded-xl border border-border text-center">
              <div className="text-4xl font-bold text-red-500">
                {incorrectCount}
              </div>
              <div className="text-sm text-text-muted mt-2">Incorrect Answers</div>
            </div>
          </div>

          {/* Pass/Fail Status */}
          {results.passed !== undefined && (
            <div className={`p-6 rounded-xl mb-6 text-center ${
              results.passed 
                ? 'bg-success/10 border border-success' 
                : 'bg-red-100 border border-red-500'
            }`}>
              <div className={`text-2xl font-bold ${
                results.passed ? 'text-success' : 'text-red-700'
              }`}>
                {results.passed ? "✅ PASSED" : "❌ FAILED"}
              </div>
            </div>
          )}

          {/* Questions Review */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Detailed Review</h3>
            {mcqs.map((q, index) => {
              const result = results.results?.find(r => r.mcqId === q.id);
              const userAnswer = result?.userAnswers?.[0] || answers[q.id];
              const correctAnswer = result?.correctOptions?.[0] || q.correct_answer;

              return (
                <div 
                  key={q.id}
                  className={`bg-card p-6 rounded-xl border-2 ${
                    result?.isCorrect 
                      ? 'border-success bg-success/5' 
                      : 'border-red-500 bg-red-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-lg font-semibold text-text-primary flex-1">
                      Q{index + 1}. {q.question}
                    </h4>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      result?.isCorrect
                        ? 'bg-success text-white'
                        : 'bg-red-500 text-white'
                    }`}>
                      {result?.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {['A', 'B', 'C', 'D'].map(opt => {
                      const isCorrect = correctAnswer === opt;
                      const wasSelected = userAnswer === opt;
                      
                      let bgColor = 'bg-background';
                      let borderColor = 'border-border';
                      let textColor = 'text-text-primary';
                      
                      if (isCorrect) {
                        bgColor = 'bg-success/20';
                        borderColor = 'border-success';
                        textColor = 'text-success';
                      } else if (wasSelected && !isCorrect) {
                        bgColor = 'bg-red-100';
                        borderColor = 'border-red-500';
                        textColor = 'text-red-700';
                      }

                      return (
                        <div
                          key={opt}
                          className={`p-3 rounded-lg border ${bgColor} ${borderColor} ${textColor} font-medium flex items-center justify-between`}
                        >
                          <span>{opt}. {q[`option_${opt.toLowerCase()}`]}</span>
                          {isCorrect && <span className="text-success text-xl">✓</span>}
                          {wasSelected && !isCorrect && <span className="text-red-500 text-xl">✗</span>}
                        </div>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-background rounded-lg">
                      <span className="text-text-muted">Your Answer: </span>
                      <span className={`font-bold ${
                        result?.isCorrect ? 'text-success' : 'text-red-500'
                      }`}>
                        {userAnswer || "Not answered"}
                      </span>
                    </div>
                    <div className="p-3 bg-success/10 rounded-lg">
                      <span className="text-text-muted">Correct Answer: </span>
                      <span className="font-bold text-success">{correctAnswer}</span>
                    </div>
                  </div>

                  {result?.explanation && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm">
                        <strong className="text-blue-700">💡 Explanation:</strong>
                        <span className="text-blue-900 ml-2">{result.explanation}</span>
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </PageContainer>
      </Navbar>
    );
  }

  // Quiz Taking Interface
  const currentQ = mcqs[currentQuestion];
  const progress = ((currentQuestion + 1) / mcqs.length) * 100;

  return (
    <Navbar>
      <PageContainer
        title={`${chapterInfo?.name || 'Chapter Test'}`}
        subtitle={`Multi-Question Test - Currently on Question ${currentQuestion + 1} of ${mcqs.length}`}
      >
        {/* Timer and Progress */}
        <div className="bg-card p-4 rounded-xl border border-border shadow-sm mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className={`font-semibold ${timeLeft < 60 ? 'text-red-500' : 'text-text-primary'}`}>
                Time Left: {formatTime(timeLeft)}
              </span>
            </div>
            <div className="text-text-muted text-sm">
              Answered: {Object.keys(answers).length}/{mcqs.length}
            </div>
          </div>
          <div className="w-full h-2 bg-background rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Current Question */}
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm mb-6">
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-semibold text-text-primary">
                Q{currentQuestion + 1}. {currentQ.question}
              </h3>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {currentQ.marks || 1} Mark{(currentQ.marks || 1) > 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {['A', 'B', 'C', 'D'].map(option => {
              const isSelected = answers[currentQ.id] === option;
              return (
                <button
                  key={option}
                  onClick={() => handleAnswer(currentQ.id, option)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/10 font-medium'
                      : 'border-border bg-background hover:border-primary/50 hover:bg-primary/5'
                  }`}
                >
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full mr-3 ${
                    isSelected
                      ? 'bg-primary text-white'
                      : 'bg-background border border-border text-text-muted'
                  }`}>
                    {option}
                  </span>
                  <span className="text-text-primary">{currentQ[`option_${option.toLowerCase()}`]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-6 py-3 bg-background text-text-primary rounded-lg hover:bg-border/30 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          {currentQuestion === mcqs.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-success text-white rounded-lg hover:bg-success/90 transition-colors font-medium flex items-center gap-2"
            >
              Submit Quiz
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center gap-2"
            >
              Next
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Question Grid */}
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm mt-6">
          <h4 className="text-sm font-semibold text-text-muted mb-4">Question Navigator</h4>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {mcqs.map((q, index) => {
              const isAnswered = answers.hasOwnProperty(q.id);
              const isCurrent = index === currentQuestion;
              
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestion(index)}
                  className={`aspect-square rounded-lg font-medium text-sm transition-all ${
                    isCurrent
                      ? 'bg-primary text-white ring-2 ring-primary ring-offset-2'
                      : isAnswered
                      ? 'bg-success/20 text-success border border-success'
                      : 'bg-background border border-border text-text-muted hover:border-primary'
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
          <div className="flex gap-4 mt-4 text-xs text-text-muted">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-success/20 border border-success rounded"></div>
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-background border border-border rounded"></div>
              <span>Not Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary rounded"></div>
              <span>Current</span>
            </div>
          </div>
        </div>
      </PageContainer>
    </Navbar>
  );
};

export default AttemptMCQs;