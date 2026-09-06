import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  ArrowRight,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { Link } from "react-router";
import ProductCard from "../../components/productCard/ProductCard";
import useCart from "../../hooks/useCart";
import ScrollToTop from "../../components/scrollToTop/ScrollToTop";

export default function CategoryProducts() {
  const [categories, setCategories] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [loading, setLoading] = useState(true);

  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [isFeaturedPaused, setIsFeaturedPaused] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const [quickViewCategory, setQuickViewCategory] = useState(null);

  const featuredAutoRef = useRef(null);
  const featuredPauseTimeoutRef = useRef(null);

  const { addToCart } = useCart();

  // =========================================
  // LOAD CATEGORY + PRODUCTS
  // =========================================
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const categoryRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/products/categories`
        );

        const cats = categoryRes.data.categories || [];
        setCategories(cats);

        const requests = cats.map(async (category) => {
          try {
            const res = await axios.get(
              `${import.meta.env.VITE_API_URL}/products`,
              {
                params: {
                  page: 1,
                  limit: 10,
                  category,
                  sort: "newest",
                },
              }
            );

            return {
              category,
              products: res.data.products || [],
            };
          } catch (error) {
            console.error(`Failed to load ${category}`, error);

            return {
              category,
              products: [],
            };
          }
        });

        const results = await Promise.all(requests);

        const grouped = {};

        results.forEach(({ category, products }) => {
          if (products.length) {
            grouped[category] = products;
          }
        });

        setCategoryProducts(grouped);
      } catch (error) {
        console.error("Category loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // =========================================
  // QUICK VIEW MODAL
  // =========================================
  const openQuickView = (category) => setQuickViewCategory(category);
  const closeQuickView = () => setQuickViewCategory(null);

  useEffect(() => {
    if (!quickViewCategory) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") closeQuickView();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [quickViewCategory]);

  // =========================================
  // FEATURED PRODUCT NAVIGATION
  // =========================================
  const featuredCategory = categories.find(
    (category) => categoryProducts[category]?.length > 0
  );

  const featuredProducts = featuredCategory
    ? categoryProducts[featuredCategory] || []
    : [];

  const featuredProduct = featuredProducts[featuredIndex];

  const pauseFeaturedThenResume = (duration = 6000) => {
    setIsFeaturedPaused(true);

    if (featuredPauseTimeoutRef.current) {
      clearTimeout(featuredPauseTimeoutRef.current);
    }

    featuredPauseTimeoutRef.current = setTimeout(() => {
      setIsFeaturedPaused(false);
    }, duration);
  };

  const nextFeatured = () => {
    if (!featuredProducts.length) return;

    setFeaturedIndex((prev) =>
      prev >= featuredProducts.length - 1 ? 0 : prev + 1
    );

    pauseFeaturedThenResume();
  };

  const prevFeatured = () => {
    if (!featuredProducts.length) return;

    setFeaturedIndex((prev) =>
      prev <= 0 ? featuredProducts.length - 1 : prev - 1
    );

    pauseFeaturedThenResume();
  };

  const handleFeaturedKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      nextFeatured();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prevFeatured();
    }
  };

  const handleAddToCart = () => {
    if (!featuredProduct) return;

    addToCart(featuredProduct);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1500);
  };

  useEffect(() => {
    if (!featuredProducts.length || isFeaturedPaused) return;

    featuredAutoRef.current = setInterval(() => {
      setFeaturedIndex((prev) =>
        prev >= featuredProducts.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => {
      if (featuredAutoRef.current) {
        clearInterval(featuredAutoRef.current);
      }
    };
  }, [featuredProducts.length, isFeaturedPaused]);

  useEffect(() => {
    setFeaturedIndex(0);
  }, [featuredCategory]);

  // =========================================
  // OTHER CATEGORIES — SAME CARD FOR ALL
  // =========================================
  const otherCategories = categories.filter(
    (category) =>
      category !== featuredCategory && categoryProducts[category]?.length > 0
  );

  // =========================================
  // LOADING
  // =========================================
  if (loading) {
    return (
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-400 px-4 sm:px-6 lg:px-10">
          <div className="mb-12">
            <div className="h-2 w-24 animate-pulse rounded-full bg-gray-200" />
            <div className="mt-5 h-10 w-72 animate-pulse rounded-md bg-gray-200" />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden bg-gray-100"
              >
                <div className="aspect-3/4" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const hasFeatured = Boolean(featuredCategory && featuredProduct);

  if (!hasFeatured && !otherCategories.length) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-28">
      <div className="pointer-events-none absolute -left-40 top-40 h-96 w-96 rounded-full bg-gray-100/70 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-20 h-96 w-96 rounded-full bg-gray-100/70 blur-[120px]" />

      <div className="relative mx-auto max-w-400 px-4 sm:px-6 lg:px-10">
        {/* MAIN HEADER */}
        <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-black" />
              <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-gray-500">
                AK Signature Wear
              </p>
            </div>

            <h2 className="font-serif text-4xl font-normal leading-tight tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Discover the collection
            </h2>

            <p className="mt-6 max-w-lg text-sm leading-7 text-gray-500 md:text-[15px]">
              Explore our latest pieces, carefully selected for effortless
              everyday elegance and timeless style.
            </p>
          </div>

          <div className="flex items-center gap-3 text-gray-400">
            <Sparkles size={14} strokeWidth={1.5} />
            <span className="text-[10px] uppercase tracking-[0.3em]">
              New Season
            </span>
          </div>
        </div>

        {/* =========================================
            FEATURED — LOOKBOOK STYLE
        ========================================= */}
        {hasFeatured && (
          <div
            className="relative mb-24 md:mb-28"
            onMouseEnter={() => setIsFeaturedPaused(true)}
            onMouseLeave={() => setIsFeaturedPaused(false)}
            onTouchStart={() => setIsFeaturedPaused(true)}
            onTouchEnd={() => pauseFeaturedThenResume(4000)}
            onKeyDown={handleFeaturedKeyDown}
            tabIndex={0}
            role="region"
            aria-label={`Featured product in ${featuredCategory}`}
            aria-live="polite"
          >
            {(() => {
              const product = featuredProduct;

              const productPrice =
                product.discountPrice > 0
                  ? product.discountPrice
                  : product.price;

              const hasDiscount =
                product.discountPrice > 0 &&
                product.discountPrice < product.price;

              const discountPercent = hasDiscount
                ? Math.round(
                    ((product.price - product.discountPrice) /
                      product.price) *
                      100
                  )
                : 0;

              const image =
                product.images?.[0]?.url || "/placeholder.jpg";

              const rating = Number(product.rating) || 0;

              const shortName =
                product.name.length > 30
                  ? `${product.name.slice(0, 30)}…`
                  : product.name;

              return (
                <>
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-sm text-gray-500">
                      {featuredCategory}
                    </h3>

                    <button
                      type="button"
                      onClick={() => openQuickView(featuredCategory)}
                      className="text-xs text-gray-500 underline decoration-gray-300 underline-offset-4 transition-colors hover:text-gray-900 hover:decoration-gray-900"
                    >
                      View all
                    </button>
                  </div>

                  <div className="grid overflow-hidden bg-[#1b1a18] lg:grid-cols-[3fr_2fr]">
                    {/* IMAGE + HANGING TAG */}
                    <div className="relative">
                      <Link to={`/product/${product._id}`} className="block">
                        <img
                          key={product._id}
                          src={image}
                          alt={product.name}
                          loading="lazy"
                          className="featured-img h-105 w-full object-cover object-top sm:h-130 lg:h-160"
                        />
                      </Link>

                      {product.badge && (
                        <span className="absolute right-6 top-6 bg-[#f3eee4]/95 px-2.5 py-1 text-[10px] text-[#1b1a18]">
                          {product.badge}
                        </span>
                      )}

                      <div className="absolute bottom-6 left-6 -rotate-2 bg-[#f3eee4] px-4 py-3 shadow-[0_10px_28px_rgba(0,0,0,0.35)] sm:bottom-8 sm:left-8">
                        <p className="font-serif text-base leading-none text-[#1b1a18] sm:text-lg">
                          {shortName}
                        </p>

                        <div className="mt-2 flex items-baseline gap-2">
                          <span className="text-sm font-semibold text-[#1b1a18]">
                            ৳{Number(productPrice || 0).toLocaleString()}
                          </span>

                          {hasDiscount && (
                            <>
                              <span className="text-xs text-[#8a8577] line-through">
                                ৳
                                {Number(product.price || 0).toLocaleString()}
                              </span>
                              <span className="text-xs font-medium text-[#7c2d2d]">
                                −{discountPercent}%
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div className="flex flex-col justify-between p-8 sm:p-10 lg:p-12">
                      <div>
                        <p className="text-xs text-[#a98753]">
                          From the {featuredCategory} edit
                        </p>

                        <h3 className="mt-3 font-serif text-3xl leading-[1.1] text-[#f3eee4] sm:text-4xl">
                          {product.name}
                        </h3>

                        {rating > 0 && (
                          <div className="mt-4 flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={12}
                                fill={star <= rating ? "currentColor" : "none"}
                                className={
                                  star <= rating
                                    ? "text-[#a98753]"
                                    : "text-[#4a463f]"
                                }
                              />
                            ))}
                            <span className="ml-1 text-xs text-[#8a8577]">
                              {rating.toFixed(1)}
                            </span>
                          </div>
                        )}

                        <div className="mt-6 h-px w-12 bg-[#4a463f]" />
                      </div>

                      <div className="mt-8">
                        {featuredProducts.length > 1 && (
                          <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
                            {featuredProducts.map((p, i) => (
                              <button
                                key={p._id}
                                type="button"
                                onClick={() => {
                                  setFeaturedIndex(i);
                                  pauseFeaturedThenResume();
                                }}
                                aria-label={`Show ${p.name}`}
                                aria-current={i === featuredIndex}
                                className={`h-14 w-11 shrink-0 overflow-hidden border transition-all duration-300 ${
                                  i === featuredIndex
                                    ? "border-[#a98753] opacity-100"
                                    : "border-transparent opacity-45 hover:opacity-75"
                                }`}
                              >
                                <img
                                  src={
                                    p.images?.[0]?.url || "/placeholder.jpg"
                                  }
                                  alt=""
                                  className="h-full w-full object-cover object-top"
                                />
                              </button>
                            ))}
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-5">
                          <button
                            type="button"
                            onClick={handleAddToCart}
                            disabled={addedFeedback}
                            className={`px-5 py-3 text-xs font-medium transition-colors duration-300 ${
                              addedFeedback
                                ? "bg-[#4a663f] text-white"
                                : "bg-[#f3eee4] text-[#1b1a18] hover:bg-[#a98753]"
                            }`}
                          >
                            {addedFeedback ? "Added" : "Add to bag"}
                          </button>

                          <Link
                            to={`/product/${product._id}`}
                            className="group inline-flex items-center gap-1.5 text-xs text-[#f3eee4] underline decoration-[#4a463f] underline-offset-4 transition-colors hover:decoration-[#a98753]"
                          >
                            View full details
                            <ArrowRight
                              size={13}
                              className="transition-transform duration-300 group-hover:translate-x-0.5"
                            />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* =========================================
            EVERYTHING ELSE — IDENTICAL CARDS,
            IDENTICAL CLICK BEHAVIOR (OPEN QUICK VIEW)
        ========================================= */}
        {otherCategories.length > 0 && (
          <div>
            <h3 className="mb-6 text-sm text-gray-500">More to explore</h3>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {otherCategories.map((category) => {
                const products = categoryProducts[category] || [];
                const thumb =
                  products[0]?.images?.[0]?.url || "/placeholder.jpg";

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => openQuickView(category)}
                    className="group relative overflow-hidden bg-[#f3eee4] text-left"
                  >
                    <div className="aspect-3/4 overflow-hidden">
                      <img
                        src={thumb}
                        alt=""
                        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="p-4">
                      <p className="font-serif text-lg text-[#1b1a18]">
                        {category}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {products.length} pieces
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* BOTTOM BRAND LINE */}
        <div className="mt-24 flex items-center justify-center gap-5 md:mt-32">
          <span className="h-px w-12 bg-gray-200 md:w-20" />

          <div className="text-center">
            <p className="font-serif text-sm italic text-gray-400">
              A Mark of Style
            </p>
            <p className="mt-1 text-[8px] uppercase tracking-[0.35em] text-gray-300">
              AK Signature Wear
            </p>
          </div>

          <span className="h-px w-12 bg-gray-200 md:w-20" />
        </div>
      </div>

      {/* =========================================
          QUICK VIEW MODAL — SAME FOR EVERY CATEGORY
      ========================================= */}
      {quickViewCategory && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={closeQuickView}
        >
          <div
            className="flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden bg-white sm:max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`${quickViewCategory} products`}
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <p className="text-xs text-gray-500">Category</p>
                <h3 className="font-serif text-xl text-gray-900">
                  {quickViewCategory}
                </h3>
              </div>

              <button
                type="button"
                onClick={closeQuickView}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center border border-gray-200 transition-colors hover:border-gray-900"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 overflow-y-auto p-6 sm:grid-cols-3">
              {(categoryProducts[quickViewCategory] || []).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            <div className="border-t border-gray-100 p-6">
              <Link
                to="/shop"
                onClick={closeQuickView}
                className="flex w-full items-center justify-center gap-2 bg-[#1b1a18] px-5 py-3.5 text-xs font-medium text-[#f3eee4] transition-colors duration-300 hover:bg-[#a98753]"
              >
                All products
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .featured-img {
          animation: featuredImage 0.6s ease-out;
        }

        @keyframes featuredImage {
          from { opacity: 0.4; transform: scale(1.02); }
          to { opacity: 1; transform: scale(1); }
        }

        @media (prefers-reduced-motion: reduce) {
          .featured-img {
            animation: none;
          }
          * {
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </section>
  );
}