import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <span className="text-2xl font-bold text-primary cursor-pointer">
                  Code<span className="text-secondary">Learn</span>
                </span>
              </Link>
            </div>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-6">
            <a href="#features" className="text-primary hover:text-secondary text-sm font-medium transition-colors duration-200">
              Code Explanation
            </a>
            <a href="#how-it-works" className="text-primary hover:text-secondary text-sm font-medium transition-colors duration-200">
              Code Feedback
            </a>
            <a href="#features" className="text-primary hover:text-secondary text-sm font-medium transition-colors duration-200">
              Project Ideas
            </a>
            <Button className="bg-secondary text-white hover:bg-secondary/90">Sign Up</Button>
          </div>
          <div className="flex items-center md:hidden">
            <button 
              type="button" 
              className="text-primary p-2"
              onClick={toggleMobileMenu}
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </div>
      
      <div className={cn("md:hidden", mobileMenuVisible ? "block" : "hidden")}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a 
            href="#features" 
            className="block text-primary hover:text-secondary text-base font-medium p-2"
            onClick={() => setMobileMenuVisible(false)}
          >
            Code Explanation
          </a>
          <a 
            href="#how-it-works" 
            className="block text-primary hover:text-secondary text-base font-medium p-2"
            onClick={() => setMobileMenuVisible(false)}
          >
            Code Feedback
          </a>
          <a 
            href="#features" 
            className="block text-primary hover:text-secondary text-base font-medium p-2"
            onClick={() => setMobileMenuVisible(false)}
          >
            Project Ideas
          </a>
          <Button 
            className="block w-full bg-secondary text-white hover:bg-secondary/90 mt-4"
            onClick={() => setMobileMenuVisible(false)}
          >
            Sign Up
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
