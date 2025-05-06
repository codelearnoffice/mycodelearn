import { useState } from "react";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function Support() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !subject || !message) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Support request submitted",
      description: "We'll get back to you as soon as possible!",
    });
    
    // Reset form
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Support
        </h1>
        
        <div className="flex justify-center">
          <div className="max-w-2xl w-full">

            <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">How many free uses do I get?</h3>
                  <p className="mt-2 text-gray-600">
                    The free tier includes 3 uses of each tool (Code Explainer, Error Translator, and Project Generator).
                    Create an account to get access to more features and usage.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">What programming languages do you support?</h3>
                  <p className="mt-2 text-gray-600">
                    Our tools support a wide range of languages including Python, JavaScript, Java, C++, Ruby, PHP, 
                    Swift, Kotlin, Go, Rust, TypeScript, and more.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Can I save or export my results?</h3>
                  <p className="mt-2 text-gray-600">
                    Yes, registered users can copy explanations and feedback to their clipboard. You can also save 
                    project ideas to your account for future reference.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">I found a bug. How do I report it?</h3>
                  <p className="mt-2 text-gray-600">
                    Please use the contact form on this page to report any bugs or issues. Include as much detail 
                    as possible so our team can quickly address the problem.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-primary to-secondary text-white shadow-lg rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-4">Need Immediate Help?</h2>
              <p className="mb-4">
                For urgent issues or personalized assistance, contact our support team directly.
              </p>
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>support@codelearn.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}