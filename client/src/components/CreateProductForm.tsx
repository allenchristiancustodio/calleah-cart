import { useState, FormEvent, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { Loader, Upload, X } from "lucide-react";
import { useProductStore } from "../stores/productStore";
import toast from "react-hot-toast";

interface CreateProductFormProps {
  onClose: () => void;
}

const CreateProductForm = ({
  onClose,
}: CreateProductFormProps): React.ReactElement => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const { addProduct } = useProductStore();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    if (!name.trim()) {
      toast.error("Please enter a product name");
      return false;
    }
    if (!description.trim()) {
      toast.error("Please enter a product description");
      return false;
    }
    if (!price || parseFloat(price) <= 0) {
      toast.error("Please enter a valid price");
      return false;
    }
    if (!stock || parseInt(stock) < 0) {
      toast.error("Please enter a valid stock quantity");
      return false;
    }
    if (!image) {
      toast.error("Please select a product image");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock", stock);
      if (image) {
        formData.append("image", image);
      }

      await addProduct(formData);
      toast.success("Product added successfully");
      onClose();
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to add product"
      );
    } finally {
      setIsLoading(false);
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Add New Product</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Product Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff9f1a]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff9f1a]"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Price
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff9f1a]"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Stock
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff9f1a]"
                min="0"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Product Image
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <Loader className="w-8 h-8 animate-spin text-[#ff9f1a]" />
                    <p className="mt-2 text-sm text-gray-400">
                      Uploading image...
                    </p>
                  </div>
                ) : previewUrl ? (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="mx-auto h-32 w-32 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setPreviewUrl("");
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                    >
                      <X size={16} className="text-white" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-400">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-[#ff9f1a] hover:text-[#e68a00] focus-within:outline-none"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-400">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-gradient-to-r from-[#ff9f1a] to-orange-500 text-white font-bold rounded-md shadow-lg hover:from-[#e68a00] hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-[#ff9f1a] focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader className="w-5 h-5 animate-spin mx-auto" />
            ) : (
              "Add Product"
            )}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CreateProductForm;
