import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";

const Navbar: React.FC = () => {
  const user = true;
  const isAdmin = true;

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800">
      <div className="container mx-auto px-4 py-3">
        <Link
          to="/"
          className="text-2xl font-bold text-emerald-400 items-center space-x-2 flex"
        >
          Calleh Cart
        </Link>
        <nav className="flex flex-wrap items-center gap-4">
          <Link
            to={"/"}
            className="text-white hover:text-emerald-400 transition-colors"
          >
            Home
          </Link>
          {user && (
            <Link
              to={"/cart"}
              className="text-white hover:text-emerald-400 transition-colors"
            >
              <ShoppingCart
                className="inline-block mr-1 group-hover:text-emerald-400 transition-colors"
                size={20}
              />
              <span className="absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out">
                3
              </span>
            </Link>
          )}
          {isAdmin && (
            <Link
              className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium
								 transition duration-300 ease-in-out flex items-center"
              to={"/secret-dashboard"}
            >
              <Lock className="inline-block mr-1" size={18} />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
