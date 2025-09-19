
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  type: string;
  status: string;
  is_rental?: boolean;
  image_url: string;
  area?: string;
}

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  readTime: string;
}

const Home = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newsletterData, setNewsletterData] = useState({
    email: '',
    name: ''
  });
  const [consultationData, setConsultationData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    serviceType: '',
    message: ''
  });
  const [contactFormData, setContactFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showConsultationForm, setShowConsultationForm] = useState(false);
  const [isConsultationSubmitting, setIsConsultationSubmitting] = useState(false);
  const [consultationSubmitStatus, setConsultationSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false);
  const [newsletterSubmitStatus, setNewsletterSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [stats, setStats] = useState({
    projects: 0,
    clients: 0,
    experience: 0
  });
  const [statsAnimated, setStatsAnimated] = useState(false);

  // Hero slides data
  const heroSlides = [
    {
      image: 'https://readdy.ai/api/search-image?query=luxury%20modern%20villa%20exterior%20with%20pool%20and%20landscaped%20garden%20at%20sunset%2C%20premium%20residential%20architecture%2C%20elegant%20contemporary%20design%2C%20warm%20lighting%2C%20sophisticated%20property%20showcase&width=1920&height=1080&seq=hero1&orientation=landscape',
      title: 'Your Dream Home',
      subtitle: 'Awaits',
      description: 'Expert real estate guidance with personalized service. Let me help you find the perfect property or sell your home for the best price.'
    },
    {
      image: 'https://readdy.ai/api/search-image?query=elegant%20penthouse%20interior%20with%20panoramic%20city%20views%2C%20luxury%20living%20room%20with%20modern%20furniture%2C%20floor%20to%20ceiling%20windows%2C%20sophisticated%20interior%20design%2C%20premium%20residential%20space&width=1920&height=1080&seq=hero2&orientation=landscape',
      title: 'Premium Properties',
      subtitle: 'In Gurgaon',
      description: 'Specialized in luxury real estate with over 30 years of experience in Gurgaon\'s premium market.'
    },
    {
      image: 'https://readdy.ai/api/search-image?query=luxury%20commercial%20building%20exterior%20at%20dusk%2C%20modern%20glass%20architecture%2C%20sophisticated%20business%20district%2C%20investment%20property%20showcase%2C%20premium%20real%20estate%20portfolio&width=1920&height=1080&seq=hero3&orientation=landscape',
      title: 'Investment Excellence',
      subtitle: 'Trusted Guidance',
      description: 'Helping families, corporates, and investors find dream homes and high-return opportunities since 1990.'
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      name: 'Mr. & Mrs. Sharma',
      role: 'DLF Magnolias',
      image: 'https://readdy.ai/api/search-image?query=professional%20Indian%20businessman%20in%20elegant%20suit%2C%20confident%20smile%2C%20modern%20office%20background%2C%20executive%20portrait%20style%2C%20sophisticated%20appearance&width=80&height=80&seq=testimonial1&orientation=squarish',
      rating: 5,
      text: 'Buying our dream home in Gurgaon seemed overwhelming at first, but Rajeev made the entire process seamless. His knowledge of the luxury market, attention to detail, and ability to understand exactly what we wanted stood out. He found us a property that checked every box — location, design, and investment value. We couldn\'t have asked for a better guide.'
    },
    {
      name: 'Dr. Mehta',
      role: 'The Camellias',
      image: 'https://readdy.ai/api/search-image?query=professional%20Indian%20businesswoman%20in%20elegant%20blazer%2C%20warm%20smile%2C%20modern%20office%20setting%2C%20corporate%20portrait%20photography%2C%20confident%20appearance&width=80&height=80&seq=testimonial2&orientation=squarish',
      rating: 5,
      text: 'Rajeev is not just a realtor; he\'s a trusted advisor. From the very first meeting, he understood our requirements, respected our time, and showed us only the most relevant properties. His insights into market trends helped us make a smart decision, and today we are proud owners of a home we truly love. Highly recommended for luxury real estate in Gurgaon.'
    },
    {
      name: 'Mr. Kapoor',
      role: 'Ambience Caitriona',
      image: 'https://readdy.ai/api/search-image?query=distinguished%20Indian%20gentleman%20in%20premium%20suit%2C%20confident%20expression%2C%20upscale%20office%20background%2C%20executive%20portrait%20style%2C%20sophisticated%20businessman&width=80&height=80&seq=testimonial3&orientation=squarish',
      rating: 5,
      text: 'What impressed us most about Rajeev was his integrity and professionalism. In Gurgaon\'s fast-moving luxury real estate market, he gave us the confidence to make the right choice. He handled every detail — negotiations, paperwork, and coordination — so smoothly that the entire journey felt effortless. We are grateful for his guidance.'
    },
  ];

  // Blog posts data
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: 'Gurgaon Luxury Real Estate Market 2024',
      excerpt: 'Explore the latest trends shaping Gurgaon\'s luxury property market and investment opportunities.',
      image: 'https://readdy.ai/api/search-image?query=luxury%20real%20estate%20market%20analysis%2C%20modern%20buildings%20and%20charts%2C%20property%20investment%20trends%2C%20professional%20business%20photography%2C%20sophisticated%20market%20overview&width=400&height=250&seq=blog1&orientation=landscape',
      date: 'Dec 15, 2024',
      readTime: '5 min read'
    },
    {
      id: 2,
      title: 'Investment Guide: DLF Premium Projects',
      excerpt: 'Strategic insights for investing in DLF\'s high-value properties and maximizing returns.',
      image: 'https://readdy.ai/api/search-image?query=premium%20property%20investment%20guide%2C%20luxury%20buildings%20and%20financial%20charts%2C%20real%20estate%20portfolio%20analysis%2C%20professional%20business%20imagery%2C%20investment%20strategy%20visualization&width=400&height=250&seq=blog2&orientation=landscape',
      date: 'Dec 10, 2024',
      readTime: '7 min read'
    },
    {
      id: 3,
      title: 'Luxury Home Buying in Gurgaon',
      excerpt: 'Essential considerations when purchasing premium residential properties in NCR.',
      image: 'https://readdy.ai/api/search-image?query=luxury%20home%20buying%20checklist%2C%20elegant%20residential%20property%20exterior%2C%20premium%20real%20estate%20guide%2C%20sophisticated%20property%20showcase%2C%20professional%20real%20estate%20photography&width=400&height=250&seq=blog3&orientation=landscape',
      date: 'Dec 5, 2024',
      readTime: '6 min read'
    }
  ];

  useEffect(() => {
    loadProperties();
    animateStats();
    
    // Auto-advance hero slider
    const heroInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    // Auto-advance testimonials
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => {
      clearInterval(heroInterval);
      clearInterval(testimonialInterval);
    };
  }, []);

  const loadProperties = async () => {
    try {
      setLoadingProperties(true);
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/get-properties`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        const featuredProperties = data.properties?.slice(0, 6) || [];
        setProperties(featuredProperties);
      } else {
        setProperties([]);
      }
    } catch (error) {
      setProperties([]);
    } finally {
      setLoadingProperties(false);
    }
  };

  const animateStats = () => {
    if (!statsAnimated) {
      setStatsAnimated(true);
      
      // Animate projects counter
      let projectCount = 0;
      const projectInterval = setInterval(() => {
        projectCount += 15;
        setStats(prev => ({ ...prev, projects: projectCount }));
        if (projectCount >= 440) {
          clearInterval(projectInterval);
          setStats(prev => ({ ...prev, projects: 440 }));
        }
      }, 50);

      // Animate clients counter to show sales volume
      let clientCount = 0;
      const clientInterval = setInterval(() => {
        clientCount += 15;
        setStats(prev => ({ ...prev, clients: clientCount }));
        if (clientCount >= 489) {
          clearInterval(clientInterval);
          setStats(prev => ({ ...prev, clients: 489 }));
        }
      }, 50);

      // Animate experience counter
      let expCount = 0;
      const expInterval = setInterval(() => {
        expCount += 1;
        setStats(prev => ({ ...prev, experience: expCount }));
        if (expCount >= 30) {
          clearInterval(expInterval);
          setStats(prev => ({ ...prev, experience: 30 }));
        }
      }, 200);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsNewsletterSubmitting(true);
    
    try {
      const formDataToSend = new URLSearchParams();
      formDataToSend.append('email', newsletterData.email);
      formDataToSend.append('name', newsletterData.name);

      const response = await fetch('https://readdy.ai/api/form/d36qc4btg2u3f2oj3vq0', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formDataToSend
      });

      if (response.ok) {
        setNewsletterSubmitStatus('success');
        setNewsletterData({ email: '', name: '' });
      } else {
        setNewsletterSubmitStatus('error');
      }
    } catch (error) {
      setNewsletterSubmitStatus('error');
    } finally {
      setIsNewsletterSubmitting(false);
    }
  };

  const handleConsultationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConsultationSubmitting(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/submit-consultation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(consultationData),
      });

      if (response.ok) {
        setConsultationSubmitStatus('success');
        setConsultationData({
          name: '',
          email: '',
          phone: '',
          preferredDate: '',
          preferredTime: '',
          serviceType: '',
          message: ''
        });
        setTimeout(() => {
          setShowConsultationForm(false);
          setConsultationSubmitStatus('idle');
        }, 3000);
      } else {
        setConsultationSubmitStatus('error');
      }
    } catch (error) {
      setConsultationSubmitStatus('error');
    } finally {
      setIsConsultationSubmitting(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formDataToSend = new URLSearchParams();
      formDataToSend.append('firstName', contactFormData.firstName);
      formDataToSend.append('lastName', contactFormData.lastName);
      formDataToSend.append('email', contactFormData.email);
      formDataToSend.append('phone', contactFormData.phone);
      formDataToSend.append('message', contactFormData.message);

      const response = await fetch('https://readdy.ai/api/form/submit/contact_form_67633e4e4c94b', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formDataToSend
      });

      if (response.ok) {
        setSubmitStatus('success');
        setContactFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: ''
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number, isRental: boolean = false) => {
    if (isRental) {
      return `₹${price.toLocaleString()}/mo`;
    }
    return `₹${price.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'For Sale': return 'bg-blue-600';
      case 'For Rent': return 'bg-green-600';
      case 'Investment': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white-900/95 backdrop-blur-md  border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* <div className="flex items-center">
              <h1 className="text-3xl font-bold bg-gold-gradient bg-clip-text text-transparent font-serif">
                Rajeev Mittal
              </h1>
            </div> */}
            <div className="flex items-center">
              <img 
                src="/image.png"
                alt="Rajeev Mittal Logo" 
                className="h-16 w-auto cursor-pointer"
                onClick={() => navigate('/')}
              />
              <button
                onClick={() => navigate('/')}
                className="text-1xl font-bold text-gold-400 cursor-pointer"
              >
                Rajeev Mittal
              </button>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#home" className="text-gold-400 hover:text-gold-300 px-3 py-2 text-sm font-medium cursor-pointer transition-colors">Home</a>
                <a href="#about" className="text-gold-400 hover:text-gold-300 px-3 py-2 text-sm font-medium cursor-pointer transition-colors">About</a>
                <button onClick={() => navigate('/properties')} className="text-gold-400 hover:text-gold-300 px-3 py-2 text-sm font-medium cursor-pointer transition-colors">Properties</button>
                <a href="#services" className="text-gold-400 hover:text-gold-300 px-3 py-2 text-sm font-medium cursor-pointer transition-colors">Services</a>
                <a href="#contact" className="text-gold-400 hover:text-gold-300 px-3 py-2 text-sm font-medium cursor-pointer transition-colors">Contact</a>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <a href="https://wa.me/9811017103" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center cursor-pointer transition-colors">
                <i className="ri-whatsapp-line text-white w-5 h-5 flex items-center justify-center"></i>
              </a>
              
              {/* Mobile menu button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden w-10 h-10 bg-gold-500 hover:bg-gold-600 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
              >
                <i className={`ri-${mobileMenuOpen ? 'close' : 'menu'}-line text-white w-5 h-5 flex items-center justify-center`}></i>
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mobile-menu bg-gray-900 border-t border-gray-800">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a href="#home" className="text-gold-400 hover:text-gold-300 block px-3 py-2 text-base font-medium cursor-pointer">Home</a>
                <a href="#about" className="text-gray-300 hover:text-gold-300 block px-3 py-2 text-base font-medium cursor-pointer">About</a>
                <button onClick={() => navigate('/properties')} className="text-gray-300 hover:text-gold-300 block px-3 py-2 text-base font-medium cursor-pointer w-full text-left">Properties</button>
                <a href="#services" className="text-gray-300 hover:text-gold-300 block px-3 py-2 text-base font-medium cursor-pointer">Services</a>
                <a href="#contact" className="text-gray-300 hover:text-gold-300 block px-3 py-2 text-base font-medium cursor-pointer">Contact</a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section with Slider */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 hero-overlay"></div>
          </div>
        ))}
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="animate-fadeInUp">
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 font-serif">
              {heroSlides[currentSlide].title}
              <br />
              <span className="text-gold-300">{heroSlides[currentSlide].subtitle}</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 mb-12 max-w-3xl leading-relaxed">
              {heroSlides[currentSlide].description}
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button 
                onClick={() => setShowConsultationForm(true)}
                className="btn-luxury text-white px-10 py-4 rounded-lg text-lg font-semibold whitespace-nowrap cursor-pointer"
              >
                <i className="ri-calendar-line mr-2 w-5 h-5 flex items-center justify-center inline-flex"></i>
                Start Your Journey
              </button>
              <button onClick={() => navigate('/properties')} className="btn-outline-luxury bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-gray-900 px-10 py-4 rounded-lg text-lg font-semibold whitespace-nowrap cursor-pointer">
                Browse Properties
              </button>
            </div>
          </div>
        </div>

        {/* Hero Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                index === currentSlide ? 'bg-gold-400 w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="animate-fadeInUp">
              <div className="text-6xl font-bold text-gray-900 mb-4 font-serif animate-countUp">
                {stats.projects}+
              </div>
              <div className="text-xl text-gray-900 font-semibold mb-2">Properties Sold</div>
              <div className="text-gray-600">Successful transactions completed</div>
            </div>
            <div className="animate-fadeInUp">
              <div className="text-6xl font-bold text-gray-900 mb-4 font-serif animate-countUp">
                ₹{stats.clients}Cr+
              </div>
              <div className="text-xl text-gray-900 font-semibold mb-2">Sales Volume</div>
              <div className="text-gray-600">Total property value sold</div>
            </div>
            <div className="animate-fadeInUp">
              <div className="text-6xl font-bold text-gray-900 mb-4 font-serif animate-countUp">
                {stats.experience}+
              </div>
              <div className="text-xl text-gray-900 font-semibold mb-2">Years Experience</div>
              <div className="text-gray-600">In Gurgaon real estate market</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Carousel */}
      <section id="properties" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6 font-serif gold-accent">Featured Properties</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover exceptional properties carefully selected for discerning buyers
            </p>
          </div>
          
          {loadingProperties ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gold-400 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading featured properties...</p>
            </div>
          ) : properties.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16" data-product-shop>
                {properties.map((property) => (
                  <div key={property.id} className="luxury-card bg-white rounded-2xl overflow-hidden border border-gray-200 cursor-pointer shadow-card">
                    <div className="relative">
                      <img 
                        alt={property.title}
                        className="w-full h-64 object-cover object-top" 
                        src={property.image_url}
                      />
                      <div className="absolute top-4 left-4">
                        <span className={`${getStatusColor(property.status)} text-white px-4 py-2 rounded-full text-sm font-semibold`}>
                          {property.status}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className="bg-gold-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                          {property.type}
                        </span>
                      </div>
                    </div>
                    <div className="p-8">
                      <h3 className="text-2xl font-semibold text-gray-900 mb-3 font-serif">{property.title}</h3>
                      <p className="text-gray-600 mb-6 flex items-center">
                        <i className="ri-map-pin-line mr-2 w-5 h-5 flex items-center justify-center text-gold-500"></i>
                        {property.location}
                        {property.area && <span className="ml-2 text-gold-500 font-medium">• {property.area}</span>}
                      </p>
                      <div className="flex justify-between items-center mb-6">
                        <div className="text-3xl font-bold text-gray-900 font-serif">
                          {formatPrice(property.price, property.is_rental)}
                        </div>
                      </div>
                      <button 
                        onClick={() => navigate(`/property/${property.id}`)}
                        className="w-full btn-luxury text-white py-3 rounded-lg font-semibold whitespace-nowrap cursor-pointer"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <button 
                  onClick={() => navigate('/properties')}
                  className="btn-outline-luxury px-10 py-4 rounded-lg text-lg font-semibold whitespace-nowrap cursor-pointer"
                >
                  View All Properties
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-200">
                <i className="ri-home-4-line text-gray-400 text-3xl w-12 h-12 flex items-center justify-center"></i>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Properties Available</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Premium properties will be showcased here once added to the portfolio.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="animate-slideInLeft">
              <h2 className="text-5xl font-bold text-gray-900 mb-8 font-serif gold-accent">Meet Rajeev Mittal</h2>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                With over 30 years in Gurgaon's real estate, we've helped families, corporates, and investors find dream homes and high-return opportunities since 1990. We're trusted partners of top developers like DLF, EMAAR, TATA, Vatika, Unitech, IREO, Homestead, and more, and proudly serve leading corporates including IBM, Nestlé, Coca-Cola, American Express, Airtel, and Max Life.
              </p>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Our expertise lies in premium and ultra-luxury properties—from iconic residences like DLF Camellias, Magnolias, Aralias, Central Park, The Crest, and World Spa to exclusive high-end rentals for diplomats and expats. For us, it's not about closing deals—it's about building relationships that last a lifetime.
              </p>
              <div className="grid grid-cols-2 gap-8 mb-12">
                <div className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-card">
                  <div className="text-3xl font-bold text-gray-900 mb-2">440+</div>
                  <div className="text-gray-700 font-medium">Properties Sold</div>
                </div>
                <div className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-card">
                  <div className="text-3xl font-bold text-gray-900 mb-2">₹489Cr+</div>
                  <div className="text-gray-700 font-medium">Sales Volume</div>
                </div>
              </div>
              <button 
                onClick={() => setShowConsultationForm(true)}
                className="btn-luxury text-white px-10 py-4 rounded-lg text-lg font-semibold whitespace-nowrap cursor-pointer"
              >
                Schedule Consultation
              </button>
            </div>
            <div className="animate-slideInRight">
              <img 
                alt="Rajeev Mittal" 
                className="rounded-2xl shadow-2xl w-full h-[600px] object-cover object-top border border-gray-200" 
                src="https://check2-flame-two.vercel.app/image2url.com/images/1758081839443-f1caa703-d629-4030-be4d-15dc4509a6cd.jpg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6 font-serif gold-accent">My Services</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Comprehensive real estate solutions tailored to your unique needs
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="luxury-card bg-gray-800 p-10 rounded-2xl text-center border border-gray-700 shadow-card">
              <div className="w-20 h-20 bg-gold-gradient rounded-full flex items-center justify-center mx-auto mb-8">
                <i className="ri-home-4-line text-white text-3xl w-10 h-10 flex items-center justify-center"></i>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-6 font-serif">Home Buying</h3>
              <p className="text-gray-300 leading-relaxed">
                Expert guidance through every step of the home buying process, from search to closing.
              </p>
            </div>
            <div className="luxury-card bg-gray-800 p-10 rounded-2xl text-center border border-gray-700 shadow-card">
              <div className="w-20 h-20 bg-gold-gradient rounded-full flex items-center justify-center mx-auto mb-8">
                <i className="ri-price-tag-3-line text-white text-3xl w-10 h-10 flex items-center justify-center"></i>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-6 font-serif">Home Selling</h3>
              <p className="text-gray-300 leading-relaxed">
                Strategic marketing and pricing to sell your property quickly and for the best price.
              </p>
            </div>
            <div className="luxury-card bg-gray-800 p-10 rounded-2xl text-center border border-gray-700 shadow-card">
              <div className="w-20 h-20 bg-gold-gradient rounded-full flex items-center justify-center mx-auto mb-8">
                <i className="ri-line-chart-line text-white text-3xl w-10 h-10 flex items-center justify-center"></i>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-6 font-serif">Investment Properties</h3>
              <p className="text-gray-300 leading-relaxed">
                Identify profitable investment opportunities and build your real estate portfolio.
              </p>
            </div>
            <div className="luxury-card bg-gray-800 p-10 rounded-2xl text-center border border-gray-700 shadow-card">
              <div className="w-20 h-20 bg-gold-gradient rounded-full flex items-center justify-center mx-auto mb-8">
                <i className="ri-building-line text-white text-3xl w-10 h-10 flex items-center justify-center"></i>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-6 font-serif">Premium Projects</h3>
              <p className="text-gray-300 leading-relaxed">
                Specialized access to DLF, EMAAR, TATA and other premium developer projects in Gurgaon.
              </p>
            </div>
            <div className="luxury-card bg-gray-800 p-10 rounded-2xl text-center border border-gray-700 shadow-card">
              <div className="w-20 h-20 bg-gold-gradient rounded-full flex items-center justify-center mx-auto mb-8">
                <i className="ri-user-star-line text-white text-3xl w-10 h-10 flex items-center justify-center"></i>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-6 font-serif">Corporate Services</h3>
              <p className="text-gray-300 leading-relaxed">
                Specialized services for corporates, diplomats, and expats seeking premium accommodations.
              </p>
            </div>
            <div className="luxury-card bg-gray-800 p-10 rounded-2xl text-center border border-gray-700 shadow-card">
              <div className="w-20 h-20 bg-gold-gradient rounded-full flex items-center justify-center mx-auto mb-8">
                <i className="ri-customer-service-2-line text-white text-3xl w-10 h-10 flex items-center justify-center"></i>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-6 font-serif">Consultation</h3>
              <p className="text-gray-300 leading-relaxed">
                Professional consultation services for all your real estate needs and market analysis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6 font-serif gold-accent">Client Testimonials</h2>
            <p className="text-xl text-gray-600">What my clients say about working with me</p>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="testimonial-slider overflow-hidden">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`transition-all duration-500 ${
                    index === currentTestimonial ? 'opacity-100 transform translate-x-0' : 'opacity-0 absolute inset-0'
                  }`}
                >
                  <div className="bg-white p-12 rounded-2xl text-center border border-gray-200 shadow-card">
                    <div className="flex justify-center mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <i key={i} className="ri-star-fill text-gold-400 text-2xl w-6 h-6 flex items-center justify-center"></i>
                      ))}
                    </div>
                    <p className="text-xl text-gray-700 mb-8 italic leading-relaxed font-light">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center justify-center">
                      <img 
                        alt={testimonial.name} 
                        className="w-16 h-16 rounded-full object-cover mr-6 object-top border border-gray-200" 
                        src={testimonial.image}
                      />
                      <div className="text-left">
                        <h4 className="text-xl font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-gold-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Testimonial Navigation */}
            <div className="flex justify-center mt-12 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                    index === currentTestimonial ? 'bg-gold-400 w-8' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-32 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6 font-serif gold-accent">Latest Insights</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Stay updated with the latest trends and insights in Gurgaon real estate
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {blogPosts.map((post) => (
              <article key={post.id} className="luxury-card bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 cursor-pointer shadow-card">
                <img 
                  alt={post.title}
                  className="w-full h-48 object-cover object-top" 
                  src={post.image}
                />
                <div className="p-8">
                  <div className="flex items-center text-sm text-gray-400 mb-4">
                    <span>{post.date}</span>
                    <span className="mx-2">•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4 font-serif">{post.title}</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">{post.excerpt}</p>
                  <button className="text-gold-400 hover:text-gold-300 font-semibold cursor-pointer transition-colors">
                    Read More <i className="ri-arrow-right-line ml-1 w-4 h-4 flex items-center justify-center inline-flex"></i>
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Newsletter Subscription */}
          <div className="bg-gray-800 rounded-2xl p-12 text-center border border-gray-700">
            <h3 className="text-3xl font-bold text-white mb-4 font-serif">Stay Updated</h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter for exclusive market insights and premium property updates in Gurgaon.
            </p>
            
            {newsletterSubmitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-900/50 border border-green-600 text-green-400 rounded-lg max-w-md mx-auto">
                Thank you for subscribing! You'll receive our latest updates soon.
              </div>
            )}
            {newsletterSubmitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-900/50 border border-red-600 text-red-400 rounded-lg max-w-md mx-auto">
                Sorry, there was an error. Please try again.
              </div>
            )}
            
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto" id="newsletter_form" data-readdy-form>
              <div className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="text"
                  name="name"
                  value={newsletterData.name}
                  onChange={(e) => setNewsletterData(prev => ({ ...prev, name: e.target.value }))}
                  className="flex-1 px-6 py-4 bg-gray-770 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-gold-500 focus:border-gold-500" 
                  placeholder="Your name"
                  required
                />
                <input 
                  type="email"
                  name="email"
                  value={newsletterData.email}
                  onChange={(e) => setNewsletterData(prev => ({ ...prev, email: e.target.value }))}
                  className="flex-1 px-6 py-4 bg-gray-770 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-gold-500 focus:border-gold-500" 
                  placeholder="Your email"
                  required
                />
                <button 
                  type="submit"
                  disabled={isNewsletterSubmitting}
                  className={`btn-luxury text-white px-8 py-4 rounded-lg font-semibold whitespace-nowrap cursor-pointer ${isNewsletterSubmitting ? 'opacity-50' : ''}`}
                >
                  {isNewsletterSubmitting ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Contact Section with Google Maps */}
      <section id="contact" className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6 font-serif gold-accent">Get In Touch</h2>
            <p className="text-xl text-gray-600">Ready to start your real estate journey? Let's connect!</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h3 className="text-3xl font-semibold text-gray-900 mb-8 font-serif">Contact Information</h3>
              <div className="space-y-8">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gold-gradient rounded-full flex items-center justify-center mr-6">
                    <i className="ri-phone-line text-white w-6 h-6 flex items-center justify-center"></i>
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-gray-900">Phone</p>
                    <p className="text-gray-600">(+91) 9811017103</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gold-gradient rounded-full flex items-center justify-center mr-6">
                    <i className="ri-mail-line text-white w-6 h-6 flex items-center justify-center"></i>
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-gray-900">Email</p>
                    <p className="text-gray-600">rajeevmittal_dlf@hotmail.com</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gold-gradient rounded-full flex items-center justify-center mr-6">
                    <i className="ri-map-pin-line text-white w-6 h-6 flex items-center justify-center"></i>
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-gray-900">Office</p>
                    <p className="text-gray-600">123, DLF Qutub Plaza, DLF City-1<br />Gurugram, (Hry) 122002</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <button className="w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center mr-6 cursor-pointer transition-colors">
                    <i className="ri-whatsapp-line text-white w-6 h-6 flex items-center justify-center"></i>
                  </button>
                  <div>
                    <p className="text-xl font-semibold text-gray-900">WhatsApp</p>
                    <p className="text-gray-600">Quick response guaranteed</p>
                  </div>
                </div>
              </div>

              {/* Google Maps */}
              <div className="mt-12">
                <h4 className="text-2xl font-semibold text-gray-900 mb-6 font-serif">Visit Our Office</h4>
                <div className="rounded-2xl overflow-hidden border border-gray-200">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3508.2682782!2d77.08!3d28.47!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ceb67d5a!2sDLF%20City%20Phase%201%2C%20Sector%2026%2C%20Gurugram%2C%20Haryana!5e0!3m2!1sen!2sin!4v1640000000000!5m2!1sen!2sin"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-10 rounded-2xl border border-gray-200 shadow-card">
              <h3 className="text-3xl font-semibold text-gray-900 mb-8 font-serif">Send me a message</h3>
              
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                  Thank you for your message! We'll get back to you soon.
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  Sorry, there was an error sending your message. Please try again.
                </div>
              )}
              
              <form className="space-y-6" onSubmit={handleContactSubmit} id="contact_form" data-readdy-form>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input 
                      type="text"
                      name="firstName"
                      value={contactFormData.firstName}
                      onChange={(e) => setContactFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gold-500 focus:border-gold-500" 
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input 
                      type="text"
                      name="lastName"
                      value={contactFormData.lastName}
                      onChange={(e) => setContactFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gold-500 focus:border-gold-500" 
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input 
                    type="email"
                    name="email"
                    value={contactFormData.email}
                    onChange={(e) => setContactFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gold-500 focus:border-gold-500" 
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input 
                    type="tel"
                    name="phone"
                    value={contactFormData.phone}
                    onChange={(e) => setContactFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gold-500 focus:border-gold-500" 
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea 
                    name="message"
                    value={contactFormData.message}
                    onChange={(e) => setContactFormData(prev => ({ ...prev, message: e.target.value }))}
                    rows={5}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gold-500 focus:border-gold-500" 
                    placeholder="I'm interested in buying a home in the Gurgaon area..."
                    maxLength={500}
                    required
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full btn-luxury text-white py-4 rounded-lg text-lg font-semibold whitespace-nowrap cursor-pointer transition-all ${isSubmitting ? 'opacity-50' : ''}`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Modal */}
      {showConsultationForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-screen overflow-y-auto border border-gray-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-900 font-serif">Schedule Consultation</h3>
                <button 
                  onClick={() => setShowConsultationForm(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                >
                  <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
                </button>
              </div>
              
              {consultationSubmitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                  Consultation scheduled successfully! We'll contact you soon to confirm.
                </div>
              )}
              {consultationSubmitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  Sorry, there was an error scheduling your consultation. Please try again.
                </div>
              )}
              
              <form className="space-y-6" onSubmit={handleConsultationSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input 
                    type="text"
                    name="name"
                    value={consultationData.name}
                    onChange={(e) => setConsultationData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gold-500 focus:border-gold-500" 
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input 
                    type="email"
                    name="email"
                    value={consultationData.email}
                    onChange={(e) => setConsultationData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gold-500 focus:border-gold-500" 
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input 
                    type="tel"
                    name="phone"
                    value={consultationData.phone}
                    onChange={(e) => setConsultationData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gold-500 focus:border-gold-500" 
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                    <input 
                      type="date"
                      name="preferredDate"
                      value={consultationData.preferredDate}
                      onChange={(e) => setConsultationData(prev => ({ ...prev, preferredDate: e.target.value }))}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-gold-500 focus:border-gold-500" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
                    <input 
                      type="time"
                      name="preferredTime"
                      value={consultationData.preferredTime}
                      onChange={(e) => setConsultationData(prev => ({ ...prev, preferredTime: e.target.value }))}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-gold-500 focus:border-gold-500" 
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                  <select
                    name="serviceType"
                    value={consultationData.serviceType}
                    onChange={(e) => setConsultationData(prev => ({ ...prev, serviceType: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 pr-8"
                    required
                  >
                    <option value="">Select a service</option>
                    <option value="home-buying">Home Buying</option>
                    <option value="home-selling">Home Selling</option>
                    <option value="investment-properties">Investment Properties</option>
                    <option value="premium-projects">Premium Projects</option>
                    <option value="general-consultation">General Consultation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
                  <textarea 
                    name="message"
                    value={consultationData.message}
                    onChange={(e) => setConsultationData(prev => ({ ...prev, message: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gold-500 focus:border-gold-500" 
                    placeholder="Any specific requirements or questions..."
                    maxLength={500}
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  disabled={isConsultationSubmitting}
                  className={`w-full btn-luxury text-white py-4 rounded-lg text-lg font-semibold whitespace-nowrap cursor-pointer transition-all ${isConsultationSubmitting ? 'opacity-50' : ''}`}
                >
                  {isConsultationSubmitting ? 'Scheduling...' : 'Schedule Consultation'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-2xl font-bold bg-gold-gradient bg-clip-text text-transparent mb-6 font-serif">Rajeev Mittal</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Expert real estate guidance with personalized service for buyers and sellers in Gurgaon's premium market.
              </p>
              <div className="flex space-x-4">
                <a href="https://www.instagram.com/rajeev_mittal_6?igsh=ZnFqMTd1aXB0aXo1" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover-bg-gold-500 rounded-full flex items-center justify-center cursor-pointer transition-all group">
                  <i className="ri-instagram-line text-gray-400 group-hover:text-white w-5 h-5 flex items-center justify-center"></i>
                </a>
                <a href="https://www.linkedin.com/in/rajeev-mittal-47b51a33?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover-bg-gold-500 rounded-full flex items-center justify-center cursor-pointer transition-all group">
                  <i className="ri-linkedin-fill text-gray-400 group-hover:text-white w-5 h-5 flex items-center justify-center"></i>
                </a>
                <a href="https://wa.me/9811017103" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center cursor-pointer transition-all">
                  <i className="ri-whatsapp-line text-white w-5 h-5 flex items-center justify-center"></i>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6 text-gold-400">Quick Links</h4>
              <ul className="space-y-3 text-gray-300">
                <li><a href="#home" className="hover:text-gold-300 cursor-pointer transition-colors">Home</a></li>
                <li><a href="#about" className="hover:text-gold-300 cursor-pointer transition-colors">About</a></li>
                <li><button onClick={() => navigate('/properties')} className="hover:text-gold-300 cursor-pointer transition-colors">Properties</button></li>
                <li><a href="#services" className="hover:text-gold-300 cursor-pointer transition-colors">Services</a></li>
                <li><a href="#contact" className="hover:text-gold-300 cursor-pointer transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6 text-gold-400">Services</h4>
              <ul className="space-y-3 text-gray-300">
                <li>Home Buying</li>
                <li>Home Selling</li>
                <li>Investment Properties</li>
                <li>Market Analysis</li>
                <li>Consultation</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6 text-gold-400">Contact Info</h4>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-center">
                  <i className="ri-phone-line mr-3 text-gold-400 w-4 h-4 flex items-center justify-center"></i>
                  (+91) 9811017103
                </li>
                <li className="flex items-center">
                  <i className="ri-mail-line mr-3 text-gold-400 w-4 h-4 flex items-center justify-center"></i>
                  rajeevmittal_dlf@hotmail.com
                </li>
                <li className="flex items-start">
                  <i className="ri-map-pin-line mr-3 text-gold-400 w-4 h-4 flex items-center justify-center mt-1"></i>
                  <span>123, DLF Qutub Plaza, DLF City-1<br />Gurugram, (Hry) 122002</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">RAJEEV MITTAL ESTATES PVT.LTD. All rights reserved.<br />Rera Approved - Registration Number GGM/107/2017/1R/140/Ext1/2022/2021</p>
            <a href="https://readdy.ai/?origin=logo" className="text-gold-400 hover:text-gold-300 cursor-pointer transition-colors">
              Made with Readdy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
