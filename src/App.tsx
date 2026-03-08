import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PlanProvider } from "@/contexts/PlanContext";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import TemplateGallery from "./pages/TemplateGallery";
import TemplatePreview from "./pages/TemplatePreview";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import InvitationBuilder from "./pages/InvitationBuilder";
import Dashboard from "./pages/Dashboard";
import LiveInvite from "./pages/LiveInvite";
import RsvpPage from "./pages/RsvpPage";
import Pricing from "./pages/Pricing";
import BlogIndex from "./pages/BlogIndex";
import NotFound from "./pages/NotFound";
import BrandBadge from "@/components/BrandBadge";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PlanProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/templates" element={<TemplateGallery />} />
                <Route path="/templates/preview/:templateId" element={<TemplatePreview />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/builder/:templateId" element={<InvitationBuilder />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/invite/:slug" element={<LiveInvite />} />
                <Route path="/rsvp/:slug" element={<RsvpPage />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/blog" element={<BlogIndex />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <BrandBadge />
            </BrowserRouter>
          </TooltipProvider>
        </PlanProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
