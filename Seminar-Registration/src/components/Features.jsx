export default function Features() {
  return (
    <section
      id="features"
      className="relative min-h-screen flex items-center justify-center"
    >
      {/* ROOT DIV */}
      <div className="relative p-8 max-w-7xl w-full mx-auto flex flex-col items-center justify-center text-center group">
        <div className="bg-slate-800/20 backdrop-blur-sm p-6 h-[25rem] w-full rounded-xl content-center slide-in-from-top duration-500 transition-all ease-in-out group-hover:scale-102 group-hover:shadow-xl group-hover:shadow-slate-800/50">
          <h1 className="text-2xl md:text-5xl lg:text-6xl text-white items-center justify-center font-bold">
            FEATURES
          </h1>
        </div>
      </div>
    </section>
  );
}
