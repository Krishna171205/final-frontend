import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  type: string;
  status: string;
  is_rental?: boolean;
  custom_image: string;
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // ✅ unify menu state
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
  const [isSubmitting, _setIsSubmitting] = useState(false);
  const [submitStatus, _setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showConsultationForm, setShowConsultationForm] = useState(false);
  const [isConsultationSubmitting, setIsConsultationSubmitting] = useState(false);
  const [consultationSubmitStatus, setConsultationSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  // const [_isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false);
  // const [_newsletterSubmitStatus, setNewsletterSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [stats, setStats] = useState({ projects: 0, clients: 0, experience: 0 });
  const [statsAnimated, setStatsAnimated] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false); // To track scroll state
  const [currentPage, setCurrentPage] = useState('home'); // Track the current page
  const handleLinkClick = () => {
    setIsSidebarOpen(false); // Close the sidebar when a link is clicked
  };


//   const SidebarNavbar = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   // Handle clicking on a link
//   const handleLinkClick = () => {
//     setIsSidebarOpen(false); // Close the sidebar when a link is clicked
//   };
// }

  useEffect(() => {
    // Handle scroll event for the nav bar background
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Setup IntersectionObserver to track section visibility
    const observerOptions = {
      root: null, // viewport as the root
      rootMargin: '0px',
      threshold: 0.5, // trigger when 50% of the section is in view
    };
    
    const sections = document.querySelectorAll('section');
    
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setCurrentPage(entry.target.id); // Update currentPage when section is visible
        }
      });
    };
    
    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    
    sections.forEach(section => observer.observe(section));
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect(); // Cleanup observer
    };
  }, []);

  // Dynamically update the header link styling based on scroll position
 const getHomeLinkStyle = (link: string) => {
  const isActive = currentPage === link;
  const baseClasses = 'px-3 py-2 text-sm font-medium cursor-pointer';

  // Smooth transitions for color and scaling
  const transitionClasses = 'transition-colors duration-500 ease-in-out transform transition-transform duration-500 ease-in-out';

  if (isScrolled) {
    return isActive
      ? `bg-navy-600 hover:bg-navy-700 text-white ${baseClasses} rounded-full font-semibold transform hover:scale-105 ${transitionClasses}`
      : `${baseClasses} text-navy-800 hover:text-amber-400 ${transitionClasses}`;
  } else {
    return isActive
      ? `text-gold-400 ${baseClasses} ${transitionClasses}` // Highlight active link in gold when scrolled
      : `${baseClasses} text-navy-800 hover:text-amber-400 ${transitionClasses}`; // Normal state for non-active links
  }
};




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
      image: '/bestone.jpg',
      title: 'Your Dream Home',
      subtitle: 'Awaits',
      description: 'Expert real estate guidance with personalized service. Let me help you find the perfect property or sell your home for the best price.'
    },
    {
      image: '/dlfimage.webp',
      title: 'Premium Properties',
      subtitle: 'In Gurgaon',
      description: "Specialized in luxury real estate with over 35 years of experience in Gurgaon\'s premium market."
    },
    {
      image: 'https://omegadreamhomes.com/wp-content/uploads/2018/09/dlfcamellias...jpg',
      title: 'Investment Excellence',
      subtitle: 'Trusted Guidance',
      description: 'Helping families, corporates, and investors find dream homes and high-return opportunities since 1990.'
    }
  ];

  // Testimonials data
 const testimonials = [
  {
    name: 'Mrs. & Mr. Sharma',
    role: 'DLF Magnolias',
    rating: 5,
    text: "Buying our dream home in Gurgaon seemed overwhelming at first, but Rajeev made the entire process seamless. His knowledge of the luxury market, attention to detail, and ability to understand exactly what we wanted stood out. He found us a property that checked every box — location, design, and investment value. We couldn't have asked for a better guide."
  },
  {
    name: 'Dr. Mehta',
    role: 'The Camellias',
    rating: 5,
    text: "Rajeev is not just a realtor; he’s a trusted advisor. From the very first meeting, he understood our requirements, respected our time, and showed us only the most relevant properties. His insights into market trends helped us make a smart decision, and today we are proud owners of a home we truly love. Highly recommended for luxury real estate in Gurgaon."
  },
  {
    name: 'Mrs. Kapoor',
    role: 'Ambience Caitriona',
    rating: 5,
    text: "What impressed us most about Rajeev was his integrity and professionalism. In Gurgaon’s fast-moving luxury real estate market, he gave us the confidence to make the right choice. He handled every detail — negotiations, paperwork, and coordination — so smoothly that the entire journey felt effortless. We are grateful for his guidance."
  },
  {
    name: 'Mrs. Arora',
    role: 'DLF The Grove',
    rating: 5,
    text: "Rajeev’s network and expertise are unmatched. He helped us secure an exclusive property that wasn’t even listed on the market. The way he manages client relationships — with discretion, patience, and genuine care — is rare. Thanks to him, we now have a beautiful home in one of Gurgaon’s most sought-after communities."
  },
  {
    name: 'Mrs. & Mr. Khanna',
    role: 'The Crest',
    rating: 5,
    text: "As NRIs, we were nervous about investing in Gurgaon real estate from abroad. Rajeev gave us complete peace of mind — from virtual tours to legal formalities, he handled everything with precision. His honest advice and constant updates made us feel fully involved despite the distance. Today, we are proud owners of a luxury residence, all thanks to him."
  },
  {
    name: 'Mrs. & Mr. Bansal',
    role: 'DLF Aralias',
    rating: 5,
    text: "Rajeev has a deep understanding of Gurgaon’s luxury market and an incredible ability to match clients with the right home. He showed us options that were perfectly aligned with our taste and lifestyle. His guidance gave us complete confidence, and the property we bought feels like it was meant for us."
  },
  {
    name: 'Mr. Malhotra',
    role: 'M3M Golf Estate',
    rating: 5,
    text: "What sets Rajeev apart is his personal touch. He treats every client’s search as if it were his own. We never felt rushed or pressured — instead, we felt heard and supported throughout. The home we purchased is everything we dreamed of, and Rajeev made that possible."
  },
  {
    name: 'Mrs. Singh',
    role: 'DLF Magnolias',
    rating: 5,
    text: "Professionalism at its best. Rajeev is thorough, transparent, and truly invested in his clients’ happiness. He guided us through every step, from shortlisting to negotiation, and secured us a wonderful property at the right value. We always felt we were in safe hands."
  },
  {
    name: 'Mrs. & Mr. Gupta',
    role: 'The Camellias',
    rating: 5,
    text: "For us, buying a luxury home was not just a financial decision but an emotional one. Rajeev respected that completely. His patience, market expertise, and genuine care ensured we found a place that feels like home the moment we walk in. We couldn’t be more thankful."
  },
  {
    name: 'Mr. Khurana',
    role: 'Ambience Caitriona',
    rating: 5,
    text: "Rajeev’s reputation in the Gurgaon luxury segment is well deserved. His professionalism, discretion, and ability to deliver beyond expectations make him a class apart. He helped us acquire a property that fit our lifestyle perfectly, and the entire process felt effortless because of his expertise."
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
    }, 5000);

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
        const featuredProperties = data.properties?.slice(0, 3) || [];
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
        projectCount += 10;
        setStats(prev => ({ ...prev, projects: projectCount }));
        if (projectCount >= 800) {
          clearInterval(projectInterval);
          setStats(prev => ({ ...prev, projects: 800 }));
        }
      }, 50);

      // Animate clients counter to show sales volume
      let clientCount = 10;
      const clientInterval = setInterval(() => {
        clientCount += 15;
        setStats(prev => ({ ...prev, clients: clientCount }));
        if (clientCount >= 2500) {
          clearInterval(clientInterval);
          setStats(prev => ({ ...prev, clients: 2500 }));
        }
      }, 50);

      // Animate experience counter
      let expCount = 0;
      const expInterval = setInterval(() => {
        expCount += 1;
        setStats(prev => ({ ...prev, experience: expCount }));
        if (expCount >= 5) {
          clearInterval(expInterval);
          setStats(prev => ({ ...prev, experience: 35 }));
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

const handleContactSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const subject = encodeURIComponent("New Contact Form Submission");
  const body = encodeURIComponent(
    `First Name: ${contactFormData.firstName}
Last Name: ${contactFormData.lastName}
Email: ${contactFormData.email}
Phone: ${contactFormData.phone}
Message: ${contactFormData.message}`
  );

  // Change this to the email you want to receive the form at
  const mailtoLink = `mailto:your@email.com?subject=${subject}&body=${body}`;

  // Open the user's default email client
  window.location.href = mailtoLink;
};


  // const formatPrice = (price: number, isRental: boolean = false) => {
  //   if (isRental) {
  //     return `₹${price.toLocaleString()}/mo`;
  //   }
  //   return `₹${price.toLocaleString()}`;
  // };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready-to-move': return 'bg-blue-600';
      case 'under-construction': return 'bg-green-600';
      case 'ongoing': return 'bg-purple-600';
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
  // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // const handleTestimonialsClick = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   window.location.href = '/#testimonials';
  // };

  // const handleBlogClick = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   window.location.href = '/#blog';
  // };

  const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};


  return (
      <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-off-white-500/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0">
              <Link to="/" onClick={() => { scrollToSection('/'); }} className="flex items-center">
                <img
                  src="/image.png"
                  alt="Rajeev Mittal Logo"
                  className="h-16 w-auto cursor-pointer"
                />
                {/* <div>
                  <span className="text-2xl font-serif text-navy-800 font-bold tracking-wide">
                    Rajeev Mittal
                  </span>
                  <span className="text-sm text-gray-500 block ml-1">Estates Pvt. Ltd.</span>
                </div> */}
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link to="/" onClick={() => scrollToSection('home')} className={`${getHomeLinkStyle('home')} hover:text-amber-400`}>Home</Link>
                <Link to="/about" onClick={() => navigate('/about')} className={getHomeLinkStyle('about')}>About</Link>
                <Link to="/" onClick={() => scrollToSection('properties')} className={getHomeLinkStyle('properties')}>Properties</Link>
                
                <Link to="/" onClick={() => scrollToSection('blog')} className={getHomeLinkStyle('blog')}>Blog</Link>
                <Link to="/" onClick={() => scrollToSection('testimonials')} className={getHomeLinkStyle('testimonials')}>Testimonials</Link>
                <Link to="/" onClick={() => scrollToSection('contact')} className={getHomeLinkStyle('contact')}>Contact</Link>

              </div>
            </div>

            {/* Consultation Button */}
            <div className="hidden md:block">
              <a 
                                    href="https://wa.me/9811017103?text=Hi%2C%20I%27m%20interested%20in%20premium%20properties%20across%20Gurugram%20locations.%20Please%20share%20more%20details." 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-navy-500 hover:bg-off-white-500 text-off-white-300 hover:text-navy-500 px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 whitespace-nowrap cursor-pointer"
              >
                Book Private Consultation
              </a>
            </div>

            {/* Mobile menu toggle button */}
            <div className="md:hidden fixed top-4 right-4 z-50">
            <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white cursor-pointer p-4 rounded-full transition-transform duration-300 transform hover:scale-105"
            >
            {/* Three-line hamburger menu */}
            <div className="w-6 h-1 bg-white mb-1"></div>
            <div className="w-6 h-1 bg-white mb-1"></div>
            <div className="w-6 h-1 bg-white mb-1"></div>
             </button>
             </div>
          </div>
        </div>




      </nav>

              {/* Mobile Menu */}
      <nav className="fixed top-0 left-0 right-0 bg-off-white-500 z-50 shadow-md">
  {/* Sidebar */}
  <div
    className={`fixed top-0 right-0 bottom-0 w-64 bg-off-white-700 shadow-lg z-40 transition-transform duration-300 ${
      isSidebarOpen ? "translate-x-0" : "translate-x-full"
    }`}
  >
    {/* Cross Button */}
    <button
      onClick={() => setIsSidebarOpen(false)}
      className="absolute top-4 right-4 text-gray-700 hover:text-red-500 transition-colors"
      aria-label="Close Sidebar"
    >
      {/* Simple X Icon (SVG) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <div className="w-64 flex flex-col items-center py-12 space-y-6">
      <a
        href="#home"
        className="text-lg text-gray-900 hover:text-indigo-500"
        onClick={handleLinkClick}
      >
        Home
      </a>
      <a
        href="#properties"
        className="text-lg text-gray-900 hover:text-indigo-500"
        onClick={handleLinkClick}
      >
        Properties
      </a>
      <a
        href="#about"
        className="text-lg text-gray-900 hover:text-indigo-500"
        onClick={handleLinkClick}
      >
        About
      </a>
      <a
        href="#blog"
        className="text-lg text-gray-900 hover:text-indigo-500"
        onClick={handleLinkClick}
      >
        Blog
      </a>
      <a
        href="#testimonials"
        className="text-lg text-gray-900 hover:text-indigo-500"
        onClick={handleLinkClick}
      >
        Testimonials
      </a>
      <a
        href="#contact"
        className="text-lg text-gray-900 hover:text-indigo-500"
        onClick={handleLinkClick}
      >
        Contact
      </a>

      <div className="px-6 pt-4">
        <a
                                href="https://wa.me/9811017103?text=Hi%2C%20I%27m%20interested%20in%20premium%20properties%20across%20Gurugram%20locations.%20Please%20share%20more%20details." 
          target="_blank"
          rel="noopener noreferrer"
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 block text-center"
        >
          Book Private Consultation
        </a>
      </div>
    </div>
  </div>

  {/* Overlay */}
  {isSidebarOpen && (
    <div
      onClick={() => setIsSidebarOpen(false)}
      className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-50 z-30"
    ></div>
  )}
</nav>


      {/* Hero Section with Slider */}
      <section id="home" className={`relative h-screen flex items-center justify-center overflow-hidden ${currentPage === "home" ? 'bg-gray-800' : 'bg-white'}`}>
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-60' : 'opacity-0'
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
      <section id="home" className="py-20 bg-gray-50">
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

       {/* About Section */}
      <section id="about" className={`${currentPage === "about" ? 'text-gray-300' : 'text-navy-900'} py-32 bg-gray-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="animate-slideInLeft">
              <h2 className="text-5xl font-bold text-navy-900 mb-8 font-serif gold-accent">Meet Rajeev Mittal</h2>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                With over 35 years in Gurgaon's real estate, we've helped families, corporates, and investors find dream homes and high-return opportunities since 1990. We're trusted partners of top developers like DLF, ADANI, CENTRAL PARK, GODREJ, EXPERION and more, and proudly serve leading corporates including Nestlé, Coca-Cola, American Express, Airtel, etc.
              </p>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Our expertise lies in premium and ultra-luxury properties—from iconic residences like DLF Camellias, Magnolias, Aralias, Central Park, The Crest, and World Spa to exclusive high-end rentals for diplomats and expats. For us, it's not about closing deals—it's about building relationships that last a lifetime.
              </p>
              <div className="grid grid-cols-2 gap-8 mb-12">
                <div className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-card">
                  <div className="text-3xl font-bold text-navy-900 mb-2">800+</div>
                  <div className="text-gray-700 font-medium">Properties Sold</div>
                </div>
                <div className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-card">
                  <div className="text-3xl font-bold text-navy-900 mb-2">2500Cr+</div>
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
                src="rajeev.jpg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Carousel */}
      <section id="properties" className={`py-32 ${currentPage === "code" ? 'bg-gray-800' : 'bg-white'}`}>
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
                        src={property.custom_image}
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
      <section id="properties" className="py-32 bg-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-off-white-500 mb-6 font-serif">Premium Locations</h2>
            <p className="text-xl text-off-white-600 max-w-3xl mx-auto leading-relaxed">
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
                  <h3 className="text-2xl font-bold font-serif">Golf Course Road</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Premium residential and commercial properties in the millennium city, featuring luxury developments in Golf Course Road.
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
                  <h3 className="text-2xl font-bold font-serif">Golf Course Extension Road</h3>
                  {/* <p className="text-sm">Capital City</p> */}
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Premium residential and commercial properties in the millennium city, featuring luxury developments in Golf Course Extension Road.
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
                  <h3 className="text-2xl font-bold font-serif">Dwarka Express Way</h3>
                  {/* <p className="text-sm">Planned City</p> */}
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4 leading-relaxed">
                 Premium residential and commercial properties in the millennium city, featuring luxury developments in Dwarka Express Way.
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
                  <h3 className="text-2xl font-bold font-serif">Sohna Road</h3>
                  {/* <p className="text-sm">Future City</p> */}
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Premium residential and commercial properties in the millennium city, featuring luxury developments in Sohna Road.
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
                  <h3 className="text-2xl font-bold font-serif">Gurgaon Faridabad Road</h3>
                  {/* <p className="text-sm">Industrial Hub</p> */}
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Premium residential and commercial properties in the millennium city, featuring luxury developments in Gurgaon Faridabad Road.
                </p>
                <div className="flex items-center text-navy-600 hover:text-navy-800 font-semibold">
                  Explore Properties
                  <i className="ri-arrow-right-line ml-2 w-4 h-4 flex items-center justify-center"></i>
                </div>
              </div>
            </div>

            {/* Gurgaon */}
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
                  <h3 className="text-2xl font-bold font-serif">More Properties in Gurgaon</h3>
                  {/* <p className="text-sm">Emerging Areas</p> */}
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Premium properties across gurgaon locations emerging corridors with high growth potential.
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

     

      {/* Blog Section - Replaced Latest Insights */}
      <section className={`${currentPage === "blog" ? 'text-gray-300' : 'text-navy-900'}py-32 bg-navy-900 blog`} id='blog'>
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

      {/* Testimonials Carousel */}
            <section className="py-32 bg-gray-50 testimonials" id='testimonials'>
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
                      className={`transition-all duration-500 ${index === currentTestimonial ? 'opacity-100 transform translate-x-0' : 'opacity-0 absolute inset-0'}`}
                    >
                      <div className="bg-white p-12 rounded-2xl text-center border border-gray-200 shadow-card">
                        <div className="flex justify-center mb-6">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <i
                              key={i}
                              className="ri-star-fill text-navy-500  text-2xl w-6 h-6 flex items-center justify-center"
                            ></i>
                          ))}
                        </div>
                        <p className="text-xl text-gray-700 mb-8 italic leading-relaxed font-light">
                          "{testimonial.text}"
                        </p>
                        <div className="text-left">
                          <h4 className="text-xl font-semibold text-navy-900">{testimonial.name}</h4>
                          <p className="text-gold-500">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Testimonial Navigation */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                        index === currentTestimonial ? 'bg-navy-500 w-8' : 'bg-gray-400/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
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
                    <p className="text-gray-600">123, DLF Qutab Plaza, DLF City, Phase-1<br />Gurugram - 122002 ( Haryana)</p>
                  </div>
                </div>
              </div>

              {/* Google Maps */}
              <div className="mt-12">
              <h4 className="text-2xl font-semibold text-navy-900 mb-6 font-serif">Visit Our Office</h4>
              <div className="rounded-2xl overflow-hidden border border-gray-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3507.2534042461466!2d77.0992774754949!3d28.47191427575285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjjCsDI4JzE4LjkiTiA3N8KwMDYnMDYuNyJF!5e0!3m2!1sen!2sin!4v1759010314246!5m2!1sen!2sin"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Maps Location"
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
                <a href="https://www.facebook.com/rajeevmittalestates/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-navy-800 hover-bg-gold-500 rounded-full flex items-center justify-center cursor-pointer transition-all group">
                  <i className="ri-facebook-line text-gray-400 group-hover:text-white w-5 h-5 flex items-center justify-center"></i>
                </a>
                <a href="https://www.instagram.com/rajeev_mittal_6?igsh=ZnFqMTd1aXB0aXo1" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-navy-800 hover-bg-gold-500 rounded-full flex items-center justify-center cursor-pointer transition-all group">
                  <i className="ri-instagram-line text-gray-400 group-hover:text-white w-5 h-5 flex items-center justify-center"></i>
                </a>
                <a href="https://www.linkedin.com/in/rajeev-mittal-47b51a33?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-navy-800 hover-bg-gold-500 rounded-full flex items-center justify-center cursor-pointer transition-all group">
                  <i className="ri-linkedin-fill text-gray-400 group-hover:text-white w-5 h-5 flex items-center justify-center"></i>
                </a>
                <a                       href="https://wa.me/9811017103?text=Hi%2C%20I%27m%20interested%20in%20premium%20properties%20across%20Gurugram%20locations.%20Please%20share%20more%20details."  target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center cursor-pointer transition-all">
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
                  <span>123, DLF Qutab Plaza, DLF City, Phase-1<br />Gurugram - 122002 ( Haryana)</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-navy-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">RAJEEV MITTAL ESTATES PVT.LTD. All rights reserved.<br />Rera Approved - Registration Number GGM/107/2017/1R/140/Ext1/2022/2021</p>
      
          </div>
        </div>
      </footer>
    </div>
  );
};
export default Home;
