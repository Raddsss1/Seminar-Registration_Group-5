import { useEffect, useState } from "react";

// Which fields each role needs. Add or remove roles/fields here only.
const ROLES = {
  attendee: { label: "Attendee", fields: ["email", "password"] },
  organizer: {
    label: "Organizer",
    fields: ["email", "password", "organizerCode"],
  },
  admin: { label: "Admin", fields: ["email", "password"] },
};

// How each field looks and how it is validated
const FIELDS = {
  email: {
    label: "Email",
    type: "text",
    placeholder: "your_email@example.com",
    autoComplete: "email",
    validate: (v) =>
      v.trim().length >= 3 ? "" : "email must be at least 3 characters.",
  },
  password: {
    label: "Password",
    type: "password",
    placeholder: "••••••••",
    autoComplete: "current-password",
    validate: (v) =>
      v.length >= 6 ? "" : "Password must be at least 6 characters.",
  },
  organizerCode: {
    label: "Organizer Code",
    type: "text",
    placeholder: "e.g. ORG-1234",
    autoComplete: "off",
    validate: (v) => (v.trim() ? "" : "Please enter your organizer code."),
  },
};

const EMPTY = { email: "", password: "", organizerCode: "" };

export default function LogInModal({ onClose, onLogin }) {
  const [role, setRole] = useState("attendee");
  const [values, setValues] = useState(EMPTY);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Close on Escape + lock page scroll while the modal is open
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const handleRoleChange = (key) => {
    setRole(key);
    setValues(EMPTY); // clear everything so the organizer code never lingers
    setShowPw(false);
    setError("");
  };

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate only the fields this role actually uses
    for (const name of ROLES[role].fields) {
      const msg = FIELDS[name].validate(values[name]);
      if (msg) return setError(msg);
    }

    // Build a payload with only the relevant fields
    const payload = { role };
    ROLES[role].fields.forEach((name) => {
      payload[name] = values[name];
    });

    setLoading(true);
    try {
      // Replace with your real backend call, e.g.
      // const res = await fetch("/api/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      // });
      // if (!res.ok) throw new Error("Invalid credentials.");
      await onLogin?.(payload);
      onClose?.();
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="fixed inset-0 min-h-screen w-full z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose} // click the dark backdrop to close
      role="dialog"
      aria-modal="true"
      aria-labelledby="loginTitle"
    >
      {/* ROOT DIV */}
      <div
        className="bg-slate-900 max-w-md w-full h-auto p-4 rounded-xl outline outline-2 outline-slate-800 "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col justify-center items-center gap-4 mt-2 mb-6 ">
          {/* HEADER */}
          <div className="text-center duration-500 transition-all ease-in-out slide-in-from-top">
            <h1 id="loginTitle" className="text-2xl font-bold text-white">
              Welcome Back
            </h1>
            <p className="text-slate-400">
              Please enter your details to continue
            </p>
          </div>

          {/* ROLE SELECTOR */}
          <div className="flex justify-center bg-slate-950/60 rounded-lg text-white w-full duration-700 transition-all ease-in-out slide-in-from-top">
            <div role="tablist" className="grid grid-cols-3 gap-2 w-full p-2">
              {Object.entries(ROLES).map(([key, r]) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={role === key}
                  onClick={() => handleRoleChange(key)}
                  className={`rounded-md h-[2rem] w-full transition ${
                    role === key
                      ? "bg-indigo-700 text-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* CREDENTIALS */}
          <form
            onSubmit={handleSubmit}
            className="w-full duration-1000 transition-all ease-in-out slide-in-from-top"
            noValidate
          >
            {ROLES[role].fields.map((name, i) => {
              const f = FIELDS[name];
              const isPassword = name === "password";
              return (
                <div
                  key={name}
                  className={`flex flex-col justify-center gap-2 w-full ${i > 0 ? "mt-4 " : ""}`}
                >
                  <label htmlFor={name} className="text-slate-300">
                    {f.label}
                  </label>
                  <div className="relative">
                    <input
                      id={name}
                      name={name}
                      type={isPassword && showPw ? "text" : f.type}
                      autoComplete={f.autoComplete}
                      placeholder={f.placeholder}
                      value={values[name]}
                      onChange={(e) => handleChange(name, e.target.value)}
                      autoFocus={i === 0}
                      className={`bg-slate-800 p-2 rounded-md border border-indigo-800 text-white w-full placeholder-slate-500 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30 transition ${
                        isPassword ? "pr-16" : ""
                      }`}
                    />
                    {isPassword && (
                      <button
                        type="button"
                        onClick={() => setShowPw((s) => !s)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-2 py-1"
                      >
                        {showPw ? "Hide" : "Show"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {error && (
              <p className="mt-4 text-sm text-rose-400" role="alert">
                {error}
              </p>
            )}

            {/* BUTTON */}
            <div className="flex justify-center mt-6 w-full">
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-700 w-full hover:bg-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed text-white py-2 px-4 rounded-md transition"
              >
                {loading ? "Signing in…" : "Log In"}
              </button>
            </div>
          </form>

          {/* Admins are not self-registered, so hide Sign Up for them */}
          {role !== "admin" && (
            <div className="text-slate-400 duration-500 transition-all ease-in-out slide-in-from-top">
              <span>Don’t Have an Account? </span>
              <a href="#" className="text-indigo-400 hover:text-indigo-300">
                Sign Up
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
