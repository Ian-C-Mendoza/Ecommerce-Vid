import { Button } from "../ui/button";

export function ContactSection() {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background - matches Hero section */}
      <div className="absolute inset-0 bg-[var(--background)] dark:bg-transparent">
        <div className="absolute inset-0 bg-[#FAF7F0] dark:hidden" />
        <div className="absolute inset-0 hidden dark:block bg-gradient-to-br from-blue-950/10 via-transparent to-purple-950/10" />
      </div>

      <div className="container mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Text Section */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-6xl tracking-tight font-redhat font-extrabold">
                We are here to help!
              </h2>
              <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                Let us know how we can best serve you. Use the contact form to
                reach out or select from the topics that best fit your needs.
                It's an honor to support you in your journey.
              </p>
            </div>
          </div>

          {/* Right Contact Form */}
          <div className="w-full max-w-[700px] mx-auto lg:mx-0">
            <form className="bg-white/95 dark:bg-gray-900/40 backdrop-blur-md rounded-3xl shadow-xl p-6 sm:p-10 border border-gray-100 dark:border-white/10 space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Name</label>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full border border-gray-300 dark:border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 bg-white dark:bg-gray-900/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#a8664c] transition-all"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full border border-gray-300 dark:border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 bg-white dark:bg-gray-900/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#a8664c] transition-all"
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Message</label>
                <textarea
                  rows={5}
                  placeholder="How can we help you?"
                  className="w-full border border-gray-300 dark:border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 bg-white dark:bg-gray-900/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#a8664c] transition-all resize-none"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-primary text-white btn-hover-primary"
                >
                  Send Message
                </Button>
              </div>

              {/* Privacy Text */}
              <p className="text-xs text-muted-foreground text-center leading-relaxed pt-2">
                This site is protected by reCAPTCHA and the Google Privacy
                Policy and Terms of Service apply.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
