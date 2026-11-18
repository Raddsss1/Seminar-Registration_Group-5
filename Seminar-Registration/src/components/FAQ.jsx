import { useState } from "react"; // CHANGED: added useState import
import { X } from "lucide-react";

export default function FAQ() {
  // ADDED: tracks which FAQ is open (null = all closed). Only one opens at a time.
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I join a seminar?",
      answer:
        "To join a seminar, simply register on our platform and you will receive a confirmation email with the seminar details.",
    },
    {
      question: "Can I cancel my registration?",
      answer:
        "Yes. Open your registered seminars and select cancel before the seminar starts.",
    },
    {
      question: "Are there any fees to join?",
      answer:
        "Most seminars are free, but some may have a registration fee. Please check the seminar details for more information.",
    },
    {
      question: "How do I get a certificate of attendance?",
      answer:
        "Certificates of attendance are provided for certain seminars. Check the seminar details to see if a certificate is available.",
    },
    {
      question: "What if I have technical issues during a seminar?",
      answer:
        "If you encounter technical issues, please contact the support team for assistance.",
    },
  ];

  // ADDED: clicking the open item closes it, clicking another item opens that one
  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faqs"
      className="relative min-h-screen flex items-center justify-center"
    >
      {/* ROOT DIV */}
      <div className="relative p-8 max-w-7xl w-full mx-auto flex flex-col items-center justify-center text-center group">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center p-6 h-auto w-full rounded-xl content-center">
          {/* LEFT COLUMN */}
          <div className="flex flex-col align-top text-left gap-4">
            <h1 className="text-xl lg:text-4xl text-white">
              Frequently Asked Questions
            </h1>
            <p className="text-sm sm:text-lg lg:text-xl text-indigo-300">
              Find answers to common questions about our platform and services.
            </p>
          </div>
          {/* RIGHT COLUMN */}
          <div className="flex flex-col items-center justify-center gap-4 mt-6 mb-10">
            {/* BUTTON */}
            {faqs.map((item, index) => {
              // ADDED: true when this specific card is the open one
              const isOpen = openIndex === index;

              return (
                <button
                  key={index} // ADDED: React needs a key when mapping
                  type="button" // ADDED: prevents accidental form submission
                  onClick={() => handleToggle(index)} // ADDED: toggles the card
                  aria-expanded={isOpen} // ADDED: accessibility for screen readers
                  // CHANGED: added "text-left" and "cursor-pointer" (rest unchanged)
                  className="flex justify-between text-left cursor-pointer bg-slate-900/60 backdrop-blur-sm p-4 rounded-lg w-full h-auto border border-slate-800 border border-slate-800 transition-all duration-500 ease-in-out hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/20 focus:outline-none"
                >
                  <div className="block">
                    <span className="text-sm sm:text-lg lg:text-xl font-medium">
                      {item.question}
                    </span>
                    {/* CHANGED: answer is wrapped so it can collapse/expand smoothly.
                        grid-rows goes from 0fr (hidden) to 1fr (full height). */}
                    <div
                      className={`grid transition-all duration-500 ease-in-out ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100 mt-3"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <span className="text-sm sm:text-lg lg:text-xl text-gray-300">
                          {item.answer}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    {/* CHANGED: the X is rotated 45deg when closed so it looks like a "+",
                        and turns back into an X when open. */}
                    <X
                      className={`transition-transform duration-500 ease-in-out ${
                        isOpen ? "rotate-0" : "rotate-45"
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
