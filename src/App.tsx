
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Breadcrumbs from "@/components/Breadcrumbs";
import Index from "./pages/Index";
import AdminPanel from "./pages/AdminPanel";
import Admin from "./pages/Admin";
import ClientCabinet from "./pages/ClientCabinet";
import NotFound from "./pages/NotFound";
import ChatGPTPage from "./pages/ChatGPTPage";
import NewsPage from "./pages/NewsPage";
import AdminNewsPage from "./pages/AdminNewsPage";
import CatalogPage from "./pages/CatalogPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Breadcrumbs />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/ads" element={<Admin />} />
          <Route path="/admin/news" element={<AdminNewsPage />} />
          <Route path="/cabinet" element={<ClientCabinet />} />
          <Route path="/chatgpt" element={<ChatGPTPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;