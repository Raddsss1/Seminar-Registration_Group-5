import { useEffect, useId, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  CONFIG: edit roles, steps and fields here only                     */
/* ------------------------------------------------------------------ */

// Each role is a list of steps. A step is a group of fields that must be
// valid before the user can move on.
const ROLES = {
  attendee: {
    label: "Attendee",
    steps: [
      {
        title: "Create your account",
        fields: ["email", "password", "confirmPassword"],
      },
      { title: "Who are you?", fields: ["firstName", "lastName"] },
      { title: "What's your status?", fields: ["status"] },
    ],
  },
  organizer: {
    label: "Organizer",
    steps: [
      {
        title: "Create your account",
        fields: ["email", "password", "confirmPassword"],
      },
      {
        title: "Your organization",
        fields: ["companyName", "representativeName"],
      },
    ],
  },
};

const MIN_PASSWORD_LENGTH = 8;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Reusable validators
const required = (label) => (v) => (v.trim() ? "" : `${label} is required.`);
const textLength =
  (label, min = 2, max = 80) =>
  (v) => {
    const len = v.trim().length;
    if (len === 0) return `${label} is required.`;
    if (len < min) return `${label} must be at least ${min} characters.`;
    if (len > max) return `${label} must be ${max} characters or fewer.`;
    return "";
  };

// How each field looks and how it is validated.
// validate(value, allValues) returns an error string, or "" when valid.
const FIELDS = {
  email: {
    label: "Email",
    type: "email",
    placeholder: "your_email@example.com",
    autoComplete: "email",
    validate: (v) =>
      EMAIL_RE.test(v.trim()) ? "" : "Enter a valid email address.",
  },
  password: {
    label: "Password",
    type: "password",
    placeholder: "••••••••",
    autoComplete: "new-password",
    validate: (v) =>
      v.length >= MIN_PASSWORD_LENGTH
        ? ""
        : `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
  },
  confirmPassword: {
    label: "Confirm password",
    type: "password",
    placeholder: "••••••••",
    autoComplete: "new-password",
    validate: (v, all) => {
      if (!v) return "Confirm your password.";
      return v === all.password ? "" : "Passwords don't match.";
    },
  },
  firstName: {
    label: "First name",
    type: "text",
    placeholder: "Juan",
    autoComplete: "given-name",
    validate: textLength("First name", 2, 50),
  },
  lastName: {
    label: "Last name",
    type: "text",
    placeholder: "Dela Cruz",
    autoComplete: "family-name",
    validate: textLength("Last name", 2, 50),
  },
  status: {
    label: "Status",
    type: "choice",
    options: ["Student", "Employed", "Unemployed"],
    validate: (v) => (v ? "" : "Choose one option."),
  },
  companyName: {
    label: "Company name",
    type: "text",
    placeholder: "Acme Events Inc.",
    autoComplete: "organization",
    validate: textLength("Company name", 2, 100),
  },
  representativeName: {
    label: "Name of representative",
    type: "text",
    placeholder: "Full name",
    autoComplete: "name",
    validate: textLength("Representative name", 2, 80),
  },
};

// Fields that get the Show/Hide toggle
const PASSWORD_FIELDS = new Set(["password", "confirmPassword"]);

// Fields that must never be sent to the backend
const CLIENT_ONLY_FIELDS = new Set(["confirmPassword"]);

// Built from FIELDS, so a new field never needs to be added in two places
const EMPTY_VALUES = Object.fromEntries(
  Object.keys(FIELDS).map((k) => [k, ""]),
);

/* ------------------------------------------------------------------ */

export default function SignUpModal({ onClose, onSignUp, onSwitchToLogin }) {
  const uid = useId();
  const [role, setRole] = useState("attendee");
  const [step, setStep] = useState(0);
  const [values, setValues] = useState(EMPTY_VALUES);
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({}); // { [field]?: string, form?: string }
  const [loading, setLoading] = useState(false);

  const steps = ROLES[role].steps;
  const current = steps[step];
  const isLast = step === steps.length - 1;

  // Latest onClose in a ref so the effect below doesn't re-subscribe
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Close on Escape + lock page scroll while the modal is open
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onCloseRef.current?.();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, []);

  /* ---------- helpers ---------- */

  // Returns { field: message } for the given step (empty object = valid)
  const validateStep = (stepIndex, vals = values) => {
    const result = {};
    for (const name of steps[stepIndex].fields) {
      const msg = FIELDS[name].validate(vals[name], vals);
      if (msg) result[name] = msg;
    }
    return result;
  };

  const handleRoleChange = (key) => {
    if (key === role) return;
    setRole(key);
    setStep(0);
    // Keep the email; clear everything else so nothing lingers across roles
    setValues((prev) => ({ ...EMPTY_VALUES, email: prev.email }));
    setShowPw(false);
    setErrors({});
  };

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear only this field's error and the general form error
    setErrors((prev) => {
      if (!prev[name] && !prev.form) return prev;
      const { [name]: _removed, form: _form, ...rest } = prev;
      return rest;
    });
  };

  const handleBack = () => {
    setErrors({});
    setStep((s) => Math.max(0, s - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // also covers Enter key inside inputs
    if (loading) return;

    // 1) The current step must be valid before moving on or submitting
    const stepErrors = validateStep(step);
    if (Object.keys(stepErrors).length) return setErrors(stepErrors);

    // 2) Not the last step: just advance
    if (!isLast) {
      setErrors({});
      setStep((s) => s + 1);
      return;
    }

    // 3) Last step: re-check every step before sending, as a safety net
    //    (jump back to the first step that has a problem)
    for (let i = 0; i < steps.length; i++) {
      const errs = validateStep(i);
      if (Object.keys(errs).length) {
        setStep(i);
        return setErrors(errs);
      }
    }

    // Build a payload with only this role's fields
    const payload = { role };
    steps.forEach((s) =>
      s.fields.forEach((name) => {
        if (CLIENT_ONLY_FIELDS.has(name)) return;
        const v = values[name];
        payload[name] = name === "password" ? v : v.trim();
      }),
    );

    setLoading(true);
    try {
      // Replace with your real backend call, e.g.
      // const res = await fetch("/api/signup", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      // });
      // if (!res.ok) throw new Error("Could not create your account.");
      await onSignUp?.(payload);
      setLoading(false);
      onClose?.();
    } catch (err) {
      setErrors({
        form: err?.message || "Something went wrong. Please try again.",
      });
      setLoading(false);
    }
  };

  // Close only when a press starts on the backdrop itself
  // Events are also stopped from bubbling, because when this modal is
  // rendered inside another modal (e.g. LogInModal), React would otherwise
  // pass our clicks up to that modal's own backdrop and close it.
  const handleBackdropMouseDown = (e) => {
    e.stopPropagation();
    if (e.target === e.currentTarget) onClose?.();
  };

  const titleId = `${uid}-title`;

  /* ---------- field renderers ---------- */

  const renderChoice = (name, f, inputId, errorId, fieldError) => (
    <div
      role="radiogroup"
      aria-labelledby={`${inputId}-label`}
      aria-invalid={fieldError ? "true" : undefined}
      aria-describedby={fieldError ? errorId : undefined}
      className="grid grid-cols-1 sm:grid-cols-3 gap-2"
    >
      {f.options.map((opt) => (
        <button
          key={opt}
          type="button"
          role="radio"
          aria-checked={values[name] === opt}
          onClick={() => handleChange(name, opt)}
          className={`cursor-pointer rounded-md border py-2 px-3 transition-colors ${
            values[name] === opt
              ? "bg-indigo-700 border-indigo-500 text-white"
              : "bg-slate-800 border-indigo-800 text-slate-300 hover:bg-slate-700"
          } ${fieldError ? "border-rose-500" : ""}`}
        >
          {opt}
        </button>
      ))}
    </div>
  );

  const renderInput = (name, f, inputId, errorId, fieldError, autoFocus) => {
    const isPassword = PASSWORD_FIELDS.has(name);
    return (
      <div className="relative">
        <input
          id={inputId}
          name={name}
          type={isPassword && showPw ? "text" : f.type}
          autoComplete={f.autoComplete}
          placeholder={f.placeholder}
          value={values[name]}
          onChange={(e) => handleChange(name, e.target.value)}
          autoFocus={autoFocus}
          aria-invalid={fieldError ? "true" : undefined}
          aria-describedby={fieldError ? errorId : undefined}
          className={`bg-slate-800 p-2 rounded-md border text-white w-full placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition ${
            fieldError
              ? "border-rose-500 focus:border-rose-400"
              : "border-indigo-800 focus:border-indigo-400"
          } ${isPassword ? "pr-16" : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPw((s) => !s)}
            aria-label={showPw ? "Hide passwords" : "Show passwords"}
            className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-2 py-1"
          >
            {showPw ? "Hide" : "Show"}
          </button>
        )}
      </div>
    );
  };

  /* ---------- render ---------- */

  return (
    <section
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 backdrop-blur-sm p-4"
      onMouseDown={handleBackdropMouseDown}
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="bg-slate-950 max-w-md w-full max-h-full overflow-y-auto p-4 rounded-xl outline outline-2 outline-slate-800">
        <div className="flex flex-col justify-center items-center gap-8 mt-2 mb-6">
          {/* HEADER */}
          <div className="text-center">
            <h1
              id={titleId}
              className="text-xl sm:text-2xl md:text-3xl font-bold text-white"
            >
              {step === 0 ? "New here?" : current.title}
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm md:text-base">
              {step === 0
                ? "Sign up and explore Event-O"
                : `Step ${step + 1} of ${steps.length}`}
            </p>
          </div>

          {/* PROGRESS */}
          <div
            className="flex gap-2 w-full"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={steps.length}
            aria-valuenow={step + 1}
            aria-label="Sign-up progress"
          >
            {steps.map((s, i) => (
              <div
                key={s.title}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i <= step ? "bg-indigo-600" : "bg-slate-800"
                }`}
              />
            ))}
          </div>

          {/* ROLE SELECTOR: only on step 1 so users can't wipe their progress */}
          {step === 0 && (
            <div
              role="radiogroup"
              aria-label="Account type"
              className="grid grid-cols-2 gap-2 w-full p-2 rounded-lg bg-slate-900/60 text-white"
            >
              {Object.entries(ROLES).map(([key, r]) => (
                <button
                  key={key}
                  type="button"
                  role="radio"
                  aria-checked={role === key}
                  onClick={() => handleRoleChange(key)}
                  className={`cursor-pointer rounded-md h-8 w-full transition-colors duration-300 ${
                    role === key
                      ? "bg-indigo-700 text-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          )}

          {/* STEP FORM */}
          <form onSubmit={handleSubmit} className="w-full space-y-8" noValidate>
            {current.fields.map((name, i) => {
              const f = FIELDS[name];
              const inputId = `${uid}-${name}`;
              const errorId = `${inputId}-error`;
              const fieldError = errors[name];

              return (
                <div
                  key={`${role}-${name}`}
                  className={`flex flex-col justify-center gap-2 w-full ${
                    i > 0 ? "mt-4" : ""
                  }`}
                >
                  <label
                    id={`${inputId}-label`}
                    htmlFor={f.type === "choice" ? undefined : inputId}
                    className="text-slate-300"
                  >
                    {f.label}
                  </label>

                  {f.type === "choice"
                    ? renderChoice(name, f, inputId, errorId, fieldError)
                    : renderInput(
                        name,
                        f,
                        inputId,
                        errorId,
                        fieldError,
                        i === 0,
                      )}

                  {fieldError && (
                    <p
                      id={errorId}
                      className="text-sm text-rose-400"
                      role="alert"
                    >
                      {fieldError}
                    </p>
                  )}
                </div>
              );
            })}

            {errors.form && (
              <p className="mt-4 text-sm text-rose-400" role="alert">
                {errors.form}
              </p>
            )}

            {/* NAVIGATION */}
            <div className="flex gap-2 mt-6 w-full">
              {step > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={loading}
                  className="cursor-pointer w-1/3 bg-slate-800 hover:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-2 px-4 rounded-md transition"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-700 hover:bg-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed text-white py-2 px-4 rounded-md transition"
              >
                {loading
                  ? "Creating account…"
                  : isLast
                    ? "Create account"
                    : "Next"}
              </button>
            </div>
          </form>
          {/* LOG-IN BUTTON */}
          <div className="space-x-2">
            <span className="inline-block">Already have an account? </span>
            <button
              type="button"
              onClick={onSwitchToLogin ?? onClose}
              className="cursor-pointer text-indigo-500 hover:text-indigo-300"
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/*
  USAGE (in the parent)

  <SignUpModal
    onClose={() => setModal(null)}
    onSignUp={async (payload) => { await api.signUp(payload); }}
    onSwitchToLogin={() => setModal("login")}
  />

  Payload examples sent to onSignUp:
    attendee:  { role, email, password, firstName, lastName, status }
    organizer: { role, email, password, companyName, representativeName }
*/
