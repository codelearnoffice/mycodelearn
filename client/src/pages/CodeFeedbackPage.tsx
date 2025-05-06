import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useFeatureUsage } from "@/hooks/use-feature-usage";
import { Copy, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import "@/styles/CodeEditor.css";

const PROGRAMMING_LANGUAGES = [
  'Python', 'Java', 'C++', 'JavaScript', 'HTML/CSS', 'PHP', 'Ruby',
  'Swift', 'Kotlin', 'Go', 'Rust', 'TypeScript', 'R'
];

export default function CodeFeedbackPage() {
  const { user } = useAuth();
  const { usageCount, trackUsage } = useFeatureUsage("feedback");
  const { toast } = useToast();
  
  const [code, setCode] = useState("");
  const [programmingLanguage, setProgrammingLanguage] = useState("Python");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const analyzeCode = async () => {
    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please enter some code to analyze",
        variant: "destructive"
      });
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
      
      const prompt = `Act as a ${programmingLanguage} code interpreter and error checker. Here's the code:\n\n${code}\n\nIf there are any errors, explain them in simple terms and suggest fixes. If the code is correct, show the expected output.`;

      const response = await fetch('https://api.a0.dev/ai/llm', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are a helpful programming interpreter.' },
            { role: 'user', content: prompt }
          ]
        })
      });

      if (!response.ok) {
        let errorMessage = "Failed to generate feedback";
        try {
          const error = await response.json();
          errorMessage = error?.message || errorMessage;
        } catch (_) {
          // If response is not JSON, keep the default message
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("API Response:", data); // Debug log
      
      // Handle different API response formats
      const feedbackText = data.completion || data.feedback || data.content || data.result || data.output || "";
      
      if (!feedbackText) {
        console.warn("No feedback text found in API response:", data);
      }
      
      setFeedback(feedbackText);
      toast({
        title: "Success",
        description: "Code analyzed successfully!",
      });
    } catch (error) {
      console.error("Error generating feedback:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate feedback",
        variant: "destructive"
      });
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
      .then(() => {
        toast({
          title: "Copied",
          description: "Feedback copied to clipboard!"
        });
      })
      .catch(err => {
        console.error("Failed to copy: ", err);
        toast({
          title: "Error",
          description: "Failed to copy to clipboard",
          variant: "destructive"
        });
      });
  };

  return (
    <div className="bg-background" style={{ minHeight: '100vh', paddingBottom: '32px' }}>
      <Navbar />
      <div style={{ width: '100%', maxWidth: 900, margin: '0 auto', padding: 24, paddingTop: '110px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24 }}>Code Feedback Tool</h1>
        
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
          <label className="label">Code Editor:</label>
          <textarea
            className="code-input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Write your code here for analysis and error checking..."
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
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            'Analyze Code'
          )}
        </button>

        {feedback && (
          <div className="output-container">
            <div className="explanation-header">
              <h2 className="output-title">Analysis & Feedback:</h2>
              <button 
                className="copy-button" 
                onClick={handleCopy}
                title="Copy to clipboard"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <div className="output-text">{feedback}</div>
          </div>
        )}

        {showLoginPrompt && (
          <div className="login-prompt">
            <p>
              {!user && usageCount >= 3 
                ? "You've reached the limit of free analyses. Sign in to continue using this feature."
                : "Please sign in to copy feedback and access more features."}
            </p>
            <Link to="/auth" className="login-button">
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}