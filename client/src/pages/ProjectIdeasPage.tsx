import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useFeatureUsage } from "@/hooks/use-feature-usage";
import { Copy, Loader2, Save } from "lucide-react";
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
      
      // Make API request
      const response = await fetch("/api/project-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillLevel,
          programmingLanguage,
          interestArea,
          additionalInterests
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to generate project idea");
      }

      const data = await response.json();
      setProjectIdea(data.projectIdea);
      
      // Generate a default title based on the parameters
      setProjectTitle(`${skillLevel} ${programmingLanguage} ${interestArea} Project`);
    } catch (error) {
      console.error("Error generating project idea:", error);
      alert(error instanceof Error ? error.message : "Failed to generate project idea");
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
      .then(() => alert("Project idea copied to clipboard!"))
      .catch(err => console.error("Failed to copy: ", err));
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
      alert("Please enter a title for your project");
      return;
    }
    
    saveProject({
      title: projectTitle,
      description: `${skillLevel} ${programmingLanguage} project for ${interestArea}`,
      content: projectIdea
    });
    
    setShowSaveForm(false);
  };

  return (
    <div className="project-generator-container">
      <div className="scroll-view">
        <h1 className="title">Project Idea Generator</h1>
        
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
              Generating...
            </>
          ) : (
            'Generate Project Idea'
          )}
        </button>

        {projectIdea && (
          <div className="idea-container">
            <h2 className="idea-title">Your Personalized Project Idea:</h2>
            <div className="idea-text">{projectIdea}</div>
            
            <div className="button-group">
              <button 
                className="copy-button" 
                onClick={handleCopy}
              >
                <Copy size={16} />
                Copy Idea
              </button>
              
              {user && (
                <button 
                  className="save-button" 
                  onClick={handleSave}
                >
                  <Save size={16} />
                  Save to Account
                </button>
              )}
            </div>
            
            {showSaveForm && (
              <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                <h3 className="text-lg font-semibold mb-2">Save Project</h3>
                <div className="mb-4">
                  <label className="label">Project Title:</label>
                  <input
                    type="text"
                    className="select"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="Enter a title for your project"
                  />
                </div>
                <div className="flex space-x-2">
                  <button 
                    className="button !min-w-0 !m-0"
                    onClick={handleSaveSubmit}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : 'Save'}
                  </button>
                  <button 
                    className="copy-button" 
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
            <h3 className="login-prompt-title">Create an Account</h3>
            <p className="login-prompt-text">
              {!user && usageCount >= 3 
                ? "You've reached the limit of free project generations. Create an account to continue using this feature."
                : "Please create an account to copy project ideas, save them to your account, and access more features."}
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