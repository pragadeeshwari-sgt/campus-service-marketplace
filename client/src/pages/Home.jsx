import Hero from "../components/Hero";
import ServiceSearch from "../components/ServiceSearch";
import FeaturedServices from "../components/FeaturedServices";
import HowItWorks from "../components/HowItWorks";

function Home() {
  return (
    <>
      <Hero />
      <ServiceSearch />
      <FeaturedServices />
      <HowItWorks />
    </>
  );
}

export default Home;