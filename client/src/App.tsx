import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

// Layouts
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

// Pages
import Home from "./pages/Home";
import BibleStudies from "./pages/BibleStudies";
import Blog from "./pages/Blog";
import Forum from "./pages/Forum";
import Events from "./pages/Events";
import StudyDetail from "./pages/StudyDetail";
import BlogDetail from "./pages/BlogDetail";
import ForumTopic from "./pages/ForumTopic";
import NotFound from "./pages/not-found";
import AuthPage from "./pages/auth-page";

// Componente de transição para páginas
const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Pequeno atraso para garantir que a animação ocorra após o render inicial
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`transition-all duration-500 ease-in-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {children}
    </div>
  );
};

function Router() {
  const [location] = useLocation();

  // Efeito de scroll para o topo da página quando a rota muda
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

        {/* Rotas protegidas que requerem autenticação */}
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Header />
          <main className="flex-grow">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;