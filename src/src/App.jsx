import { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { Hero } from './components/pages/Hero';
import { Gallery } from './components/pages/Gallery';
import { Pricing } from './components/pages/Pricing';
import { ServiceDetails } from './components/pages/ServiceDetails';
import { Cart } from './components/pages/Cart';
import { Portfolio } from './components/pages/Portfolio';
import { Testimonials } from './components/pages/Testimonials';
import { ChatSupport } from './components/common/ChatSupport';
import { AdminWrapper } from './components/admin/AdminWrapper';
import { Footer } from './components/common/Footer';
import { Toaster } from '../components/ui/sonner';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedService, setSelectedService] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDark(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme);
  }, []);

  const handleThemeToggle = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const handleSelectService = (service) => {
    setSelectedService(service);
    setCurrentPage('service-details');
  };

  const handleAddToCart = (item) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(
        cartItem => cartItem.service.id === item.service.id &&
        JSON.stringify(cartItem.addons.sort()) === JSON.stringify(item.addons.sort())
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + item.quantity
        };
        return updated;
      } else {
        return [...prev, item];
      }
    });

    // Show success message and redirect
    alert('Service added to cart successfully!');
    setCurrentPage('cart');
  };

  const handleUpdateQuantity = (index, quantity) => {
    if (quantity <= 0) {
      handleRemoveItem(index);
      return;
    }

    setCartItems(prev => prev.map((item, i) =>
      i === index ? { ...item, quantity } : item
    ));
  };

  const handleRemoveItem = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleCheckout = () => {
    setCartItems([]);
    setCurrentPage('home');
  };

  const handleGetStarted = () => {
    setCurrentPage('services');
  };

  const handleNavigation = (page) => {
    if (page === 'services') {
      setCurrentPage('home');
      // Scroll to pricing section
      setTimeout(() => {
        const pricingElement = document.getElementById('pricing');
        if (pricingElement) {
          pricingElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      setCurrentPage(page);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'service-details':
        return selectedService ? (
          <ServiceDetails
            service={selectedService}
            onBack={() => setCurrentPage('home')}
            onAddToCart={handleAddToCart}
          />
        ) : (
          <div className="py-20 text-center">
            <p>Service not found</p>
          </div>
        );
      case 'cart':
        return (
          <Cart
            cartItems={cartItems}
            onBack={() => setCurrentPage('home')}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onCheckout={handleCheckout}
          />
        );
      case 'portfolio':
        return <Portfolio onBack={() => setCurrentPage('home')} />;
      case 'admin':
        return <AdminWrapper onBack={() => setCurrentPage('home')} isDark={isDark} onThemeToggle={handleThemeToggle} />;
      case 'about':
        return (
          <div className="py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center space-y-8">
                <h1 className="text-4xl lg:text-5xl">About ReelWorks</h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  We are a team of passionate video editors and creative professionals dedicated to bringing your vision to life. With over 5 years of experience and 500+ completed projects, we understand what it takes to create compelling video content that engages audiences and drives results.
                </p>
                <div className="grid md:grid-cols-3 gap-8 mt-12">
                  <div className="space-y-4">
                    <div className="text-3xl font-bold text-primary">5+</div>
                    <div className="text-lg font-medium">Years of Experience</div>
                    <p className="text-muted-foreground">
                      Serving clients across various industries with professional video editing services.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="text-3xl font-bold text-primary">500+</div>
                    <div className="text-lg font-medium">Projects Completed</div>
                    <p className="text-muted-foreground">
                      From corporate videos to personal projects, we've delivered exceptional results.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="text-3xl font-bold text-primary">98%</div>
                    <div className="text-lg font-medium">Client Satisfaction</div>
                    <p className="text-muted-foreground">
                      Our commitment to quality and customer service speaks for itself.
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
            <Hero onGetStarted={handleGetStarted} />
            <Gallery onViewPortfolio={() => setCurrentPage('portfolio')} />
            <Pricing onSelectService={handleSelectService} />
            <Testimonials />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen text-foreground relative overflow-x-hidden">
      {/* Enhanced gradient background for light mode, minimal change for dark */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-enhanced-light dark:bg-gradient-to-br dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900" />
        <div className="absolute inset-0 pattern-grid opacity-20 dark:opacity-10" />
        
        {/* Additional light mode enhancements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-violet-200/20 via-pink-200/20 to-transparent rounded-full blur-3xl animate-pulse dark:hidden" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-yellow-200/20 via-pink-200/20 to-transparent rounded-full blur-3xl animate-pulse dark:hidden" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-purple-200/15 to-transparent rounded-full blur-3xl animate-pulse dark:hidden" style={{ animationDelay: '4s' }} />
      </div>
      
      <Header
        currentPage={currentPage}
        onPageChange={handleNavigation}
        isDark={isDark}
        onThemeToggle={handleThemeToggle}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
      />
      
      <main className="relative z-10">
        {renderPage()}
      </main>

      {currentPage !== 'admin' && <ChatSupport />}
      
      {currentPage !== 'admin' && <Footer />}
      
      <Toaster />
    </div>
  );
}