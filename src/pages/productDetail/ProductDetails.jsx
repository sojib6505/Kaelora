import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../../components/productCard/ProductCard";
import { Phone, ShoppingCart } from "lucide-react";
import { BsWhatsapp } from "react-icons/bs";
import { MdPayment } from "react-icons/md";
import ScrollToTop from "../../components/scrollToTop/ScrollToTop";
import useCart from "../../hooks/useCart";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectImage, setSelectImage] = useState("");
  const [showFull, setShowFull] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/products/${id}`)
      .then((res) => {
        const p = res.data.product;
        setProduct(p);
        setSelectImage(p.images?.[0]?.url || "");
        // Related products (same category)
        return axios.get(
          `${import.meta.env.VITE_API_URL}/products?category=${p.category}&limit=5`,
        );
      })
      .then((res) => {
        setRelated(
          res.data.products?.filter((p) => p._id !== id).slice(0, 4) || [],
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    await addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (loading)
    return (
      <section className="max-w-6xl mx-auto px-4 py-10 mt-16">
        <div className="grid md:grid-cols-2 gap-8 animate-pulse">
          <div className="bg-gray-100 rounded-xl aspect-square" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-100 rounded-xl w-3/4" />
            <div className="h-4 bg-gray-100 rounded-xl" />
            <div className="h-4 bg-gray-100 rounded-xl w-2/3" />
            <div className="h-10 bg-gray-100 rounded-xl w-1/3" />
          </div>
        </div>
      </section>
    );

  if (!product)
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold">Product not found</h2>
        <button
          onClick={() => navigate("/shop")}
          className="mt-4 px-4 py-2 bg-black text-white rounded-lg"
        >
          Back to Shop
        </button>
      </div>
    );

  const displayPrice =
    product.discountPrice > 0 ? product.discountPrice : product.price;
  const words = product.description.split(" ");
  const shortText = words.slice(0, 20).join(" ");
  const isLong = words.length > 20;

  return (
    <>
      <ScrollToTop />
      <section className="max-w-6xl mx-auto px-4 py-10 mt-16">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Images */}
          <div className="flex flex-col-reverse gap-3 md:flex-row md:gap-5">
            <div className="flex gap-2 md:flex-col">
              {product.images?.map((img, idx) => (
                <img
                  key={idx}
                  src={img.url}
                  onClick={() => setSelectImage(img.url)}
                  className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 ${
                    selectImage === img.url
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                />
              ))}
            </div>
            <div className="bg-gray-50 rounded-xl overflow-hidden flex-1">
              <img
                src={selectImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">{product.name}</h1>

            {product.brand && (
              <p className="text-sm text-gray-500">
                Brand: <span className="font-medium">{product.brand}</span>
              </p>
            )}

            <p className="text-gray-500">
              {showFull ? product.description : shortText}
              {isLong && (
                <button
                  onClick={() => setShowFull(!showFull)}
                  className="ml-2 text-gray-700 italic font-serif font-bold"
                >
                  {showFull ? "See Less" : "See More..."}
                </button>
              )}
            </p>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold">
                ৳{displayPrice.toLocaleString()}
              </span>
              {product.discountPrice > 0 && (
                <span className="text-gray-400 line-through text-lg">
                  ৳{product.price.toLocaleString()}
                </span>
              )}
            </div>

            {/* Stock */}
            <p
              className={`text-sm font-medium ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}
            >
              {product.stock > 0
                ? `In Stock (${product.stock} available)`
                : "Out of Stock"}
            </p>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 border rounded-lg font-bold hover:bg-gray-50"
              >
                -
              </button>
              <span className="w-10 text-center font-medium">{quantity}</span>
              <button
                onClick={() =>
                  setQuantity((q) => Math.min(product.stock, q + 1))
                }
                className="w-8 h-8 border rounded-lg font-bold hover:bg-gray-50"
              >
                +
              </button>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-3 font-serif">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex justify-center items-center gap-2 py-3 rounded-lg text-white transition ${
                  added ? "bg-green-500" : "bg-gray-light hover:bg-red-primary"
                } disabled:opacity-50`}
              >
                <ShoppingCart size={18} />
                {added ? "Added!" : "Add to Cart"}
              </button>

              <button
                onClick={() =>
                  navigate("/checkout", { state: { product, quantity } })
                }
                disabled={product.stock === 0}
                className="flex justify-center items-center gap-2 border py-3 rounded-lg hover:bg-red-primary hover:text-white transition disabled:opacity-50"
              >
                <MdPayment size={20} /> Buy Now
              </button>

              <button className="flex justify-center items-center gap-2 border py-3 rounded-lg hover:bg-red-primary hover:text-white transition">
                <BsWhatsapp size={20} /> WhatsApp
              </button>
              <button className="flex justify-center gap-2 bg-gray-light hover:bg-red-primary text-white py-3 rounded-lg transition">
                <Phone size={18} /> Contact
              </button>
            </div>

            <div className="text-sm text-gray-600 space-y-1">
              <p>✔ Fast Delivery</p>
              <p>✔ Cash on Delivery Available</p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-semibold mb-4">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
