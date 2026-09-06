import { useState, useEffect } from "react";
import ProductCard from "../productCard/ProductCard";
import { useNavigate } from "react-router";
import axios from "axios";

export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  const itemsPerPage = 5;

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/products?sort=newest&limit=20`)
      .then(res => {console.log(res.data.products); setProducts( res.data.products || [])})
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const visible = products.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  if (loading) return (
    <section className="mt-10 mb-10">
      <div className="text-center mb-10">
        <p className="text-xs font-semibold tracking-[0.25em] text-amber-600 uppercase mb-2">Just Dropped</p>
        <h2 className="font-serif text-3xl md:text-4xl font-normal text-gray-900 tracking-tight">New Arrival</h2>
        <div className="flex items-center justify-center gap-2 mt-3">
          <div className="h-px w-12 bg-amber-300" />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <div className="h-px w-12 bg-amber-300" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="rounded-2xl bg-gray-100 animate-pulse aspect-3/4" />
        ))}
      </div>
    </section>
  );

  if (products.length === 0) return (
    <section className="mt-10 text-center py-20 text-gray-400">
      <p className="text-lg">No products yet</p>
      <p className="text-sm mt-1">Add products from admin panel</p>
    </section>
  );

  return (
    <section className="mt-10">
      <div className="text-center mb-10">
        <p className="text-xs font-semibold tracking-[0.25em] text-amber-600 uppercase mb-2">Just Dropped</p>
        <h2 className="font-serif text-3xl md:text-4xl font-normal text-gray-900 tracking-tight">New Arrival</h2>
        <div className="flex items-center justify-center gap-2 mt-3">
          <div className="h-px w-12 bg-amber-300" />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <div className="h-px w-12 bg-amber-300" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {visible.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`transition-all duration-200 rounded-full ${
                i === currentPage ? "w-6 h-2.5 bg-gray-900" : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}

      <div className="text-center mt-8">
        <button
          onClick={() => navigate('/shop')}
          className="inline-flex items-center gap-2 px-8 py-3 border-2 border-gray-900 text-gray-900 text-sm font-semibold rounded-sm hover:bg-gray-900 hover:text-white transition-all duration-200 group"
        >
          View All Products
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </section>
  );
}