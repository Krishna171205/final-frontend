
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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

const LIMIT = 6; // ✅ number of items per page

const Properties = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [filterArea, setFilterArea] = useState(searchParams.get('area') || 'all');
  const [sortBy, _setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const handleLoadMore = async () => {
  const scrollYBefore = window.scrollY;
  await loadProperties(page + 1);

  // ✅ Restore scroll position after new items render
  requestAnimationFrame(() => {
    window.scrollTo({ top: scrollYBefore, behavior: 'instant' as ScrollBehavior });
  });
};

  // const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [_isScrolled, setIsScrolled] = useState(false); // To track scroll state
  const [_currentPage, setCurrentPage] = useState('home'); // Track the current page
  const handleLinkClick = () => {
    setIsSidebarOpen(false); // Close the sidebar when a link is clicked
  };

  useEffect(() => {
    loadProperties(1,true);
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

            const loadProperties = async (nextPage: number, replace = false) => {
          setLoading(true);

          try {
            const res = await fetch(
              `${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/get-properties?page=${nextPage}&limit=${LIMIT}`,
              { headers: { 'Content-Type': 'application/json' } }
            );

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();
            const newProps: Property[] = data.properties ?? [];

            // ✅ Append or replace properties
            setProperties(prev => (replace ? newProps : [...prev, ...newProps]));

            // ✅ Stop when fewer than LIMIT
            setHasMore(newProps.length === LIMIT);

            // ✅ Only update page if data came in
            if (newProps.length > 0) setPage(nextPage);
          } catch (err) {
            console.error('Error loading properties:', err);
            if (replace) setProperties([]); // clear only on replace
            setHasMore(false);
          } finally {
            setLoading(false);
          }
        };

  //   const handleLoadMore = async () => {
  //   await loadProperties(page + 1);
  //   // ✅ keep “Load More” area in view after new content is added
  //   loadMoreRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  // };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready-to-move':
        return 'bg-blue-600';
      case 'under-construction':
        return 'bg-green-600';
      case 'ongoing':
        return 'bg-purple-600';
      default:
        return 'bg-gray-600';
    }
  };

  const handlePropertyClick = (propertyId: number) => {
    navigate(`/property/${propertyId}`);
  };

  // Generate dynamic area options from actual properties
  const availableAreas = [
    ...new Set(properties.filter((p) => p.area && p.area.trim()).map((p) => p.area)),
  ].sort();

  // Add predefined areas to ensure all areas are available
  const allAreas = ['gurgaon','Gurgaon Faridabad Road','Dwarka Expressway'];
  const combinedAreas = [...new Set([...availableAreas, ...allAreas])];

  const filteredProperties = properties.filter((property) => {
    if (filterType !== 'all' && property.type.toLowerCase() !== filterType.toLowerCase()) {
      return false;
    }

    if (filterArea !== 'all') {
      const propertyArea = property.area?.toLowerCase() || 'gurgaon';
      if (propertyArea !== filterArea.toLowerCase()) {
        return false;
      }
    }

    return true;
  });

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.id - a.id; // Assuming higher ID means newer
      case 'oldest':
        return a.id - b.id;
      case 'name_asc':
        return a.title.localeCompare(b.title);
      case 'name_desc':
        return b.title.localeCompare(a.title);
      default:
        return b.id - a.id;
    }
  });

      const formatAreaName = (area?: string) => {
      if (!area) return ''; // or return area ?? '' if you want
      return area
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };


  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gold-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading luxury properties...</p>
        </div>
      </div>
    );
  }

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
                                  <button  onClick={() => navigate('/properties')} className={('px-3 py-2 text-sm font-medium cursor-pointer bg-navy-600 hover:bg-navy-700 text-white rounded-full font-semibold transform hover:scale-105')}>Properties</button>
                                  <button  onClick={() => navigate('/about')} className={('')}>About</button>
                                  <button  onClick={() => navigate('/blogs')} className={('')}>Blog</button>
                                  <button  onClick={() => navigate('/areas')} className={('')}>Areas</button>
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
      <div className="bg-off-white-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-navy-900 mb-6 font-serif">Premium Properties</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover exceptional properties from our exclusive portfolio in Gurgaon's luxury real estate market
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-off-white-50 border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-6 items-center justify-between">
            <div className="flex flex-wrap gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-navy-500 focus:border-navy-500 pr-8"
                >
                  <option value="all">All Types</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="flat">Flat</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="duplex">Duplex</option>
                  <option value="studio">Studio</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
                <select
                  value={filterArea}
                  onChange={(e) => setFilterArea(e.target.value)}
                  className="px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-navy-500 focus:border-navy-500 pr-8"
                >
                  <option value="all">All Areas</option>
                  {combinedAreas.map((area) => (
                    <option key={area} value={area}>
                      {formatAreaName(area)}
                    </option>
                  ))}
                </select>
              </div>
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-navy-500 focus:border-navy-500 pr-8"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name_asc">Name: A to Z</option>
                  <option value="name_desc">Name: Z to A</option>
                </select>
              </div> */}
            </div>
            <div className="flex items-end">
              <span className="text-gray-600 font-semibold">{sortedProperties.length} luxury properties found</span>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {sortedProperties.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedProperties.map((property) => (
                <div
                  key={property.id}
                  className="luxury-card bg-white rounded-2xl overflow-hidden border border-gray-200 cursor-pointer shadow-card"
                >
                  <div className="relative">
                    <img
                      alt={property.title}
                      className="w-full h-64 object-cover object-top"
                      src={property.custom_image instanceof File
                        ? URL.createObjectURL(property.custom_image)
                        : property.custom_image || ''}
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`${getStatusColor(property.status)} text-white px-4 py-2 rounded-full text-sm font-semibold`}>
                        {property.status}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-navy-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                        {property.type}
                      </span>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-semibold text-navy-900 mb-3 font-serif">{property.title}</h3>
                    <p className="text-gray-600 mb-6 flex items-center">
                      <i className="ri-map-pin-line mr-2 w-5 h-5 flex items-center justify-center text-navy-500"></i>
                      {property.location}
                      {property.area && (
                        <span className="ml-2 text-navy-500 font-medium">• {formatAreaName(property.area)}</span>
                      )}
                    </p>
                    <div className="bg-navy-100 border border-navy-300 rounded-lg p-4 mb-6">
                      <div className="flex items-center justify-center">
                        <i className="ri-phone-line text-navy-600 text-lg mr-2 w-5 h-5 flex items-center justify-center"></i>
                        <div className="text-lg font-bold text-navy-800 font-serif">Price on Call</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePropertyClick(property.id)}
                      className="w-full bg-navy-600 hover:bg-navy-700 text-white py-3 rounded-lg font-semibold whitespace-nowrap cursor-pointer transition-all shadow-lg"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ✅ Next Page Button */}
            {hasMore && (
              <div ref={loadMoreRef} className="text-center mt-12">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="px-6 py-3 bg-navy-600 hover:bg-navy-700 text-white rounded-lg font-semibold shadow-md disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Load More...'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-200">
              <i className="ri-home-4-line text-gray-400 text-3xl w-12 h-12 flex items-center justify-center"></i>
            </div>
            <h3 className="text-2xl font-semibold text-navy-900 mb-4">No Properties Found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {properties.length === 0
                ? 'Luxury properties will be showcased here once added to the portfolio.'
                : 'No properties match your current filters. Try adjusting your search criteria.'}
            </p>
            {properties.length === 0 && (
              <button
                onClick={() => navigate('/admin')}
                className="bg-navy-600 hover:bg-navy-700 text-white px-8 py-3 rounded-lg font-semibold whitespace-nowrap cursor-pointer transition-all shadow-lg"
              >
                Go to Admin Dashboard
              </button>
              
            )}
            {hasMore && (
              <div ref={loadMoreRef} className="text-center mt-12">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="px-6 py-3 bg-navy-600 hover:bg-navy-700 text-white rounded-lg font-semibold shadow-md disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Load More...'}
                </button>
              </div>
            )}
          </div>
          

        )}
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

export default Properties;
