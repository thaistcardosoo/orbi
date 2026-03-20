import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Companies from "@/pages/Companies";
import CompanyProfile from "@/pages/CompanyProfile";
import Jobs from "@/pages/Jobs";
import JobDetail from "@/pages/JobDetail";
import Articles from "@/pages/Articles";
import StatePage from "@/pages/StatePage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/empresas" component={Companies} />
      <Route path="/empresas/:slug" component={CompanyProfile} />
      <Route path="/vagas" component={Jobs} />
      <Route path="/vagas/:id" component={JobDetail} />
      <Route path="/artigos" component={Articles} />
      <Route path="/estados/sc" component={StatePage} />
      <Route component={NotFound} />
    </Switch>
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
