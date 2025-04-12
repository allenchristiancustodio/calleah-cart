import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";
import { AxiosError } from "axios";

// Define interfaces for better type safety
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isFeatured: boolean;
  stock: number;
  sales: number;
  [key: string]: any;
}

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  setProducts: (products: Product[]) => void;
  createProduct: (productData: Partial<Product>) => Promise<void>;
  fetchAllProducts: () => Promise<void>;
  fetchProductsByCategory: (category: string) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  toggleFeaturedProduct: (productId: string) => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  getProducts: () => Promise<Product[]>;
  addProduct: (formData: FormData) => Promise<void>;
  updateProduct: (id: string, formData: FormData) => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  isLoading: false,
  error: null,

  setProducts: (products) => set({ products }),

  createProduct: async (productData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post("/products", productData);
      set((prevState) => ({
        products: [...prevState.products, res.data],
        loading: false,
      }));
      toast.success("Product created successfully");
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to create product",
      });
      toast.error(error.response?.data?.error || "Failed to create product");
    }
  },

  fetchAllProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get("/products");
      set({ products: response.data.products, isLoading: false });
    } catch (error: unknown) {
      set({ error: "Failed to fetch products", isLoading: false });
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data?.error || "Failed to fetch products");
      } else {
        toast.error("Failed to fetch products");
      }
    }
  },

  fetchProductsByCategory: async (category) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`/products/category/${category}`);
      set({ products: response.data.products, isLoading: false });
    } catch (error: unknown) {
      set({ error: "Failed to fetch products", isLoading: false });
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data?.error || "Failed to fetch products");
      } else {
        toast.error("Failed to fetch products");
      }
    }
  },

  deleteProduct: async (productId) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`/products/${productId}`);
      set((prevState) => ({
        products: prevState.products.filter(
          (product) => product._id !== productId
        ),
        loading: false,
      }));
      toast.success("Product deleted successfully");
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to delete product",
      });
      toast.error(error.response?.data?.error || "Failed to delete product");
    }
  },

  toggleFeaturedProduct: async (productId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.patch(`/products/${productId}`);
      set((prevState) => ({
        products: prevState.products.map((product) =>
          product._id === productId
            ? { ...product, isFeatured: response.data.isFeatured }
            : product
        ),
        isLoading: false,
      }));
      toast.success("Product updated successfully");
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to update product",
      });
      toast.error(error.response?.data?.error || "Failed to update product");
    }
  },

  fetchFeaturedProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get("/products/featured");
      set({ products: response.data, isLoading: false });
    } catch (error: unknown) {
      set({ error: "Failed to fetch featured products", isLoading: false });
      if (error instanceof AxiosError && error.response) {
        toast.error(
          error.response.data?.error || "Failed to fetch featured products"
        );
      } else {
        toast.error("Failed to fetch featured products");
      }
    }
  },

  getProducts: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get("/products");
      set({ products: response.data });
      return response.data;
    } catch (error) {
      set({ error: "Failed to fetch products" });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  addProduct: async (formData: FormData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set((state) => ({
        products: [...state.products, response.data],
      }));
    } catch (error) {
      set({ error: "Failed to add product" });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateProduct: async (id: string, formData: FormData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.put(`/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set((state) => ({
        products: state.products.map((product) =>
          product._id === id ? response.data : product
        ),
      }));
    } catch (error) {
      set({ error: "Failed to update product" });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
