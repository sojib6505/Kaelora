import { useState } from "react";
import { Link, useNavigate } from "react-router";

const StarRating = ({ rating, reviews }) => (
  <div className="flex items-center gap-1.5 mt-1">
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= rating ? "text-amber-400" : "text-gray-200"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
    <span className="text-xs text-gray-500">{reviews} reviews</span>
  </div>
);

const badgeStyles = {
  New: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Premium: "bg-amber-50 text-amber-700 border border-amber-200",
  Trending: "bg-rose-50 text-rose-700 border border-rose-200",
  Sale: "bg-red-50 text-red-700 border border-red-200",
};

export default function ProductCard({ product }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [hovered, setHovered] = useState(false);

  const navigate = useNavigate()

  return (
    
      <div
        className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image */}
        <div className="relative overflow-hidden bg-gray-50 aspect-3/4">
         <Link to={`/product/${product.id}`}>
            <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
         </Link>

          {/* Badge */}
          <span
            className={`absolute top-3 left-3 text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeStyles[product.badge]}`}
          >
            {product.badge}
          </span>

          {/* Wishlist */}
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center"
          >
            <svg
              className={`w-4 h-4 ${
                isWishlisted ? "text-red-500 fill-red-500" : "text-gray-400"
              }`}
              fill={isWishlisted ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Add to cart */}
          <div
            className={`absolute bottom-0 left-0 right-0 p-3 transition-all duration-300 ${
              hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
          >
            <button className="w-full py-2.5 bg-gray-light hover:bg-red-primary text-white text-xs font-semibold rounded-xl">
              ADD TO CART
            </button>
          </div>
        </div>

        {/* Info */}
        <div onClick={()=>{navigate(`/product/${product.id}`)}} className="p-3.5">
          <h3 className="text-[13px] font-medium line-clamp-2 min-h-9">
            {product.name}
          </h3>

          <StarRating rating={product.rating} reviews={product.reviews} />

          <div className="mt-2 text-base font-bold">
            ৳{product.price.toLocaleString()}
          </div>
        </div>
      </div>
    
  );
}
