import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useProductStore } from "../stores/productStore";
import { Loader } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  sales: number;
}

const AnalyticsTab = (): React.ReactElement => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);
  const productStore = useProductStore();
  const { fetchAllProducts } = productStore as {
    fetchAllProducts: Function;
  };

  useEffect(() => {
    const fetchProducts = async (): Promise<void> => {
      try {
        const fetchedProducts = await fetchAllProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [fetchAllProducts]);

  const chartData = products.map((product) => ({
    name: product.name,
    sales: product.sales,
    stock: product.stock,
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-[#ff9f1a]" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg p-6"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Product Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">
            Sales Overview
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "0.5rem",
                    color: "#F3F4F6",
                  }}
                />
                <Bar dataKey="sales" fill="#ff9f1a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">
            Stock Levels
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "0.5rem",
                    color: "#F3F4F6",
                  }}
                />
                <Bar dataKey="stock" fill="#e68a00" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ scale: 1.02 }}
            className="bg-gray-700 rounded-lg p-4"
          >
            <h4 className="text-lg font-semibold text-white mb-2">
              {product.name}
            </h4>
            <div className="space-y-2">
              <p className="text-gray-300">
                Price:{" "}
                <span className="text-[#ff9f1a]">
                  ${product.price.toFixed(2)}
                </span>
              </p>
              <p className="text-gray-300">
                Stock: <span className="text-[#ff9f1a]">{product.stock}</span>
              </p>
              <p className="text-gray-300">
                Sales: <span className="text-[#ff9f1a]">{product.sales}</span>
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AnalyticsTab;
