
import { useState, useEffect, useRef } from 'react';
import { useNavigate ,  useSearchParams } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();
  // const [filterType, setFilterType] = useState('all');
  const [searchParams] = useSearchParams();
  // const [filterArea, setFilterArea] = useState(searchParams.get('area') || 'all');
  const [isVisible, setIsVisible] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [_isScrolled, setIsScrolled] = useState(false); // To track scroll state
  const [_currentPage, setCurrentPage] = useState('home'); // Track the current page
  const handleLinkClick = () => {
    setIsSidebarOpen(false); // Close the sidebar when a link is clicked
  };
  const [counters, setCounters] = useState({
    projects: 0,
    clients: 0,
    experience: 0,
    awards: 0
  });
  const sectionRef = useRef<HTMLDivElement>(null);

  const finalValues = {
    projects: 440,
    clients: 489,
    experience: 30,
    awards: 25
  };

  const milestones = [
    { year: '1990', title: 'Company Founded', description: 'Started with a vision to redefine real estate excellence in Gurgaon' },
    { year: '1995', title: 'First Major Project', description: 'Successfully delivered our first luxury residential complex with DLF' },
    { year: '2000', title: 'Premium Partnerships', description: 'Established trusted partnerships with DLF, EMAAR, TATA, and Vatika' },
    { year: '2005', title: 'Corporate Expansion', description: 'Started serving leading corporates including IBM, Nestlé, and American Express' },
    { year: '2010', title: 'Ultra-Luxury Focus', description: 'Specialized in iconic properties like DLF Camellias, Magnolias, and The Crest' },
    { year: '2024', title: 'Market Leadership', description: 'Established as the trusted name in Gurgaon\'s premium real estate market' }
  ];

  const team = [
    {
      name: 'Rajeev Mittal',
      role: 'Founder & CEO',
      image: 'https://check2-flame-two.vercel.app/image2url.com/images/1758081839443-f1caa703-d629-4030-be4d-15dc4509a6cd.jpg',
      bio: 'With over 30 years of experience in Gurgaon\'s premium real estate market, Rajeev leads with unmatched expertise and vision.'
    },
    {
      name: 'Priya Sharma',
      role: 'Head of Sales',
      image: 'https://readdy.ai/api/search-image?query=professional%20indian%20businesswoman%20sales%20director%20confident%20portrait%20corporate%20attire%20office%20environment%20luxury%20real%20estate%20professional&width=300&height=300&seq=team2&orientation=squarish',
      bio: 'Priya brings exceptional sales expertise and client relationship management to our premium property portfolio.'
    },
    {
      name: 'Amit Kumar',
      role: 'Project Manager',
      image: 'https://readdy.ai/api/search-image?query=professional%20indian%20project%20manager%20construction%20real%20estate%20confident%20portrait%20business%20formal%20attire%20luxury%20property%20development&width=300&height=300&seq=team3&orientation=squarish',
      bio: 'Amit ensures seamless project execution and maintains our high standards of quality across all premium developments.'
    },
    {
      name: 'Dr. Sunita Agarwal',
      role: 'Legal Advisor',
      image: 'https://readdy.ai/api/search-image?query=professional%20indian%20female%20lawyer%20legal%20advisor%20confident%20portrait%20formal%20business%20attire%20office%20setting%20real%20estate%20law%20expert&width=300&height=300&seq=team4&orientation=squarish',
      bio: 'Dr. Agarwal provides expert legal guidance for all premium property transactions and regulatory compliance.'
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Update filter when URL params change
    
    // const areaParam = searchParams.get('area');
    // if (areaParam) {
    //   setFilterArea(areaParam);
    // }
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
  }, [searchParams]);

  useEffect(() => {
    if (isVisible) {
      const duration = 2000;
      const steps = 50;
      const stepTime = duration / steps;

      Object.keys(finalValues).forEach((key) => {
        const finalValue = finalValues[key as keyof typeof finalValues];
        const increment = finalValue / steps;
        let currentValue = 0;
        let step = 0;

        const timer = setInterval(() => {
          step++;
          currentValue = Math.min(currentValue + increment, finalValue);
          
          setCounters(prev => ({
            ...prev,
            [key]: Math.floor(currentValue)
          }));

          if (step >= steps) {
            clearInterval(timer);
          }
        }, stepTime);
      });
    }
  }, [isVisible]);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 bg-off-white-500/95 backdrop-blur-sm shadow-lg `}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                  <div className="flex-shrink-0">
                    <button  onClick={() => { navigate('/'); }} className="flex items-center">
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
                    </button>
                  </div>
      
                  {/* Desktop Menu */}
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-8">
                      <button  onClick={() => navigate('/')} className={('home')}>Home</button>
                      <button  onClick={() => navigate('/properties')}>Properties</button>
                      <button  onClick={() => navigate('/about')} className={('px-3 py-2 text-sm font-medium cursor-pointer bg-navy-600 hover:bg-navy-700 text-white rounded-full font-semibold transform hover:scale-105')}>About</button>
                      <button  onClick={() => navigate('/blogs')} className={('blog')}>Blog</button>
                      <button  onClick={() => navigate('/areas')} className={('testimonials')}>Areas</button>
                      {/* <button  onClick={() => navigate('/contact')} className={('contact')}>Contact</button> */}
                    </div>
                  </div>
      
                  {/* Consultation Button */}
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
      
              {/* Mobile Menu */}
           <div
              className={`fixed top-0 right-0 bottom-0 w-64 bg-off-white-900  shadow-lg z-40 transition-transform duration-300 ${
                isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
              }`}
            >
              <div className=" fixed w-64 flex flex-col items-center py-8 space-y-6">
                <a
                  href="#home"
                  className="text-lg text-gray-900 hover:text-indigo-500 opacity-100"
                  onClick={handleLinkClick}
                >
                  Home
                </a>
                <a
                  href="#properties"
                  className="text-lg text-gray-900 hover:text-indigo-500 opacity-100"
                  onClick={handleLinkClick}
                >
                  Properties
                </a>
                <a
                  href="#about"
                  className="text-lg text-gray-900 hover:text-indigo-500 opacity-100"
                  onClick={handleLinkClick}
                >
                  About
                </a>
                <a
                  href="#blog"
                  className="text-lg text-gray-900 hover:text-indigo-500 opacity-100"
                  onClick={handleLinkClick}
                >
                  Blog
                </a>
                <a
                  href="#testimonials"
                  className="text-lg text-gray-900 hover:text-indigo-500 opacity-100"
                  onClick={handleLinkClick}
                >
                  Testimonials
                </a>
                <a
                  href="#contact"
                  className="text-lg text-gray-900 hover:text-indigo-500 opacity-100"
                  onClick={handleLinkClick}
                >
                  Contact
                </a>
      
                <div className="px-6 pt-4 opacity-100">
                  <a
                    href="https://wa.me/919999999999?text=Hi%2C%20I%27m%20interested%20in%20a%20private%20consultation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 block text-center opacity-100"
                  >
                    Book Private Consultation
                  </a>
                </div>
              </div>
            </div>
      
            {/* Overlay that appears when Sidebar is open */}
            {isSidebarOpen && (
              <div
                onClick={() => setIsSidebarOpen(false)}
                className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-50 z-30"
              ></div>
            )}
            </nav>
      
      {/* Hero Section */}
      <div className="pt-20 pb-16 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://readdy.ai/api/search-image?query=modern%20real%20estate%20office%20building%20corporate%20headquarters%20professional%20business%20environment%20elegant%20architecture%20gurgaon%20skyline%20luxury%20commercial%20property&width=1920&height=800&seq=about-hero&orientation=landscape"
            alt="About Us"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gray-900/70"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-6">
              About <span className="text-gold-300">Our Legacy</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Building dreams, creating legacies, and delivering excellence in Gurgaon's premium real estate for over 30 years
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div ref={sectionRef} className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-gold-500 mb-2 font-serif">
                {counters.projects}+
              </div>
              <div className="text-gray-900 text-lg font-medium">
                Properties Sold
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-gold-500 mb-2 font-serif">
                ₹{counters.clients}Cr+
              </div>
              <div className="text-gray-900 text-lg font-medium">
                Sales Volume
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-gold-500 mb-2 font-serif">
                {counters.experience}+
              </div>
              <div className="text-gray-900 text-lg font-medium">
                Years Experience
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-gold-500 mb-2 font-serif">
                {counters.awards}+
              </div>
              <div className="text-gray-900 text-lg font-medium">
                Awards Won
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Company Story */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-serif text-gray-900 mb-6 gold-accent">
                Our Journey of Excellence
              </h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  Founded in 1990 by Rajeev Mittal, our company began with a simple yet powerful vision: to redefine excellence in Gurgaon's real estate industry through integrity, innovation, and unparalleled client service.
                </p>
                <p>
                  With over 30 years in Gurgaon's real estate market, we've helped families, corporates, and investors find dream homes and high-return opportunities. We're trusted partners of top developers like DLF, EMAAR, TATA, Vatika, Unitech, IREO, and Homestead.
                </p>
                <p>
                  We proudly serve leading corporates including IBM, Nestlé, Coca-Cola, American Express, Airtel, and Max Life. Our expertise lies in premium and ultra-luxury properties—from iconic residences like DLF Camellias, Magnolias, Aralias, Central Park, The Crest, and World Spa to exclusive high-end rentals for diplomats and expats.
                </p>
                <p>
                  Today, we stand proud as a trusted partner for hundreds of families and businesses in their real estate journey, having facilitated transactions worth over ₹489 crores. For us, it's not about closing deals—it's about building relationships that last a lifetime.
                </p>
              </div>
              <div className="mt-8">
                <a 
                  href="https://wa.me/9811017103?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20your%20company" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors cursor-pointer whitespace-nowrap shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #F59E0B, #d97706)', boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)' }}
                >
                  Connect With Us
                </a>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://readdy.ai/api/search-image?query=modern%20real%20estate%20company%20office%20interior%20professional%20workspace%20team%20meeting%20business%20environment%20luxury%20property%20consulting%20elegant%20office%20design&width=600&height=500&seq=office-interior&orientation=landscape"
                alt="Our Office"
                className="w-full h-[500px] object-cover object-top rounded-2xl shadow-2xl border border-gray-200"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-white mb-4" style={{ background: 'linear-gradient(135deg, #F59E0B, #d97706)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Our Journey Through Time
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Key milestones that shaped our company's growth and success in Gurgaon's premium real estate market
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gold-500"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                    <div className={`bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-card ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                      <div className="text-gold-400 text-2xl font-bold mb-2 font-serif">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gold-500 rounded-full border-4 border-gray-900"></div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-gray-900 mb-4 gold-accent">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The dedicated professionals behind our success in premium real estate
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-200">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover object-top"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 font-serif">
                    {member.name}
                  </h3>
                  <p className="text-gold-600 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-gray-900 mb-4 gold-accent">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do in premium real estate
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: 'ri-shield-check-line',
                title: 'Integrity',
                description: 'We believe in complete transparency and honest dealings in every premium property transaction'
              },
              {
                icon: 'ri-award-line',
                title: 'Excellence',
                description: 'We strive for perfection in every luxury project and service we deliver to our clients'
              },
              {
                icon: 'ri-customer-service-line',
                title: 'Client Focus',
                description: 'Our clients\' needs and satisfaction are at the heart of our premium real estate services'
              },
              {
                icon: 'ri-lightbulb-line',
                title: 'Innovation',
                description: 'We embrace new technologies and methods to better serve our discerning clientele'
              },
              {
                icon: 'ri-team-line',
                title: 'Teamwork',
                description: 'We believe in the power of collaboration and collective expertise in luxury real estate'
              },
              {
                icon: 'ri-heart-line',
                title: 'Passion',
                description: 'We are passionate about premium real estate and helping people find their perfect luxury home'
              }
            ].map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #FEF3C7, #F59E0B)' }}>
                  <i className={`${value.icon} text-2xl text-gold-700 w-8 h-8 flex items-center justify-center`}></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 font-serif">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-serif text-white mb-6" style={{ background: 'linear-gradient(135deg, #F59E0B, #d97706)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Ready to Begin Your Real Estate Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Let our 30+ years of experience in Gurgaon's premium market help you find your perfect property or investment opportunity.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => navigate('/properties')}
              className="text-white px-10 py-4 rounded-lg text-lg font-semibold whitespace-nowrap cursor-pointer transition-colors shadow-lg"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #d97706)', boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)' }}
            >
              View Properties
            </button>
            <a
              href="/#contact"
              className="bg-white/10 backdrop-blur-sm border border-white text-white hover:bg-white hover:text-gray-900 px-10 py-4 rounded-lg text-lg font-semibold whitespace-nowrap cursor-pointer transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>

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
              <h4 className="text-lg font-semibold mb-6 text-[#F59E0B]">Quick Links</h4>
              <ul className="space-y-3 text-gray-300">
                <li><button onClick={() => navigate('/')} className="hover:text-[#F59E0B] cursor-pointer transition-colors">Home</button></li>
                <li><span className="text-[#F59E0B]">About</span></li>
                <li><button onClick={() => navigate('/properties')} className="hover:text-[#F59E0B] cursor-pointer transition-colors">Properties</button></li>
                <li><button onClick={() => navigate('/areas')} className="hover:text-[#F59E0B] cursor-pointer transition-colors">Areas</button></li>
                <li><a href="/#services" className="hover:text-[#F59E0B] cursor-pointer transition-colors">Services</a></li>
                <li><button onClick={() => navigate('/blogs')} className="hover:text-[#F59E0B] cursor-pointer transition-colors">Blog</button></li>
                <li><a href="/#contact" className="hover:text-[#F59E0B] cursor-pointer transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6 text-gold-400">Services</h4>
              <ul className="space-y-3 text-gray-300">
                <li>Home Buying</li>
                <li>Home Selling</li>
                <li>Investment Properties</li>
                <li>Premium Projects</li>
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

export default About;
