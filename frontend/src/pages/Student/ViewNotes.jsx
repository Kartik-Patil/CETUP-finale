import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { getUser } from "../../auth/auth";

const ViewNotes = () => {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const [hasPDF, setHasPDF] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState(null);
  const user = getUser();
  const iframeRef = useRef(null);

  const loadPDF = useCallback(async () => {
    try {
      // First check if it's a Google Drive link
      const checkRes = await api.get(`/notes/chapters/${chapterId}/check`);
      
      if (checkRes.data.storage_type === 'google_drive') {
        // For Google Drive, get the redirect URL from backend (token included in request)
        const token = localStorage.getItem("token");
        const viewUrl = `${api.defaults.baseURL}/notes/chapters/${chapterId}/view?token=${token}`;
        window.open(viewUrl, '_blank');
        setLoading(false);
        return;
      }
      
      // For uploaded files, fetch as blob
      const response = await api.get(`/notes/chapters/${chapterId}/view`, {
        responseType: 'blob'
      });
      
      // Create blob URL
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      let errorMsg = "Failed to load PDF. ";
      if (err.code === 'ERR_NETWORK') {
        errorMsg += "Backend server is not running. Please start the backend server on port 5000.";
      } else if (err.response?.status === 404) {
        errorMsg += "PDF file not found on server.";
      } else if (err.response?.status === 401) {
        errorMsg += "Authentication failed. Please log in again.";
      } else {
        errorMsg += err.response?.data?.message || "Unknown error occurred.";
      }
      
      alert(errorMsg);
      setLoading(false);
    }
  }, [chapterId]);

  const checkPDF = useCallback(async () => {
    try {
      const res = await api.get(`/notes/chapters/${chapterId}/check`);
      
      if (res.data.hasPDF) {
        setHasPDF(true);
        await loadPDF();
      }
    } catch (err) {
      console.error("Error checking PDF:", err.message);
      if (err.code === 'ERR_NETWORK') {
        alert("Cannot connect to backend server. Please ensure the server is running on port 5000.");
      }
    } finally {
      setLoading(false);
    }
  }, [chapterId, loadPDF]);

  useEffect(() => {
    checkPDF();
  }, [checkPDF]);

  useEffect(() => {
    // Cleanup blob URL when component unmounts
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  useEffect(() => {
    // Disable right-click and drag events on the entire document
    const handleContextMenu = (e) => {
      e.preventDefault();
      alert("Right-click is disabled for security reasons");
      return false;
    };

    const handleDragStart = (e) => {
      e.preventDefault();
      return false;
    };

    const handleSelectStart = (e) => {
      e.preventDefault();
      return false;
    };

    // Disable common keyboard shortcuts for saving/printing
    const handleKeyDown = (e) => {
      // Ctrl+S, Ctrl+P, Ctrl+Shift+S, Ctrl+C (copy)
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'p' || e.key === 'c')) {
        e.preventDefault();
        alert("Downloading/Printing/Copying is disabled for security reasons");
        return false;
      }
      // F12, Ctrl+Shift+I (DevTools)
      if (e.key === 'F12' || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
        return false;
      }
    };

    // Add event listeners with capture phase to catch events before they reach iframe
    document.addEventListener("contextmenu", handleContextMenu, true);
    document.addEventListener("dragstart", handleDragStart, true);
    document.addEventListener("selectstart", handleSelectStart, true);
    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu, true);
      document.removeEventListener("dragstart", handleDragStart, true);
      document.removeEventListener("selectstart", handleSelectStart, true);
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, []);

  if (loading) return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <div style={{ fontSize: "32px", marginBottom: "10px" }}>📄</div>
      <p>Loading notes...</p>
      <p style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>
        Make sure the backend server is running on port 5000
      </p>
    </div>
  );

  if (!hasPDF) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <button 
          onClick={() => navigate(-1)}
          style={{
            marginBottom: "30px",
            padding: "10px 20px",
            backgroundColor: "#6366f1",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          ⬅ Back to Chapters
        </button>
        <div style={{ fontSize: "64px", marginBottom: "20px" }}>📭</div>
        <h2 style={{ marginBottom: "10px" }}>No PDF Notes Available</h2>
        <p style={{ color: "#666" }}>
          PDF notes have not been uploaded for this chapter yet.
          <br />
          Please check back later or contact your instructor.
        </p>
      </div>
    );
  }

  if (!pdfUrl) {
    return <div style={{ padding: "20px" }}>Loading PDF...</div>;
  }

  return (
    <div 
      style={{ 
        height: "100vh", 
        display: "flex", 
        flexDirection: "column",
        userSelect: "none",
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        KhtmlUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none"
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        return false;
      }}
      onSelectStart={(e) => {
        e.preventDefault();
        return false;
      }}
      onDragStart={(e) => {
        e.preventDefault();
        return false;
      }}
    >
      <div style={{ 
        padding: "10px 20px", 
        backgroundColor: "#f8f9fa", 
        borderBottom: "1px solid #ddd",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <button onClick={() => navigate(-1)}>⬅ Back to Chapters</button>
        <div style={{ fontSize: "12px", color: "#666" }}>
          Viewing as: <strong>{user?.name}</strong> ({user?.email})
        </div>
      </div>

      {/* Watermark overlay */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%) rotate(-45deg)",
        fontSize: "48px",
        color: "rgba(0, 0, 0, 0.05)",
        fontWeight: "bold",
        pointerEvents: "none",
        zIndex: 999,
        whiteSpace: "nowrap",
        userSelect: "none"
      }}>
        {user?.name} - {user?.email}
      </div>

      <div style={{ 
        flex: 1, 
        position: "relative",
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none"
      }}>
        <iframe
          ref={iframeRef}
          src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            userSelect: "none"
          }}
          title="PDF Notes"
          allowFullScreen={false}
        />
        
        {/* Invisible overlay to block right-click but allow scrolling */}
        <div 
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            userSelect: "none"
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }}
        />
      </div>

      <div style={{
        padding: "10px 20px",
        backgroundColor: "#fff3cd",
        borderTop: "1px solid #ddd",
        fontSize: "12px",
        textAlign: "center"
      }}>
        ⚠️ This content is protected. Downloading, printing, or sharing is prohibited.
      </div>
    </div>
  );
};

export default ViewNotes;
