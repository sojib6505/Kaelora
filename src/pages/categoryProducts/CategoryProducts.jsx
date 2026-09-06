import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Star,
  ShoppingBag,
} from "lucide-react";
import { Link } from "react-router";
import ProductCard from "../../components/productCard/ProductCard";

export default function CategoryProducts() {
  const [categories, setCategories] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [loading, setLoading] = useState(true);

  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [isFeaturedPaused, setIsFeaturedPaused] = useState(false);

  const sliderRefs = useRef({});
  const autoSlideRefs = useRef({});
  const featuredAutoRef = useRef(null);

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
  // NORMAL CATEGORY SLIDE
  // =========================================
  const slide = (category, direction) => {
    const slider = sliderRefs.current[category];

    if (!slider) return;

    const card = slider.querySelector("[data-product-card]");

    if (!card) return;

    const gap = 16;
    const cardWidth = card.offsetWidth + gap;

    slider.scrollBy({
      left: direction === "next" ? cardWidth : -cardWidth,
      behavior: "smooth",
    });
  };

  // =========================================
  // NORMAL CATEGORY AUTO SLIDE
  // =========================================
  const startAutoSlide = (category) => {
    const products = categoryProducts[category];

    if (!products || products.length <= 1) return;

    if (autoSlideRefs.current[category]) {
      clearInterval(autoSlideRefs.current[category]);
    }

    autoSlideRefs.current[category] = setInterval(() => {
      const slider = sliderRefs.current[category];

      if (!slider) return;

      const maxScroll = slider.scrollWidth - slider.clientWidth;

      if (slider.scrollLeft >= maxScroll - 10) {
        slider.scrollTo({
          left: 0,
          behavior: "smooth",
        });

        return;
      }

      slide(category, "next");
    }, 4000);
  };

  // =========================================
  // NORMAL CATEGORY AUTO INIT
  // =========================================
  useEffect(() => {
    Object.keys(categoryProducts).forEach((category, index) => {
      // First category is featured, so don't start
      // the normal slider auto-scroll for it.
      if (index !== 0) {
        startAutoSlide(category);
      }
    });

    return () => {
      Object.values(autoSlideRefs.current).forEach((interval) => {
        clearInterval(interval);
      });
    };
  }, [categoryProducts]);

  // =========================================
  // PAUSE NORMAL CATEGORY
  // =========================================
  const pauseAutoSlide = (category) => {
    if (autoSlideRefs.current[category]) {
      clearInterval(autoSlideRefs.current[category]);
    }
  };

  // =========================================
  // RESUME NORMAL CATEGORY
  // =========================================
  const resumeAutoSlide = (category) => {
    startAutoSlide(category);
  };

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

  const nextFeatured = () => {
    if (!featuredProducts.length) return;

    setFeaturedIndex((prev) =>
      prev >= featuredProducts.length - 1 ? 0 : prev + 1
    );
  };

  const prevFeatured = () => {
    if (!featuredProducts.length) return;

    setFeaturedIndex((prev) =>
      prev <= 0 ? featuredProducts.length - 1 : prev - 1
    );
  };

  // =========================================
  // FEATURED AUTO SLIDE
  // =========================================
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

  // =========================================
  // RESET FEATURED INDEX
  // WHEN CATEGORY DATA CHANGES
  // =========================================
  useEffect(() => {
    setFeaturedIndex(0);
  }, [featuredCategory]);

  // =========================================
  // LOADING
  // =========================================
  if (loading) {
    return (
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
          <div className="mb-12">
            <div className="h-2 w-24 animate-pulse rounded-full bg-gray-200" />

            <div className="mt-5 h-10 w-72 animate-pulse rounded-md bg-gray-200" />
          </div>

          <div className="flex gap-5 overflow-hidden">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="min-w-[72%] animate-pulse overflow-hidden rounded-xl bg-gray-100 sm:min-w-[42%] md:min-w-[24%] lg:min-w-[19.5%]"
              >
                <div className="aspect-[3/4]" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // =========================================
  // AVAILABLE CATEGORIES
  // =========================================
  const availableCategories = categories.filter(
    (category) => categoryProducts[category]?.length > 0
  );

  if (!availableCategories.length) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-28">
      {/* Ambient Background */}
      <div className="pointer-events-none absolute -left-40 top-40 h-96 w-96 rounded-full bg-gray-100/70 blur-[120px]" />

      <div className="pointer-events-none absolute -right-40 bottom-20 h-96 w-96 rounded-full bg-gray-100/70 blur-[120px]" />

      <div className="relative mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        {/* =========================================
            MAIN HEADER
        ========================================= */}
        <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-black" />

              <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-gray-500">
                AK Signature Wear
              </p>
            </div>

            <h2 className="font-serif text-4xl font-normal leading-tight tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Discover
              <span className="ml-2 italic text-gray-400">
                the collection.
              </span>
            </h2>

            <p className="mt-6 max-w-lg text-sm leading-7 text-gray-500 md:text-[15px]">
              Explore our latest pieces, carefully selected for effortless
              everyday elegance and timeless style.
            </p>
          </div>

          {/* Header Side */}
          <div className="flex items-center gap-3 text-gray-400">
            <Sparkles size={14} strokeWidth={1.5} />

            <span className="text-[10px] uppercase tracking-[0.3em]">
              New Season
            </span>
          </div>
        </div>

        {/* =========================================
            CATEGORY SECTIONS
        ========================================= */}
        <div className="space-y-24 md:space-y-28">
          {availableCategories.map((category, index) => {
            const products = categoryProducts[category];

            // =========================================
            // FIRST CATEGORY = FEATURED COLLECTION
            // =========================================
            if (index === 0) {
              const product = featuredProduct;

              if (!product) return null;

              const productPrice =
                product.discountPrice > 0
                  ? product.discountPrice
                  : product.price;

              const hasDiscount =
                product.discountPrice > 0 &&
                product.discountPrice < product.price;

              const image =
                product.images?.[0]?.url || "/placeholder.jpg";

              const rating = Number(product.rating) || 0;

              return (
                <div
                  key={category}
                  className="relative"
                  onMouseEnter={() => setIsFeaturedPaused(true)}
                  onMouseLeave={() => setIsFeaturedPaused(false)}
                >
                  {/* Featured Header */}
                  <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
                    <div className="flex items-center gap-4">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-black bg-black text-[9px] text-white">
                        01
                      </span>

                      <div>
                        <h3 className="text-sm font-medium uppercase tracking-[0.22em] text-gray-900">
                          {category}
                        </h3>

                        <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-gray-400">
                          Featured collection
                        </p>
                      </div>
                    </div>

                    <Link
                      to={`/products?category=${encodeURIComponent(
                        category
                      )}`}
                      className="group/view flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-gray-500 transition-all duration-300 hover:text-black"
                    >
                      View all

                      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 transition-all duration-300 group-hover/view:border-black group-hover/view:bg-black group-hover/view:text-white">
                        <ArrowRight
                          size={13}
                          className="transition-transform duration-300 group-hover/view:translate-x-0.5"
                        />
                      </span>
                    </Link>
                  </div>

                  {/* =========================================
                      FEATURED PRODUCT
                  ========================================= */}
                  <div className="grid overflow-hidden rounded-2xl border border-gray-100 bg-[#f8f7f5] lg:grid-cols-[1.15fr_0.85fr]">
                    {/* IMAGE */}
                    <div className="group/featured relative overflow-hidden bg-gray-100">
                      <Link to={`/product/${product._id}`}>
                        <img
                          key={product._id}
                          src={image}
                          alt={product.name}
                          className="aspect-[4/4.7] h-full w-full object-cover object-top transition-all duration-700 group-hover/featured:scale-[1.025] sm:aspect-[4/4.5] lg:aspect-auto lg:min-h-[620px]"
                        />
                      </Link>

                      {/* Image Overlay */}
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/25 to-transparent" />

                      {/* Badge */}
                      {product.badge && (
                        <span
                          className={`absolute left-5 top-5 rounded-full border px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] ${
                            product.badge === "New"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : product.badge === "Premium"
                              ? "border-amber-200 bg-amber-50 text-amber-700"
                              : product.badge === "Trending"
                              ? "border-rose-200 bg-rose-50 text-rose-700"
                              : product.badge === "Sale"
                              ? "border-red-200 bg-red-50 text-red-700"
                              : "border-white/40 bg-white/90 text-gray-700"
                          }`}
                        >
                          {product.badge}
                        </span>
                      )}

                      {/* Product Counter */}
                      <div className="absolute bottom-5 left-5 rounded-full bg-white/90 px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.18em] text-gray-700 backdrop-blur-sm">
                        {String(featuredIndex + 1).padStart(2, "0")} /{" "}
                        {String(products.length).padStart(2, "0")}
                      </div>
                    </div>

                    {/* DETAILS */}
                    <div className="flex flex-col justify-between bg-[#f8f7f5] p-7 sm:p-10 lg:p-14">
                      <div>
                        {/* Small Label */}
                        <div className="mb-7 flex items-center gap-3">
                          <span className="h-px w-7 bg-gray-400" />

                          <span className="text-[9px] uppercase tracking-[0.35em] text-gray-400">
                            AK Signature Wear
                          </span>
                        </div>

                        {/* Category */}
                        <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-gray-400">
                          {category}
                        </p>

                        {/* Product Name */}
                        <h3
                          key={`title-${product._id}`}
                          className="max-w-xl font-serif text-3xl font-normal leading-tight text-gray-900 sm:text-4xl lg:text-5xl"
                        >
                          {product.name}
                        </h3>

                        {/* Rating */}
                        <div className="mt-5 flex items-center gap-2">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={13}
                                fill={star <= rating ? "currentColor" : "none"}
                                className={
                                  star <= rating
                                    ? "text-amber-400"
                                    : "text-gray-300"
                                }
                              />
                            ))}
                          </div>

                          <span className="text-[10px] text-gray-400">
                            {rating > 0 ? `${rating.toFixed(1)} / 5` : "No rating"}
                          </span>
                        </div>

                        {/* Divider */}
                        <div className="my-7 h-px w-full bg-gray-200" />

                        {/* Price */}
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-semibold text-gray-900">
                            ৳{Number(productPrice || 0).toLocaleString()}
                          </span>

                          {hasDiscount && (
                            <span className="text-base text-gray-400 line-through">
                              ৳{Number(product.price || 0).toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        <p className="mt-6 max-w-md text-sm leading-7 text-gray-500">
                          Carefully selected for effortless everyday elegance.
                          Discover a piece designed to bring timeless style
                          and confidence to your wardrobe.
                        </p>
                      </div>

                      {/* Bottom */}
                      <div className="mt-10">
                        {/* CTA */}
                        <Link
                          to={`/product/${product._id}`}
                          className="group/cta inline-flex w-full items-center justify-between border border-gray-900 bg-gray-900 px-5 py-4 text-[10px] font-medium uppercase tracking-[0.25em] text-white transition-all duration-300 hover:bg-white hover:text-gray-900 sm:max-w-sm"
                        >
                          <span className="flex items-center gap-3">
                            <ShoppingBag size={14} strokeWidth={1.5} />
                            View Product
                          </span>

                          <ArrowRight
                            size={15}
                            className="transition-transform duration-300 group-hover/cta:translate-x-1"
                          />
                        </Link>

                        {/* Navigation */}
                        <div className="mt-7 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={prevFeatured}
                              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 transition-all duration-300 hover:border-black hover:bg-black hover:text-white active:scale-90"
                              aria-label="Previous featured product"
                            >
                              <ChevronLeft size={17} strokeWidth={1.5} />
                            </button>

                            <button
                              type="button"
                              onClick={nextFeatured}
                              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 transition-all duration-300 hover:border-black hover:bg-black hover:text-white active:scale-90"
                              aria-label="Next featured product"
                            >
                              <ChevronRight size={17} strokeWidth={1.5} />
                            </button>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400">
                              Explore
                            </span>

                            <span className="h-px w-8 bg-gray-300" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Featured Progress */}
                  <div className="mt-5 flex items-center gap-2">
                    {products.map((_, productIndex) => (
                      <button
                        key={productIndex}
                        type="button"
                        onClick={() => setFeaturedIndex(productIndex)}
                        className="group h-5 flex-1"
                        aria-label={`Show product ${productIndex + 1}`}
                      >
                        <span
                          className={`block h-[2px] w-full transition-all duration-500 ${
                            productIndex === featuredIndex
                              ? "bg-black"
                              : "bg-gray-200 group-hover:bg-gray-400"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              );
            }

            // =========================================
            // OTHER CATEGORIES = NORMAL SLIDER
            // =========================================
            return (
              <div
                key={category}
                className="group/category"
                onMouseEnter={() => pauseAutoSlide(category)}
                onMouseLeave={() => resumeAutoSlide(category)}
              >
                {/* CATEGORY HEADER */}
                <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
                  <div className="flex items-center gap-4">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-[9px] text-gray-400 transition-all duration-500 group-hover/category:border-black group-hover/category:text-black">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div>
                      <h3 className="text-sm font-medium uppercase tracking-[0.22em] text-gray-900">
                        {category}
                      </h3>

                      <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-gray-400">
                        {products.length} pieces
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/products?category=${encodeURIComponent(category)}`}
                    className="group/view flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-gray-500 transition-all duration-300 hover:text-black"
                  >
                    View all

                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 transition-all duration-300 group-hover/view:border-black group-hover/view:bg-black group-hover/view:text-white">
                      <ArrowRight
                        size={13}
                        className="transition-transform duration-300 group-hover/view:translate-x-0.5"
                      />
                    </span>
                  </Link>
                </div>

                {/* SLIDER */}
                <div className="group/slider relative">
                  {/* LEFT ARROW */}
                  <button
                    type="button"
                    onClick={() => slide(category, "prev")}
                    className="absolute left-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-700 shadow-sm backdrop-blur-md transition-all duration-500 hover:scale-105 hover:bg-black hover:text-white md:flex md:-translate-x-3 md:opacity-0 md:group-hover/slider:translate-x-0 md:group-hover/slider:opacity-100"
                    aria-label="Previous products"
                  >
                    <ChevronLeft size={18} strokeWidth={1.5} />
                  </button>

                  {/* PRODUCT TRACK */}
                  <div
                    ref={(el) => {
                      sliderRefs.current[category] = el;
                    }}
                    className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-3"
                  >
                    {products.map((product, productIndex) => (
                      <div
                        key={product._id}
                        data-product-card
                        style={{
                          animationDelay: `${productIndex * 70}ms`,
                        }}
                        className="product-reveal min-w-[72%] snap-start sm:min-w-[42%] md:min-w-[24%] lg:min-w-[19.5%]"
                      >
                        <div className="h-full transition-transform duration-500 hover:-translate-y-1">
                          <ProductCard product={product} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* RIGHT ARROW */}
                  <button
                    type="button"
                    onClick={() => slide(category, "next")}
                    className="absolute right-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-700 shadow-sm backdrop-blur-md transition-all duration-500 hover:scale-105 hover:bg-black hover:text-white md:flex md:translate-x-3 md:opacity-0 md:group-hover/slider:translate-x-0 md:group-hover/slider:opacity-100"
                    aria-label="Next products"
                  >
                    <ChevronRight size={18} strokeWidth={1.5} />
                  </button>
                </div>

                {/* MOBILE CONTROLS */}
                <div className="mt-5 flex items-center justify-between md:hidden">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400">
                    Swipe to explore
                  </span>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => slide(category, "prev")}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 transition-all duration-300 active:scale-90"
                    >
                      <ChevronLeft size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={() => slide(category, "next")}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 transition-all duration-300 active:scale-90"
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* =========================================
            BOTTOM BRAND LINE
        ========================================= */}
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
          CUSTOM ANIMATIONS
      ========================================= */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .product-reveal {
          animation: productReveal 0.8s cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        @keyframes productReveal {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes featuredImage {
          from {
            opacity: 0.4;
            transform: scale(1.02);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .product-reveal {
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