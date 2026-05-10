import { FaHeadset, FaUndoAlt, FaLock } from "react-icons/fa";

export default function Features() {
  const features = [
    {
      id: 1,
      icon: <FaHeadset size={28} />,
      title: "SUPPORT 24/7",
      desc1: "24-Hour Customer Support",
      desc2: "We're here to help.",
    },
    {
      id: 2,
      icon: <FaUndoAlt size={28} />,
      title: "RETURN POLICIES",
      desc1: "Simply return policies",
      desc2: "for an exchange.",
    },
    {
      id: 3,
      icon: <FaLock size={28} />,
      title: "100%  SECURE",
      desc1: "All Products Cash On Delivary",
      desc2: "",
    },
  ];

  return (
    <section className="bg-gray-100 py-10 mt-10">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {features.map((item) => (
          <div key={item.id} className="flex flex-col items-center space-y-3">
            
            {/* Icon */}
            <div className="text-gray-700">{item.icon}</div>

            {/* Title */}
            <h3 className="font-semibold text-sm tracking-wide text-gray-800">
              {item.title}
            </h3>

            {/* Description */}
            <p className="text-xs font-semibold text-gray-700 leading-5">
              {item.desc1} <br /> {item.desc2}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}