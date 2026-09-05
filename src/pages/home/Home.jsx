import { FeatherIcon } from "lucide-react";
import HeroSlider from "../../components/hero/HeroSlider";
import NewArrivals from "../../components/newArrivals/NewArrivals";
import ScrollToTop from "../../components/scrollToTop/ScrollToTop";
import Features from "../../components/features/Features";
import CategoryProducts from "../CategoryProducts/CategoryProducts";


export default function Home() {
  return (
    <div>
        <ScrollToTop/>
        <HeroSlider/>
        <NewArrivals/>
        <CategoryProducts/>     
        <Features/>   
    </div>
  )
}
