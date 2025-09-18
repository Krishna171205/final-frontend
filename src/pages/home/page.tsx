import { useState } from 'react';

const Home = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showConsultationForm, setShowConsultationForm] = useState(false);
  const [isConsultationSubmitting, setIsConsultationSubmitting] = useState(false);
  const [consultationSubmitStatus, setConsultationSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleConsultationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setConsultationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formDataToSend = new URLSearchParams();
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('message', formData.message);

      const response = await fetch('https://readdy.ai/api/form/submit/contact_form_67633e4e4c94b', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formDataToSend
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
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

  const handleWhatsAppConsultation = () => {
    const message = "Hello! I'm interested in booking a private consultation for luxury real estate services. Could you please provide more information?";
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/15551234567?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-pearl-white">
      {/* Navigation */}
      <nav className="glass-effect fixed w-full z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            {/* Company Logo */}
            <div className="flex items-center space-x-4">
              <img 
                src="/image.png"
                alt="Rajeev Mittal Logo" 
                className="h-16 w-auto cursor-pointer"
                // onClick={() => navigate('/')}
              />
              {/* <div className="w-16 h-16 bg-gradient-to-br from-luxury-navy to-luxury-navy/80 rounded-2xl flex items-center justify-center premium-shadow">
                
              </div> */}
              <div>
                <h1 className="text-3xl font-serif font-bold text-deep-navy tracking-wide">Rajeev Mittal</h1>
                <p className="text-sm text-deep-navy/60 font-light tracking-wider">LUXURY REAL ESTATE</p>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-12">
                <a href="#home" className="text-deep-navy hover:text-luxury-navy px-4 py-2 text-sm font-medium tracking-wide transition-colors duration-300 cursor-pointer">Home</a>
                <a href="#about" className="text-deep-navy/80 hover:text-luxury-navy px-4 py-2 text-sm font-medium tracking-wide transition-colors duration-300 cursor-pointer">About</a>
                <a href="#contact" className="text-deep-navy/80 hover:text-luxury-navy px-4 py-2 text-sm font-medium tracking-wide transition-colors duration-300 cursor-pointer">Contact</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a href="https://wa.me/15551234567" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110">
                <i className="ri-whatsapp-line text-white w-5 h-5 flex items-center justify-center"></i>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center bg-cover bg-center overflow-hidden" style={{
        backgroundImage: 'url(https://readdy.ai/api/search-image?query=ultra%20modern%20luxury%20architecture%20exterior%20with%20clean%20geometric%20lines%2C%20premium%20materials%20like%20marble%20and%20glass%2C%20sophisticated%20minimal%20design%2C%20dramatic%20evening%20lighting%20with%20warm%20interior%20glow%2C%20elegant%20landscaping%20with%20topiary%20gardens%2C%20contemporary%20luxury%20villa%20with%20floor-to-ceiling%20windows%2C%20navy%20blue%20accent%20lighting%2C%20left%20side%20darker%20gradient%20for%20elegant%20text%20overlay%2C%20cinematic%20composition%2C%20architectural%20photography&width=1920&height=1080&seq=luxuryarchitecture&orientation=landscape)'
      }}>
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-black/80 via-deep-navy/60 to-transparent"></div>
        <div className="absolute inset-0 luxury-gradient-overlay"></div>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-left text-white animate-fade-in">
            <h1 className="text-6xl md:text-8xl font-serif font-bold mb-8 leading-tight">
              Luxury<br />
              <span className="text-luxury-navy-light">Redefined</span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 max-w-2xl font-light leading-relaxed text-pearl-white/90">
              Discover extraordinary properties with unparalleled elegance. Where sophistication meets your vision of home.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button 
                onClick={handleWhatsAppConsultation}
                className="luxury-button-primary text-white px-12 py-5 rounded-2xl text-lg font-medium whitespace-nowrap cursor-pointer inline-block text-center tracking-wide"
              >
                Book Your Private Consultation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced About Section */}
      <section id="about" className="py-40 bg-gradient-to-br from-pearl-white via-luxury-cream to-pearl-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-luxury-navy/3 via-transparent to-luxury-navy/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Section Header */}
          <div className="text-center mb-24 animate-fade-in">
            <h2 className="text-7xl font-serif font-bold text-deep-navy mb-8 leading-tight">
              Excellence in<br />
              <span className="text-luxury-navy">Every Detail</span>
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-luxury-navy to-transparent mx-auto mb-8"></div>
            <p className="text-2xl text-charcoal-gray max-w-4xl mx-auto font-light leading-relaxed">
              Where luxury meets legacy, and dreams transform into extraordinary realities
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-24 items-center mb-32">
            
            {/* Left: Image with Premium Effects */}
            <div className="relative animate-slide-up">
              <div className="absolute -inset-8 bg-gradient-to-br from-luxury-navy/15 via-luxury-cream/40 to-luxury-navy/10 rounded-[3rem] blur-3xl opacity-70"></div>
              <div className="absolute -inset-4 bg-gradient-to-br from-luxury-navy/20 to-luxury-cream/50 rounded-3xl blur-xl"></div>
              <div className="relative premium-card-enhanced rounded-3xl overflow-hidden">
                <img 
                  alt="Sarah Mitchell Luxury Office" 
                  className="w-full h-[700px] object-cover object-center" 
                  src="https://image2url.com/images/1758081839443-f1caa703-d629-4030-be4d-15dc4509a6cd.jpg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-navy/15 via-transparent to-transparent"></div>
              </div>
              
              {/* Floating Stats Cards */}
              <div className="absolute -right-8 top-16 premium-card-enhanced p-8 rounded-3xl animate-fade-in" style={{animationDelay: '0.5s'}}>
                <div className="text-center">
                  <div className="text-4xl font-serif font-bold text-luxury-navy mb-2">500+</div>
                  <div className="text-sm text-charcoal-gray tracking-wide font-light">Premium Properties</div>
                </div>
              </div>
              
              <div className="absolute -left-8 bottom-16 premium-card-enhanced p-8 rounded-3xl animate-fade-in" style={{animationDelay: '0.7s'}}>
                <div className="text-center">
                  <div className="text-4xl font-serif font-bold text-luxury-navy mb-2">₹2.5B+</div>
                  <div className="text-sm text-charcoal-gray tracking-wide font-light">Portfolio Value</div>
                </div>
              </div>
            </div>

            {/* Right: Content */}
            <div className="animate-slide-up" style={{animationDelay: '0.3s'}}>
              <div className="mb-12">
                <h3 className="text-5xl font-serif font-bold text-deep-navy mb-8 leading-tight">
                  Crafting Luxury<br />
                  <span className="text-luxury-navy">Experiences</span>
                </h3>
                <div className="w-24 h-1 bg-gradient-to-r from-luxury-navy to-luxury-navy/60 mb-10"></div>
                <p className="text-xl text-charcoal-gray mb-8 leading-relaxed font-light">
                  With over 12 years of distinguished expertise in luxury real estate, I curate exceptional properties for the most discerning clientele. My unwavering commitment to excellence and personalized service has established me as the premier choice for luxury property investments.
                </p>
                <p className="text-lg text-charcoal-gray/80 mb-12 leading-relaxed font-light italic">
                  "Every property tells a story. I ensure that story becomes your legacy."
                </p>
              </div>

              {/* Achievement Cards */}
              <div className="grid grid-cols-1 gap-8 mb-12">
                <div className="premium-card-enhanced p-8 rounded-3xl group hover:scale-105 transition-all duration-300">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-luxury-navy to-luxury-navy-dark rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300">
                      <i className="ri-award-line text-white text-2xl w-8 h-8 flex items-center justify-center"></i>
                    </div>
                    <div>
                      <h4 className="text-2xl font-serif font-semibold text-deep-navy mb-2">Industry Recognition</h4>
                      <p className="text-charcoal-gray font-light">Top 1% Luxury Real Estate Professional</p>
                    </div>
                  </div>
                </div>
                
                <div className="premium-card-enhanced p-8 rounded-3xl group hover:scale-105 transition-all duration-300">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-luxury-navy to-luxury-navy-dark rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300">
                      <i className="ri-star-line text-white text-2xl w-8 h-8 flex items-center justify-center"></i>
                    </div>
                    <div>
                      <h4 className="text-2xl font-serif font-semibold text-deep-navy mb-2">Client Satisfaction</h4>
                      <p className="text-charcoal-gray font-light">5.0 Star Rating • 245 Distinguished Clients</p>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleWhatsAppConsultation}
                className="luxury-button-primary text-white px-12 py-6 rounded-2xl text-lg font-medium whitespace-nowrap cursor-pointer tracking-wide group"
              >
                <span className="flex items-center">
                  Book Your Consultation
                  <i className="ri-arrow-right-line ml-3 w-5 h-5 flex items-center justify-center group-hover:translate-x-1 transition-transform duration-300"></i>
                </span>
              </button>
            </div>
          </div>
          </div>

          {/* Services Grid */}
          {/* Bespoke Services */}
        <section 
          id="services" 
          className="py-40 bg-gradient-to-br from-luxury-navy to-luxury-navy-dark text-white"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h3 className="text-5xl font-serif font-bold mb-6 text-white">Bespoke Services</h3>
              <p className="text-xl text-white/80 max-w-3xl mx-auto font-light leading-relaxed">
                Tailored luxury real estate solutions crafted for the most discerning clientele
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              <div className="premium-card-enhanced p-12 rounded-3xl text-center bg-white/10 group hover:scale-105 transition-all duration-500">
                <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <i className="ri-home-4-line text-white text-3xl"></i>
                </div>
                <h4 className="text-3xl font-serif font-semibold text-white mb-6">Luxury Acquisitions</h4>
                <p className="text-white/80 leading-relaxed font-light text-lg">
                  Exclusive access to the finest properties with comprehensive market analysis and strategic guidance.
                </p>
              </div>
              
              <div className="premium-card-enhanced p-12 rounded-3xl text-center bg-white/10 group hover:scale-105 transition-all duration-500">
                <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <i className="ri-price-tag-3-line text-white text-3xl"></i>
                </div>
                <h4 className="text-3xl font-serif font-semibold text-white mb-6">Premium Sales</h4>
                <p className="text-white/80 leading-relaxed font-light text-lg">
                  Strategic marketing and positioning to achieve maximum value for your luxury property.
                </p>
              </div>
              
              <div className="premium-card-enhanced p-12 rounded-3xl text-center bg-white/10 group hover:scale-105 transition-all duration-500">
                <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <i className="ri-line-chart-line text-white text-3xl"></i>
                </div>
                <h4 className="text-3xl font-serif font-semibold text-white mb-6">Portfolio Management</h4>
                <p className="text-white/80 leading-relaxed font-light text-lg">
                  Curate and manage prestigious investment portfolios with exceptional growth potential.
                </p>
              </div>
            </div>
          </div>
        </section>

      </section>

      {/* Testimonials Section */}
      {/* Distinguished Clientele */}
