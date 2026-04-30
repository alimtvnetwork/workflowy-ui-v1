import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Deck from "./pages/Deck.tsx";
import BackendDeck from "./pages/BackendDeck.tsx";
import OpsDeck from "./pages/OpsDeck.tsx";
import EnforcementDeck from "./pages/EnforcementDeck.tsx";
import UserDeck from "./pages/UserDeck.tsx";
import PrintDeck from "./pages/PrintDeck.tsx";
import Presenter from "./pages/Presenter.tsx";
import ApiPlayground from "./pages/ApiPlayground.tsx";
import SyncSimulator from "./pages/SyncSimulator.tsx";
import TrashReaper from "./pages/TrashReaper.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/deck" element={<Deck />} />
          <Route path="/backend-deck" element={<BackendDeck />} />
          <Route path="/ops-deck" element={<OpsDeck />} />
          <Route path="/enforcement-deck" element={<EnforcementDeck />} />
          <Route path="/user-deck" element={<UserDeck />} />
          <Route path="/print" element={<PrintDeck />} />
          <Route path="/presenter" element={<Presenter />} />
          <Route path="/api-playground" element={<ApiPlayground />} />
          <Route path="/sync-simulator" element={<SyncSimulator />} />
          <Route path="/trash-reaper" element={<TrashReaper />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
