import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import { useCartStore } from "../stores/cartStore";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  description: string;
}

const ProductCard = ({ product }: { product: Product }) => {
  const { user } = useAuthStore();
  const { addToCart } = useCartStore();
  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add products to cart", { id: "login" });
      return;
    } else {
      // add to cart
      addToCart(product);
    }
  };

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-orange-400/30 shadow-lg bg-white/5 backdrop-blur-md hover:shadow-orange-300/20 transition-shadow duration-300">
      <div className="relative h-60 overflow-hidden rounded-t-2xl">
        <img
          className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
          src={product.image}
          alt={product.name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      <div className="px-6 py-5">
        <h5 className="text-xl font-semibold text-white mb-2 truncate">
          {product.name}
        </h5>
        <p className="text-sm text-gray-300 line-clamp-2 mb-4">
          {product.description}
        </p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-orange-400">
            ${product.price.toFixed(2)}
          </span>
        </div>
        <button
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-white font-medium py-2.5 transition duration-300"
          onClick={handleAddToCart}
        >
          <ShoppingCart size={20} />
          Add to Cart
        </button>
      </div>
    </div>
  );
};
export default ProductCard;
