import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import Contacts from "@/pages/contacts";
import Pipeline from "@/pages/pipeline";
import Campaigns from "@/pages/campaigns";
import Funnels from "@/pages/funnels";
import Automation from "@/pages/automation";
import Messaging from "@/pages/messaging";
import Calendar from "@/pages/calendar";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";
import MainLayout from "./components/layout/main-layout";
import { SubaccountProvider } from "./components/layout/subaccount-switcher";

function Router() {
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/contacts" component={Contacts} />
        <Route path="/pipeline" component={Pipeline} />
        <Route path="/campaigns" component={Campaigns} />
        <Route path="/funnels" component={Funnels} />
        <Route path="/automation" component={Automation} />
        <Route path="/messaging" component={Messaging} />
        <Route path="/calendar" component={Calendar} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SubaccountProvider>
          <Toaster />
          <Router />
        </SubaccountProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
