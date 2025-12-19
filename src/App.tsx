import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import DossierList from "./pages/DossierList";
import DossierDetail from "./pages/DossierDetail";
import NewDossier from "./pages/NewDossier";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AuthRedirect() {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return <Auth />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<AuthRedirect />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/dossiers" element={
              <ProtectedRoute>
                <DossierList />
              </ProtectedRoute>
            } />
            <Route path="/dossiers/new" element={
              <ProtectedRoute>
                <NewDossier />
              </ProtectedRoute>
            } />
            <Route path="/dossiers/:id" element={
              <ProtectedRoute>
                <DossierDetail />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
