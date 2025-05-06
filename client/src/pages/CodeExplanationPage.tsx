import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useFeatureUsage } from "@/hooks/use-feature-usage";
import { Copy, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
  const { usageCount, isAtFreeLimit, trackUsage } = useFeatureUsage("explanation");
  const { toast } = useToast();

  const [code, setCode] = useState("");
  const [programmingLanguage, setProgrammingLanguage] = useState("Python");
  const [explanationLanguage, setExplanationLanguage] = useState("English");
  const [explanationTone, setExplanationTone] = useState("Professional");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const getExplanation = async () => {
    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please enter some code to explain",
        variant: "destructive"
      });
      return;
    }

    if (!user && usageCount >= 3) {
      setShowLoginPrompt(true);
      return;
    }

    if (!user && explanationLanguage !== "English") {
      toast({
        title: "Feature Restricted",
        description: "Multiple languages only available for registered users",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await trackUsage();
      
      const prompt = `As a ${explanationTone.toLowerCase()} programming teacher, explain this ${programmingLanguage} code in ${explanationLanguage}. Focus on clear, direct explanations for each line. Here's the code:\n\n${code}`;

      const response = await fetch('https://api.a0.dev/ai/llm', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are a helpful programming teacher.' },
            { role: 'user', content: prompt }
          ]
        })
      });

      if (!response.ok) {
        let errorMessage = "Failed to generate explanation";
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
      const explanationText = data.completion || data.explanation || data.content || data.result || data.output || "";
      
      if (!explanationText) {
        console.warn("No explanation text found in API response:", data);
      }
      
      setExplanation(explanationText);
      toast({
        title: "Success",
        description: "Code explanation generated!",
      });
    } catch (error) {
      console.error("Error generating explanation:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate explanation",
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

    navigator.clipboard.writeText(explanation)
      .then(() => {
        toast({
          title: "Copied",
          description: "Explanation copied to clipboard!"
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
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24 }}>Code Explanation Tool</h1>
        
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
          >
            {EXPLANATION_LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
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

        <button 
          className={`button ${loading ? 'button-disabled' : ''}`}
          onClick={getExplanation}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Generating...</span>
            </>
          ) : 'Explain Code'}
        </button>

        {showLoginPrompt && (
          <div className="login-prompt">
            <p>You've reached the limit for free explanations. Please sign in to continue.</p>
            <Link to="/auth" className="login-button">Sign In</Link>
          </div>
        )}

        {explanation && (
          <div className="explanation-container">
            <div className="explanation-header">
              <h2 className="explanation-title">Explanation:</h2>
              <button 
                className="copy-button" 
                onClick={handleCopy}
                title="Copy to clipboard"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <div className="explanation-text">{explanation}</div>
          </div>
        )}
      </div>
    </div>
  );
}
