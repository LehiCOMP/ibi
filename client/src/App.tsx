import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";

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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/estudos" component={BibleStudies} />
      <Route path="/estudos/:id" component={StudyDetail} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:id" component={BlogDetail} />
      <Route path="/forum" component={Forum} />
      <Route path="/forum/:id" component={ForumTopic} />
      <Route path="/eventos" component={Events} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Router />
        </main>
        <Footer />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
