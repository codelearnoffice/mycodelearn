import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import CodeExplanationPage from "@/pages/CodeExplanationPage";
import CodeFeedbackPage from "@/pages/CodeFeedbackPage";
import ProjectIdeasPage from "@/pages/ProjectIdeasPage";
import AuthPage from "@/pages/AuthPage";
import MyAccountPage from "@/pages/MyAccountPage";
import Documentation from "@/pages/Documentation";
import Tutorials from "@/pages/Tutorials";
import Support from "@/pages/Support";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Privacy from "@/pages/Privacy";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";


function BetaVersionNote() {
  const [location] = useLocation();
  
  // Hide the beta note on the auth page
  if (location === '/auth') {
    return null;
  }
  
  return (
    <div className="bg-yellow-100 text-yellow-800 p-2 text-center fixed top-0 left-0 right-0 z-[60]" style={{ marginTop: '64px' }}>
      This is a beta version. Some features may have bugs. Your feedback is appreciated as we improve for the full release.
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/code-explanation" component={CodeExplanationPage} />
      <Route path="/code-feedback" component={CodeFeedbackPage} />
      <Route path="/project-ideas" component={ProjectIdeasPage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/my-account" component={MyAccountPage} />
      <Route path="/documentation" component={Documentation} />
      <Route path="/tutorials" component={Tutorials} />
      <Route path="/support" component={Support} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/privacy" component={Privacy} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BetaVersionNote />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;