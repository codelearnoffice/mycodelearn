import { Switch, Route } from "wouter";
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
import SavedProjectsPage from "@/pages/SavedProjectsPage";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/code-explanation" component={CodeExplanationPage} />
      <Route path="/code-feedback" component={CodeFeedbackPage} />
      <Route path="/project-ideas" component={ProjectIdeasPage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/saved-projects" component={SavedProjectsPage} />
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
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
