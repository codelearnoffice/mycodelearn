import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { LogOut, Folder } from "lucide-react";
import codelearnLogo from "@/assets/codelearnlogo.png";

const Navbar = () => {
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const { user, logout } = useAuth();
  const [location] = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };

  const handleLogout = () => {
    logout();
    setMobileMenuVisible(false);
  };


  const isActivePath = (path: string) => {
    return location === path;
  };

  return (
    <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center space-x-2">
  <img
    src={codelearnLogo}
    alt="CodeLearn Logo"
    className="h-7 w-auto cursor-pointer"
    style={{ display: 'inline-block' }}
  />
  <span className=" font-bold text-primary cursor-pointer select-none" 
  style={{ fontSize: "1.3rem", lineHeight: "2rem" }} // 1.5rem is between xl (1.25rem) and 2xl (1.5rem)
  >
    Simple<span className="text-secondary">Codr</span>
  </span>
</Link>
            </div>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link href="/code-explanation" className={cn(
                "text-sm font-medium transition-colors duration-200",
                isActivePath("/code-explanation") 
                  ? "text-secondary font-semibold" 
                  : "text-primary hover:text-secondary"
              )}>
                Code Explanation
            </Link>
            <Link href="/code-feedback" className={cn(
                "text-sm font-medium transition-colors duration-200",
                isActivePath("/code-feedback") 
                  ? "text-secondary font-semibold" 
                  : "text-primary hover:text-secondary"
              )}>
                Code Feedback
            </Link>
            <Link href="/project-ideas" className={cn(
                "text-sm font-medium transition-colors duration-200",
                isActivePath("/project-ideas") 
                  ? "text-secondary font-semibold" 
                  : "text-primary hover:text-secondary"
              )}>
                Project Ideas
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                
<Link href="/my-account" className="text-gray-700 hover:text-blue-600 p-2 rounded-full" aria-label="My Account">
  <User size={22} />
</Link>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/auth">
                <Button className="bg-secondary text-white hover:bg-secondary/90">
                  Sign Up / Login
                </Button>
              </Link>
            )}
          </div>
          <div className="flex items-center md:hidden">
            <button 
              type="button" 
              className="text-primary p-2"
              onClick={toggleMobileMenu}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div className={cn("md:hidden", mobileMenuVisible ? "block" : "hidden")}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link 
            href="/code-explanation"
            className={cn(
              "block text-base font-medium p-2",
              isActivePath("/code-explanation") 
                ? "text-secondary font-semibold dark:text-secondary" 
                : "text-primary hover:text-secondary dark:text-gray-300 dark:hover:text-secondary"
            )}
            onClick={() => setMobileMenuVisible(false)}
          >
            Code Explanation
          </Link>
          <Link 
            href="/code-feedback"
            className={cn(
              "block text-base font-medium p-2",
              isActivePath("/code-feedback") 
                ? "text-secondary font-semibold dark:text-secondary" 
                : "text-primary hover:text-secondary dark:text-gray-300 dark:hover:text-secondary"
            )}
            onClick={() => setMobileMenuVisible(false)}
          >
            Code Feedback
          </Link>
          <Link 
            href="/project-ideas"
            className={cn(
              "block text-base font-medium p-2",
              isActivePath("/project-ideas") 
                ? "text-secondary font-semibold dark:text-secondary" 
                : "text-primary hover:text-secondary dark:text-gray-300 dark:hover:text-secondary"
            )}
            onClick={() => setMobileMenuVisible(false)}
          >
            Project Ideas
          </Link>
          
          {user ? (
            <>
              <Link 
                href="/saved-projects"
                className={cn(
                  "block text-base font-medium p-2 flex items-center gap-2",
                  isActivePath("/saved-projects") 
                    ? "text-secondary font-semibold" 
                    : "text-primary hover:text-secondary"
                )}
                onClick={() => setMobileMenuVisible(false)}
              >
                <Folder size={16} />
                Saved Projects
              </Link>
              <Button 
                className="block w-full bg-red-500 text-white hover:bg-red-600 mt-4 flex items-center justify-center gap-2"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth">
                <Button 
                  className="block w-full bg-secondary text-white hover:bg-secondary/90 mt-4"
                  onClick={() => setMobileMenuVisible(false)}
                >
                  Sign Up / Login
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
