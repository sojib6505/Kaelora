import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ProductCard from "../../components/productCard/ProductCard";

export default function AllProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState(""); 
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");
  const [categories, setCategories] = useState([]);

  const itemsPerPage = 16;

  // Debounce — 500ms after search set 
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Categories load
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/products/categories`)
      .then(res => setCategories(res.data.categories || []))
      .catch(console.error);
  }, []);

  // Products load
  useEffect(() => {
    setLoading(true);
    axios.get(`${import.meta.env.VITE_API_URL}/products`, {
      params: { page: currentPage, limit: itemsPerPage, search, category, sort }
    })
      .then(res => {
        setProducts(res.data.products || []);
        setTotalPages(res.data.pagination?.pages || 1);
        setTotal(res.data.pagination?.total || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [currentPage, search, category, sort]);

  const handleCategory = (val) => { setCategory(val); setCurrentPage(1); };
  const handleSort = (val) => { setSort(val); setCurrentPage(1); };

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setCategory("");
    setSort("newest");
    setCurrentPage(1);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-10 mt-16">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold font-serif">All Products</h1>
        <p className="text-gray-500 text-sm mt-1 font-serif">
          {total} products found
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 justify-center">
        {/*  searchInput use*/}
        <input
          type="text"
          placeholder="Search products..."
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          className="border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black w-full max-w-xs"
        />
        <select
          value={category}
          onChange={e => handleCategory(e.target.value)}
          className="border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={e => handleSort(e.target.value)}
          className="border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-gray-100 animate-pulse aspect-3/4" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">No products found</p>
          <button
            onClick={clearFilters}
            className="mt-3 text-sm underline text-gray-500 hover:text-black"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
              currentPage === 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-black hover:text-white"
            }`}
          >
            Prev
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-8 h-8 rounded-md text-sm font-medium transition ${
                  currentPage === index + 1 ? "bg-black text-white" : "border hover:bg-gray-100"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
              currentPage === totalPages ? "opacity-40 cursor-not-allowed" : "hover:bg-black hover:text-white"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}