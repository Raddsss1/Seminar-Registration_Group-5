import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import HowItWorks from "./components/HowItWorks";
import Features from "./components/Features";
import FAQ from "./components/FAQ";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

// Each orb: position, size, color, and opacity.
// Tweak top/left/right and size to rearrange. Keep opacity low so content stays readable.
const orbs = [
  {
    pos: "top-[2%] -left-40",
    size: "h-[34rem] w-[34rem]",
    color: "bg-indigo-400",
    opacity: "opacity-20",
  },
  {
    pos: "top-[10%] -right-32",
    size: "h-[28rem] w-[28rem]",
    color: "bg-indigo-500",
    opacity: "opacity-15",
  },
  {
    pos: "top-[42%] -left-48",
    size: "h-[32rem] w-[32rem]",
    color: "bg-indigo-500",
    opacity: "opacity-15",
  },
  {
    pos: "top-[55%] -right-40",
    size: "h-[36rem] w-[36rem]",
    color: "bg-cyan-500",
    opacity: "opacity-20",
  },
  {
    pos: "top-[72%] left-[20%]",
    size: "h-[26rem] w-[26rem]",
    color: "bg-cyan-500",
    opacity: "opacity-10",
  },
  {
    pos: "top-[85%] -right-24",
    size: "h-[30rem] w-[30rem]",
    color: "bg-cyan-400",
    opacity: "opacity-10",
  },
];

function Background() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {orbs.map((orb, i) => (
        <div
          key={i}
          className={`absolute rounded-full blur-[120px] ${orb.pos} ${orb.size} ${orb.color} ${orb.opacity}`}
        />
      ))}
    </div>
  );
}

function App() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden">
      <Background />

      {/* Content sits above the background */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <HowItWorks />
        <Features />
        <FAQ />
        <CTA />
        <Footer />
      </div>
    </div>
  );
}

export default App;
