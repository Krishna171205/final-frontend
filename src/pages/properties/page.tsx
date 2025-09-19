
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

const Properties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [filterArea, setFilterArea] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('price_desc');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/get-properties`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProperties(data.properties || []);
      } else {
        setProperties([]);
      }
    } catch (error) {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'For Sale':
        return 'bg-blue-600';
      case 'For Rent':
        return 'bg-green-600';
      case 'Investment':
        return 'bg-purple-600';
      default:
        return 'bg-gray-600';
    }
  };

  const formatPrice = (price: number, isRental: boolean = false) => {
    if (isRental) {
      return `₹${price.toLocaleString()}/mo`;
    }
    return `₹${price.toLocaleString()}`;
  };

  const handlePropertyClick = (propertyId: number) => {
    navigate(`/property/${propertyId}`);
  };

  // Generate dynamic area options from actual properties
  const availableAreas = [
    ...new Set(properties.filter((p) => p.area && p.area.trim()).map((p) => p.area)),
  ].sort();

  const filteredProperties = properties.filter((property) => {
    if (filterType !== 'all' && property.type.toLowerCase() !== filterType.toLowerCase()) {
      return false;
    }

    if (filterArea !== 'all' && property.area && property.area.toLowerCase() !== filterArea.toLowerCase()) {
      return false;
    }

    if (priceRange !== 'all') {
      const price = property.is_rental ? property.price * 12 : property.price;
      switch (priceRange) {
        case 'under_1m':
          return price < 10_000_000;
        case '1m_3m':
          return price >= 10_000_000 && price <= 30_000_000;
        case 'over_3m':
          return price > 30_000_000;
        default:
          return true;
      }
    }

    return true;
  });

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    const aPrice = a.is_rental ? a.price * 12 : a.price;
    const bPrice = b.is_rental ? b.price * 12 : b.price;

    switch (sortBy) {
      case 'price_asc':
        return aPrice - bPrice;
      case 'price_desc':
        return bPrice - aPrice;
      default:
        return bPrice - aPrice;
    }
  });

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
      <nav className="bg-gray-900/95 backdrop-blur-md shadow-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="text-3xl font-bold bg-gold-gradient bg-clip-text text-transparent cursor-pointer font-serif"
              >
                Rajeev Mittal
              </button>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <button
                  onClick={() => navigate('/')}
                  className="text-gray-300 hover:text-gold-300 px-3 py-2 text-sm font-medium cursor-pointer transition-colors"
                >
                  Home
                </button>
                <a
                  href="/#about"
                  className="text-gray-300 hover:text-gold-300 px-3 py-2 text-sm font-medium cursor-pointer transition-colors"
                >
                  About
                </a>
                <button
                  onClick={() => navigate('/properties')}
                  className="text-gold-400 hover:text-gold-300 px-3 py-2 text-sm font-medium cursor-pointer transition-colors"
                >
                  Properties
                </button>
                <a
                  href="/#services"
                  className="text-gray-300 hover:text-gold-300 px-3 py-2 text-sm font-medium cursor-pointer transition-colors"
                >
                  Services
                </a>
                <a
                  href="/#contact"
                  className="text-gray-300 hover=text-gold-300 px-3 py-2 text-sm font-medium cursor-pointer transition-colors"
                >
                  Contact
                </a>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <a
                href="https://wa.me/9811017103"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center cursor-pointer transition-colors"
              >
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
                <a href="/#about" className="text-gray-300 hover:text-gold-300 block px-3 py-2 text-base font-medium cursor-pointer">About</a>
                <button onClick={() => navigate('/properties')} className="text-gold-400 hover:text-gold-300 block px-3 py-2 text-base font-medium cursor-pointer w-full text-left">Properties</button>
                <a href="/#services" className="text-gray-300 hover:text-gold-300 block px-3 py-2 text-base font-medium cursor-pointer">Services</a>
                <a href="/#contact" className="text-gray-300 hover:text-gold-300 block px-3 py-2 text-base font-medium cursor-pointer">Contact</a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 font-serif gold-accent">Premium Properties</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover exceptional properties from our exclusive portfolio in Gurgaon's luxury real estate market
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 border-b border-gray-200 py-8">
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
                  className="px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 pr-8"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area
                </label>
                <select
                  value={filterArea}
                  onChange={(e) => setFilterArea(e.target.value)}
                  className="px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 pr-8"
                >
                  <option value="all">All Areas</option>
                  {availableAreas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 pr-8"
                >
                  <option value="all">All Prices</option>
                  <option value="under_1m">Under ₹1 Crore</option>
                  <option value="1m_3m">₹1 Crore - ₹3 Crore</option>
                  <option value="over_3m">Over ₹3 Crore</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 pr-8"
                >
                  <option value="price_desc">Price: High to Low</option>
                  <option value="price_asc">Price: Low to High</option>
                </select>
              </div>
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-product-shop>
            {sortedProperties.map((property) => (
              <div
                key={property.id}
                className="luxury-card bg-white rounded-2xl overflow-hidden border border-gray-200 cursor-pointer shadow-card"
              >
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
                    {property.area && (
                      <span className="ml-2 text-gold-500 font-medium">• {property.area}</span>
                    )}
                  </p>
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-3xl font-bold text-gray-900 font-serif">
                      {formatPrice(property.price, property.is_rental)}
                    </div>
                  </div>
                  <button
                    onClick={() => handlePropertyClick(property.id)}
                    className="w-full btn-luxury text-white py-3 rounded-lg font-semibold whitespace-nowrap cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-200">
              <i className="ri-home-4-line text-gray-400 text-3xl w-12 h-12 flex items-center justify-center"></i>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Properties Found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {properties.length === 0
                ? 'Luxury properties will be showcased here once added to the portfolio.'
                : 'No properties match your current filters. Try adjusting your search criteria.'}
            </p>
            {properties.length === 0 && (
              <button
                onClick={() => navigate('/admin')}
                className="btn-luxury text-white px-8 py-3 rounded-lg font-semibold whitespace-nowrap cursor-pointer"
              >
                Go to Admin Dashboard
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="col-span-2">
              <h3 className="text-2xl font-bold bg-gold-gradient bg-clip-text text-transparent mb-6 font-serif">Rajeev Mittal</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Expert real estate guidance with personalized service for buyers and sellers in Gurgaon's premium market since 1990.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://wa.me/9811017103"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center cursor-pointer transition-all"
                >
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
                <li>
                  <button onClick={() => navigate('/')} className="text-gray-300 hover:text-gold-300 cursor-pointer transition-colors">
                    Home
                  </button>
                </li>
                <li>
                  <a href="/#about" className="text-gray-300 hover:text-gold-300 cursor-pointer transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="/#services" className="text-gray-300 hover:text-gold-300 cursor-pointer transition-colors">
                    Services
                  </a>
                </li>
                <li>
                  <button onClick={() => navigate('/properties')} className="text-gray-300 hover:text-gold-300 cursor-pointer transition-colors">
                    Properties
                  </button>
                </li>
                <li>
                  <a href="/#contact" className="text-gray-300 hover:text-gold-300 cursor-pointer transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="https://readdy.ai/?origin=logo" className="text-gray-300 hover:text-gold-300 cursor-pointer transition-colors">
                    Made with Readdy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6 text-gold-400">Services</h4>
              <ul className="space-y-3">
                <li>
                  <span className="text-gray-300">Home Buying</span>
                </li>
                <li>
                  <span className="text-gray-300">Home Selling</span>
                </li>
                <li>
                  <span className="text-gray-300">Investment Properties</span>
                </li>
                <li>
                  <span className="text-gray-300">Premium Projects</span>  
                </li>
                <li>
                  <span className="text-gray-300">Corporate Services</span>
                </li>
                <li>
                  <span className="text-gray-300">Consultation</span>
                </li>
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

export default Properties;
