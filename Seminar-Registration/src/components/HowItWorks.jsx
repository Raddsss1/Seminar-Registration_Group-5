import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useInView,
  useReducedMotion,
} from "framer-motion";

// HOW IT WORKS DATA
const HowItWorksData = [
  {
    Title: "Log In or Sign Up",
    Step: "Step 1",
    description:
      "Log in to your account or create a new one to access the platform.",
  },
  {
    Title: "Explore and Register for Seminars",
    Step: "Step 2",
    description:
      "Explore the available seminars and register for the ones that interest you.",
  },
  {
    Title: "Attend Seminars and Workshops",
    Step: "Step 3",
    description:
      "Attend and participate in various seminars and workshops to enhance your knowledge and skills.",
  },
  {
    Title: "Gain Experience and Contribute",
    Step: "Step 4",
    description:
      "Gain valuable experience by participating in various activities and contribute to the growth of the platform.",
  },
];

/* -------------------------------------------------------------------------
   2. ONE TIMELINE ENTRY
   The dot lights up once the scroll line reaches it.
   ------------------------------------------------------------------------- */
function TimelineItem({ item }) {
  const ref = useRef(null);
  // Fires when the entry crosses ~60% down the viewport (matches the line).
  const reached = useInView(ref, { once: true, margin: "0px 0px -40% 0px" });

  return (
    <li
      ref={ref}
      className="relative grid gap-2 pl-10 md:grid-cols-[12rem_1fr] md:gap-0 md:pl-0"
    >
      {/* Dot sitting on the line */}
      <span
        aria-hidden="true"
        className="absolute left-px top-1.5 flex h-4 w-4 items-center justify-center md:left-[calc(12rem-7px)]"
      >
        <span
          className={`h-4 w-4 rounded-full border-2 transition-colors duration-500 ${
            reached
              ? "border-indigo-400 bg-indigo-500 shadow-[0_0_0_6px_rgba(99,102,241,0.18)]"
              : "border-slate-600 bg-slate-950"
          }`}
        />
      </span>

      {/* Step */}
      <p
        className={`pt-0.5 sm:text-md md:text-lg lg:text-xl font-medium transition-colors duration-500 md:pr-8 md:text-right ${
          reached ? "text-indigo-400" : "text-slate-500"
        }`}
      >
        {item.Step}
      </p>

      {/* Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 transition-all duration-500 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-2 md:ml-10">
        <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-slate-100">
          {item.Title}
        </h3>
        {item.description && (
          <p className="mt-4 w-full text-lg leading-relaxed text-slate-400 text-center">
            {item.description}
          </p>
        )}
      </div>
    </li>
  );
}

export default function HowItWorks() {
  const listRef = useRef(null);
  const reduceMotion = useReducedMotion();

  // Progress of the list through the viewport, 0 -> 1
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 60%", "end 60%"],
  });

  // Spring = the "smooth" feel. Softens jumpy mouse-wheel scrolling.
  const smooth = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 24,
    mass: 0.4,
  });

  return (
    <section
      id="how-it-works"
      className="relative min-h-screen flex items-center justify-center scroll-mt-12"
    >
      {/* ROOT DIV */}
      <div className="relative p-8 max-w-7xl w-full mx-auto flex flex-col items-center justify-center text-center group">
        <div className="flex flex-col items-center justify-center gap-4 p-6 h-auto w-full rounded-xl">
          {/* FLOATING CARD */}
          <div className="max-w-sm mt-2 mb-4 bg-transparent border border-indigo-400/40 px-4 py-2 rounded-lg shadow-md">
            <h1 className="text-lg text-indigo-400 ">The Process</h1>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-white items-center justify-center font-bold">
            HOW IT WORKS
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-indigo-300 mb-6">
            Here's how our platform works:
          </p>
          {/* TIMELINE */}
          <div ref={listRef} className="relative mt-2 w-full  max-w-5xl">
            {/* Track (grey) */}
            <div
              aria-hidden="true"
              className="absolute bottom-0 left-2 top-0 w-0.5 bg-slate-800 md:left-48"
            />
            {/* Fill (indigo) - grows as you scroll */}
            <motion.div
              aria-hidden="true"
              style={{
                scaleY: reduceMotion ? 1 : smooth,
                transformOrigin: "top",
              }}
              className="absolute bottom-0 left-2 top-0 w-0.5 bg-gradient-to-b from-indigo-400 to-indigo-600 md:left-48"
            />

            <ol className="space-y-12">
              {HowItWorksData.map((item) => (
                <TimelineItem key={`${item.Title}-${item.Step}`} item={item} />
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
