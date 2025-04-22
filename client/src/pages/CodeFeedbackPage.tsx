import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useFeatureUsage } from "@/hooks/use-feature-usage";
import { Copy, Loader2 } from "lucide-react";
import "@/styles/CodeEditor.css";

const PROGRAMMING_LANGUAGES = [
  'Python', 'Java', 'C++', 'JavaScript', 'HTML/CSS', 'PHP', 'Ruby',
  'Swift', 'Kotlin', 'Go', 'Rust', 'TypeScript', 'R'
];

export default function CodeFeedbackPage() {
  const { user } = useAuth();
  const { usageCount, trackUsage } = useFeatureUsage("feedback");
  
  const [code, setCode] = useState("");
  const [programmingLanguage, setProgrammingLanguage] = useState("Python");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const analyzeCode = async () => {
    if (!code.trim()) {
      alert("Please enter some code to analyze");
      return;
    }

    // Check if non-authenticated user has exceeded free usage
    if (!user && usageCount >= 3) {
      setShowLoginPrompt(true);
      return;
    }

    setLoading(true);
    try {
      // Track usage first
      await trackUsage();
      
      // Make API request
      const response = await fetch("/api/code-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          programmingLanguage
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to generate feedback");
      }

      const data = await response.json();
      setFeedback(data.feedback);
    } catch (error) {
      console.error("Error generating feedback:", error);
      alert(error instanceof Error ? error.message : "Failed to generate feedback");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    navigator.clipboard.writeText(feedback)
      .then(() => alert("Feedback copied to clipboard!"))
      .catch(err => console.error("Failed to copy: ", err));
  };

  return (
    <div className="code-editor-container">
      <div className="scroll-view">
        <h1 className="title">Code Feedback Tool</h1>
        
        <div className="picker-container">
          <label className="label">Programming Language:</label>
          <select
            className="select"
            value={programmingLanguage}
            onChange={(e) => setProgrammingLanguage(e.target.value)}
          >
            {PROGRAMMING_LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <div className="picker-container">
          <label className="label">Your Code:</label>
          <textarea
            className="code-input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here for analysis and error checking..."
            rows={15}
            spellCheck={false}
          />
        </div>

        {!user && (
          <div className="usage-count">
            You have used <span>{usageCount}/3</span> free analyses
          </div>
        )}

        <button 
          className={`button ${loading ? "button-disabled" : ""}`}
          onClick={analyzeCode}
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="spinner" />
              <span>Analyzing...</span>
            </>
          ) : (
            'Analyze Code'
          )}
        </button>

        {feedback && (
          <div className="output-container">
            <h2 className="output-title">Analysis & Feedback:</h2>
            <div className="output-text">{feedback}</div>
            <button 
              className="copy-button" 
              onClick={handleCopy}
            >
              <Copy size={16} />
              Copy Feedback
            </button>
          </div>
        )}

        {showLoginPrompt && (
          <div className="login-prompt">
            <h3 className="login-prompt-title">Create an Account</h3>
            <p className="login-prompt-text">
              {!user && usageCount >= 3 
                ? "You've reached the limit of free analyses. Create an account to continue using this feature."
                : "Please create an account to copy feedback and access more features."}
            </p>
            <Link href="/auth" className="login-button">
              Sign Up / Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}