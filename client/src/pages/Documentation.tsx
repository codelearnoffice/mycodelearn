import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Documentation() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Documentation
        </h1>
        
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="prose prose-indigo max-w-none">
            <h2>Welcome to CodeLearn Documentation</h2>
            <p>
              This documentation will help you understand how to use the CodeLearn platform
              effectively to improve your programming skills and knowledge.
            </p>
            
            <h3>Getting Started</h3>
            <p>
              CodeLearn offers three main tools to help you with your coding journey:
            </p>
            
            <ul>
              <li>
                <strong>Code Explainer</strong> - Understand your code through line-by-line explanations
              </li>
              <li>
                <strong>Error Translator</strong> - Make sense of cryptic error messages
              </li>
              <li>
                <strong>Project Generator</strong> - Get personalized project ideas based on your interests and skill level
              </li>
            </ul>
            
            <h3>Using the Code Explainer</h3>
            <p>
              The Code Explainer tool breaks down your code into easy-to-understand explanations:
            </p>
            <ol>
              <li>Paste your code into the editor</li>
              <li>Select the programming language</li>
              <li>Choose the explanation tone that works best for you</li>
              <li>Get a detailed explanation of what your code does</li>
            </ol>
            
            <h3>Using the Error Translator</h3>
            <p>
              When you encounter an error that's difficult to understand:
            </p>
            <ol>
              <li>Paste your code and the error message</li>
              <li>Select the programming language</li>
              <li>Get a plain-English explanation of what went wrong</li>
              <li>Follow the suggested steps to fix the issue</li>
            </ol>
            
            <h3>Using the Project Generator</h3>
            <p>
              To generate customized project ideas for practice:
            </p>
            <ol>
              <li>Select your skill level</li>
              <li>Choose your preferred programming language</li>
              <li>Pick an area of interest</li>
              <li>Add any additional details or requirements</li>
              <li>Get a personalized project idea with implementation details</li>
            </ol>
            
            <h3>Account Features</h3>
            <p>
              Creating an account allows you to:
            </p>
            <ul>
              <li>Use our tools beyond the free tier limit</li>
              <li>Save your favorite project ideas</li>
              <li>Copy explanations and feedback to your clipboard</li>
              <li>Track your progress over time</li>
            </ul>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}