import { useParams, useNavigate } from "react-router";
import products from "../../data/products";
import { useEffect, useState } from "react";
import ProductCard from "../../components/productCard/ProductCard";
import { Phone, ShoppingCart } from "lucide-react";
import { BsWhatsapp } from "react-icons/bs";
import { GiBuyCard } from "react-icons/gi";
import { FaBuysellads } from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import ScrollToTop from "../../components/scrollToTop/ScrollToTop";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);

  const [showFull, setShowFull] = useState(false);
  const product = products.find((p) => p.id === Number(id));
  const [selectImage, setSelectImage] = useState(
    () => products.find((p) => p.id === Number(id))?.image?.[0] ?? "",
  );

  useEffect(() => {
    setSelectImage(product?.image?.[0] ?? "");
  }, [id]);

  const words = product.description.split(" ");
  const shortText = words.slice(0, 20).join(" ");
  const isLong = words.length > 20;

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold">Product not found</h2>
        <button
          onClick={() => navigate("/products")}
          className="mt-4 px-4 py-2 bg-black text-white rounded"
        >
          Back to Products
        </button>
      </div>
    );
  }

  // related products (same category)
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <>
    <ScrollToTop/>
     <section className="max-w-6xl mx-auto px-4 py-10 mt-16.5">
      <div className="grid md:grid-cols-2 gap-2">
        <div className="flex flex-col-reverse gap-3 md:flex-row md:gap-5">
          <div className="flex gap-2 md:flex-col ">
            {product.image.map((img, idx) => (
              <img
                key={idx}
                src={img}
                onClick={() => setSelectImage(img)}
                className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 ${
                  selectImage === img ? "border-red-500" : "border-gray-200"
                }`}
              />
            ))}
          </div>
          <div className="bg-gray-50  rounded-xl overflow-hidden ">
            {/* Image */}
            <img
              src={selectImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div className="md:space-y-5">
          <h1 className="text-2xl font-bold">{product.name}</h1>

          <p className="text-gray-500 mt-2">
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

          <div className="mt-4 text-2xl font-bold">
            ৳{product.price.toLocaleString()}
          </div>

          {/* size */}
          <div className="flex gap-2 items-center">
            <span className="font-serif text-xl md:text-2xl font-bold">
              SIZE :
            </span>
            <div className="flex gap-2">
              {product.size.map((s, i) => (
                <p
                  className="font-serif text-sm md:text-xl font-semibold border border-gray-light h-6 w-6 md:h-10 md:w-10 text-center rounded-sm hover:bg-gray-light hover:text-white"
                  key={i}
                >
                  {s}
                </p>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-3 mt-5">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 border rounded"
            >
              -
            </button>

            <span className="w-10 text-center">{quantity}</span>

            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 border rounded"
            >
              +
            </button>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-6 font-serif">
            <button className="flex-1 flex justify-center items-center gap-2  bg-gray-light text-white hover:bg-red-primary py-3 rounded-lg">
              <ShoppingCart /> Add to Cart
            </button>

            <button onClick={()=>{navigate('/checkout')}} className="flex-1 flex justify-center items-center gap-2 border py-3 rounded-lg hover:bg-red-primary hover:text-white animate-jump">
              <MdPayment size={20} /> Buy Now
            </button>

            <button className="flex-4 flex justify-center items-center gap-2 border py-3 rounded-lg hover:bg-red-primary hover:text-white">
              <BsWhatsapp size={20} /> WhatsApp
            </button>
            <button className="flex-3 flex justify-center gap-2 bg-gray-light hover:bg-red-primary text-white py-3 rounded-lg">
              <Phone /> Contact
            </button>
          </div>

          {/* Extra Info */}
          <div className="mt-6 text-sm text-gray-600">
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
              <div
                key={p.id}
                onClick={() => navigate(`/product/${p.id}`)}
                className="cursor-pointer"
              >
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
    </>
  );
}
