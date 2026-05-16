"use client";

import { useState, type FormEvent } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!email.trim()) {
      setStatus("error");
      setErrorMessage("Vyplňte e-mail.");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const json = await res.json();

      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(json.message || "Nepodařilo se přihlásit. Zkuste to znovu.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Chyba připojení. Zkuste to znovu.");
    }
  }

  if (status === "success") {
    return (
      <p className="text-center py-5 text-cz-blue font-semibold">
        Dáme vám vědět. Děkujeme.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="vas@email.cz"
        required
        className="flex-1 px-5 py-4 border border-gray-200 rounded text-sm text-cz-gray focus:outline-none focus:border-cz-blue transition-colors"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-8 py-4 bg-cz-red hover:bg-cz-red-dark text-white font-semibold text-sm rounded transition-colors duration-200 whitespace-nowrap disabled:opacity-60"
      >
        {status === "loading" ? "Odesílám..." : "Chci vědět první"}
      </button>
      {status === "error" && (
        <p className="sm:col-span-2 text-sm text-cz-red font-semibold text-center w-full">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
