import { useState } from "react";
import LogInModal from "./LogInModal";

export default function CTA() {
  const [loginOpen, setLoginOpen] = useState(false);

  const orbs = [
    {
      pos: "-top-155 left-35",
      size: "h-[60rem] w-[60rem]",
      color: "bg-indigo-500/20 group-hover:bg-indigo-700/20",
      opacity:
        "opacity-30 group-hover:opacity-40 group-hover:-top-20 group-hover:-bottom-20",
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
            className={`absolute rounded-full blur-[120px] transition-all duration-500 ease-in-out ${orb.pos} ${orb.size} ${orb.color} ${orb.opacity}`}
          />
        ))}
      </div>
    );
  }

  return (
    <section
      id="cta"
      className="relative min-h-screen flex items-center justify-center scroll-mt-6"
    >
      {/* ROOT DIV */}
      <div className="group relative p-4 max-w-7xl w-full mx-auto rounded-2xl">
        {/* BACKGROUND ORBS */}
        <Background />
        <div className="group flex flex-col justify-center items-center bg-slate-800/20 border border-slate-700 p-6 space-y-2 lg:space-y-4 h-[25rem] md:h-[30rem] lg:h-[35rem] w-full rounded-3xl transition-all duration-500 ease-in-out hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/20">
          {/* CTA HEADING */}
          <div className="text-5xl sm:5xl md:text-6xl lg:text-7xl text-slate-400 font-bold space-x-2">
            <span className="inline-block transition-all group-hover:duration-300 ease-in-out group-hover:text-indigo-500 group-hover:-translate-y-[0.30rem]">
              Join,
            </span>
            <span className="inline-block transition-all group-hover:duration-500 ease-in-out group-hover:text-indigo-500 group-hover:-translate-y-[0.30rem]">
              Create,
            </span>
            <span className="inline-block transition-all group-hover:duration-1000 ease-in-out group-hover:text-indigo-500 group-hover:-translate-y-[0.30rem]">
              Manage
            </span>
          </div>
          {/* CTA SUBHEADING */}
          <p className="text-lg text-white">
            Seminars with Ease: Your Seminar Registration Platform
          </p>
          {/* CTA BUTTON */}
          <div className="flex justify-center items-center mt-4">
            <button
              onClick={() => setLoginOpen(true)}
              className="cursor-pointer bg-indigo-600 hover:bg-indigo-800 text-white font-medium p-4 py-2 px-4 rounded-lg border border-indigo-400 hover:border-indigo-500 hover:-translate-y-2 transition-all duration-500"
            >
              Register Now
            </button>
            <a
              href="#how-it-works"
              className="bg-transparent border border-indigo-400/40 px-4 py-2 ml-4 rounded-lg transition-all duration-500 ease-out hover:bg-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-2"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
      {loginOpen && (
        <LogInModal
          onClose={() => setLoginOpen(false)}
          onLogin={async (payload) => {
            // send payload to your backend; throw an Error to show a message
            console.log(payload);
          }}
        />
      )}
    </section>
  );
}
