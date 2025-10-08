import  { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

const BlogDetailPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  // const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleLinkClick = () => {
      setIsSidebarOpen(false); // Close the sidebar when a link is clicked
    };

  useEffect(() => {
    if (slug) {
      loadBlog();
      loadRelatedBlogs();
    }
  }, [slug]);

  const loadBlog = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/manage-blogs?public=true&slug=${slug}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.blog) {
          setBlog(data.blog);
          // Update document title and meta description
          document.title = `${data.blog.title} - Rajeev Mittal Real Estate`;
          const metaDescription = document.querySelector('meta[name="description"]');
          if (metaDescription) {
            metaDescription.setAttribute('content', data.blog.meta_description || data.blog.excerpt);
          }
        } else {
          setError(true);
        }
      } else {
        setError(true);
      }
    } catch (error) {
      console.error('Error loading blog:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedBlogs = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/manage-blogs?public=true`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        const allBlogs = data.blogs || [];
        // Get 3 random blogs excluding the current one
        const filtered = allBlogs.filter((b: Blog) => b.slug !== slug);
        const shuffled = filtered.sort(() => 0.5 - Math.random());
        setRelatedBlogs(shuffled.slice(0, 3));
      }
    } catch (error) {
      console.error('Error loading related blogs:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  const formatContent = (content: string) => {
    // Simple formatting for paragraphs
    return content.split('\n').map((paragraph, index) => {
      if (paragraph.trim()) {
        return (
          <p key={index} className="mb-6 text-lg leading-relaxed text-gray-700">
            {paragraph.trim()}
          </p>
        );
      }
      return null;
    });
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = blog?.title || '';
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#F59E0B] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <i className="ri-article-line text-gray-400 text-3xl w-12 h-12 flex items-center justify-center"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-8">The article you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate('/blogs')}
            className="bg-[#F59E0B] hover:bg-[#d97706] text-white px-6 py-3 rounded-lg font-semibold cursor-pointer transition-colors"
          >
            View All Articles
          </button>
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
      

      {/* Breadcrumb */}
      <section className="pt-32 pb-8 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <button onClick={() => navigate('/')} className="hover:text-[#F59E0B] cursor-pointer transition-colors">Home</button>
            <i className="ri-arrow-right-s-line w-4 h-4 flex items-center justify-center"></i>
            <button onClick={() => navigate('/blogs')} className="hover:text-[#F59E0B] cursor-pointer transition-colors">Blog</button>
            <i className="ri-arrow-right-s-line w-4 h-4 flex items-center justify-center"></i>
            <span className="text-gray-400 truncate">{blog.title}</span>
          </nav>
        </div>
      </section>

      {/* Article Header */}
      <section className="pb-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            {blog.featured && (
              <span className="inline-block bg-[#F59E0B] text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
                Featured Article
              </span>
            )}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-serif leading-tight">
              {blog.title}
            </h1>
            <div className="flex items-center justify-center space-x-6 text-gray-600 mb-8">
              <div className="flex items-center">
                <i className="ri-user-line mr-2 w-4 h-4 flex items-center justify-center"></i>
                <span>{blog.author}</span>
              </div>
              <div className="flex items-center">
                <i className="ri-calendar-line mr-2 w-4 h-4 flex items-center justify-center"></i>
                <span>{formatDate(blog.created_at)}</span>
              </div>
              <div className="flex items-center">
                <i className="ri-time-line mr-2 w-4 h-4 flex items-center justify-center"></i>
                <span>{blog.read_time} min read</span>
              </div>
            </div>
            
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {blog.tags.map((tag) => (
                  <span key={tag} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Share Buttons */}
            <div className="flex items-center justify-center gap-4">
              <span className="text-gray-600 font-medium">Share:</span>
              <button 
                onClick={() => handleShare('twitter')}
                className="w-10 h-10 bg-blue-400 hover:bg-blue-500 text-white rounded-full flex items-center justify-center cursor-pointer transition-colors"
              >
                <i className="ri-twitter-line w-4 h-4 flex items-center justify-center"></i>
              </button>
              <button 
                onClick={() => handleShare('facebook')}
                className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center cursor-pointer transition-colors"
              >
                <i className="ri-facebook-line w-4 h-4 flex items-center justify-center"></i>
              </button>
              <button 
                onClick={() => handleShare('linkedin')}
                className="w-10 h-10 bg-blue-700 hover:bg-blue-800 text-white rounded-full flex items-center justify-center cursor-pointer transition-colors"
              >
                <i className="ri-linkedin-line w-4 h-4 flex items-center justify-center"></i>
              </button>
              <button 
                onClick={() => handleShare('whatsapp')}
                className="w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center cursor-pointer transition-colors"
              >
                <i className="ri-whatsapp-line w-4 h-4 flex items-center justify-center"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src={blog.featured_image} 
              alt={blog.title}
              className="w-full h-96 md:h-[500px] object-cover object-top"
            />
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            {formatContent(blog.content)}
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedBlogs.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4 font-serif">Related Articles</h2>
              <p className="text-xl text-gray-600">Continue exploring our real estate insights</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {relatedBlogs.map((relatedBlog) => (
                <article 
                  key={relatedBlog.id}
                  onClick={() => navigate(`/blog/${relatedBlog.slug}`)}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer group border border-gray-200"
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={relatedBlog.featured_image} 
                      alt={relatedBlog.title}
                      className="w-full h-48 object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    />
                    {relatedBlog.featured && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-[#F59E0B] text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span>{formatDate(relatedBlog.created_at)}</span>
                      <span className="mx-2">•</span>
                      <span>{relatedBlog.read_time} min read</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 font-serif group-hover:text-[#F59E0B] transition-colors line-clamp-2">
                      {relatedBlog.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">{relatedBlog.excerpt}</p>
                    <span className="text-[#F59E0B] font-semibold group-hover:text-[#d97706] transition-colors">
                      Read More <i className="ri-arrow-right-line ml-1 w-4 h-4 flex items-center justify-center inline-flex"></i>
                    </span>
                  </div>
                </article>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <button 
                onClick={() => navigate('/blogs')}
                className="bg-[#F59E0B] hover:bg-[#d97706] text-white px-8 py-4 rounded-lg font-semibold cursor-pointer transition-colors"
              >
                View All Articles
              </button>
            </div>
          </div>
        </section>
      )}

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

export default BlogDetailPage;