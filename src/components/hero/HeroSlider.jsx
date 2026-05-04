import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import banners from "../../data/banner";

import "swiper/css";
import "swiper/css/pagination";
import { useNavigate } from "react-router";

export default function HeroSlider() {
    const navigate = useNavigate()
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
                  <button onClick={()=>{navigate(item.redirectLink)}}
                    className="bg-red-primary text-white font-medium sm:font-semibold text-xs sm:text-sm md:text-base px-3 sm:px-5 md:px-6 py-1.5 sm:py-2 md:py-3 rounded-md sm:rounded-lg shadow-md hover:bg-gray-light hover:text-black transition-all duration-300 tracking-wide"
                  >
                    {item.button}
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
