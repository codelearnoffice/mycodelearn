import { 
  Twitter, 
  Instagram, 
  Linkedin 
} from "lucide-react";
import FeedbackForm from "./FeedbackForm";

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-dark text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold">
              Simple<span className="text-secondary">Codr</span>
            </div>
            <p className="mt-4 text-white-400">
              Making coding education accessible, understandable, and enjoyable for students worldwide.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-white-400 hover:text-white transition-colors duration-200">
                <Twitter className="h-5 w-5" />
              </a>
                            <a href="#" className="text-white-400 hover:text-white transition-colors duration-200">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-white-400 hover:text-white transition-colors duration-200">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="/code-explanation" className="text-white-400 hover:text-white transition-colors duration-200">Code Explainer</a></li>
              <li><a href="/code-feedback" className="text-white-400 hover:text-white transition-colors duration-200">Error Translator</a></li>
              <li><a href="/project-ideas" className="text-white-400 hover:text-white transition-colors duration-200">Project Generator</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="/documentation" className="text-white-400 hover:text-white transition-colors duration-200">Documentation</a></li>
              <li><a href="/tutorials" className="text-white-400 hover:text-white transition-colors duration-200">Tutorials</a></li>
              <li><a href="/support" className="text-white-400 hover:text-white transition-colors duration-200">Support</a></li>
            </ul>
          </div>
          
          <div>
  <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
  <address className="not-italic text-white-400 text-base mb-2">
    Bagathngar, Karimnagar, Telangana, India<br />
    Pincode: 505001
  </address>
  <div className="text-white-400 text-base">
    Email: <a href="mailto:info@codelearn.com" className="underline hover:text-white">info@codelearn.com</a><br />
    Support: <a href="mailto:support@codelearn.com" className="underline hover:text-white">support@codelearn.com</a>
  </div>
</div>
        </div>
        
        
        
        <div className="mt-12 pt-8 border-t border-white-800 text-center text-white-400">
          <p>&copy; {new Date().getFullYear()} CodeLearn. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
