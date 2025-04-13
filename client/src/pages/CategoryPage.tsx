import { useEffect, useState } from "react";
import { useProductStore } from "../stores/productStore";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";

const CategoryPage = (): React.ReactElement => {
  const { fetchProductsByCategory, products, isLoading, error } =
    useProductStore();
  const { category } = useParams();
  const [localLoading, setLocalLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      if (!category) {
        navigate("/");
        return;
      }

      setLocalLoading(true);
      try {
        await fetchProductsByCategory(category);
      } catch (err) {
        console.error("Error loading products:", err);
        toast.error("Failed to load products. Please try again later.");
        navigate("/");
      } finally {
        setLocalLoading(false);
      }
    };

    loadProducts();
  }, [category, fetchProductsByCategory, navigate]);

  if (isLoading || localLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h1
          className="text-center text-4xl sm:text-5xl font-bold text-emerald-400 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {category ? category.charAt(0).toUpperCase() + category.slice(1) : ""}
        </motion.h1>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {products?.length === 0 && (
            <h2 className="text-3xl font-semibold text-gray-300 text-center col-span-full">
              No products found
            </h2>
          )}

          {products?.map((product) => (
            <ProductCard
              key={product._id}
              product={{ ...product, quantity: product.quantity || 0 }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default CategoryPage;
