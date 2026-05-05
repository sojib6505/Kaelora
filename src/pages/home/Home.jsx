import HeroSlider from "../../components/hero/HeroSlider";
import NewArrivals from "../../components/newArrivals/NewArrivals";
import ScrollToTop from "../../components/scrollToTop/ScrollToTop";


export default function Home() {
  return (
    <div>
        <ScrollToTop/>
        <HeroSlider/>
        <NewArrivals/>
    </div>
  )
}
