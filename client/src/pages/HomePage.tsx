import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/productStore";
import FeaturedProducts from "../components/FeaturedProducts";
import { Loader } from "lucide-react";

const categories = [
  { href: "/jeans", name: "Jeans", imageUrl: "/jeans.jpg" },
  { href: "/t-shirts", name: "T-shirts", imageUrl: "/tshirts.jpg" },
  { href: "/shoes", name: "Shoes", imageUrl: "/shoes.jpg" },
  { href: "/glasses", name: "Glasses", imageUrl: "/glasses.png" },
  { href: "/jackets", name: "Jackets", imageUrl: "/jackets.jpg" },
  { href: "/bags", name: "Bags", imageUrl: "/bags.jpg" },
];

const HomePage = (): React.ReactElement => {
  const { fetchFeaturedProducts, products, isLoading, error } =
    useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <h1 className="text-center text-4xl sm:text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#ff9f1a] to-orange-500">
          Explore Our Categories
        </h1>
        <p className="text-center text-lg sm:text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Discover the latest trends in eco-friendly fashion
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryItem category={category} key={category.name} />
          ))}
        </div>

        <div className="mt-16">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="w-8 h-8 animate-spin text-orange-400" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 font-medium">{error}</p>
            </div>
          ) : products && products.length > 0 ? (
            <div>
              <h2 className="text-3xl font-semibold text-center text-orange-400 mb-8">
                Featured Products
              </h2>
              <FeaturedProducts featuredProducts={products} />
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">No featured products available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
