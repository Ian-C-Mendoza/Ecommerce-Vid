import { useState, useEffect } from "react";
import { Header } from "./components/common/Header";
import { Hero } from "./components/pages/Hero";
import { Gallery } from "./components/pages/Gallery";
import { ContactSection } from "./components/pages/ContactSection";
import { Pricing } from "./components/pages/Pricing";
import { ServiceDetails } from "./components/pages/ServiceDetails";
import { Cart } from "./components/pages/Cart";
import { OrderHistory } from "./components/pages/OrderHistory";
import { Checkout } from "./components/pages/Checkout";
import { Portfolio } from "./components/pages/Portfolio";
import { ChatSupport } from "./components/common/ChatSupport";
import { AdminWrapper } from "./components/admin/AdminWrapper";
import { Footer } from "./components/common/Footer";
import { Toaster } from "sonner";
import { addons } from "./data/mockData"; // ✅ addon price lookup
// App.jsx
import { CustomPackageBuilder } from "./components/pages/CustomPackageBuilder";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [transitioning, setTransitioning] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const initialTheme = savedTheme === "dark" || (!savedTheme && prefersDark);

    setIsDark(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme);
  }, []);

  const handleThemeToggle = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle("dark", newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const handleSelectService = (service) => {
    setSelectedService(service);
    setCurrentPage("service-details");
  };

  const handleAddToCart = (item) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (cartItem) =>
          cartItem.service.id === item.service.id &&
          JSON.stringify(cartItem.addons.sort()) ===
            JSON.stringify(item.addons.sort())
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + item.quantity,
        };
        return updated;
      } else {
        return [...prev, item];
      }
    });

    setCurrentPage("cart");
  };

  const handleUpdateQuantity = (index, quantity) => {
    if (quantity <= 0) {
      handleRemoveItem(index);
      return;
    }

    setCartItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ subtotal calculation
  const subtotal = cartItems.reduce((sum, item) => {
    const addonsCost = (item.addons || []).reduce((addonSum, addonName) => {
      const addon = addons.find((a) => a.name === addonName);
      return addonSum + (addon?.price || 0);
    }, 0);
    return sum + (item.service.price + addonsCost) * item.quantity;
  }, 0);

  // ✅ Smooth scroll and transition handling
  const handlePageChange = (page) => {
    // If the section exists on the current page → smooth scroll
    const section = document.getElementById(page);
    if (section && currentPage === "home" && page !== "portfolio") {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    // If navigating to portfolio → fade transition
    if (page === "portfolio") {
      setTransitioning(true);
      setTimeout(() => {
        setCurrentPage(page);
        setTimeout(() => setTransitioning(false), 200);
      }, 100);
      return;
    }

    // Otherwise normal page switch
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "custom-package":
        return (
          <CustomPackageBuilder
            onBack={() => setCurrentPage("home")}
            onSelectService={(service) => {
              setSelectedService(service);
              setCurrentPage("service-details");
            }}
          />
        );

      case "service-details":
        return selectedService ? (
          <ServiceDetails
            service={selectedService}
            onBack={() => setCurrentPage("home")}
            onAddToCart={handleAddToCart}
          />
        ) : (
          <div className="py-20 text-center">
            <p>Service not found</p>
          </div>
        );

      case "cart":
        return (
          <Cart
            cartItems={cartItems}
            onBack={() => setCurrentPage("home")}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onCheckout={() => setCurrentPage("checkout")}
          />
        );
      case "orders":
        return <OrderHistory onBack={() => setCurrentPage("home")} />;

      case "checkout":
        return (
          <Checkout
            cartItems={cartItems}
            setCartItems={setCartItems} // <-- pass it here
            total={subtotal}
            onPlaceOrder={(orderData) => {
              console.log("✅ Order placed:", orderData);
              setCartItems([]);
              setCurrentPage("done");
            }}
            onBack={() => setCurrentPage("cart")}
            onSelectService={() => handlePageChange("services")} // 👈 this is the fix
          />
        );

      case "done":
        return (
          <div className="p-20 text-center">
            <h1 className="text-3xl font-bold mb-4">🎉 Thank you!</h1>
            <p>Your order has been placed successfully.</p>
            <button
              className="mt-6 px-6 py-3 bg-gradient-primary text-white rounded-lg"
              onClick={() => setCurrentPage("home")}
            >
              Continue Shopping
            </button>
          </div>
        );

        //  case "portfolio":
        return (
          <div
            className={`transition-opacity duration-500 ${
              transitioning ? "opacity-0" : "opacity-100"
            }`}
          >
            <Portfolio onBack={() => setCurrentPage("home")} />
          </div>
        );

      case "admin":
        return (
          <AdminWrapper
            onBack={() => setCurrentPage("home")}
            isDark={isDark}
            onThemeToggle={handleThemeToggle}
          />
        );

      case "about":
        return (
          <div className="py-28">
            <div className="container mx-auto px-4">
              {/* Glass Container */}
              <div
                className="
        max-w-6xl mx-auto
        rounded-2xl
        bg-white/60 dark:bg-gray-900/60
        backdrop-blur-xl
        border border-white/20 dark:border-white/10
        shadow-lg
        px-8 sm:px-12 lg:px-16
        py-16
            mt-12 mb-12

      "
              >
                <div className="max-w-4xl mx-auto text-center space-y-14">
                  {/* Heading */}
                  <h1 className="text-4xl lg:text-5xl text-muted-foreground font-bold">
                    About{" "}
                    <span className="bg-gradient-primary bg-clip-text text-transparent animate-pulse-hard">
                      WeEdit Co
                    </span>
                  </h1>

                  {/* Description */}
                  <p className="max-w-3xl mx-auto text-lg lg:text-xl text-muted-foreground leading-relaxed mb-12">
                    WeEdit Co empowers brands with polished, professional video
                    content that enhances visibility and keeps your online
                    presence active and compelling so you can focus on what
                    matters most in your business. Backed by a skilled team of
                    editors, we deliver consistent, high-quality results that
                    support your marketing and business growth.
                  </p>

                  {/* Feature Grid */}
                  <div className="grid gap-12 md:grid-cols-3 mt-20 animate-pulse-hard">
                    {[
                      {
                        title: "Experienced Creative Team",
                        desc: "Years of proven editing expertise across various industries and content styles.",
                      },
                      {
                        title: "Trusted by Growing Businesses",
                        desc: "Brands and entrepreneurs rely on us for consistent, high-quality video content.",
                      },
                      {
                        title: "Client Satisfaction",
                        desc: "Our dedication to quality and smooth communication keeps clients coming back.",
                      },
                    ].map((item, i) => (
                      <div key={i} className="relative group">
                        {/* Soft Gradient Border */}
                        <div
                          className="
                  absolute -inset-0.5 rounded-2xl
                  bg-gradient-primary
                  opacity-20
                  blur-lg
                  group-hover:opacity-30
                  transition-opacity duration-500
                "
                        />

                        {/* Card */}
                        <div
                          className="
                  relative h-full
                  rounded-2xl
                  bg-white/70 dark:bg-gray-900/70
                  backdrop-blur-lg
                  border border-white/40 dark:border-white/10
                  px-8 py-10
                  text-center
                  shadow-sm
                  hover:shadow-xl
                  hover:-translate-y-1
                  transition-all duration-300
                "
                        >
                          <h3 className="text-lg font-semibold bg-gradient-primary bg-clip-text text-transparent">
                            {item.title}
                          </h3>

                          <p className="mt-4 text-muted-foreground leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <>
            <section id="home">
              <Hero onGetStarted={() => handlePageChange("services")} />
            </section>

            <section id="services" className="scroll-mt-20">
              <Pricing
                onSelectService={handleSelectService}
                onOpenCustomBuilder={() => setCurrentPage("custom-package")}
              />
            </section>

            <section id="contact" className="scroll-mt-20">
              <ContactSection />
            </section>
          </>
        );
    }
  };

  return (
    <div
      className={`min-h-screen text-foreground relative overflow-x-hidden transition-all duration-500 ${
        transitioning ? "opacity-0 scale-[0.98]" : "opacity-100 scale-100"
      }`}
    >
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-enhanced-light dark:bg-gradient-to-br dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900" />
        <div className="absolute inset-0 pattern-grid opacity-20 dark:opacity-10" />
      </div>

      {/* Header (hidden on admin) */}
      {currentPage !== "admin" && (
        <Header
          currentPage={currentPage}
          onPageChange={handlePageChange}
          isDark={isDark}
          onThemeToggle={handleThemeToggle}
          cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        />
      )}

      <main className="relative z-10">{renderPage()}</main>

      {/*currentPage !== "admin" && <ChatSupport />*/}
      {currentPage !== "admin" && (
        <Footer onSelectService={handleSelectService} />
      )}

      <Toaster />
    </div>
  );
}
