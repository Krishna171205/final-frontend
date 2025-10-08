
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
// import { createClient } from '@supabase/supabase-js';
import { HashLink } from 'react-router-hash-link';

// const supabase = createClient(
//   import.meta.env.VITE_PUBLIC_SUPABASE_URL,
//   import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY
// );

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
  custom_image: File | string | null;
  custom_image_2: File | string | null;
  custom_image_3: File | string | null;
}

interface AreaData {
  name: string;
  slug: string;
  description: string;
  heroImage: string;
  properties: Property[];
}

const Areas = () => {
  const navigate = useNavigate();
  const [areasData, setAreasData] = useState<AreaData[]>([]);
  const [_loading, _setLoading] = useState(true);
  // const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    // const [filterType, setFilterType] = useState('all');
    const [searchParams] = useSearchParams();
      const [_filterArea, setFilterArea] = useState(searchParams.get('area') || 'all');
      const [isSidebarOpen, setIsSidebarOpen] = useState(false);
      const [_isScrolled, setIsScrolled] = useState(false); // To track scroll state
    const [_currentPage, setCurrentPage] = useState('home'); // Track the current page
    const handleLinkClick = () => {
      setIsSidebarOpen(false); // Close the sidebar when a link is clicked
    };

  const predefinedAreas = [
    {
      name: 'Golf Course Road',
      slug: 'golf course road',
      description:
        'Premium residential and commercial properties in the millennium city, featuring luxury developments in Golf Course Road.',
      heroImage:
        'https://readdy.ai/api/search-image?query=Modern%20luxury%20residential%20towers%20and%20commercial%20buildings%20in%20Gurgaon%20millennium%20city%20with%20wide%20roads%2C%20premium%20architecture%2C%20glass%20facades%2C%20landscaped%20gardens%2C%20and%20urban%20skyline%20during%20golden%20hour%2C%20professional%20real%20estate%20photography%20style%2C%20contemporary%20design%20elements&width=1200&height=400&seq=gurgaon-hero-001&orientation=landscape',
    },
    {
      name: 'Golf Course Extension Road',
      slug: 'golf course extension road',
      description:
        'Premium residential and commercial properties in the millennium city, featuring luxury developments in Golf Course Extension Road.',
      heroImage:
        'https://readdy.ai/api/search-image?query=Elegant%20luxury%20residential%20buildings%20and%20commercial%20properties%20in%20Delhi%20with%20mix%20of%20modern%20architecture%20and%20heritage%20elements%2C%20tree-lined%20streets%2C%20premium%20facades%2C%20professional%20real%20estate%20photography%20during%20sunset%2C%20sophisticated%20urban%20design&width=1200&height=400&seq=delhi-hero-001&orientation=landscape',
    },
    {
      name: 'Sohna Road',
      slug: 'sohna road',
      description:
        'Premium residential and commercial properties in the millennium city, featuring luxury developments in Sohna Road.',
      heroImage:
        'https://readdy.ai/api/search-image?query=Contemporary%20luxury%20residential%20and%20commercial%20developments%20in%20Noida%20planned%20city%20with%20modern%20glass%20towers%2C%20wide%20expressways%2C%20green%20landscaping%2C%20premium%20architecture%2C%20professional%20real%20estate%20photography%2C%20urban%20planning%20excellence&width=1200&height=400&seq=noida-hero-001&orientation=landscape',
    },
    {
      name: 'Gurgaon Faridabad Road',
      slug: 'gurgaon faridabad road',
      description:
        'Premium residential and commercial properties in the millennium city, featuring luxury developments in Gurgaon Faridabad Road.',
      heroImage:
        'https://readdy.ai/api/search-image?query=Modern%20luxury%20residential%20complexes%20and%20commercial%20buildings%20in%20Faridabad%20with%20contemporary%20architecture%2C%20landscaped%20compounds%2C%20premium%20facilities%2C%20wide%20roads%2C%20professional%20real%20estate%20photography%20style%2C%20emerging%20urban%20development&width=1200&height=400&seq=faridabad-hero-001&orientation=landscape',
    },
    {
      name: 'Dwarka Express Way',
      slug: 'dwarka express way',
      description:
        'Premium residential and commercial properties in the millennium city, featuring luxury developments in Dwarka Express Way.',
      heroImage:
        'https://readdy.ai/api/search-image?query=Premium%20residential%20and%20commercial%20properties%20in%20Greater%20Noida%20with%20modern%20architecture%2C%20luxury%20developments%2C%20green%20spaces%2C%20contemporary%20design%2C%20professional%20real%20estate%20photography%20during%20golden%20hour%2C%20planned%20city%20infrastructure&width=1200&height=400&seq=greater-noida-hero-001&orientation=landscape',
    },
    {
      name: 'More Projects in Gurgaon',
      slug: 'More Projects in Gurgaon',
      description:
        'Premium properties across gurgaon locations and emerging corridors with high growth potential.',
      heroImage:
        'https://readdy.ai/api/search-image?query=Premium%20residential%20and%20commercial%20properties%20across%20NCR%20region%20with%20modern%20architecture%2C%20luxury%20developments%2C%20green%20spaces%2C%20contemporary%20design%2C%20professional%20real%20estate%20photography%20during%20golden%20hour%2C%20diverse%20urban%20landscapes&width=1200&height=400&seq=ncr-other-hero-001&orientation=landscape',
    },
  ];

  useEffect(() => {
    fetchPropertiesByArea();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const fetchPropertiesByArea = async () => {
    // console.error('Failed to load properties:', response.status, response.statusText);
    setAreasData(predefinedAreas.map((area) => ({ ...area, properties: [] })));
    // try {
    //   console.log('Fetching properties by area...');

    //   const session = await supabase.auth.getSession();
    //   const response = await fetch(
    //     `${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/manage-properties`,
    //     {
    //       method: 'GET',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${session.data.session?.access_token}`,
    //       },
    //     }
    //   );

    //   if (response.ok) {
    //     const data = await response.json();
    //     console.log('Properties loaded:', data);

    //     // Group properties by area (fallback to 'other-ncr')
    //     const propertiesByArea = (data.properties || []).reduce(
    //       (acc: Record<string, Property[]>, property: Property) => {
    //         const areaKey = property.area?.toLowerCase() || 'More Properties in Gurgaon';
    //         if (!acc[areaKey]) acc[areaKey] = [];
    //         acc[areaKey].push(property);
    //         return acc;
    //       },
    //       {}
    //     );

    //     // Merge predefined areas with their properties
    //     const areasWithProperties = predefinedAreas.map((area) => ({
    //       ...area,
    //       properties: propertiesByArea[area.slug] || [],
    //     }));

    //     setAreasData(areasWithProperties);
    //   } else {
    //     console.error('Failed to load properties:', response.status, response.statusText);
    //     setAreasData(predefinedAreas.map((area) => ({ ...area, properties: [] })));
    //   }
    // } catch (error) {
    //   console.error('Error fetching properties:', error);
    //   setAreasData(predefinedAreas.map((area) => ({ ...area, properties: [] })));
    // } finally {
    //   setLoading(false);
    // }
  };

  const handleViewAllProperties = (area: string) => {
    navigate(`/properties?area=${area}`);
  };

  // const handlePropertyClick = (propertyId: number) => {
  //   navigate(`/property/${propertyId}`);
  // };

  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case 'ready-to-move':
  //       return 'bg-blue-600';
  //     case 'under-construction':
  //       return 'bg-green-600';
  //     case 'Fresh Booking':
  //       return 'bg-purple-600';
  //     default:
  //       return 'bg-gray-600';
  //   }
  // };

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-navy-600 mx-auto" />
  //         <p className="mt-4 text-gray-600">Loading premium locations...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50">
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

      {/* Header */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-navy-900 mb-6 font-serif">Premium Locations</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover luxury properties across prime locations in NCR. From the millennium city of Gurgaon to the heart of
              Delhi, explore our curated collection of premium real estate.
            </p>
          </div>
        </div>
      </div>

      {/* Areas Sections */}
      <div className="py-16">
        {areasData.map((area, index) => (
          <div key={area.slug} className="mb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Area Header */}
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-serif text-navy-900 mb-4">{area.name}</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">{area.description}</p>
              </div>

              {/* Hero Banner */}
              <div
                className="relative h-96 rounded-2xl overflow-hidden mb-12 bg-cover bg-center shadow-lg"
                style={{ backgroundImage: `url(${area.heroImage})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-navy-900/80 to-transparent" />
                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-xl ml-8 text-white">
                    <h3 className="text-2xl md:text-3xl font-serif mb-4">Luxury Living in {area.name}</h3>
                    <p className="text-gray-200 mb-6 leading-relaxed">
                      Explore premium properties with world‑class amenities and prime locations.
                    </p>
                    <button
                      onClick={() => handleViewAllProperties(area.slug)}
                      className="bg-navy-600 hover:bg-navy-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 whitespace-nowrap shadow-lg shadow-navy-600/30"
                    >
                      View All Properties in {area.name}
                      <i className="ri-arrow-right-line ml-2 w-4 h-4 inline-flex items-center justify-center" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Properties Grid */}
              {/* {area.properties.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12" data-product-shop>
                  {area.properties.slice(0, 6).map((property) => (
                    <div
                      key={property.id}
                      className="bg-white rounded-2xl overflow-hidden border border-gray-200 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                      onClick={() => handlePropertyClick(property.id)}
                    >
                      <div className="relative">
                        <img
                          src={property.custom_image instanceof File 
                      ? URL.createObjectURL(property.custom_image) // Create a URL from the file
                      : property.custom_image || ''} 
                          alt={property.title}
                          className="w-full h-64 object-cover object-top"
                        />
                        <div className="absolute top-4 left-4">
                          <span
                            className={`${getStatusColor(property.status)} text-white px-4 py-2 rounded-full text-sm font-semibold`}
                          >
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
                        <h4 className="text-xl font-semibold text-navy-900 mb-3 font-serif">{property.title}</h4>
                        <p className="text-gray-600 mb-4 flex items-center">
                          <i className="ri-map-pin-line mr-2 w-5 h-5 flex items-center justify-center text-navy-600" />
                          {property.location}
                        </p> */}

                        {/* <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                          <div className="flex items-center justify-center">
                            <i className="ri-phone-line text-navy-600 text-lg mr-2 w-5 h-5 flex items-center justify-center" />
                            <div className="text-lg font-bold text-navy-800 font-serif">Price on Call</div>
                          </div>
                        </div>

                        {(property.bhk || property.sqft) && (
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                            {property.bhk && (
                              <div className="flex items-center">
                                <i className="ri-home-4-line mr-1 w-4 h-4 flex items-center justify-center" />
                                {property.bhk} BHK
                              </div>
                            )}
                            {property.baths && (
                              <div className="flex items-center">
                                <i className="ri-drop-line mr-1 w-4 h-4 flex items-center justify-center" />
                                {property.baths} Baths
                              </div>
                            )}
                            {property.sqft && (
                              <div className="flex items-center">
                                <i className="ri-ruler-line mr-1 w-4 h-4 flex items-center justify-center" />
                                {property.sqft} sqft
                              </div>
                            )}
                          </div>
                        )} */}

                        {/* View Details Button */}
                        {/* <button
                          className="w-full bg-navy-600 hover:bg-navy-700 text-white py-3 rounded-md font-semibold transition-colors"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent the card click bubbling
                            handlePropertyClick(property.id);
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 mb-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-200">
                    <i className="ri-home-4-line text-gray-400 text-3xl w-12 h-12 flex items-center justify-center" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-3">
                    No properties available in {area.name}
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Premium properties will be showcased here once added to this location through our admin dashboard.
                  </p>
                </div>
              )} */}

              {/* View All CTA */}
              {area.properties.length > 0 && (
                <div className="text-center">
                  <button
                    onClick={() => handleViewAllProperties(area.slug)}
                    className="bg-navy-600 hover:bg-navy-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 whitespace-nowrap shadow-lg shadow-navy-600/30"
                  >
                    View All Properties in {area.name}
                    <i className="ri-arrow-right-line ml-2 w-5 h-5 inline-flex items-center justify-center" />
                  </button>
                </div>
              )}
            </div>

            {/* Section Divider */}
            {index < areasData.length - 1 && (
              <div className="mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="bg-navy-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">Ready to Find Your Dream Property?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Our expert team is here to help you discover the perfect property across NCR's premium locations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/9811017103?text=Hi,%20I%27m%20interested%20in%20premium%20properties%20across%20NCR%20locations.%20Please%20share%20more%20details."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-md font-semibold transition-colors"
            >
              Chat on WhatsApp
            </a>
            {/* <button
              onClick={() => navigate('/contact')}
              className="bg-navy-600 hover:bg-navy-700 text-white px-8 py-3 rounded-md font-semibold transition-colors"
            >
              Get In Touch
            </button> */}
          </div>
        </div>
      </div>

      {/* Footer */}
<footer className="bg-navy-900 text-white py-16 border-t border-navy-800">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid md:grid-cols-4 gap-12">
      {/* Brand Section */}
      <div>
        <h3 className="text-2xl font-bold bg-gold-gradient bg-clip-text text-transparent mb-6 font-serif">
          Rajeev Mittal
        </h3>
        <p className="text-gray-300 mb-6 leading-relaxed">
          Expert real estate guidance with personalized service for buyers
          and sellers in Gurgaon's premium market.
        </p>

        {/* Social Icons */}
        <div className="flex space-x-4">
          <a
            href="https://www.facebook.com/rajeevmittalestates/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-navy-800 hover:bg-gold-500 rounded-full flex items-center justify-center transition-all group"
          >
            <i className="ri-facebook-line text-gray-400 group-hover:text-white text-lg"></i>
          </a>
          <a
            href="https://www.instagram.com/rajeev_mittal_6?igsh=ZnFqMTd1aXB0aXo1"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-navy-800 hover:bg-gold-500 rounded-full flex items-center justify-center transition-all group"
          >
            <i className="ri-instagram-line text-gray-400 group-hover:text-white text-lg"></i>
          </a>
          <a
            href="https://www.linkedin.com/in/rajeev-mittal-47b51a33"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-navy-800 hover:bg-gold-500 rounded-full flex items-center justify-center transition-all group"
          >
            <i className="ri-linkedin-fill text-gray-400 group-hover:text-white text-lg"></i>
          </a>
          <a
            href="https://wa.me/9811017103?text=Hi%2C%20I%27m%20interested%20in%20premium%20properties%20across%20Gurugram%20locations.%20Please%20share%20more%20details."
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-all"
          >
            <i className="ri-whatsapp-line text-white text-lg"></i>
          </a>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h4 className="text-lg font-semibold mb-6 text-gold-400">
          Quick Links
        </h4>
        <ul className="space-y-3 text-gray-300">
          <li>
            <button
              onClick={() => navigate("/")}
              className="hover:text-gold-400 transition-colors"
            >
              Home
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/about")}
              className="hover:text-gold-400 transition-colors"
            >
              About
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/properties")}
              className="hover:text-gold-400 transition-colors"
            >
              Properties
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/blogs")}
              className="hover:text-gold-400 transition-colors"
            >
              Blog
            </button>
          </li>
        </ul>
      </div>

      {/* Services */}
      <div>
        <h4 className="text-lg font-semibold mb-6 text-gold-400">
          Services
        </h4>
        <ul className="space-y-3 text-gray-300">
          <li>Home Buying</li>
          <li>Home Selling</li>
          <li>Investment Properties</li>
          <li>Market Analysis</li>
          <li>Consultation</li>
        </ul>
      </div>

      {/* Contact Info */}
      <div>
        <h4 className="text-lg font-semibold mb-6 text-gold-400">
          Contact Info
        </h4>
        <ul className="space-y-4 text-gray-300 text-sm">
          <li className="flex items-center">
            <i className="ri-phone-line mr-3 text-gold-400"></i>
            <a href="tel:+919811017103" className="hover:text-gold-400">
              (+91) 9811017103
            </a>
          </li>
          <li className="flex items-center">
            <i className="ri-mail-line mr-3 text-gold-400"></i>
            <a href="mailto:rajevmittal_dlf@hotmail.com" className="hover:text-gold-400">
              rajeevmittal_dlf@hotmail.com
            </a>
          </li>
          <li className="flex items-start">
            <i className="ri-map-pin-line mr-3 text-gold-400 mt-1"></i>
            <span>
              123, DLF Qutab Plaza, DLF City, Phase-1
              <br />
              Gurugram - 122002 (Haryana)
            </span>
          </li>
        </ul>
      </div>
    </div>

    {/* Footer Bottom */}
    <div className="border-t border-navy-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
      <p className="text-gray-400 text-sm leading-relaxed">
        © {new Date().getFullYear()} RAJEEV MITTAL ESTATES PVT. LTD. All
        rights reserved.
        <br />
        RERA Approved - Registration Number:
        <br className="md:hidden" /> GGM/107/2017/1R/140/Ext1/2022/2021
      </p>
    </div>
  </div>
</footer>
    </div>
  );
};

export default Areas;
