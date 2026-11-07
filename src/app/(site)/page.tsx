import {
  About,
  Gallery,
  Ground,
  Hero,
  HowItWorks,
  PrimeTimeCta,
  Services,
} from "@/src/components/home";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Ground />
      <Gallery />
      <Services />
      <About />
      <PrimeTimeCta />
    </>
  );
}
