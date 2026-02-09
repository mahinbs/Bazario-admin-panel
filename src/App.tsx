import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { AdminLayout } from "./components/AdminLayout";
import Dashboard from "./pages/DashboardNew";
import UsersManagement from "./pages/UsersManagementNew";
import ProductsManagement from "./pages/ProductsManagementNew";
import OrdersManagement from "./pages/OrdersManagementNew";
import StoresManagement from "./pages/StoresManagementNew";
import RidersManagement from "./pages/RidersManagementNew";
import DeliveryManagement from "./pages/DeliveryManagementNew";
import Analytics from "./pages/AnalyticsNew";
import Commission from "./pages/Commission";
import LiveChat from "./pages/LiveChat";
import CouponManagement from "./pages/CouponManagement";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="users" element={<UsersManagement />} />
              <Route path="products" element={<ProductsManagement />} />
              <Route path="orders" element={<OrdersManagement />} />
              <Route path="stores" element={<StoresManagement />} />
              <Route path="riders" element={<RidersManagement />} />
              <Route path="delivery" element={<DeliveryManagement />} />
              <Route path="live-chat" element={<LiveChat />} />
              <Route path="coupons" element={<CouponManagement />} />
              <Route path="commission" element={<Commission />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
