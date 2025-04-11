import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { AuthProvider } from "./hooks/use-auth";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "./components/ui/toaster";
import { Header } from "./components/layout/Header";
import { ProtectedRoute } from "./lib/protected-route";

import Home from "./pages/Home";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import AuthPage from "./pages/auth-page";
import BibleStudies from "./pages/BibleStudies";
import StudyDetail from "./pages/StudyDetail";
import Forum from "./pages/Forum";
import ForumTopic from "./pages/ForumTopic";
import Events from "./pages/Events";
import NotFound from "./pages/not-found";

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`transition-all duration-500 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {children}
    </div>
  );
};

function Router() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <PageTransition>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:id" component={BlogDetail} />
        <Route path="/auth" component={AuthPage} />
        <ProtectedRoute path="/estudos" component={BibleStudies} />
        <ProtectedRoute path="/estudos/:id" component={StudyDetail} />
        <ProtectedRoute path="/forum" component={Forum} />
        <ProtectedRoute path="/forum/:id" component={ForumTopic} />
        <ProtectedRoute path="/eventos" component={Events} />
        <Route component={NotFound} />
      </Switch>
    </PageTransition>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-neutral-lightest">
          <Header />
          <main className="w-full h-full overflow-y-auto">
            <Router />
          </main>
          <Toaster />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}