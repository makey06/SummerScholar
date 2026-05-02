import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Categories from "@/pages/categories";
import CategoryView from "@/pages/category";
import LessonPlayer from "@/pages/lesson";
import Achievements from "@/pages/achievements";
import Profile from "@/pages/profile";
import Navigation from "@/components/Navigation";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30000, retry: 1 } },
});

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/categories">{() => <Categories />}</Route>
          <Route path="/categories/weekly">{() => <Categories defaultTab="weeks" />}</Route>
          <Route path="/categories/:categoryId" component={CategoryView} />
          <Route path="/lessons/:lessonId" component={LessonPlayer} />
          <Route path="/achievements" component={Achievements} />
          <Route path="/profile" component={Profile} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