<section 
  id="clients" 
  className="py-40 bg-gradient-to-br from-pearl-white via-luxury-cream to-pearl-white"
>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-20">
      <h3 className="text-5xl font-serif font-bold text-deep-navy mb-6">Distinguished Clientele</h3>
      <p className="text-xl text-charcoal-gray max-w-3xl mx-auto font-light leading-relaxed">
        Honored to have served some of the most distinguished clients in the luxury real estate market
      </p>
    </div>

    {/* Example client logos / testimonials */}
    <div className="grid md:grid-cols-3 gap-12">
      <div className="premium-card-enhanced p-12 rounded-3xl text-center group hover:scale-105 transition-all duration-500 border border-gray-200">
        <h4 className="text-2xl font-serif font-semibold text-deep-navy mb-4">Global Leaders</h4>
        <p className="text-charcoal-gray font-light">
          Trusted advisor to leading business figures and entrepreneurs worldwide.
        </p>
      </div>
      
      <div className="premium-card-enhanced p-12 rounded-3xl text-center group hover:scale-105 transition-all duration-500 border border-gray-200">
        <h4 className="text-2xl font-serif font-semibold text-deep-navy mb-4">Celebrities</h4>
        <p className="text-charcoal-gray font-light">
          Delivering utmost discretion and exclusivity to high-profile personalities.
        </p>
      </div>
      
      <div className="premium-card-enhanced p-12 rounded-3xl text-center group hover:scale-105 transition-all duration-500 border border-gray-200">
        <h4 className="text-2xl font-serif font-semibold text-deep-navy mb-4">Investors</h4>
        <p className="text-charcoal-gray font-light">
          Guiding prominent investors in building prestigious property portfolios.
        </p>
      </div>
    </div>
  </div>
