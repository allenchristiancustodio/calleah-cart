import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import Navbar from "./components/Navbar.tsx";
import FloatingShape from "./components/FloatingShapes.tsx";
import EmailVerificationPage from "./pages/EmailVerificationPage.tsx";
import { Toaster } from "react-hot-toast";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.tsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.tsx";
import { useAuthStore } from "./stores/authStore";
import { useCartStore } from "./stores/cartStore.ts";
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import CategoryPage from "./pages/CategoryPage.tsx";
import CartPage from "./pages/CartPage.tsx";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage.tsx";

const App = (): React.ReactElement => {
  const authStore = useAuthStore();
  const { user, checkAuth, isCheckingAuth } = authStore;

  const cartStore = useCartStore();
  const { getCartItems } = cartStore;

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!user) return;

    getCartItems();
  }, [getCartItems, user]);

  if (isCheckingAuth) return <LoadingSpinner />;
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white  flex items-center justify-center relative overflow-hidden">
      {/* Floating Visual Shapes (Decorative) */}
      <FloatingShape
        color="bg-[#ffaf40]"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-orange-300/20"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShape
        color="bg-[#ff9f1a]/30"
        size="w-32 h-32"
        top="40%"
        left="-10%"
        delay={2}
      />

      {/* Navigation */}
      <Navbar />

      {/* Main App Routes */}
      <main className="relative z-10 pt-10 pb-10 px-4 sm:px-6 lg:px-8 max-w-9xl mx-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/signup"
            element={!user ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!user ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/secret-dashboard"
            element={
              user?.role === "admin" ? <AdminPage /> : <Navigate to="/login" />
            }
          />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route
            path="/cart"
            element={user ? <CartPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/purchase-success"
            element={user ? <PurchaseSuccessPage /> : <Navigate to="/login" />}
          />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Toasts */}
      <Toaster
        toastOptions={{
          style: {
            background: "#1f1f1f",
            color: "#fff",
            border: "1px solid #ff9f1a",
          },
        }}
      />
    </div>
  );
};

export default App;
