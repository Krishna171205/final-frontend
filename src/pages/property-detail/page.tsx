
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Property {
  id: number;
  title: string;
  location: string;
  full_address: string;
  price: number;
  type: string;
  status: string;
  description: string;
  is_rental?: boolean;
  image_url: string;
}

const PropertyDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [showContactForm, setShowContactForm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/get-properties`);
      
      if (response.ok) {
        const data = await response.json();
        const foundProperty = data.properties.find((p: Property) => p.id.toString() === id);
        
        if (foundProperty) {
          setProperty(foundProperty);
        } else {
          navigate('/properties');
        }
      }
    } catch (error) {
      console.error('Error loading property:', error);
      navigate('/properties');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formDataToSend = new URLSearchParams();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('message', formData.message);
      formDataToSend.append('property', property?.title || '');

      const response = await fetch('https://readdy.ai/api/form/d30trnuld3g0jopqalf0', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formDataToSend
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
        setTimeout(() => {
          setShowContactForm(false);
          setSubmitStatus('idle');
        }, 3000);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gold-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Property Not Found</h2>
          <button 
            onClick={() => navigate('/properties')}
            className="btn-luxury text-slate-900 px-8 py-3 rounded-lg font-semibold cursor-pointer"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-gray-900/95 backdrop-blur-md shadow-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <button onClick={() => navigate('/')} className="text-3xl font-bold bg-gold-gradient bg-clip-text text-transparent cursor-pointer font-serif">
                Rajeev Mittal
              </button>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <button onClick={() => navigate('/')} className="text-gray-300 hover:text-gold-300 px-3 py-2 text-sm font-medium cursor-pointer transition-colors">Home</button>
                <a href="/#about" className="text-gray-300 hover:text-gold-300 px-3 py-2 text-sm font-medium cursor-pointer transition-colors">About</a>
                <button onClick={() => navigate('/properties')} className="text-gray-300 hover:text-gold-300 px-3 py-2 text-sm font-medium cursor-pointer transition-colors">Properties</button>
                <a href="/#services" className="text-gray-300 hover:text-gold-300 px-3 py-2 text-sm font-medium cursor-pointer transition-colors">Services</a>
                <a href="/#contact" className="text-gray-300 hover:text-gold-300 px-3 py-2 text-sm font-medium cursor-pointer transition-colors">Contact</a>
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
                <button onClick={() => navigate('/')} className="text-gray-300 hover:text-gold-300 block px-3 py-2 text-base font-medium cursor-pointer w-full text-left">Home</button>
                <a href="/#about" className="text-gray-300 hover=text-gold-300 block px-3 py-2 text-base font-medium cursor-pointer">About</a>
                <button onClick={() => navigate('/properties')} className="text-gray-300 hover:text-gold-300 block px-3 py-2 text-base font-medium cursor-pointer w-full text-left">Properties</button>
                <a href="/#services" className="text-gray-300 hover:text-gold-300 block px-3 py-2 text-base font-medium cursor-pointer">Services</a>
                <a href="/#contact" className="text-gray-300 hover=text-gold-300 block px-3 py-2 text-base font-medium cursor-pointer">Contact</a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 text-sm text-gray-500">
            <button onClick={() => navigate('/')} className="hover:text-gold-500 cursor-pointer transition-colors">Home</button>
            <i className="ri-arrow-right-s-line w-4 h-4 flex items-center justify-center"></i>
            <button onClick={() => navigate('/properties')} className="hover:text-gold-500 cursor-pointer transition-colors">Properties</button>
            <i className="ri-arrow-right-s-line w-4 h-4 flex items-center justify-center"></i>
            <span className="text-gold-500">{property.title}</span>
          </div>
        </div>
      </div>

      {/* Property Images */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative">
          <img 
            alt={property.title}
            className="w-full max-h-[600px] object-contain rounded-2xl bg-gray-50 border border-gray-200" 
            src={property.image_url}
          />
          <div className="absolute top-6 left-6">
            <span className={`${getStatusColor(property.status)} text-white px-4 py-2 rounded-full text-sm font-semibold`}>
              {property.status}
            </span>
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2">
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-6 font-serif">{property.title}</h1>
              <p className="text-xl text-gray-600 mb-6 flex items-center">
                <i className="ri-map-pin-line mr-3 w-6 h-6 flex items-center justify-center text-gold-500"></i>
                {property.full_address}
              </p>
              <div className="text-4xl font-bold text-gray-900 mb-8 font-serif">
                {formatPrice(property.price, property.is_rental)}
              </div>
              
              <div className="text-center p-8 bg-gray-50 rounded-2xl mb-12 border border-gray-200">
                <i className="ri-home-4-line text-3xl text-gray-600 mb-4 w-12 h-12 flex items-center justify-center mx-auto"></i>
                <div className="text-xl font-semibold text-gray-900 mb-2">{property.type}</div>
                <div className="text-gray-600">Property Type</div>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif gold-accent">Property Description</h2>
              <p className="text-gray-700 leading-relaxed text-lg">{property.description}</p>
            </div>
          </div>

          {/* Contact Form Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-2xl sticky top-24 border border-gray-200 shadow-card">
              <div className="text-center mb-8">
                <img 
                  alt="Rajeev Mittal" 
                  className="w-24 h-24 rounded-full mx-auto mb-6 object-cover object-top border-2 border-gray-200" 
                  src="https://check2-flame-two.vercel.app/image2url.com/images/1758081839443-f1caa703-d629-4030-be4d-15dc4509a6cd.jpg"
                />
                <h3 className="text-2xl font-semibold text-gray-900 font-serif">Rajeev Mittal</h3>
                <p className="text-gold-500 mb-4">Real Estate Expert</p>
                <div className="flex justify-center space-x-1 mb-3">
                  <i className="ri-star-fill text-gold-400 w-5 h-5 flex items-center justify-center"></i>
                  <i className="ri-star-fill text-gold-400 w-5 h-5 flex items-center justify-center"></i>
                  <i className="ri-star-fill text-gold-400 w-5 h-5 flex items-center justify-center"></i>
                  <i className="ri-star-fill text-gold-400 w-5 h-5 flex items-center justify-center"></i>
                  <i className="ri-star-fill text-gold-400 w-5 h-5 flex items-center justify-center"></i>
                </div>
                <span className="text-sm text-gray-500">30+ years experience</span>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <a href="tel:+919811017103" className="text-gold-500 hover:text-gold-600 cursor-pointer transition-colors">(+91) 9811017103</a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Email:</span>
                  <a href="mailto:rajeevmittal_dlf@hotmail.com" className="text-gold-500 hover:text-gold-600 cursor-pointer text-sm transition-colors">rajeevmittal_dlf@hotmail.com</a>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => setShowContactForm(!showContactForm)}
                  className="w-full btn-luxury text-white py-4 rounded-lg font-semibold whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-mail-line mr-2 w-5 h-5 flex items-center justify-center inline-flex"></i>
                  Inquire About Property
                </button>
                <a 
                  href={`https://wa.me/9811017103?text=Hi Rajeev, I'm interested in the property: ${property.title}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-lg font-semibold whitespace-nowrap cursor-pointer flex items-center justify-center transition-colors"
                >
                  <i className="ri-whatsapp-line mr-2 w-5 h-5 flex items-center justify-center"></i>
                  WhatsApp Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-gray-900 font-serif">Property Inquiry</h3>
              <button 
                onClick={() => setShowContactForm(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
              >
                <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
              </button>
            </div>
            
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                Thank you for your inquiry! We'll get back to you soon.
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                Sorry, there was an error sending your message. Please try again.
              </div>
            )}

            <form onSubmit={handleSubmit} id="property_inquiry_form" data-readdy-form>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input 
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gold-500 focus:border-gold-500" 
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gold-500 focus:border-gold-500" 
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input 
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gold-500 focus:border-gold-500" 
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea 
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gold-500 focus:border-gold-500" 
                    placeholder="I'm interested in this luxury property..."
                    maxLength={500}
                    required
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full btn-luxury text-white py-4 rounded-lg font-semibold whitespace-nowrap cursor-pointer transition-all ${isSubmitting ? 'opacity-50' : ''}`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="col-span-2">
              <h3 className="text-2xl font-bold bg-gold-gradient bg-clip-text text-transparent mb-6 font-serif">Rajeev Mittal</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Expert real estate guidance with personalized service for buyers and sellers in Gurgaon's premium market.
              </p>
              <div className="flex space-x-4">
                <a href="https://wa.me/9811017103" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center cursor-pointer transition-all">
                  <i className="ri-whatsapp-line w-5 h-5 flex items-center justify-center"></i>
                </a>
                <div className="w-10 h-10 bg-gray-800 hover:bg-gold-500 rounded-full flex items-center justify-center cursor-pointer transition-all group">
                  <i className="ri-linkedin-fill text-gray-400 group-hover:text-white w-5 h-5 flex items-center justify-center"></i>
                </div>
                <div className="w-10 h-10 bg-gray-800 hover:bg-gold-500 rounded-full flex items-center justify-center cursor-pointer transition-all group">
                  <i className="ri-instagram-fill text-gray-400 group-hover:text-white w-5 h-5 flex items-center justify-center"></i>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6 text-gold-400">Quick Links</h4>
              <ul className="space-y-3">
                <li><button onClick={() => navigate('/')} className="text-gray-300 hover:text-gold-300 cursor-pointer transition-colors">Home</button></li>
                <li><a href="/#about" className="text-gray-300 hover:text-gold-300 cursor-pointer transition-colors">About</a></li>
                <li><a href="/#services" className="text-gray-300 hover:text-gold-300 cursor-pointer transition-colors">Services</a></li>
                <li><button onClick={() => navigate('/properties')} className="text-gray-300 hover:text-gold-300 cursor-pointer transition-colors">Properties</button></li>
                <li><a href="/#contact" className="text-gray-300 hover:text-gold-300 cursor-pointer transition-colors">Contact</a></li>
                <li><a href="https://readdy.ai/?origin=logo" className="text-gray-300 hover:text-gold-300 cursor-pointer transition-colors">Made with Readdy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6 text-gold-400">Services</h4>
              <ul className="space-y-3">
                <li><span className="text-gray-300">Home Buying</span></li>
                <li><span className="text-gray-300">Home Selling</span></li>  
                <li><span className="text-gray-300">Investment Properties</span></li>
                <li><span className="text-gray-300">Premium Projects</span></li>
                <li><span className="text-gray-300">Corporate Services</span></li>
                <li><span className="text-gray-300">Consultation</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 mb-4 md:mb-0">RAJEEV MITTAL ESTATES PVT.LTD. All rights reserved.<br />Rera Approved - Registration Number GGM/107/2017/1R/140/Ext1/2022/2021</p>
            <a href="https://readdy.ai/?origin=logo" className="text-gold-400 hover:text-gold-300 cursor-pointer transition-colors">
              Made with Readdy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PropertyDetail;
