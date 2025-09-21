
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Property {
  id: number;
  title: string;
  location: string;
  full_address: string;
  type: string;
  status: string;
  bhk?: number;
  baths?: number;
  sqft?: number;
  image_url: string;
  area?: string;
  description: string;
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
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const predefinedAreas = [
    {
      name: 'Gurgaon',
      slug: 'gurgaon',
      description:
        'Premium residential and commercial properties in the millennium city, featuring luxury developments in Golf Course Road, Sector 54, and DLF phases.',
      heroImage:
        'https://readdy.ai/api/search-image?query=Modern%20luxury%20residential%20towers%20and%20commercial%20buildings%20in%20Gurgaon%20millennium%20city%20with%20wide%20roads%2C%20premium%20architecture%2C%20glass%20facades%2C%20landscaped%20gardens%2C%20and%20urban%20skyline%20during%20golden%20hour%2C%20professional%20real%20estate%20photography%20style%2C%20contemporary%20design%20elements&width=1200&height=400&seq=gurgaon-hero-001&orientation=landscape',
    },
    {
      name: 'Delhi',
      slug: 'delhi',
      description:
        'Exclusive properties in the heart of the capital, including luxury apartments, heritage homes, and premium commercial spaces in prime locations.',
      heroImage:
        'https://readdy.ai/api/search-image?query=Elegant%20luxury%20residential%20buildings%20and%20commercial%20properties%20in%20Delhi%20with%20mix%20of%20modern%20architecture%20and%20heritage%20elements%2C%20tree-lined%20streets%2C%20premium%20facades%2C%20professional%20real%20estate%20photography%20during%20sunset%2C%20sophisticated%20urban%20design&width=1200&height=400&seq=delhi-hero-001&orientation=landscape',
    },
    {
      name: 'Noida',
      slug: 'noida',
      description:
        'Contemporary living spaces and commercial hubs in the planned city, offering modern amenities and excellent connectivity to major business districts.',
      heroImage:
        'https://readdy.ai/api/search-image?query=Contemporary%20luxury%20residential%20and%20commercial%20developments%20in%20Noida%20planned%20city%20with%20modern%20glass%20towers%2C%20wide%20expressways%2C%20green%20landscaping%2C%20premium%20architecture%2C%20professional%20real%20estate%20photography%2C%20urban%20planning%20excellence&width=1200&height=400&seq=noida-hero-001&orientation=landscape',
    },
    {
      name: 'Faridabad',
      slug: 'faridabad',
      description:
        'Emerging luxury developments and industrial properties in the growing commercial hub, perfect for investment and residential purposes.',
      heroImage:
        'https://readdy.ai/api/search-image?query=Modern%20luxury%20residential%20complexes%20and%20commercial%20buildings%20in%20Faridabad%20with%20contemporary%20architecture%2C%20landscaped%20compounds%2C%20premium%20facilities%2C%20wide%20roads%2C%20professional%20real%20estate%20photography%20style%2C%20emerging%20urban%20development&width=1200&height=400&seq=faridabad-hero-001&orientation=landscape',
    },
    {
      name: 'Greater Noida',
      slug: 'greater-noida',
      description:
        'Planned infrastructure with luxury residential projects, educational institutions, and commercial developments offering excellent growth potential.',
      heroImage:
        'https://readdy.ai/api/search-image?query=Premium%20residential%20and%20commercial%20properties%20in%20Greater%20Noida%20with%20modern%20architecture%2C%20luxury%20developments%2C%20green%20spaces%2C%20contemporary%20design%2C%20professional%20real%20estate%20photography%20during%20golden%20hour%2C%20planned%20city%20infrastructure&width=1200&height=400&seq=greater-noida-hero-001&orientation=landscape',
    },
    {
      name: 'Other NCR',
      slug: 'other-ncr',
      description:
        'Premium properties across other NCR locations including Ghaziabad and emerging corridors with high growth potential.',
      heroImage:
        'https://readdy.ai/api/search-image?query=Premium%20residential%20and%20commercial%20properties%20across%20NCR%20region%20with%20modern%20architecture%2C%20luxury%20developments%2C%20green%20spaces%2C%20contemporary%20design%2C%20professional%20real%20estate%20photography%20during%20golden%20hour%2C%20diverse%20urban%20landscapes&width=1200&height=400&seq=ncr-other-hero-001&orientation=landscape',
    },
  ];

  useEffect(() => {
    fetchPropertiesByArea();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPropertiesByArea = async () => {
    try {
      console.log('Fetching properties by area...');
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/get-properties`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Properties loaded:', data.properties?.length || 0);

        // Group properties by area (fallback to 'other-ncr')
        const propertiesByArea = (data.properties || []).reduce(
          (acc: Record<string, Property[]>, property: Property) => {
            const areaKey = property.area?.toLowerCase() || 'other-ncr';
            if (!acc[areaKey]) acc[areaKey] = [];
            acc[areaKey].push(property);
            return acc;
          },
          {}
        );

        // Merge predefined areas with their properties
        const areasWithProperties = predefinedAreas.map((area) => ({
          ...area,
          properties: propertiesByArea[area.slug] || [],
        }));

        setAreasData(areasWithProperties);
      } else {
        console.error('Failed to load properties:', response.status, response.statusText);
        setAreasData(predefinedAreas.map((area) => ({ ...area, properties: [] })));
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      setAreasData(predefinedAreas.map((area) => ({ ...area, properties: [] })));
    } finally {
      setLoading(false);
    }
  };

  const handleViewAllProperties = (area: string) => {
    navigate(`/properties?area=${area}`);
  };

  const handlePropertyClick = (propertyId: number) => {
    navigate(`/property/${propertyId}`);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-navy-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading premium locations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="text-3xl font-bold text-navy-900 cursor-pointer font-serif"
              >
                Rajeev Mittal
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <button
                  onClick={() => navigate('/')}
                  className="text-gray-600 hover:text-navy-600 px-3 py-2 text-sm font-medium cursor-pointer transition-colors"
                >
                  Home
                </button>
                <a
                  href="/#about"
                  className="text-gray-600 hover:text-navy-600 px-3 py-2 text-sm font-medium cursor-pointer transition-colors"
                >
                  About
                </a>
                <button
                  onClick={() => navigate('/properties')}
                  className="text-gray-600 hover:text-navy-600 px-3 py-2 text-sm font-medium cursor-pointer transition-colors"
                >
                  Properties
                </button>
                <button
                  onClick={() => navigate('/areas')}
                  className="text-navy-600 hover:text-navy-800 px-3 py-2 text-sm font-medium cursor-pointer transition-colors"
                >
                  Areas
                </button>
                <button
                  onClick={() => navigate('/blogs')}
                  className="text-gray-600 hover:text-navy-600 px-3 py-2 text-sm font-medium cursor-pointer transition-colors"
                >
                  Blog
                </button>
                <a
                  href="/#contact"
                  className="text-gray-600 hover:text-navy-600 px-3 py-2 text-sm font-medium cursor-pointer transition-colors"
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
                <i className="ri-whatsapp-line text-white w-5 h-5 flex items-center justify-center" />
              </a>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden w-10 h-10 bg-navy-600 hover:bg-navy-700 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
              >
                <i
                  className={`ri-${mobileMenuOpen ? 'close' : 'menu'}-line text-white w-5 h-5 flex items-center justify-center`}
                />
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mobile-menu bg-white border-t border-gray-200">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <button
                  onClick={() => navigate('/')}
                  className="text-gray-600 hover:text-navy-600 block px-3 py-2 text-base font-medium cursor-pointer w-full text-left"
                >
                  Home
                </button>
                <a href="/#about" className="text-gray-600 hover:text-navy-600 block px-3 py-2 text-base font-medium cursor-pointer">
                  About
                </a>
                <button
                  onClick={() => navigate('/properties')}
                  className="text-gray-600 hover:text-navy-600 block px-3 py-2 text-base font-medium cursor-pointer w-full text-left"
                >
                  Properties
                </button>
                <button
                  onClick={() => navigate('/areas')}
                  className="text-navy-600 hover:text-navy-800 block px-3 py-2 text-base font-medium cursor-pointer w-full text-left"
                >
                  Areas
                </button>
                <button
                  onClick={() => navigate('/blogs')}
                  className="text-gray-600 hover:text-navy-600 block px-3 py-2 text-base font-medium cursor-pointer w-full text-left"
                >
                  Blog
                </button>
                <a href="/#contact" className="text-gray-600 hover:text-navy-600 block px-3 py-2 text-base font-medium cursor-pointer">
                  Contact
                </a>
              </div>
            </div>
          )}
        </div>
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
              {area.properties.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12" data-product-shop>
                  {area.properties.slice(0, 6).map((property) => (
                    <div
                      key={property.id}
                      className="bg-white rounded-2xl overflow-hidden border border-gray-200 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                      onClick={() => handlePropertyClick(property.id)}
                    >
                      <div className="relative">
                        <img
                          src={property.image_url}
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
                        </p>

                        {/* Price on Call Card */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                          <div className="flex items-center justify-center">
                            <i className="ri-phone-line text-navy-600 text-lg mr-2 w-5 h-5 flex items-center justify-center" />
                            <div className="text-lg font-bold text-navy-800 font-serif">Price on Call</div>
                          </div>
                        </div>

                        {(property.bhk || property.baths || property.sqft) && (
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
                        )}

                        {/* View Details Button */}
                        <button
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
              )}

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
            <button
              onClick={() => navigate('/contact')}
              className="bg-navy-600 hover:bg-navy-700 text-white px-8 py-3 rounded-md font-semibold transition-colors"
            >
              Get In Touch
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-navy-900 text-white py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="col-span-2">
              <h3 className="text-2xl font-bold text-navy-900 mb-6 font-serif">Rajeev Mittal</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Expert real estate guidance with personalized service for buyers and sellers in Gurgaon's premium market since
                1990.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://wa.me/9811017103"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center cursor-pointer transition-all"
                >
                  <i className="ri-whatsapp-line w-5 h-5 flex items-center justify-center" />
                </a>
                <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-navy-600 rounded-full flex items-center justify-center cursor-pointer transition-all"
                >
                  <i className="ri-linkedin-fill text-gray-400 w-5 h-5 flex items-center justify-center" />
                </a>
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-navy-600 rounded-full flex items-center justify-center cursor-pointer transition-all"
                >
                  <i className="ri-instagram-fill text-gray-400 w-5 h-5 flex items-center justify-center" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6 text-navy-400">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => navigate('/')}
                    className="text-gray-300 hover:text-navy-400 cursor-pointer transition-colors"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <a href="/#about" className="text-gray-300 hover:text-navy-400 cursor-pointer transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/properties')}
                    className="text-gray-300 hover:text-navy-400 cursor-pointer transition-colors"
                  >
                    Properties
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/areas')}
                    className="text-gray-300 hover:text-navy-400 cursor-pointer transition-colors"
                  >
                    Areas
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/blogs')}
                    className="text-gray-300 hover:text-navy-400 cursor-pointer transition-colors"
                  >
                    Blog
                  </button>
                </li>
                <li>
                  <a href="/#contact" className="text-gray-300 hover:text-navy-400 cursor-pointer transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="https://readdy.ai/?origin=logo" className="text-gray-300 hover:text-navy-400 cursor-pointer transition-colors">
                    Made with Readdy
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6 text-navy-400">Services</h4>
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
            <p className="text-gray-300 mb-4 md:mb-0">© 2024 Real Estate Company. All rights reserved.</p>
            <a href="https://readdy.ai/?origin=logo" className="text-navy-400 hover:text-navy-300 cursor-pointer transition-colors">
              Made with Readdy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Areas;
