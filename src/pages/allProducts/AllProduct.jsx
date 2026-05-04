import { useState } from "react";
import products from "../../data/products";
import ProductCard from "../../components/productCard/ProductCard";


export default function AllProduct() {
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 16;

  const totalPages = Math.ceil(products.length / itemsPerPage);

  // current page products
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // next button
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // prev button
  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-10 mt-16.5">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold font-serif">All Products</h1>
        <p className="text-gray-500 text-sm mt-1 font-serif">
          Showing page {currentPage} of {totalPages}
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {currentProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-10">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg border text-sm ${
            currentPage === 1
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-gray-light text-white"
          }`}
        >
          Prev
        </button>

        {/* Page Numbers */}
        <div className="flex gap-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`w-8 h-8 rounded-md text-sm ${
                currentPage === index + 1
                  ? "bg-black text-white"
                  : "border hover:bg-gray-100"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg border text-sm ${
            currentPage === totalPages
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-gray-light text-white"
          }`}
        >
          Next
        </button>
      </div>
    </section>
  );
}