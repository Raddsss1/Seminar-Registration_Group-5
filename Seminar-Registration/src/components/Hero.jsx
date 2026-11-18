import LogInModal from "./LogInModal";
import { useState } from "react";

export default function Hero() {
  const heroArray = [
    { title: "Event Organization" },
    { title: "Event Registration" },
    { title: "Event Management" },
  ];

  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <section
      id="#"
      className="relative min-h-screen flex items-center justify-center"
    >
      {/* ROOT DIV */}
      <div className="relative p-8 max-w-7xl w-full mx-auto flex flex-col items-center justify-center text-center group">
        <div className="h-[30rem] w-full rounded-xl content-center">
          {/* HERO ITEMS */}
          <div className="flex items-center justify-center gap-4 mt-2 mb-10 slide-in-from-top duration-500">
            {heroArray.map((item, index) => (
              <div
                key={index}
                className="bg-transparent border border-indigo-400/40 px-4 py-2 rounded-2xl shadow-md transition-all duration-500 ease-out hover:bg-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-2 "
              >
                <h1 className="text-md text-indigo-400">{item.title}</h1>
              </div>
            ))}
          </div>
          {/* HEADER */}
          <div className="flex flex-col items-center justify-center gap-4 mt-2 mb-10 slide-in-from-top duration-700">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              All the seminars you need, in one place
            </h1>
            <p className="text-md md:text-lg lg:text-2xl text-gray-300 max-w-2xl">
              Discover and register for the latest seminars and workshops in
              your field.
            </p>
          </div>
          {/* BUTTONS */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-6 slide-in-from-top duration-1000">
            <button
              onClick={() => setLoginOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-800 text-white font-medium p-4 py-2 px-4 rounded-lg border border-indigo-400 hover:border-indigo-500 hover:-translate-y-2 transition-all duration-500"
            >
              Register Now
            </button>
            <a
              href="#how-it-works"
              className="bg-transparent border border-indigo-400/40 px-4 py-2 rounded-lg transition-all duration-500 ease-out hover:bg-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-2"
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
