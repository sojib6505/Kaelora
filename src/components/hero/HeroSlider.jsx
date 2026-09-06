import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import banners from "../../data/banner";

import "swiper/css";
import "swiper/css/pagination";
import { useNavigate } from "react-router";

export default function HeroSlider() {
  const navigate = useNavigate();
  return (
    <div className="w-full h-62.5 sm:h-87.5 md:h-112.5 lg:h-137.5 mt-16.5">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3000 }}
        loop={true}
        pagination={{ clickable: true }}
        slidesPerView={1}
        className="w-full h-full"
      >
        {banners.map((item) => (
          <SwiperSlide key={item._id}>
            <div className="relative w-full h-full">
              <img
                src={item.image}
                className="w-full h-full object-cover block"
                alt={item.title}
              />

              {/* overlay */}
              <div className="absolute inset-0 right-16  md:right-50 top-50 md:top-100 flex justify-end">
                <div>
                  <button
                    onClick={() => navigate(item.redirectLink)}
                    className="group inline-flex items-center gap-2
  bg-transparent text-gray-900
  border border-gray-900
  px-4 sm:px-6 md:px-7
  py-2 sm:py-2.5 md:py-3
  rounded-sm
  text-xs sm:text-sm md:text-base
  font-medium
  tracking-wide
  shadow-sm
  hover:bg-gray-900 hover:text-white
  hover:shadow-lg
  transition-all duration-300"
                  >
                    <span>{item.button}</span>

                    <svg
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4
    transition-transform duration-300
    group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 12h14m-6-6 6 6-6 6"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              {/* </div> */}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