</section>


      {/* Contact Section */}
      <section id="contact" className="py-32 bg-gradient-to-br from-deep-navy via-deep-navy/98 to-luxury-navy-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-serif font-bold text-white mb-6">Book Your Private Consultation</h2>
            <p className="text-xl text-pearl-white/80 font-light">Connect with luxury real estate excellence</p>
          </div>
          <div className="grid md:grid-cols-2 gap-16">
            <div className="animate-fade-in">
              <h3 className="text-3xl font-serif font-semibold text-white mb-10">Exclusive Access</h3>
              <div className="space-y-8">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-luxury-navy to-luxury-navy-dark rounded-2xl flex items-center justify-center mr-6">
                    <i className="ri-phone-line text-white w-6 h-6 flex items-center justify-center"></i>
                  </div>
                  <div>
                    <p className="font-medium text-white text-lg">Private Line</p>
                    <p className="text-pearl-white/70 font-light">(555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-luxury-navy to-luxury-navy-dark rounded-2xl flex items-center justify-center mr-6">
                    <i className="ri-mail-line text-white w-6 h-6 flex items-center justify-center"></i>
                  </div>
                  <div>
                    <p className="font-medium text-white text-lg">Exclusive Email</p>
                    <p className="text-pearl-white/70 font-light">sarah@mitchellrealty.com</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-luxury-navy to-luxury-navy-dark rounded-2xl flex items-center justify-center mr-6">
                    <i className="ri-map-pin-line text-white w-6 h-6 flex items-center justify-center"></i>
                  </div>
                  <div>
                    <p className="font-medium text-white text-lg">Private Office</p>
                    <p className="text-pearl-white/70 font-light">123 Premium Tower, Suite 456<br />Luxury District, Mumbai 400001</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <button 
                    onClick={handleWhatsAppConsultation}
                    className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-2xl flex items-center justify-center mr-6 cursor-pointer transition-all duration-300"
                  >
                    <i className="ri-whatsapp-line text-white w-5 h-5 flex items-center justify-center"></i>
                  </button>
                  <div>
                    <p className="font-medium text-white text-lg">WhatsApp</p>
                    <p className="text-pearl-white/70 font-light">Instant premium service</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="glass-effect-enhanced p-10 rounded-3xl shadow-2xl">
              <h3 className="text-3xl font-serif font-semibold text-deep-navy mb-8">Private Consultation</h3>
              {submitStatus === 'success' && (
                <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 text-green-800 rounded-2xl">
                  Thank you for your inquiry! I'll contact you within 24 hours.
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-800 rounded-2xl">
                  Please try again or contact us directly.
                </div>
              )}
              <form className="space-y-8" onSubmit={handleSubmit} id="contact_form" data-readdy-form>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-deep-navy mb-3">First Name</label>
                    <input 
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 border border-charcoal-gray/20 rounded-2xl focus:ring-2 focus:ring-luxury-navy focus:border-luxury-navy text-sm font-light bg-pearl-white" 
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-deep-navy mb-3">Last Name</label>
                    <input 
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 border border-charcoal-gray/20 rounded-2xl focus:ring-2 focus:ring-luxury-navy focus:border-luxury-navy text-sm font-light bg-pearl-white" 
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-deep-navy mb-3">Email</label>
                  <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 border border-charcoal-gray/20 rounded-2xl focus:ring-2 focus:ring-luxury-navy focus:border-luxury-navy text-sm font-light bg-pearl-white" 
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-deep-navy mb-3">Phone</label>
                  <input 
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 border border-charcoal-gray/20 rounded-2xl focus:ring-2 focus:ring-luxury-navy focus:border-luxury-navy text-sm font-light bg-pearl-white" 
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-deep-navy mb-3">Message</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-6 py-4 border border-charcoal-gray/20 rounded-2xl focus:ring-2 focus:ring-luxury-navy focus:border-luxury-navy text-sm font-light bg-pearl-white" 
                    placeholder="I'm interested in luxury properties in South Mumbai..."
                    required
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full ${isSubmitting ? 'bg-luxury-navy/50' : 'luxury-button-primary'} text-white py-5 rounded-2xl font-medium whitespace-nowrap cursor-pointer transition-all duration-300 tracking-wide`}
                >
                  {isSubmitting ? 'Submitting...' : 'Request Consultation'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Modal */}
      {showConsultationForm && (
        <div className="fixed inset-0 bg-luxury-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-effect-enhanced rounded-3xl shadow-2xl max-w-md w-full max-h-screen overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-3xl font-serif font-semibold text-deep-navy">Private Consultation</h3>
                <button 
                  onClick={() => setShowConsultationForm(false)}
                  className="text-charcoal-gray hover:text-deep-navy cursor-pointer transition-colors duration-300"
                >
                  <i className="ri-close-line w-8 h-8 flex items-center justify-center"></i>
                </button>
              </div>
              
              {consultationSubmitStatus === 'success' && (
                <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 text-green-800 rounded-2xl">
                  Consultation scheduled successfully! I'll contact you within 24 hours.
                </div>
              )}
              {consultationSubmitStatus === 'error' && (
                <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-800 rounded-2xl">
                  Please try again or contact us directly.
                </div>
              )}
              
              <form className="space-y-6" onSubmit={handleConsultationSubmit}>
                <div>
                  <label className="block text-sm font-medium text-deep-navy mb-3">Full Name</label>
                  <input 
                    type="text"
                    name="name"
                    value={consultationData.name}
                    onChange={handleConsultationChange}
                    className="w-full px-6 py-4 border border-charcoal-gray/20 rounded-2xl focus:ring-2 focus:ring-luxury-navy focus:border-luxury-navy text-sm font-light bg-pearl-white" 
                    placeholder="Sarah Johnson"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-deep-navy mb-3">Email</label>
                  <input 
                    type="email"
                    name="email"
                    value={consultationData.email}
                    onChange={handleConsultationChange}
                    className="w-full px-6 py-4 border border-charcoal-gray/20 rounded-2xl focus:ring-2 focus:ring-luxury-navy focus:border-luxury-navy text-sm font-light bg-pearl-white" 
                    placeholder="sarah@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-deep-navy mb-3">Phone</label>
                  <input 
                    type="tel"
                    name="phone"
                    value={consultationData.phone}
                    onChange={handleConsultationChange}
                    className="w-full px-6 py-4 border border-charcoal-gray/20 rounded-2xl focus:ring-2 focus:ring-luxury-navy focus:border-luxury-navy text-sm font-light bg-pearl-white" 
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-deep-navy mb-3">Preferred Date</label>
                    <input 
                      type="date"
                      name="preferredDate"
                      value={consultationData.preferredDate}
                      onChange={handleConsultationChange}
                      className="w-full px-6 py-4 border border-charcoal-gray/20 rounded-2xl focus:ring-2 focus:ring-luxury-navy focus:border-luxury-navy text-sm font-light bg-pearl-white" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-deep-navy mb-3">Preferred Time</label>
                    <input 
                      type="time"
                      name="preferredTime"
                      value={consultationData.preferredTime}
                      onChange={handleConsultationChange}
                      className="w-full px-6 py-4 border border-charcoal-gray/20 rounded-2xl focus:ring-2 focus:ring-luxury-navy focus:border-luxury-navy text-sm font-light bg-pearl-white" 
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-deep-navy mb-3">Service Type</label>
                  <select
                    name="serviceType"
                    value={consultationData.serviceType}
                    onChange={handleConsultationChange}
                    className="w-full px-6 py-4 border border-charcoal-gray/20 rounded-2xl focus:ring-2 focus:ring-luxury-navy focus:border-luxury-navy text-sm font-light pr-8 bg-pearl-white"
                    required
                  >
                    <option value="">Select a service</option>
                    <option value="luxury-acquisitions">Luxury Acquisitions</option>
                    <option value="premium-sales">Premium Sales</option>
                    <option value="portfolio-management">Portfolio Management</option>
                    <option value="private-consultation">Private Consultation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-deep-navy mb-3">Message (Optional)</label>
                  <textarea 
                    name="message"
                    value={consultationData.message}
                    onChange={handleConsultationChange}
                    rows={3}
                    className="w-full px-6 py-4 border border-charcoal-gray/20 rounded-2xl focus:ring-2 focus:ring-luxury-navy focus:border-luxury-navy text-sm font-light bg-pearl-white" 
                    placeholder="Specific requirements or investment goals..."
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  disabled={isConsultationSubmitting}
                  className={`w-full ${isConsultationSubmitting ? 'bg-luxury-navy/50' : 'luxury-button-primary'} text-white py-5 rounded-2xl font-medium whitespace-nowrap cursor-pointer transition-all duration-300 tracking-wide`}
                >
                  {isConsultationSubmitting ? 'Scheduling...' : 'Schedule Consultation'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
        <footer className="bg-white text-gray-900 py-16 border-t border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-4 gap-12">
        
        {/* Branding & Socials */}
        <div>
          <div className="flex items-center space-x-4 mb-6">
            <img 
                src="/image.png"
                alt="Rajeev Mittal Logo" 
                className="h-16 w-auto cursor-pointer"
                // onClick={() => navigate('/')}
              />
            {/* <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
              <span className="text-lg font-serif font-bold text-white">RM</span>
            </div> */}
            <h3 className="text-2xl font-serif font-bold text-gray-900">Rajeev Mittal</h3>
          </div>
          <p className="text-gray-600 mb-8 font-light leading-relaxed">
            Exclusive luxury real estate services for discerning clientele seeking exceptional properties and personalized excellence.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="w-10 h-10 bg-gray-100 hover:bg-blue-600 hover:text-white rounded-xl flex items-center justify-center transition-all duration-300">
              <i className="ri-twitter-fill"></i>
            </a>
            <a href="#" className="w-10 h-10 bg-gray-100 hover:bg-pink-500 hover:text-white rounded-xl flex items-center justify-center transition-all duration-300">
              <i className="ri-instagram-line"></i>
            </a>
            <a href="#" className="w-10 h-10 bg-gray-100 hover:bg-blue-700 hover:text-white rounded-xl flex items-center justify-center transition-all duration-300">
              <i className="ri-linkedin-fill"></i>
            </a>
            <a href="#" className="w-10 h-10 bg-gray-100 hover:bg-red-600 hover:text-white rounded-xl flex items-center justify-center transition-all duration-300">
              <i className="ri-youtube-fill"></i>
            </a>
            <a href="https://wa.me/15551234567" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 hover:bg-green-600 hover:text-white rounded-xl flex items-center justify-center transition-all duration-300">
              <i className="ri-whatsapp-line"></i>
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-lg font-serif font-semibold mb-6 text-gray-900">Navigation</h4>
          <ul className="space-y-3 text-gray-600 font-light">
            <li><a href="#home" className="hover:text-blue-600">Home</a></li>
            <li><a href="#about" className="hover:text-blue-600">About</a></li>
            <li><a href="#services" className="hover:text-blue-600">Services</a></li>
            <li><a href="#contact" className="hover:text-blue-600">Contact</a></li>
          </ul>
        </div>

        {/* Premium Services */}
        <div>
          <h4 className="text-lg font-serif font-semibold mb-6 text-gray-900">Premium Services</h4>
          <ul className="space-y-3 text-gray-600 font-light">
            <li>Luxury Acquisitions</li>
            <li>Premium Sales</li>
            <li>Portfolio Management</li>
            <li>Market Analysis</li>
            <li>Private Consultations</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-lg font-serif font-semibold mb-6 text-gray-900">Exclusive Contact</h4>
          <ul className="space-y-3 text-gray-600 font-light">
            <li className="flex items-center">
              <i className="ri-phone-line mr-3 text-blue-600"></i> (555) 123-4567
            </li>
            <li className="flex items-center">
              <i className="ri-mail-line mr-3 text-blue-600"></i> rajeevmittal@gmail.com
            </li>
            <li className="flex items-start">
              <i className="ri-map-pin-line mr-3 mt-1 text-blue-600"></i>
              <span>123 Premium Tower<br />Luxury District, Mumbai 400001</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200 mt-12 pt-8 flex justify-between items-center">
        <p className="text-gray-500 font-light">
          &copy; {new Date().getFullYear()} Rajeev Mittal Luxury Real Estate. All rights reserved.
        </p>
      </div>
    </div>
  </footer>

    </div>
  );
};

export default Home;
