import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  author: string;
  status: string;
  featured: boolean;
  tags: string[];
  meta_description: string;
  read_time: number;
  created_at: string;
  updated_at: string;
}

const BlogsPage = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [featuredBlogs, setFeaturedBlogs] = useState<Blog[]>([]);
  // const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  //     const [filterType, setFilterType] = useState('all');
      const [searchParams] = useSearchParams();
        const [_filterArea, setFilterArea] = useState(searchParams.get('area') || 'all');
        const [isSidebarOpen, setIsSidebarOpen] = useState(false);
        const [_isScrolled, setIsScrolled] = useState(false); // To track scroll state
      const [_currentPage, setCurrentPage] = useState('home'); // Track the current page
      const handleLinkClick = () => {
        setIsSidebarOpen(false); // Close the sidebar when a link is clicked
      };

  useEffect(() => {
    loadBlogs();
  }, []);

  useEffect(() => {
    filterBlogs();
  }, [blogs, searchTerm, selectedTag]);

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

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/manage-blogs?public=true`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        const blogList = data.blogs || [];
        setBlogs(blogList);
        setFeaturedBlogs(blogList.filter((blog: Blog) => blog.featured).slice(0, 3));
        
        // Extract unique tags
        const tags: string[] = [
          ...new Set(
            blogList.flatMap((blog: Blog) => blog.tags || [])
          )
        ].filter(Boolean) as string[];

        setAllTags(tags);
      }
    } catch (error) {
      console.error('Error loading blogs:', error);
      setBlogs([]);
      setFeaturedBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const filterBlogs = () => {
    let filtered = blogs;

    if (searchTerm) {
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedTag) {
      filtered = filtered.filter(blog => blog.tags?.includes(selectedTag));
    }

    setFilteredBlogs(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleBlogClick = (slug: string) => {
    navigate(`/blog/${slug}`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTag('');
  };

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
                            <button  onClick={() => navigate('/about')} className={('')}>About</button>
                            <button  onClick={() => navigate('/blogs')} className={('px-3 py-2 text-sm font-medium cursor-pointer bg-navy-600 hover:bg-navy-700 text-white rounded-full font-semibold transform hover:scale-105')}>Blog</button>
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
            

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 font-serif">
            Real Estate <span className="text-[#F59E0B]">Insights</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Stay informed with expert analysis, market trends, and valuable insights from Gurgaon's premium real estate market
          </p>
          
          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#F59E0B] focus:border-[#F59E0B] text-lg"
                />
                <i className="ri-search-line absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 flex items-center justify-center"></i>
              </div>
              <div className="md:w-64">
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#F59E0B] focus:border-[#F59E0B] text-lg pr-8"
                >
                  <option value="">All Categories</option>
                  {allTags.map((tag) => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {(searchTerm || selectedTag) && (
              <div className="flex items-center justify-center gap-4 mb-8">
                <span className="text-gray-300">
                  Found {filteredBlogs.length} article{filteredBlogs.length !== 1 ? 's' : ''}
                </span>
                <button
                  onClick={clearFilters}
                  className="text-[#F59E0B] hover:text-[#d97706] cursor-pointer transition-colors"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Blogs */}
      {featuredBlogs.length > 0 && !searchTerm && !selectedTag && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4 font-serif">Featured Articles</h2>
              <p className="text-xl text-gray-600">Hand-picked insights from our latest content</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {featuredBlogs.map((blog) => (
                <article 
                  key={blog.id} 
                  onClick={() => handleBlogClick(blog.slug)}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer group border border-gray-200"
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={blog.featured_image} 
                      alt={blog.title}
                      className="w-full h-64 object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#F59E0B] text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                      </span>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <span>{formatDate(blog.created_at)}</span>
                      <span className="mx-2">•</span>
                      <span>{blog.read_time} min read</span>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4 font-serif group-hover:text-[#F59E0B] transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{blog.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">By {blog.author}</span>
                      <span className="text-[#F59E0B] font-semibold group-hover:text-[#d97706] transition-colors">
                        Read More <i className="ri-arrow-right-line ml-1 w-4 h-4 flex items-center justify-center inline-flex"></i>
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Blogs */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-serif">
              {searchTerm || selectedTag ? 'Search Results' : 'Latest Articles'}
            </h2>
            <p className="text-xl text-gray-600">
              {searchTerm || selectedTag ? 
                `Showing results for your search criteria` : 
                'Comprehensive insights and expert analysis on real estate'
              }
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#F59E0B] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading articles...</p>
            </div>
          ) : filteredBlogs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog) => (
                <article 
                  key={blog.id}
                  onClick={() => handleBlogClick(blog.slug)}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer group border border-gray-200"
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={blog.featured_image} 
                      alt={blog.title}
                      className="w-full h-56 object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    />
                    {blog.featured && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-[#F59E0B] text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span>{formatDate(blog.created_at)}</span>
                      <span className="mx-2">•</span>
                      <span>{blog.read_time} min read</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 font-serif group-hover:text-[#F59E0B] transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">{blog.excerpt}</p>
                    
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {blog.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                        {blog.tags.length > 2 && (
                          <span className="text-gray-500 text-xs">+{blog.tags.length - 2} more</span>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">By {blog.author}</span>
                      <span className="text-[#F59E0B] font-semibold group-hover:text-[#d97706] transition-colors">
                        Read More <i className="ri-arrow-right-line ml-1 w-4 h-4 flex items-center justify-center inline-flex"></i>
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-200">
                <i className="ri-article-line text-gray-400 text-3xl w-12 h-12 flex items-center justify-center"></i>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Articles Found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {searchTerm || selectedTag ? 
                  'No articles match your current search criteria. Try adjusting your filters.' :
                  'No articles have been published yet. Check back soon for fresh insights.'
                }
              </p>
              {(searchTerm || selectedTag) && (
                <button
                  onClick={clearFilters}
                  className="bg-[#F59E0B] hover:bg-[#d97706] text-white px-6 py-3 rounded-lg font-semibold cursor-pointer transition-colors"
                >
                  View All Articles
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      {/* <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6 font-serif">Stay Updated</h2>
          <p className="text-xl text-gray-300 mb-8">
            Get the latest real estate insights and market updates delivered to your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email"
              className="flex-1 px-6 py-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#F59E0B] focus:border-[#F59E0B]" 
              placeholder="Your email address"
            />
            <button className="bg-[#F59E0B] hover:bg-[#d97706] text-white px-8 py-4 rounded-lg font-semibold whitespace-nowrap cursor-pointer transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section> */}

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

export default BlogsPage;