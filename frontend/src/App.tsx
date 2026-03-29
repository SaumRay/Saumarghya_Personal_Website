import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Gallery from "@/pages/Gallery";
import AdminPage from "@/pages/admin/AdminPage";
import { ThemeProvider } from "@/hooks/use-theme";
import { AdminAuthProvider } from "@/hooks/use-admin-auth";
import { VisitorGate } from "@/components/VisitorGate";
import InterestCategory from "@/pages/InterestCategory";
import Stats from "@/pages/Stats";
import FamilyFriends from "@/pages/FamilyFriends";
import Notes from "@/pages/Notes";
import NoteDetail from "@/pages/NoteDetail";
import Music from "@/pages/Music";
import Favourites from "@/pages/Favourites";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/interests" component={InterestCategory} />
      <Route path="/stats" component={Stats} />
      <Route path="/family-friends" component={FamilyFriends} />
      <Route path="/notes" component={Notes} />
      <Route path="/notes/:id" component={NoteDetail} />
      <Route path="/music" component={Music} />
      <Route path="/favourites" component={Favourites} />
      <Route path="/admin" component={AdminPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AdminAuthProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <VisitorGate>
                <Router />
              </VisitorGate>
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </QueryClientProvider>
      </AdminAuthProvider>
    </ThemeProvider>
  );
}

export default App;