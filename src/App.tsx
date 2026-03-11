import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PlanProvider } from "@/contexts/PlanContext";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";

// Lazy load non-homepage routes to reduce initial JS bundle
const TemplateGallery = lazy(() => import("./pages/TemplateGallery"));
const TemplatePreview = lazy(() => import("./pages/TemplatePreview"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Login = lazy(() => import("./pages/Login"));
const InvitationBuilder = lazy(() => import("./pages/InvitationBuilder"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const LiveInvite = lazy(() => import("./pages/LiveInvite"));
const RsvpPage = lazy(() => import("./pages/RsvpPage"));
const Pricing = lazy(() => import("./pages/Pricing"));
const BlogIndex = lazy(() => import("./pages/BlogIndex"));
const NotFound = lazy(() => import("./pages/NotFound"));

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
              <Suspense fallback={<div className="min-h-screen bg-background" />}>
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
              </Suspense>
              
            </BrowserRouter>
          </TooltipProvider>
        </PlanProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
