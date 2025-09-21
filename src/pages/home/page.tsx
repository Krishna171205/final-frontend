import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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
  featured_image: string;
  created_at: string;
  read_time: number;
  slug: string;
}

const Home = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // ✅ unify menu state
  // const [newsletterData, setNewsletterData] = useState({ email: '', name: '' });
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
  // const [_isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false);
  // const [_newsletterSubmitStatus, setNewsletterSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [stats, setStats] = useState({ projects: 0, clients: 0, experience: 0 });
  const [statsAnimated, setStatsAnimated] = useState(false);

  // ✅ Moved Navigation as inner component
  // const Navigation = () => {
  //   const [isScrolled, setIsScrolled] = useState(false);

  //   useEffect(() => {
  //     const handleScroll = () => setIsScrolled(window.scrollY > 50);
  //     window.addEventListener('scroll', handleScroll);
  //     return () => window.removeEventListener('scroll', handleScroll);
  //   }, [])};

    // const handleTestimonialsClick = (e: React.MouseEvent) => {
    //   e.preventDefault();
    //   window.location.href = '/#testimonials';
    // };

    // const handleBlogClick = (e: React.MouseEvent) => {
    //   e.preventDefault();
    //   window.location.href = '/#blog';
    // };

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
      description: "Specialized in luxury real estate with over 30 years of experience in Gurgaon\'s premium market."
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
      text: "Buying our dream home in Gurgaon seemed overwhelming at first, but Rajeev made the entire process seamless. His knowledge of the luxury market, attention to detail, and ability to understand exactly what we wanted stood out. He found us a property that checked every box — location, design, and investment value. We couldn\'t have asked for a better guide."
    },
    {
      name: 'Dr. Mehta',
      role: 'The Camellias',
      image: 'https://readdy.ai/api/search-image?query=professional%20Indian%20businesswoman%20in%20elegant%20blazer%2C%20warm%20smile%2C%20modern%20office%20setting%2C%20corporate%20portrait%20photography%2C%20confident%20appearance&width=80&height=80&seq=testimonial2&orientation=squarish',
      rating: 5,
      text: "Rajeev is not just a realtor; he\'s a trusted advisor. From the very first meeting, he understood our requirements, respected our time, and showed us only the most relevant properties. His insights into market trends helped us make a smart decision, and today we are proud owners of a home we truly love. Highly recommended for luxury real estate in Gurgaon."
    },
    {
      name: 'Mr. Kapoor',
      role: 'Ambience Caitriona',
      image: 'https://readdy.ai/api/search-image?query=distinguished%20Indian%20gentleman%20in%20premium%20suit%2C%20confident%20expression%2C%20upscale%20office%20background%2C%20executive%20portrait%20style%2C%20sophisticated%20businessman&width=80&height=80&seq=testimonial3&orientation=squarish',
      rating: 5,
      text: "What impressed us most about Rajeev was his integrity and professionalism. In Gurgaon\'s fast-moving luxury real estate market, he gave us the confidence to make the right choice. He handled every detail — negotiations, paperwork, and coordination — so smoothly that the entire journey felt effortless. We are grateful for his guidance."
    }
  ];

  useEffect(() => {
    loadProperties();
    loadBlogs();
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

  const loadBlogs = async () => {
    try {
      setLoadingBlogs(true);
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/manage-blogs?public=true`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const latestBlogs = data.blogs?.slice(0, 3) || [];
        setBlogPosts(latestBlogs);
      } else {
        setBlogPosts([]);
      }
    } catch (error) {
      setBlogPosts([]);
    } finally {
      setLoadingBlogs(false);
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

  // const handleNewsletterSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsNewsletterSubmitting(true);

  //   try {
  //     const formDataToSend = new URLSearchParams();
  //     formDataToSend.append('email', newsletterData.email);
  //     formDataToSend.append('name', newsletterData.name);

  //     const response = await fetch('https://readdy.ai/api/form/d36qc4btg2u3f2oj3vq0', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/x-www-form-urlencoded',
  //       },
  //       body: formDataToSend
  //     });

  //     if (response.ok) {
  //       setNewsletterSubmitStatus('success');
  //       setNewsletterData({ email: '', name: '' });
  //     } else {
  //       setNewsletterSubmitStatus('error');
  //     }
  //   } catch (error) {
  //     setNewsletterSubmitStatus('error');
  //   } finally {
  //     setIsNewsletterSubmitting(false);
  //   }
  // };

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

  // const formatPrice = (price: number, isRental: boolean = false) => {
  //   if (isRental) {
  //     return `₹${price.toLocaleString()}/mo`;
  //   }
  //   return `₹${price.toLocaleString()}`;
  // };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'For Sale': return 'bg-blue-600';
      case 'For Rent': return 'bg-green-600';
      case 'Investment': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // export default function Navigation() {
  // const [isScrolled, setIsScrolled] = useState(false);
  // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     setIsScrolled(window.scrollY > 50);
  //   };
  //   window.addEventListener('scroll', handleScroll);
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, []);

  const [isScrolled, setIsScrolled] = useState(false);
  // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTestimonialsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = '/#testimonials';
  };

  const handleBlogClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = '/#blog';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300  ${
      isScrolled ? 'bg-off-white-500/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
            <img 
                src="/image.png"
                alt="Rajeev Mittal Logo" 
                className="h-16 w-auto cursor-pointer"
                onClick={() => navigate('/')}
              />
              <span className="text-2xl font-serif text-navy-800 font-bold tracking-wide">
                Rajeev Mittal
              </span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/" className="text-navy-800 hover:text-amber-400 px-3 py-2 text-sm font-medium transition-colors">
                Home
              </Link>
              <Link to="/properties" className="text-navy-800 hover:text-amber-400 px-3 py-2 text-sm font-medium transition-colors">
                Properties
              </Link>
              <Link to="/about" className="text-navy-800 hover:text-amber-400 px-3 py-2 text-sm font-medium transition-colors">
                About
              </Link>
              <a href="#blog" onClick={handleBlogClick} className="text-navy-800 hover:text-amber-400 px-3 py-2 text-sm font-medium transition-colors cursor-pointer">
                Blog
              </a>
              <a href="#testimonials" onClick={handleTestimonialsClick} className="text-navy-800 hover:text-amber-400 px-3 py-2 text-sm font-medium transition-colors cursor-pointer">
                Testimonials
              </a>
              <Link to="/contact" className="text-navy-800 hover:text-amber-400 px-3 py-2 text-sm font-medium transition-colors">
                Contact
              </Link>
            </div>
          </div>

          <div className="hidden md:block">
            <a 
              href="https://wa.me/919999999999?text=Hi%2C%20I%27m%20interested%20in%20a%20private%20consultation" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-navy-500 hover:bg-off-white-500 text-off-white-300 hover:text-navy-500 px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 whitespace-nowrap cursor-pointer"
            >
              Book Private Consultation
            </a>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-amber-400 cursor-pointer"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <i className={`ri-${isMobileMenuOpen ? 'close' : 'menu'}-line text-xl`}></i>
              </div>
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-900/95 backdrop-blur-sm">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="text-white hover:text-amber-400 block px-3 py-2 text-base font-medium">
              Home
            </Link>
            <Link to="/properties" className="text-white hover:text-amber-400 block px-3 py-2 text-base font-medium">
              Properties
            </Link>
            <Link to="/about" className="text-white hover:text-amber-400 block px-3 py-2 text-base font-medium">
              About
            </Link>
            <a href="#blog" onClick={handleBlogClick} className="text-white hover:text-amber-400 block px-3 py-2 text-base font-medium cursor-pointer">
              Blog
            </a>
            <a href="#testimonials" onClick={handleTestimonialsClick} className="text-white hover:text-amber-400 block px-3 py-2 text-base font-medium cursor-pointer">
              Testimonials
            </a>
            <Link to="/contact" className="text-white hover:text-amber-400 block px-3 py-2 text-base font-medium">
              Contact
            </Link>
            <div className="px-3 pt-4">
              <a 
                href="https://wa.me/919999999999?text=Hi%2C%20I%27m%20interested%20in%20a%20private%20consultation" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-amber-500 hover:bg-amber-600 text-blue-900 px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 block text-center whitespace-nowrap cursor-pointer"
              >
                Book Private Consultation
              </a>
            </div>
          </div>
        </div>
      )}
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
            {/* <div className="absolute inset-0 hero-overlay"></div> */}
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
                className="bg-off-white-500 backdrop-blur-sm text-navy-900 hover:text-white hover:bg-navy-500 px-10 py-4 rounded-lg text-lg font-semibold whitespace-nowrap cursor-pointer transition-colors duration-300">
                <i className="ri-calendar-line mr-2 w-5 h-5 flex items-center justify-center inline-flex"></i>
                Start Your Journey
              </button>
              <button
                  onClick={() => navigate('/properties')}
                  className="bg-off-white-500 backdrop-blur-sm text-navy-900 hover:text-white hover:bg-navy-500 px-10 py-4 rounded-lg text-lg font-semibold whitespace-nowrap cursor-pointer transition-colors duration-300">
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
              <div className="text-6xl font-bold text-navy-800 mb-4 font-serif animate-countUp">
                {stats.projects}+
              </div>
              <div className="text-xl text-navy-800 font-semibold mb-2">Properties Sold</div>
              <div className="text-gray-600">Successful transactions completed</div>
            </div>
            <div className="animate-fadeInUp">
              <div className="text-6xl font-bold text-navy-800 mb-4 font-serif animate-countUp">
                ₹{stats.clients}Cr+
              </div>
              <div className="text-xl text-navy-800 font-semibold mb-2">Sales Volume</div>
              <div className="text-gray-600">Total property value sold</div>
            </div>
            <div className="animate-fadeInUp">
              <div className="text-6xl font-bold text-navy-800 mb-4 font-serif animate-countUp">
                {stats.experience}+
              </div>
              <div className="text-xl text-navy-800 font-semibold mb-2">Years Experience</div>
              <div className="text-gray-600">In Gurgaon real estate market</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Carousel */}
      <section id="properties" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-navy-900 mb-6 font-serif">Featured Properties</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover exceptional properties carefully selected for discerning buyers
            </p>
          </div>

          {loadingProperties ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-navy-400 mx-auto"></div>
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
                        <span className="bg-navy-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                          {property.type}
                        </span>
                      </div>
                    </div>
                    <div className="p-8">
                      <h3 className="text-2xl font-semibold text-navy-900 mb-3 font-serif">{property.title}</h3>
                      <p className="text-gray-600 mb-6 flex items-center">
                        <i className="ri-map-pin-line mr-2 w-5 h-5 flex items-center justify-center text-navy-600"></i>
                        {property.location}
                        {property.area && <span className="ml-2 text-navy-500 font-medium">• {property.area}</span>}
                      </p>

                      {/* Price on Call Card */}
                      <div className="bg-navy-100 border border-navy-300 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-center">
                          <i className="ri-phone-line text-navy-600 text-lg mr-2 w-5 h-5 flex items-center justify-center"></i>
                          <div className="text-lg font-bold text-navy-800 font-serif">Price on Call</div>
                        </div>
                      </div>

                      <button
                        onClick={() => navigate(`/property/${property.id}`)}
                        className="w-full bg-navy-600 hover:bg-navy-700 text-white py-3 rounded-lg font-semibold whitespace-nowrap cursor-pointer transition-all shadow-lg"
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
                  className="bg-navy-600 hover:bg-navy-700 text-white px-10 py-4 rounded-lg text-lg font-semibold whitespace-nowrap cursor-pointer transition-all shadow-lg"
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
              <h3 className="text-2xl font-semibold text-navy-900 mb-4">No Properties Available</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Premium properties will be showcased here once added to the portfolio.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Areas Section */}
      <section className="py-32 bg-off-white-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-navy-900 mb-6 font-serif">Premium Locations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Explore luxury properties across NCR's most sought-after areas
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Gurgaon */}
            <div 
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
              onClick={() => navigate('/areas')}
            >
              <div 
                className="h-48 bg-cover bg-center relative"
                style={{ backgroundImage: 'url(https://readdy.ai/api/search-image?query=Modern%20luxury%20residential%20towers%20and%20commercial%20buildings%20in%20Gurgaon%20millennium%20city%20with%20wide%20roads%2C%20premium%20architecture%2C%20glass%20facades%2C%20landscaped%20gardens%2C%20and%20urban%20skyline%20during%20golden%20hour%2C%20professional%20real%20estate%20photography%20style%2C%20contemporary%20design%20elements&width=400&height=200&seq=gurgaon-card-001&orientation=landscape)' }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold font-serif">Gurgaon</h3>
                  <p className="text-sm">The Millennium City</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Premium residential and commercial properties in the millennium city, featuring luxury developments in Golf Course Road and DLF phases.
                </p>
                <div className="flex items-center text-navy-600 hover:text-navy-800 font-semibold">
                  Explore Properties
                  <i className="ri-arrow-right-line ml-2 w-4 h-4 flex items-center justify-center"></i>
                </div>
              </div>
            </div>

            {/* Delhi */}
            <div 
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
              onClick={() => navigate('/areas')}
            >
              <div 
                className="h-48 bg-cover bg-center relative"
                style={{ backgroundImage: 'url(https://readdy.ai/api/search-image?query=Elegant%20luxury%20residential%20buildings%20and%20commercial%20properties%20in%20Delhi%20with%20mix%20of%20modern%20architecture%20and%20heritage%20elements%2C%20tree-lined%20streets%2C%20premium%20facades%2C%20professional%20real%20estate%20photography%20during%20sunset%2C%20sophisticated%20urban%20design&width=400&height=200&seq=delhi-card-001&orientation=landscape)' }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold font-serif">Delhi</h3>
                  <p className="text-sm">Capital City</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Exclusive properties in the heart of the capital, including luxury apartments and premium commercial spaces in prime locations.
                </p>
                <div className="flex items-center text-navy-600 hover:text-navy-800 font-semibold">
                  Explore Properties
                  <i className="ri-arrow-right-line ml-2 w-4 h-4 flex items-center justify-center"></i>
                </div>
              </div>
            </div>

            {/* Noida */}
            <div 
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
              onClick={() => navigate('/areas')}
            >
              <div 
                className="h-48 bg-cover bg-center relative"
                style={{ backgroundImage: 'url(https://readdy.ai/api/search-image?query=Contemporary%20luxury%20residential%20and%20commercial%20developments%20in%20Noida%20planned%20city%20with%20modern%20glass%20towers%2C%20wide%20expressways%2C%20green%20landscaping%2C%20premium%20architecture%2C%20professional%20real%20estate%20photography%2C%20urban%20planning%20excellence&width=400&height=200&seq=noida-card-001&orientation=landscape)' }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold font-serif">Noida</h3>
                  <p className="text-sm">Planned City</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Contemporary living spaces and commercial hubs in the planned city, offering modern amenities and excellent connectivity.
                </p>
                <div className="flex items-center text-navy-600 hover:text-navy-800 font-semibold">
                  Explore Properties
                  <i className="ri-arrow-right-line ml-2 w-4 h-4 flex items-center justify-center"></i>
                </div>
              </div>
            </div>

            {/* Greater Noida */}
            <div 
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
              onClick={() => navigate('/areas')}
            >
              <div 
                className="h-48 bg-cover bg-center relative"
                style={{ backgroundImage: 'url(https://readdy.ai/api/search-image?query=Premium%20residential%20and%20commercial%20properties%20in%20Greater%20Noida%20with%20modern%20architecture%2C%20luxury%20developments%2C%20green%20spaces%2C%20contemporary%20design%2C%20professional%20real%20estate%20photography%20during%20golden%20hour%2C%20planned%20city%20infrastructure&width=400&height=200&seq=greater-noida-card-001&orientation=landscape)' }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold font-serif">Greater Noida</h3>
                  <p className="text-sm">Future City</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Planned infrastructure with luxury residential projects and commercial developments offering excellent growth potential.
                </p>
                <div className="flex items-center text-navy-600 hover:text-navy-800 font-semibold">
                  Explore Properties
                  <i className="ri-arrow-right-line ml-2 w-4 h-4 flex items-center justify-center"></i>
                </div>
              </div>
            </div>

            {/* Faridabad */}
            <div 
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
              onClick={() => navigate('/areas')}
            >
              <div 
                className="h-48 bg-cover bg-center relative"
                style={{ backgroundImage: 'url(https://readdy.ai/api/search-image?query=Modern%20luxury%20residential%20complexes%20and%20commercial%20buildings%20in%20Faridabad%20with%20contemporary%20architecture%2C%20landscaped%20compounds%2C%20premium%20facilities%2C%20wide%20roads%2C%20professional%20real%20estate%20photography%20style%2C%20emerging%20urban%20development&width=400&height=200&seq=faridabad-card-001&orientation=landscape)' }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold font-serif">Faridabad</h3>
                  <p className="text-sm">Industrial Hub</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Emerging luxury developments and industrial properties in the growing commercial hub, perfect for investment opportunities.
                </p>
                <div className="flex items-center text-navy-600 hover:text-navy-800 font-semibold">
                  Explore Properties
                  <i className="ri-arrow-right-line ml-2 w-4 h-4 flex items-center justify-center"></i>
                </div>
              </div>
            </div>

            {/* Other NCR */}
            <div 
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
              onClick={() => navigate('/areas')}
            >
              <div 
                className="h-48 bg-cover bg-center relative"
                style={{ backgroundImage: 'url(https://readdy.ai/api/search-image?query=Premium%20residential%20and%20commercial%20properties%20across%20NCR%20region%20with%20modern%20architecture%2C%20luxury%20developments%2C%20green%20spaces%2C%20contemporary%20design%2C%20professional%20real%20estate%20photography%20during%20golden%20hour%2C%20diverse%20urban%20landscapes&width=400&height=200&seq=ncr-other-card-001&orientation=landscape)' }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold font-serif">Other NCR</h3>
                  <p className="text-sm">Emerging Areas</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Premium properties across other NCR locations including Ghaziabad and emerging corridors with high growth potential.
                </p>
                <div className="flex items-center text-navy-600 hover:text-navy-800 font-semibold">
                  Explore Properties
                  <i className="ri-arrow-right-line ml-2 w-4 h-4 flex items-center justify-center"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate('/areas')}
              className="bg-navy-600 hover:bg-navy-700 text-white px-10 py-4 rounded-lg text-lg font-semibold whitespace-nowrap cursor-pointer transition-all shadow-lg"
            >
              View All Areas
              <i className="ri-arrow-right-line ml-2 w-5 h-5 inline-flex items-center justify-center"></i>
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="animate-slideInLeft">
              <h2 className="text-5xl font-bold text-navy-900 mb-8 font-serif gold-accent">Meet Rajeev Mittal</h2>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                With over 30 years in Gurgaon's real estate, we've helped families, corporates, and investors find dream homes and high-return opportunities since 1990. We're trusted partners of top developers like DLF, EMAAR, TATA, Vatika, Unitech, IREO, Homestead, and more, and proudly serve leading corporates including IBM, Nestlé, Coca-Cola, American Express, Airtel, and Max Life.
              </p>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Our expertise lies in premium and ultra-luxury properties—from iconic residences like DLF Camellias, Magnolias, Aralias, Central Park, The Crest, and World Spa to exclusive high-end rentals for diplomats and expats. For us, it's not about closing deals—it's about building relationships that last a lifetime.
              </p>
              <div className="grid grid-cols-2 gap-8 mb-12">
                <div className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-card">
                  <div className="text-3xl font-bold text-navy-900 mb-2">440+</div>
                  <div className="text-gray-700 font-medium">Properties Sold</div>
                </div>
                <div className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-card">
                  <div className="text-3xl font-bold text-navy-900 mb-2">₹489Cr+</div>
                  <div className="text-gray-700 font-medium">Sales Volume</div>
                </div>
              </div>
              <button
                onClick={() => setShowConsultationForm(true)}
                className="text-white px-10 py-4 rounded-lg text-lg font-semibold whitespace-nowrap cursor-pointer transition-colors shadow-lg"
                style={{ background: 'linear-gradient(135deg, #DAA520, #B8860B)', boxShadow: '0 10px 25px rgba(218, 165, 32, 0.3)' }}
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

      {/* Testimonials Carousel */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-navy-900 mb-6 font-serif gold-accent">Client Testimonials</h2>
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
                        <h4 className="text-xl font-semibold text-navy-900">{testimonial.name}</h4>
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

      {/* Blog Section - Replaced Latest Insights */}
      <section className="py-32 bg-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6 font-serif" style={{ background: 'linear-gradient(135deg, #DAA520, #B8860B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Real Estate Blog</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Expert insights, market analysis, and valuable tips for your real estate journey
            </p>
          </div>

          {loadingBlogs ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gold-400 mx-auto"></div>
              <p className="mt-4 text-gray-300">Loading articles...</p>
            </div>
          ) : blogPosts.length > 0 ? (
            <>
              <div className="grid md:grid-cols-3 gap-8 mb-16">
                {blogPosts.map((post) => (
                  <article 
                    key={post.id} 
                    onClick={() => navigate(`/blog/${post.slug}`)}
                    className="luxury-card bg-navy-800 rounded-2xl overflow-hidden border border-navy-700 cursor-pointer shadow-card"
                  >
                    <img
                      alt={post.title}
                      className="w-full h-48 object-cover object-top"
                      src={post.featured_image}
                    />
                    <div className="p-8">
                      <div className="flex items-center text-sm text-gray-400 mb-4">
                        <span>{formatDate(post.created_at)}</span>
                        <span className="mx-2">•</span>
                        <span>{post.read_time} min read</span>
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
              <div className="text-center">
                <button
                  onClick={() => navigate('/blogs')}
                  className="bg-gold-400 hover:bg-gold-600 text-white px-10 py-4 rounded-lg text-lg font-semibold whitespace-nowrap cursor-pointer transition-colors shadow-lg"
                  style={{ boxShadow: '0 10px 25px rgba(218, 165, 32, 0.3)' }}
                >
                  View All Articles
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-navy-800 rounded-full flex items-center justify-center mx-auto mb-8 border border-navy-700">
                <i className="ri-article-line text-gray-400 text-3xl w-12 h-12 flex items-center justify-center"></i>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">No Articles Available</h3>
              <p className="text-gray-300 mb-8 max-w-md mx-auto">
                Real estate insights will be showcased here once articles are published.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section with Google Maps */}
      <section id="contact" className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-navy-900 mb-6 font-serif gold-accent">Get In Touch</h2>
            <p className="text-xl text-gray-600">Ready to start your real estate journey? Let's connect!</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h3 className="text-3xl font-semibold text-navy-900 mb-8 font-serif">Contact Information</h3>
              <div className="space-y-8">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gold-gradient rounded-full flex items-center justify-center mr-6">
                    <i className="ri-phone-line text-white w-6 h-6 flex items-center justify-center"></i>
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-navy-900">Phone</p>
                    <p className="text-gray-600">(+91) 9811017103</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gold-gradient rounded-full flex items-center justify-center mr-6">
                    <i className="ri-mail-line text-white w-6 h-6 flex items-center justify-center"></i>
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-navy-900">Email</p>
                    <p className="text-gray-600">rajeevmittal_dlf@hotmail.com</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gold-gradient rounded-full flex items-center justify-center mr-6">
                    <i className="ri-map-pin-line text-white w-6 h-6 flex items-center justify-center"></i>
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-navy-900">Office</p>
                    <p className="text-gray-600">123, DLF Qutub Plaza, DLF City-1<br />Gurugram, (Hry) 122002</p>
                  </div>
                </div>
              </div>

              {/* Google Maps */}
              <div className="mt-12">
                <h4 className="text-2xl font-semibold text-navy-900 mb-6 font-serif">Visit Our Office</h4>
                <div className="rounded-2xl overflow-hidden border border-gray-200">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3508.2682782!2d77.08!3d28.47!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1s0x390ceb67d5a!2sDLF%20City%20Phase%201%2C%20Sector%2026%2C%20Gurugram%2C%20Haryana!5e0!3m2!1sen!2sin!4v1640000000000!5m2!1sen!2sin"
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
              <h3 className="text-3xl font-semibold text-navy-900 mb-8 font-serif">Send me a message</h3>

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
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-navy-900 placeholder-gray-500 focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
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
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-navy-900 placeholder-gray-500 focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
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
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-navy-900 placeholder-gray-500 focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
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
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-navy-900 placeholder-gray-500 focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
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
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-navy-900 placeholder-gray-500 focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
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
                <h3 className="text-2xl font-semibold text-navy-900 font-serif">Schedule Consultation</h3>
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
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-navy-900 placeholder-gray-500 focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
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
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-navy-900 placeholder-gray-500 focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
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
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-navy-900 placeholder-gray-500 focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
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
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-navy-900 focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
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
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-navy-900 focus:ring-2 focus:ring-gold-500 focus-border-gold-500"
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
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-navy-900 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 pr-8"
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
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-navy-900 placeholder-gray-500 focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                    placeholder="Any specific requirements or questions..."
                    maxLength={500}
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  disabled={isConsultationSubmitting}
                   className=" w-full bg-navy-500 hover:bg-off-white-500 text-off-white-300 hover:text-navy-500 px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 transform  whitespace-nowrap cursor-pointer"
                >
                  {isConsultationSubmitting ? 'Scheduling...' : 'Schedule Consultation'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-navy-900 text-white py-16 border-t border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-2xl font-bold bg-gold-gradient bg-clip-text text-transparent mb-6 font-serif">Rajeev Mittal</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Expert real estate guidance with personalized service for buyers and sellers in Gurgaon's premium market.
              </p>
              <div className="flex space-x-4">
                <a href="https://www.instagram.com/rajeev_mittal_6?igsh=ZnFqMTd1aXB0aXo1" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-navy-800 hover-bg-gold-500 rounded-full flex items-center justify-center cursor-pointer transition-all group">
                  <i className="ri-instagram-line text-gray-400 group-hover:text-white w-5 h-5 flex items-center justify-center"></i>
                </a>
                <a href="https://www.linkedin.com/in/rajeev-mittal-47b51a33?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-navy-800 hover-bg-gold-500 rounded-full flex items-center justify-center cursor-pointer transition-all group">
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
                <li><button onClick={() => navigate('/about')} className="hover:text-gold-400 cursor-pointer transition-colors">About</button></li>
                <li><button onClick={() => navigate('/properties')} className="hover:text-gold-400 cursor-pointer transition-colors">Properties</button></li>
                <li><button onClick={() => navigate('/areas')} className="hover:text-gold-400 cursor-pointer transition-colors">Areas</button></li>
                <li><a href="#contact" className="hover:text-gold-400 cursor-pointer transition-colors">Contact</a></li>
                <li><button onClick={() => navigate('/blogs')} className="hover:text-gold-400 cursor-pointer transition-colors">Blog</button></li>
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
          <div className="border-t border-navy-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
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
