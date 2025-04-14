import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useCartStore } from "../stores/cartStore";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const isAdmin = user?.role === "admin";
  const { cart } = useCartStore();

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-50 border-b border-orange-800">
      <div className="container mx-auto px-4 py-3 flex flex-wrap justify-between items-center">
        <Link to="/" className="flex items-center space-x-3">
          <h2 className="text-orange-500 flex items-center text-2xl">
            <ShoppingCart className="mr-1" />
            CalleahCart
          </h2>
        </Link>

        <nav className="flex flex-wrap items-center gap-4 text-sm sm:text-base font-medium">
          <Link
            to="/"
            className="text-gray-300 hover:text-[#ff9f1a] transition duration-300"
          >
            Home
          </Link>

          {user && (
            <Link
              to="/cart"
              className="relative group text-gray-300 hover:text-[#ff9f1a] transition duration-300"
            >
              <ShoppingCart className="inline-block mr-1" size={20} />
              <span className="hidden sm:inline">Cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -left-2 bg-[#ff9f1a] text-white rounded-full px-2 py-0.5 text-xs">
                  {cart.length}
                </span>
              )}
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/secret-dashboard"
              className="flex items-center bg-[#ff9f1a] hover:bg-[#e68a00] text-white px-3 py-1 rounded-md transition duration-300"
            >
              <Lock className="mr-1" size={18} />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          )}

          {user ? (
            <button
              onClick={logout}
              className="flex items-center bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition duration-300"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline ml-2">Log Out</span>
            </button>
          ) : (
            <>
              <Link
                to="/signup"
                className="flex items-center bg-[#ff9f1a] hover:bg-[#e68a00] text-white py-2 px-4 rounded-md transition duration-300"
              >
                <UserPlus className="mr-2" size={18} />
                Sign Up
              </Link>
              <Link
                to="/login"
                className="flex items-center bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition duration-300"
              >
                <LogIn className="mr-2" size={18} />
                Login
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
export default Navbar;
