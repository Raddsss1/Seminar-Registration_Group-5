import { useState } from "react";
import { Menu, X } from "lucide-react";
import LogInModal from "./LogInModal";

export default function Navbar() {
  const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false);

  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <navbar className="fixed top-0 z-50 w-full bg-slate-900/20 text-white shadow-md backdrop-blur-md">
      {/* ROOT DIV */}
      <div className="flex items-center justify-between gap-4 px-[4rem] py-4">
        <div>
          <a href="#" className="text-2xl font-medium">
            Event-O
          </a>
        </div>
        <div className="hidden md:flex p-2 items-center justify-center gap-10 text-md text-white font-normal">
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuIsOpen(false)}
            className="hover:text-indigo-300 transition-colors duration-300 ease-out"
          >
            How It Works
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuIsOpen(false)}
            className="hover:text-indigo-300 transition-colors duration-300 ease-out"
          >
            Features
          </a>
          <a
            href="#faqs"
            onClick={() => setMobileMenuIsOpen(false)}
            className="hover:text-indigo-300 transition-colors duration-300 ease-out"
          >
            FAQs
          </a>
          <a
            href="#cta"
            onClick={() => setMobileMenuIsOpen(false)}
            className="hover:text-indigo-300 transition-colors duration-300 ease-out"
          >
            Contact
          </a>
          {/* LOG-IN Button */}
          <button
            onClick={() => setLoginOpen(true)}
            className="cursor-pointer bg-indigo-600 hover:bg-indigo-800 text-white py-2 px-4 rounded-md transition-colors duration-300"
          >
            Log in
          </button>

          {loginOpen && (
            <LogInModal
              onClose={() => setLoginOpen(false)}
              onLogin={async (payload) => {
                // send payload to your backend; throw an Error to show a message
                console.log(payload);
              }}
            />
          )}
        </div>

        {/* MENU BUTTON */}
        <button
          className="md:hidden items-center p-2 text-gray-300 hover:text-white " //focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white
          onClick={() => setMobileMenuIsOpen((prev) => !prev)}
        >
          {mobileMenuIsOpen ? (
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          )}
        </button>
      </div>
      {/* MOBILE MENU */}
      {mobileMenuIsOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 animate-in slide-in-from-top duration-300">
          <div className="px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuIsOpen(false)}
              className="block text-gray-300 hover:text-white text-sm lg:text-base transition-colors duration-300"
            >
              How It Works
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuIsOpen(false)}
              className="block text-gray-300 hover:text-white text-sm lg:text-base transition-colors duration-300"
            >
              Features
            </a>
            <a
              href="#faqs"
              onClick={() => setMobileMenuIsOpen(false)}
              className="block text-gray-300 hover:text-white text-sm lg:text-base transition-colors duration-300"
            >
              FAQs
            </a>
            <a
              href="#cta"
              className="hover:text-gray-200 transition-colors duration-300 ease-out"
            >
              Contact
            </a>
          </div>
        </div>
      )}
    </navbar>
  );
}
