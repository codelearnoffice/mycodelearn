import { useState } from "react";
import { useAuth, LoginData, RegisterData } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Loader2, Eye, EyeOff } from "lucide-react";

const REFERRAL_SOURCES = [
  "Google Search",
  "Friend or Colleague",
  "Social Media",
  "Blog or Article",
  "YouTube",
  "School/University",
  "Other"
];

export default function AuthPage() {
  const { user, isLoading, isAuthenticated, login, register } = useAuth();
  const [isLoginView, setIsLoginView] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Form state
  const [formData, setFormData] = useState({
    // Login form
    loginUsername: "",
    loginPassword: "",
    
    // Register form
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phoneNumber: "",
    profession: "",
    referralSource: REFERRAL_SOURCES[0]
  });
  
  // If the user is already logged in, redirect to the home page
  if (isAuthenticated && user) {
    return <Redirect to="/" />;
  }
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { loginUsername, loginPassword } = formData;
    const errors: Record<string, string> = {};
    
    // Validate form
    if (!loginUsername) errors.loginUsername = "Username is required";
    if (!loginPassword) errors.loginPassword = "Password is required";
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      const loginData: LoginData = {
        username: loginUsername,
        password: loginPassword
      };
      
      await login(loginData);
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
      username,
      email,
      password,
      confirmPassword,
      fullName,
      phoneNumber,
      profession,
      referralSource
    } = formData;
    
    const errors: Record<string, string> = {};
    
    // Validate form
    if (!username) {
      errors.username = "Username is required";
    } else if (username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }
    
    if (!email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    // Add validation for the newly required fields
    if (!fullName) {
      errors.fullName = "Full name is required";
    }
    
    if (!phoneNumber) {
      errors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(phoneNumber.replace(/[\s-]/g, ''))) {
      errors.phoneNumber = "Please enter a valid 10-digit phone number";
    }
    
    if (!profession) {
      errors.profession = "Profession is required";
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      const registerData: RegisterData = {
        username,
        email,
        password,
        fullName,
        phoneNumber,
        profession,
        referralSource: referralSource || undefined
      };
      
      await register(registerData);
    } catch (error) {
      console.error("Registration error:", error);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Left side - Form */}
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">
              {isLoginView ? "Sign in to your account" : "Create your account"}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {isLoginView ? (
                <>
                  Or{" "}
                  <button 
                    className="font-medium text-primary hover:text-primary/80"
                    onClick={() => {
                      setIsLoginView(false);
                      setFormErrors({});
                    }}
                  >
                    create a new account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button 
                    className="font-medium text-primary hover:text-primary/80"
                    onClick={() => {
                      setIsLoginView(true);
                      setFormErrors({});
                    }}
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>
          
          {isLoginView ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="loginUsername" className="block text-sm font-medium text-gray-700">
                  Username or Email
                </label>
                <div className="mt-1">
                  <input
                    id="loginUsername"
                    name="loginUsername"
                    type="text"
                    autoComplete="username"
                    value={formData.loginUsername}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      formErrors.loginUsername ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                  />
                  {formErrors.loginUsername && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.loginUsername}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="loginPassword"
                    name="loginPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={formData.loginPassword}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      formErrors.loginPassword ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm pr-10`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  {formErrors.loginPassword && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.loginPassword}</p>
                  )}
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username*
                  </label>
                  <div className="mt-1">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      value={formData.username}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        formErrors.username ? 'border-red-500' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                    />
                    {formErrors.username && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email*
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        formErrors.email ? 'border-red-500' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password*
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        formErrors.password ? 'border-red-500' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm pr-10`}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                    {formErrors.password && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password*
                  </label>
                  <div className="mt-1">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                    />
                    {formErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    Full Name*
                  </label>
                  <div className="mt-1">
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        formErrors.fullName ? 'border-red-500' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                    />
                    {formErrors.fullName && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.fullName}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                    Phone Number*
                  </label>
                  <div className="mt-1">
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      autoComplete="tel"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        formErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                    />
                    {formErrors.phoneNumber && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.phoneNumber}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="profession" className="block text-sm font-medium text-gray-700">
                    Profession*
                  </label>
                  <div className="mt-1">
                    <input
                      id="profession"
                      name="profession"
                      type="text"
                      value={formData.profession}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        formErrors.profession ? 'border-red-500' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                    />
                    {formErrors.profession && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.profession}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="referralSource" className="block text-sm font-medium text-gray-700">
                    How did you hear about us? <span className="text-gray-500">(optional)</span>
                  </label>
                  <div className="mt-1">
                    <select
                      id="referralSource"
                      name="referralSource"
                      value={formData.referralSource}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    >
                      {REFERRAL_SOURCES.map((source) => (
                        <option key={source} value={source}>
                          {source}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
        
        {/* Right side - Hero */}
        <div className="bg-primary hidden md:block relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 opacity-90"></div>
          <div className="absolute inset-0 bg-pattern opacity-10"></div>
          <div className="relative p-8 flex flex-col justify-center h-full text-white">
            <h2 className="text-3xl font-extrabold mb-4">Welcome to SimpleCodr...</h2>
            <p className="text-lg mb-6">
              The ultimate platform for learning coding, helping you understand, debug, and build better code.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-indigo-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Get detailed explanations of your code</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-indigo-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Receive helpful feedback and error translations</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-indigo-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Generate exciting project ideas tailored to your skills</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-indigo-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Save your favorite ideas and explanations</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}