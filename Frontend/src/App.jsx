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
          <div className="py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center space-y-8">
                <h1 className="text-4xl lg:text-5xl">About WeEdit Co</h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  We are a team of passionate video editors and creative
                  professionals dedicated to bringing your vision to life. With
                  over 5 years of experience and 500+ completed projects, we
                  understand what it takes to create compelling video content
                  that engages audiences and drives results.
                </p>
                <div className="grid md:grid-cols-3 gap-8 mt-12">
                  <div className="space-y-4">
                    <div className="text-3xl font-bold text-primary">5+</div>
                    <div className="text-lg font-medium">
                      Years of Experience
                    </div>
                    <p className="text-muted-foreground">
                      Serving clients across various industries with
                      professional video editing services.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="text-3xl font-bold text-primary">500+</div>
                    <div className="text-lg font-medium">
                      Projects Completed
                    </div>
                    <p className="text-muted-foreground">
                      From corporate videos to personal projects, we've
                      delivered exceptional results.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="text-3xl font-bold text-primary">98%</div>
                    <div className="text-lg font-medium">
                      Client Satisfaction
                    </div>
                    <p className="text-muted-foreground">
                      Our commitment to quality and customer service speaks for
                      itself.
                    </p>
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
              <Pricing onSelectService={handleSelectService} />
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
