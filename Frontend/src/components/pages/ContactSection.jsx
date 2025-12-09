import { useState } from "react";
import { Button } from "../ui/button";
import { supabase } from "../../lib/supabaseClient";

export function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    const { data, error } = await supabase.from("messages").insert([
      {
        name: form.name,
        email: form.email,
        message: form.message,
      },
    ]);

    if (error) {
      console.log(error);
      setStatus("error");
    } else {
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    }

    setLoading(false);
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[var(--background)] dark:bg-transparent">
        <div className="absolute inset-0 bg-[#FAF7F0] dark:hidden" />
        <div className="absolute inset-0 hidden dark:block bg-gradient-to-br from-blue-950/10 via-transparent to-purple-950/10" />
      </div>

      <div className="container mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* TEXT SECTION */}
          <div className="space-y-8">
            <h2 className="text-4xl lg:text-6xl tracking-tight font-redhat font-extrabold">
              We are here to help!
            </h2>
            <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
              Let us know how we can best serve you. Use the contact form to
              reach out or select from the packages that best fit your needs. We
              are happy to assists your needs!.
            </p>
          </div>

          {/* FORM */}
          <div className="w-full max-w-[700px] mx-auto lg:mx-0">
            <form
              onSubmit={handleSubmit}
              className="bg-white/95 dark:bg-gray-900/40 backdrop-blur-md rounded-3xl shadow-xl p-6 sm:p-10 border border-gray-100 dark:border-white/10 space-y-6"
            >
              {/* NAME */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Your Name"
                  required
                  className="w-full rounded-xl px-4 py-3
             bg-white dark:bg-gray-800/60
             border border-gray-300 dark:border-gray-600
             text-black dark:text-white
             placeholder:text-gray-400 dark:placeholder:text-gray-500
             focus:outline-none focus:ring-2 focus:ring-[#a8664c]"
                />
              </div>

              {/* EMAIL */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full rounded-xl px-4 py-3
             bg-white dark:bg-gray-800/60
             border border-gray-300 dark:border-gray-600
             text-black dark:text-white
             placeholder:text-gray-400 dark:placeholder:text-gray-500
             focus:outline-none focus:ring-2 focus:ring-[#a8664c]"
                />
              </div>

              {/* MESSAGE */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Message</label>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  placeholder="How can we help you?"
                  required
                  className="w-full rounded-xl px-4 py-3
             bg-white dark:bg-gray-800/60
             border border-gray-300 dark:border-gray-600
             text-black dark:text-white
             placeholder:text-gray-400 dark:placeholder:text-gray-500
             resize-none
             focus:outline-none focus:ring-2 focus:ring-[#a8664c]"
                />
              </div>

              {/* BUTTON */}
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full bg-gradient-primary text-white btn-hover-primary"
              >
                {loading ? "Sending..." : "Send Message"}
              </Button>

              {/* STATUS MESSAGE */}
              {status === "success" && (
                <p className="text-green-600 text-sm text-center">
                  ✔ Message sent successfully!
                </p>
              )}
              {status === "error" && (
                <p className="text-red-600 text-sm text-center">
                  ❌ Something went wrong. Try again.
                </p>
              )}

              <p className="text-xs text-muted-foreground text-center pt-2">
                This site is protected by reCAPTCHA and Google Privacy Policy
                applies.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
