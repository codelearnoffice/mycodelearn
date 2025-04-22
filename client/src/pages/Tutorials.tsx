import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Tutorials() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Tutorials
        </h1>
        
        <div className="grid gap-8 md:grid-cols-2">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
              <h3 className="text-2xl font-bold text-white">Getting Started with CodeLearn</h3>
            </div>
            <div className="p-6">
              <h4 className="text-xl font-semibold mb-2">Learn the basics</h4>
              <p className="text-gray-600 mb-4">
                This tutorial walks you through the core features of CodeLearn and how to make the most of our tools.
              </p>
              <span className="text-sm text-gray-500">15 min read</span>
            </div>
          </div>
          
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center">
              <h3 className="text-2xl font-bold text-white">Understanding Python Errors</h3>
            </div>
            <div className="p-6">
              <h4 className="text-xl font-semibold mb-2">Debug with confidence</h4>
              <p className="text-gray-600 mb-4">
                Learn how to interpret common Python error messages and efficiently fix them using our Error Translator.
              </p>
              <span className="text-sm text-gray-500">20 min read</span>
            </div>
          </div>
          
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-amber-500 to-pink-500 flex items-center justify-center">
              <h3 className="text-2xl font-bold text-white">JavaScript Fundamentals</h3>
            </div>
            <div className="p-6">
              <h4 className="text-xl font-semibold mb-2">Build your JS foundation</h4>
              <p className="text-gray-600 mb-4">
                A comprehensive guide to understanding JavaScript code examples using our Code Explainer tool.
              </p>
              <span className="text-sm text-gray-500">25 min read</span>
            </div>
          </div>
          
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
              <h3 className="text-2xl font-bold text-white">Building Your First Project</h3>
            </div>
            <div className="p-6">
              <h4 className="text-xl font-semibold mb-2">From idea to implementation</h4>
              <p className="text-gray-600 mb-4">
                Follow along as we take a project idea from our generator and build it step by step.
              </p>
              <span className="text-sm text-gray-500">30 min read</span>
            </div>
          </div>
          
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
              <h3 className="text-2xl font-bold text-white">Java Error Handling</h3>
            </div>
            <div className="p-6">
              <h4 className="text-xl font-semibold mb-2">Master Java debugging</h4>
              <p className="text-gray-600 mb-4">
                Deep dive into common Java exceptions and learn how to solve them efficiently.
              </p>
              <span className="text-sm text-gray-500">22 min read</span>
            </div>
          </div>
          
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-purple-500 to-violet-500 flex items-center justify-center">
              <h3 className="text-2xl font-bold text-white">Advanced Python Projects</h3>
            </div>
            <div className="p-6">
              <h4 className="text-xl font-semibold mb-2">Level up your skills</h4>
              <p className="text-gray-600 mb-4">
                Explore complex Python project ideas and implementation approaches for intermediate learners.
              </p>
              <span className="text-sm text-gray-500">35 min read</span>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}