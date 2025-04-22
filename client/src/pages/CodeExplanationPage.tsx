import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useFeatureUsage } from "@/hooks/use-feature-usage";
import { Copy, Loader2 } from "lucide-react";
import "@/styles/CodeExplanation.css";

const PROGRAMMING_LANGUAGES = [
  'Python', 'Java', 'C++', 'JavaScript', 'HTML/CSS', 'PHP', 'Ruby',
  'Swift', 'Kotlin', 'Go', 'Rust', 'TypeScript', 'R'
];

const EXPLANATION_LANGUAGES = [
  'English', 'Hindi', 'Telugu', 'Tamil', 'Bengali', 
  'Marathi', 'Gujarati', 'Kannada', 'Malayalam'
];

const EXPLANATION_TONES = [
  'Professional', 'Friendly', 'Simple (13-year-old)', 
  'Technical', 'Casual', 'Teacher-like'
];

export default function CodeExplanationPage() {
  const { user } = useAuth();
  const { usageCount, trackUsage } = useFeatureUsage("explanation");

  const [code, setCode] = useState("");
  const [programmingLanguage, setProgrammingLanguage] = useState("Python");
  const [explanationLanguage, setExplanationLanguage] = useState("English");
  const [explanationTone, setExplanationTone] = useState("Professional");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const getExplanation = async () => {
    if (!code.trim()) {
      alert("Please enter some code to explain");
      return;
    }

    // Check if non-authenticated user has exceeded free usage
    if (!user && usageCount >= 3) {
      setShowLoginPrompt(true);
      return;
    }

    // Check if non-premium user tries to use non-English explanation
    if (!user && explanationLanguage !== "English") {
      alert("Multiple languages only available for registered users");
      return;
    }

    setLoading(true);
    try {
      // Track usage first
      await trackUsage();
      
      // Make API request
      const response = await fetch("/api/code-explanation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          programmingLanguage,
          explanationLanguage,
          explanationTone
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to generate explanation");
      }

      const data = await response.json();
      setExplanation(data.explanation);
    } catch (error) {
      console.error("Error generating explanation:", error);
      alert(error instanceof Error ? error.message : "Failed to generate explanation");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    navigator.clipboard.writeText(explanation)
      .then(() => alert("Explanation copied to clipboard!"))
      .catch(err => console.error("Failed to copy: ", err));
  };

  return (
    <div className="code-explanation-container">
      <div className="content">
        <h1 className="title">Code Explanation Tool</h1>
        
        <div className="select-container">
          <label className="label">Programming Language:</label>
          <select
            value={programmingLanguage}
            onChange={(e) => setProgrammingLanguage(e.target.value)}
            className="select"
          >
            {PROGRAMMING_LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <div className="select-container">
          <label className="label">Explanation Tone:</label>
          <select
            value={explanationTone}
            onChange={(e) => setExplanationTone(e.target.value)}
            className="select"
          >
            {EXPLANATION_TONES.map((tone) => (
              <option key={tone} value={tone}>{tone}</option>
            ))}
          </select>
        </div>

        <div className="select-container">
          <label className="label">Explanation Language:</label>
          <select
            value={explanationLanguage}
            onChange={(e) => setExplanationLanguage(e.target.value)}
            className="select"
            disabled={!user}
          >
            {EXPLANATION_LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
          {!user && (
            <p className="text-sm text-orange-600 mt-1">
              Multiple languages available only for registered users
            </p>
          )}
        </div>

        <div className="code-input-container">
          <label className="label">Your Code:</label>
          <textarea
            className="code-input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here..."
            rows={10}
          />
        </div>

        {!user && (
          <div className="usage-count">
            You have used <span>{usageCount}/3</span> free explanations
          </div>
        )}

        <button 
          className={`button ${loading ? "button-disabled" : ""}`}
          onClick={getExplanation}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Generating...
            </>
          ) : "Explain Code"}
        </button>

        {explanation && (
          <div className="explanation-container">
            <h2 className="explanation-title">Explanation:</h2>
            <div className="explanation-text">{explanation}</div>
            <button 
              className="copy-button" 
              onClick={handleCopy}
            >
              <Copy size={16} />
              Copy Explanation
            </button>
          </div>
        )}

        {showLoginPrompt && (
          <div className="login-prompt">
            <h3 className="login-prompt-title">Create an Account</h3>
            <p className="login-prompt-text">
              {!user && usageCount >= 3 
                ? "You've reached the limit of free explanations. Create an account to continue using this feature."
                : "Please create an account to copy explanations and access more features."}
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