import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useFeatureUsage } from "@/hooks/use-feature-usage";
import { Copy, Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import "@/styles/ProjectGenerator.css";

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const PROGRAMMING_LANGUAGES = [
  'Python', 'Java', 'C++', 'JavaScript', 'HTML/CSS', 'PHP', 'Ruby',
  'Swift', 'Kotlin', 'Go', 'Rust', 'TypeScript', 'R'
];
const INTEREST_AREAS = [
  'Web Development', 'Mobile Apps', 'Data Science', 'Game Development',
  'Machine Learning', 'IoT', 'Cybersecurity', 'Desktop Applications',
  'Cloud Computing', 'Blockchain', 'Automation'
];

export default function ProjectIdeasPage() {
  const { user } = useAuth();
  const { usageCount, trackUsage, saveProject, isSaving } = useFeatureUsage("project");
  const { toast } = useToast();
  
  const [skillLevel, setSkillLevel] = useState('Beginner');
  const [programmingLanguage, setProgrammingLanguage] = useState('Python');
  const [interestArea, setInterestArea] = useState('Web Development');
  const [additionalInterests, setAdditionalInterests] = useState('');
  const [projectIdea, setProjectIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);

  const generateIdea = async () => {
    // Check if non-authenticated user has exceeded free usage
    if (!user && usageCount >= 3) {
      setShowLoginPrompt(true);
      return;
    }

    setLoading(true);
    try {
      // Track usage first
      await trackUsage();
      
      // Make API request to get a project idea
      const prompt = `Generate a unique and practical project idea for a ${skillLevel.toLowerCase()} programmer who knows ${programmingLanguage} and is interested in ${interestArea}. Additional interests: ${additionalInterests || 'None'}. Include: 1) Project title 2) Description 3) Key features 4) Learning outcomes 5) Estimated time to complete 6) Required technologies 7) Step-by-step approach`;

      const response = await fetch('https://api.a0.dev/ai/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are a creative programming mentor.' },
            { role: 'user', content: prompt }
          ]
        })
      });

      if (!response.ok) {
        let errorMessage = "Failed to generate project idea";
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
      const ideaText = data.completion || data.projectIdea || data.content || data.result || data.output || "";
      
      if (!ideaText) {
        console.warn("No project idea found in API response:", data);
      }
      
      setProjectIdea(ideaText);
      
      // Generate a default title based on the parameters
      setProjectTitle(`${skillLevel} ${programmingLanguage} ${interestArea} Project`);
      
      toast({
        title: "Success",
        description: "Project idea generated!",
      });
    } catch (error) {
      console.error("Error generating project idea:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate project idea",
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

    navigator.clipboard.writeText(projectIdea)
      .then(() => {
        toast({
          title: "Copied",
          description: "Project idea copied to clipboard!"
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
  
  const handleSave = () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    
    setShowSaveForm(true);
  };
  
  const handleSaveSubmit = () => {
    if (!projectTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for your project",
        variant: "destructive"
      });
      return;
    }
    
    saveProject({
      title: projectTitle,
      description: `${skillLevel} ${programmingLanguage} project for ${interestArea}`,
      content: projectIdea
    });
    
    toast({
      title: "Success",
      description: "Project saved to your account!",
    });
    
    setShowSaveForm(false);
  };

  return (
    <div className="bg-background" style={{ minHeight: '100vh', paddingBottom: '32px' }}>
      <Navbar />
      <div style={{ width: '100%', maxWidth: 900, margin: '0 auto', padding: 24, paddingTop: '110px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24 }}>Project Idea Generator</h1>
        
        <div className="picker-container">
          <label className="label">Skill Level:</label>
          <select
            className="select"
            value={skillLevel}
            onChange={(e) => setSkillLevel(e.target.value)}
          >
            {SKILL_LEVELS.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

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
          <label className="label">Area of Interest:</label>
          <select
            className="select"
            value={interestArea}
            onChange={(e) => setInterestArea(e.target.value)}
          >
            {INTEREST_AREAS.map((area) => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>

        <div className="picker-container">
          <label className="label">Additional Interests or Requirements:</label>
          <textarea
            className="text-input"
            value={additionalInterests}
            onChange={(e) => setAdditionalInterests(e.target.value)}
            placeholder="Enter any specific interests, requirements, or preferences..."
            rows={4}
          />
        </div>

        {!user && (
          <div className="usage-count">
            You have used <span>{usageCount}/3</span> free project generations
          </div>
        )}

        <button 
          className={`button ${loading ? "button-disabled" : ""}`}
          onClick={generateIdea}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span>Generating...</span>
            </>
          ) : (
            'Generate Project Idea'
          )}
        </button>

        {projectIdea && (
          <div className="idea-container">
            <div className="explanation-header">
              <h2 className="idea-title">Your Personalized Project Idea:</h2>
              <button 
                className="copy-button" 
                onClick={handleCopy}
                title="Copy to clipboard"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <div className="idea-text">{projectIdea}</div>
            
            {user && (
              <div className="button-group">
                <button 
                  className="save-button" 
                  onClick={handleSave}
                >
                  <Save size={16} />
                  Save to Account
                </button>
              </div>
            )}
            
            {showSaveForm && (
              <div className="save-form">
                <h3 className="save-form-title">Save Project</h3>
                <div className="save-form-field">
                  <label className="label">Project Title:</label>
                  <input
                    type="text"
                    className="select"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="Enter a title for your project"
                  />
                </div>
                <div className="save-form-buttons">
                  <button 
                    className="button save-button-small"
                    onClick={handleSaveSubmit}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span>Saving...</span>
                      </>
                    ) : 'Save'}
                  </button>
                  <button 
                    className="button cancel-button" 
                    onClick={() => setShowSaveForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {showLoginPrompt && (
          <div className="login-prompt">
            <p>
              {!user && usageCount >= 3 
                ? "You've reached the limit of free project generations. Sign in to continue using this feature."
                : "Please sign in to copy project ideas, save them to your account, and access more features."}
            </p>
            <Link href="/auth" className="login-button">
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}