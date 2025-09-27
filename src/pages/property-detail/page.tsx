
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Property {
  id: number;
  title: string;
  location: string;
  full_address: string;
  type: string;
  status: string;
  description: string;
  bhk: number;
  baths: number;
  sqft: number;
  area?: string;
  created_at: string;
  custom_image?: File | string | null;
  custom_image_2?: File | string | null;
  custom_image_3?: File | string | null;
}

const PropertyDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'For Sale': return 'bg-navy-600';
      case 'For Rent': return 'bg-green-600';
      case 'Investment': return 'bg-purple-600';
      default: return 'bg-navy-500';
    }
  };

  const getPropertyImages = () => {
    const images = [property?.custom_image];
    if (property?.custom_image_2) images.push(property.custom_image_2);
    if (property?.custom_image_3) images.push(property.custom_image_3);
    return images.filter(Boolean);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-off-white-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-navy-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-off-white-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-navy-900 mb-6">Property Not Found</h2>
          <button 
            onClick={() => navigate('/properties')}
            className="btn-luxury text-white px-8 py-3 rounded-lg font-semibold cursor-pointer"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  const images = getPropertyImages();

  return (
    <div className="min-h-screen bg-off-white-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <button onClick={() => navigate('/')} className="text-3xl font-bold text-navy-900 cursor-pointer font-serif">
                Rajeev Mittal
              </button>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <button onClick={() => navigate('/')} className="text-gray-700 hover:text-navy-600 px-3 py-2 text-sm font-medium cursor-pointer transition-colors">Home</button>
                <button onClick={() => navigate('/about')} className="text-gray-700 hover:text-navy-600 px-3 py-2 text-sm font-medium cursor-pointer transition-colors">About</button>
                <button onClick={() => navigate('/properties')} className="text-gray-700 hover:text-navy-600 px-3 py-2 text-sm font-medium cursor-pointer transition-colors">Properties</button>
                <button onClick={() => navigate('/areas')} className="text-gray-700 hover:text-navy-600 px-3 py-2 text-sm font-medium cursor-pointer transition-colors">Areas</button>
                <button onClick={() => navigate('/blogs')} className="text-gray-700 hover:text-navy-600 px-3 py-2 text-sm font-medium cursor-pointer transition-colors">Blogs</button>
                <a href="/#contact" className="text-gray-700 hover:text-navy-600 px-3 py-2 text-sm font-medium cursor-pointer transition-colors">Contact</a>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <a href="https://wa.me/9811017103" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center cursor-pointer transition-colors">
                <i className="ri-whatsapp-line text-white w-5 h-5 flex items-center justify-center"></i>
              </a>
              
              {/* Mobile menu button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden w-10 h-10 bg-navy-500 hover:bg-navy-600 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
              >
                <i className={`ri-${mobileMenuOpen ? 'close' : 'menu'}-line text-white w-5 h-5 flex items-center justify-center`}></i>
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mobile-menu bg-white border-t border-gray-200">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <button onClick={() => navigate('/')} className="text-gray-700 hover:text-navy-600 block px-3 py-2 text-base font-medium cursor-pointer w-full text-left">Home</button>
                <button onClick={() => navigate('/about')} className="text-gray-700 hover:text-navy-600 block px-3 py-2 text-base font-medium cursor-pointer w-full text-left">About</button>
                <button onClick={() => navigate('/properties')} className="text-gray-700 hover:text-navy-600 block px-3 py-2 text-base font-medium cursor-pointer w-full text-left">Properties</button>
                <button onClick={() => navigate('/areas')} className="text-gray-700 hover:text-navy-600 block px-3 py-2 text-base font-medium cursor-pointer w-full text-left">Areas</button>
                <button onClick={() => navigate('/blogs')} className="text-gray-700 hover:text-navy-600 block px-3 py-2 text-base font-medium cursor-pointer w-full text-left">Blogs</button>
                <a href="/#contact" className="text-gray-700 hover:text-navy-600 block px-3 py-2 text-base font-medium cursor-pointer">Contact</a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="bg-off-white-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 text-sm text-gray-500">
            <button onClick={() => navigate('/')} className="hover:text-navy-500 cursor-pointer transition-colors">Home</button>
            <i className="ri-arrow-right-s-line w-4 h-4 flex items-center justify-center"></i>
            <button onClick={() => navigate('/properties')} className="hover:text-navy-500 cursor-pointer transition-colors">Properties</button>
            <i className="ri-arrow-right-s-line w-4 h-4 flex items-center justify-center"></i>
            <span className="text-navy-500">{property.title}</span>
          </div>
        </div>
      </div>

      {/* Property Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-navy-900 mb-4 font-serif">{property.title}</h1>
            
            {/* Price on Call Card */}
            <div className="bg-navy-100 border-2 border-navy-300 rounded-lg p-4 mb-4 inline-block">
              <div className="flex items-center">
                <i className="ri-phone-line text-navy-600 text-xl mr-3 w-6 h-6 flex items-center justify-center"></i>
                <div>
                  <div className="text-2xl font-bold text-navy-800 font-serif">Price on Call</div>
                  <div className="text-sm text-navy-600">Contact for pricing details</div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center text-gray-600 mb-4">
              <i className="ri-map-pin-line mr-2 w-5 h-5 flex items-center justify-center"></i>
              <span>{property.full_address}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className={`${getStatusColor(property.status)} text-white px-4 py-2 rounded-full text-sm font-semibold`}>
              {property.status}
            </span>
          </div>
        </div>

        {/* Property Images */}
        <div className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Main Image */}
            <div className="lg:col-span-2">
              <img 
                alt={property.title}
                className="w-full h-96 lg:h-[500px] object-cover rounded-lg" 
                src={
                // Check if selected image index exists
                images[selectedImageIndex] instanceof File
                  ? URL.createObjectURL(images[selectedImageIndex])  // Convert File to URL
                  : images[selectedImageIndex] || (property.custom_image instanceof File
                      ? URL.createObjectURL(property.custom_image)  // Convert File to URL if custom_image is a File
                      : property.custom_image || '')  // Use custom_image or fallback to empty string
              }
              />
            </div>
            
            {/* Thumbnail Images */}
            <div className="lg:col-span-1 grid grid-cols-3 lg:grid-cols-1 gap-4">
              {images.map((image, index) => (
                <img 
                  key={index}
                  alt={`${property.title} ${index + 1}`}
                  className={`w-full h-24 lg:h-32 object-cover rounded-lg cursor-pointer transition-all border-2 ${
                    selectedImageIndex === index ? 'border-navy-500' : 'border-transparent hover:border-gray-300'
                  }`}
                  src={image instanceof File ? URL.createObjectURL(image) : image || ''}
                  onClick={() => setSelectedImageIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Project Specifications */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-navy-900 mb-6 font-serif">Project Specifications</h2>
          <div className="bg-off-white-100 rounded-lg p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-home-2-line text-navy-600 text-2xl w-8 h-8 flex items-center justify-center"></i>
                </div>
                <div className="text-2xl font-bold text-navy-900 mb-1">{property.bhk}</div>
                <div className="text-gray-600 text-sm">BHK</div>
              </div>
              {/* <div className="text-center">
                <div className="w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-drop-line text-navy-600 text-2xl w-8 h-8 flex items-center justify-center"></i>
                </div>
                <div className="text-2xl font-bold text-navy-900 mb-1">{property.baths}</div>
                <div className="text-gray-600 text-sm">Bathrooms</div>
              </div> */}
              <div className="text-center">
                <div className="w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-ruler-line text-navy-600 text-2xl w-8 h-8 flex items-center justify-center"></i>
                </div>
                <div className="text-2xl font-bold text-navy-900 mb-1">{property.sqft}</div>
                <div className="text-gray-600 text-sm">Sq.ft Area</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-building-line text-navy-600 text-2xl w-8 h-8 flex items-center justify-center"></i>
                </div>
                <div className="text-2xl font-bold text-navy-900 mb-1">{property.type}</div>
                <div className="text-gray-600 text-sm">Property Type</div>
              </div>
            </div>
          </div>
        </div>

        {/* About Project */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-navy-900 mb-6 font-serif">About Project</h2>
          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-gray-700 leading-relaxed">{property.description}</p>
          </div>
          
          {/* Contact Now Button */}
          <div className="flex justify-center">
            <a 
              href="https://wa.me/9811017103" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-10 py-4 rounded-lg text-lg font-semibold whitespace-nowrap cursor-pointer transition-colors shadow-lg flex items-center"
            >
              <i className="ri-whatsapp-line mr-3 w-6 h-6 flex items-center justify-center"></i>
              Contact Now
            </a>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="bg-navy-900 text-white py-16 border-t border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="col-span-2">
              <h3 className="text-2xl font-bold text-white mb-6 font-serif">Rajeev Mittal</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Expert real estate guidance with personalized service for buyers and sellers in Gurgaon's premium market.
              </p>
              <div className="flex space-x-4">
                <a href="https://wa.me/9811017103" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center cursor-pointer transition-all">
                  <i className="ri-whatsapp-line w-5 h-5 flex items-center justify-center"></i>
                </a>
                <div className="w-10 h-10 bg-navy-800 hover:bg-navy-600 rounded-full flex items-center justify-center cursor-pointer transition-all group">
                  <i className="ri-linkedin-fill text-gray-400 group-hover:text-white w-5 h-5 flex items-center justify-center"></i>
                </div>
                <div className="w-10 h-10 bg-navy-800 hover:bg-navy-600 rounded-full flex items-center justify-center cursor-pointer transition-all group">
                  <i className="ri-instagram-fill text-gray-400 group-hover:text-white w-5 h-5 flex items-center justify-center"></i>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
              <ul className="space-y-3">
                <li><button onClick={() => navigate('/')} className="text-gray-300 hover:text-white cursor-pointer transition-colors">Home</button></li>
                <li><button onClick={() => navigate('/about')} className="text-gray-300 hover:text-white cursor-pointer transition-colors">About</button></li>
                <li><button onClick={() => navigate('/properties')} className="text-gray-300 hover:text-white cursor-pointer transition-colors">Properties</button></li>
                <li><button onClick={() => navigate('/areas')} className="text-gray-300 hover:text-white cursor-pointer transition-colors">Areas</button></li>
                <li><button onClick={() => navigate('/blogs')} className="text-gray-300 hover:text-white cursor-pointer transition-colors">Blogs</button></li>
                <li><a href="/#contact" className="text-gray-300 hover:text-white cursor-pointer transition-colors">Contact</a></li>
                <li><a href="https://readdy.ai/?origin=logo" className="text-gray-300 hover:text-white cursor-pointer transition-colors">Made with Readdy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Services</h4>
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
          <div className="border-t border-navy-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 mb-4 md:mb-0">RAJEEV MITTAL ESTATES PVT.LTD. All rights reserved.<br />Rera Approved - Registration Number GGM/107/2017/1R/140/Ext1/2022/2021</p>
            <a href="https://readdy.ai/?origin=logo" className="text-gray-300 hover:text-white cursor-pointer transition-colors">
              Made with Readdy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PropertyDetail;
