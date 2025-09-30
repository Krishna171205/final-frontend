
import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

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
  // const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // const [filterType, setFilterType] = useState('all');
  const [searchParams] = useSearchParams();
    const [_filterArea, setFilterArea] = useState(searchParams.get('area') || 'all');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [_isScrolled, setIsScrolled] = useState(false); // To track scroll state
  const [_, setCurrentPage] = useState('home'); // Track the current page
  const handleLinkClick = () => {
    setIsSidebarOpen(false); // Close the sidebar when a link is clicked
  };
  // const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    loadProperty();
  }, [id]);

  useEffect(() => {
    // Update filter when URL params change
    
    const areaParam = searchParams.get('area');
    if (areaParam) {
      setFilterArea(areaParam);
    }
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

  // const getPropertyImages = () => {
  //   const images = [property?.custom_image];
  //   if (property?.custom_image_2) images.push(property.custom_image_2);
  //   if (property?.custom_image_3) images.push(property.custom_image_3);
  //   return images.filter(Boolean);
  // };

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

  // const images = getPropertyImages();

  return (
    <div className="min-h-screen bg-off-white-50">
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
                                 <button  onClick={() => navigate('/about')} className={('')}>About</button>
                                 <button  onClick={() => navigate('/blogs')} className={('blog')}>Blog</button>
                                 <button  onClick={() => navigate('/areas')} className={('px-3 py-2 text-sm font-medium cursor-pointer bg-navy-600 hover:bg-navy-700 text-white rounded-full font-semibold transform hover:scale-105')}>Areas</button>
                                 {/* <button  onClick={() => navigate('/contact')} className={('contact')}>Contact</button> */}
                               </div>
                             </div>
                 
                             {/* Consultation Button */}
                             <div className="hidden md:block">
                               <a 
                                 href="https://wa.me/9811017103?text=Hi%2C%20I%27m%20interested%20in%20premium%20properties%20across%20Gurugram%20locations.%20Please%20share%20more%20details.
           " 
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
                         {/* Home → "/" */}
                         <HashLink
                           smooth
                           to="/#home"
                           className="text-lg text-gray-900 hover:text-indigo-500"
                           onClick={handleLinkClick}
                         >
                           Home
                         </HashLink>
                       
                         {/* Properties → "/properties" */}
                         <HashLink
                           smooth
                           to="/properties"
                           className="text-lg text-gray-900 hover:text-indigo-500"
                           onClick={handleLinkClick}
                         >
                           Properties
                         </HashLink>
                       
                         {/* About → "/about" */}
                         <HashLink
                           smooth
                           to="/about"
                           className="text-lg text-gray-900 hover:text-indigo-500"
                           onClick={handleLinkClick}
                         >
                           About
                         </HashLink>
                       
                         {/* Blog → "/about" (same as About for now) */}
                         <HashLink
                           smooth
                           to="/blogs"
                           className="text-lg text-gray-900 hover:text-indigo-500"
                           onClick={handleLinkClick}
                         >
                           Blog
                         </HashLink>
                       
                         {/* Testimonials → "#testimonials" on home route */}
                         <HashLink
                           smooth
                           to="/#testimonials"
                           className="text-lg text-gray-900 hover:text-indigo-500"
                           onClick={handleLinkClick}
                         >
                           Testimonials
                         </HashLink>
                       
                         {/* Contact → "#contact" on home route */}
                         <HashLink
                           smooth
                           to="/#contact"
                           className="text-lg text-gray-900 hover:text-indigo-500"
                           onClick={handleLinkClick}
                         >
                           Contact
                         </HashLink>
                       
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="relative">
            <img 
              alt={property.title}
              className="w-full max-h-[600px] object-contain rounded-lg bg-gray-50" 
              src={property.custom_image instanceof File 
                      ? URL.createObjectURL(property.custom_image) // Create a URL from the file
                      : property.custom_image || ''}
            />
            {/* <div className="absolute top-4 left-4">
              <span className={`${getStatusColor(property.status)} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                {property.status}
              </span>
            </div> */}
          </div>
        <div className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Main Image */}
            {/* <div className="lg:col-span-2">
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
            </div> */}
            
            {/* Thumbnail Images */}
            
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
                                    href="https://wa.me/9811017103?text=Hi%2C%20I%27m%20interested%20in%20premium%20properties%20across%20Gurugram%20locations.%20Please%20share%20more%20details." 
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

export default PropertyDetail;