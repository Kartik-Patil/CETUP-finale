import { useState, useEffect } from "react";
import api from "../../api/axios";
import Navbar from "../../components/Navbar";
import PageContainer from "../../components/PageContainer";

const BatchImport = () => {
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [csvData, setCsvData] = useState("");
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchSubjects();
    fetchHistory();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await api.get("/subjects");
      setSubjects(res.data);
    } catch (error) {
      console.error("Error fetching subjects:", error.message);
    }
  };

  const fetchChapters = async (subjectId) => {
    try {
      const res = await api.get(`/chapters/${subjectId}`);
      setChapters(res.data);
    } catch (error) {
      console.error("Error fetching chapters:", error.message);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await api.get("/batch-import/history");
      setHistory(res.data.logs || res.data || []);
    } catch (error) {
      console.error("Error fetching history:", error.message);
    }
  };

  const handleSubjectChange = (e) => {
    const subjectId = e.target.value;
    setSelectedSubject(subjectId);
    setSelectedChapter("");
    setChapters([]);
    if (subjectId) {
      fetchChapters(subjectId);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCsvData(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleImport = async () => {
    if (!selectedChapter || !csvData) {
      alert("Please select a chapter and upload a CSV file");
      return;
    }

    try {
      setImporting(true);
      setResult(null);
      const res = await api.post("/batch-import/mcqs", {
        chapterId: selectedChapter,
        csvData: csvData
      });
      setResult(res.data);
      setCsvData("");
      fetchHistory();
      alert(`Import completed! Success: ${res.data.successCount}, Failed: ${res.data.failCount}`);
    } catch (error) {
      console.error("Error importing:", error.message);
      alert(error.response?.data?.message || "Import failed");
    } finally {
      setImporting(false);
    }
  };

  const downloadSample = async () => {
    try {
      const res = await api.get("/batch-import/sample-csv", {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'mcq_import_template.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading sample:", error);
    }
  };

  return (
    <Navbar>
      <PageContainer>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📥 Batch Import MCQs</h1>
          <p className="text-gray-600 mb-8">Upload multiple MCQs at once using a CSV file</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Import Form */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload CSV</h2>

              <div className="space-y-4">
                {/* Subject Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Subject
                  </label>
                  <select
                    value={selectedSubject}
                    onChange={handleSubjectChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">-- Select Subject --</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Chapter Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Chapter
                  </label>
                  <select
                    value={selectedChapter}
                    onChange={(e) => setSelectedChapter(e.target.value)}
                    disabled={!selectedSubject}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                  >
                    <option value="">-- Select Chapter --</option>
                    {chapters.map((chapter) => (
                      <option key={chapter.id} value={chapter.id}>
                        {chapter.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload CSV File
                  </label>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  {csvData && (
                    <p className="mt-2 text-sm text-green-600">
                      ✓ File loaded ({csvData.split('\n').length - 1} rows)
                    </p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={handleImport}
                    disabled={importing || !selectedChapter || !csvData}
                    className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {importing ? "Importing..." : "Import MCQs"}
                  </button>
                  <button
                    onClick={downloadSample}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    📄 Sample
                  </button>
                </div>
              </div>

              {/* Result Summary */}
              {result && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Import Result</h3>
                  <div className="space-y-1 text-sm">
                    <p className="text-green-600">✓ Success: {result.successCount}</p>
                    <p className="text-red-600">✗ Failed: {result.failCount}</p>
                    <p className="text-gray-600">Total: {result.totalRows}</p>
                  </div>
                  {result.errors && result.errors.length > 0 && (
                    <div className="mt-3">
                      <p className="font-medium text-red-600 mb-1">Errors:</p>
                      <div className="max-h-40 overflow-y-auto text-xs">
                        {result.errors.map((err, idx) => (
                          <p key={idx} className="text-red-600">
                            Line {err.line}: {err.error}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">📚 Instructions</h2>
              
              <div className="space-y-4 text-sm text-gray-700">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">CSV Format:</h3>
                  <p className="mb-2">Your CSV file must have these columns (in order):</p>
                  <ul className="list-disc list-inside space-y-1 text-xs bg-white p-3 rounded">
                    <li><strong>question</strong> - The question text</li>
                    <li><strong>option_a</strong> - Option A text</li>
                    <li><strong>option_b</strong> - Option B text</li>
                    <li><strong>option_c</strong> - Option C text</li>
                    <li><strong>option_d</strong> - Option D text</li>
                    <li><strong>correct_options</strong> - Correct answer(s): A, B, C, D or A,B for multiple</li>
                    <li><strong>explanation</strong> - (Optional) Explanation text</li>
                    <li><strong>difficulty</strong> - (Optional) easy, medium, or hard</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Example Row:</h3>
                  <div className="bg-white p-3 rounded text-xs font-mono overflow-x-auto">
                    "What is 2+2?","3","4","5","6","B","Basic arithmetic",easy
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Tips:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Use quotes for text with commas</li>
                    <li>First row must be headers</li>
                    <li>For multiple correct answers: A,B or A,C</li>
                    <li>Download sample for reference</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Import History */}
          <div className="mt-8 bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Import History</h2>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Success</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Failed</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {history.map((log) => (
                  <tr key={log.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(log.imported_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.admin_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {log.total_rows}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      {log.successful_rows}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      {log.failed_rows}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {history.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p>No import history yet</p>
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    </Navbar>
  );
};

export default BatchImport;
