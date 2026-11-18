export default function Features() {
  const features = [
    {
      title: "Feature 1",
      description: "Description for Feature 1",
      icon: "Icon 1",
      colspan: 1, // spans one column on large screens
    },
    {
      title: "Feature 2",
      description: "Description for Feature 2",
      icon: "Icon 2",
      colspan: 2, // spans two columns on large screens
    },
    {
      title: "Feature 3",
      description: "Description for Feature 3",
      icon: "Icon 3",
      colspan: 2, // spans the full row on large screens
    },
    {
      title: "Feature 4",
      description: "Description for Feature 4",
      icon: "Icon 4",
      colspan: 1,
    },
    {
      title: "Feature 5",
      description: "Description for Feature 5",
      icon: "Icon 5",
      colspan: 3,
    },
  ];

  return (
    <section
      id="features"
      className="relative min-h-screen flex items-center justify-center scroll-mt-12"
    >
      <div className="relative p-8 max-w-7xl w-full mx-auto flex flex-col items-center justify-center text-center group">
        <div className="p-6 h-auto w-full rounded-xl content-center">
          <div className="flex flex-col items-center justify-center gap-4 mt-6 mb-10">
            <h1 className="text-2xl md:text-5xl lg:text-6xl text-white font-bold">
              FEATURES
            </h1>
            <p className="text-indigo-300">
              List of features available with our platform.
            </p>
          </div>

          {/* BENTO GRID: one grid, many children */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            {features.map((item, index) => (
              <div
                key={index}
                className={`flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6 h-[20rem] w-full rounded-xl border border-slate-800 transition-all duration-500 ease-in-out hover:border-indigo-500/40 hover:-translate-y-2 hover:shadow-lg hover:shadow-indigo-500/20 ${
                  item.colspan === 3
                    ? "md:col-span-2 lg:col-span-3"
                    : item.colspan === 2
                      ? "md:col-span-2"
                      : "col-span-1"
                }`}
              >
                {/* TITLE & DESCRIPTION */}
                <div className="flex flex-col items-center justify-center text-center gap-4">
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>
                </div>
                {/* ICON */}
                <div className="mt-4">{item.icon}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
