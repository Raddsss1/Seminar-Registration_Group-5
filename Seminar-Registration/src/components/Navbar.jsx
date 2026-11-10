export default function Navbar() {
  return (
    <navbar className="fixed top-0 z-50 w-full bg-slate-900/20 text-white shadow-md backdrop-blur-md">
      {/* ROOT DIV */}
      <div className="flex items-center justify-center gap-4 px-4 py-4">
        <div className="flex items-center justify-center gap-4 text-md text-gray-400 font-normal">
          <a className="hover:text-gray-200 transition-colors duration-300 ease-out">
            Navigation Links Go Here
          </a>
        </div>
      </div>
    </navbar>
  );
}
