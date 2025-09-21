import  { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      <nav className="fixed w-full z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <button onClick={() => navigate('/')} className="text-3xl font-bold bg-gradient-to-r from-[#F59E0B] to-[#d97706] bg-clip-text text-transparent font-serif cursor-pointer">
                Rajeev Mittal
              </button>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <button onClick={() => navigate('/')} className="text-gray-300 hover:text-[#F59E0B] px-3 py-2 text-sm font-medium cursor-pointer transition-colors">Home</button>
                <button onClick={() => navigate('/properties')} className="text-gray-300 hover:text-[#F59E0B] px-3 py-2 text-sm font-medium cursor-pointer transition-colors">Properties</button>
                <a href="/#services" className="text-gray-300 hover:text-[#F59E0B] px-3 py-2 text-sm font-medium cursor-pointer transition-colors">Services</a>
                <button onClick={() => navigate('/blogs')} className="text-[#F59E0B] px-3 py-2 text-sm font-medium cursor-pointer transition-colors">Blog</button>
                <a href="/#contact" className="text-gray-300 hover:text-[#F59E0B] px-3 py-2 text-sm font-medium cursor-pointer transition-colors">Contact</a>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <a href="https://wa.me/9811017103" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center cursor-pointer transition-colors">
                <i className="ri-whatsapp-line text-white w-5 h-5 flex items-center justify-center"></i>
              </a>
              
              {/* Mobile menu button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden w-10 h-10 bg-[#F59E0B] hover:bg-[#d97706] rounded-lg flex items-center justify-center cursor-pointer transition-colors"
              >
                <i className={`ri-${mobileMenuOpen ? 'close' : 'menu'}-line text-white w-5 h-5 flex items-center justify-center`}></i>
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mobile-menu bg-gray-900 border-t border-gray-800">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <button onClick={() => navigate('/')} className="text-gray-300 hover:text-[#F59E0B] block px-3 py-2 text-base font-medium cursor-pointer w-full text-left">Home</button>
                <button onClick={() => navigate('/properties')} className="text-gray-300 hover:text-[#F59E0B] block px-3 py-2 text-base font-medium cursor-pointer w-full text-left">Properties</button>
                <a href="/#services" className="text-gray-300 hover:text-[#F59E0B] block px-3 py-2 text-base font-medium cursor-pointer">Services</a>
                <button onClick={() => navigate('/blogs')} className="text-[#F59E0B] block px-3 py-2 text-base font-medium cursor-pointer w-full text-left">Blog</button>
                <a href="/#contact" className="text-gray-300 hover:text-[#F59E0B] block px-3 py-2 text-base font-medium cursor-pointer">Contact</a>
              </div>
            </div>
          )}
        </div>
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
      <section className="py-20 bg-gray-900">
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
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-[#F59E0B] to-[#d97706] bg-clip-text text-transparent mb-6 font-serif">Rajeev Mittal</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Expert real estate guidance with personalized service for buyers and sellers in Gurgaon's premium market.
              </p>
              <div className="flex space-x-4">
                <a href="https://www.instagram.com/rajeev_mittal_6?igsh=ZnFqMTd1aXB0aXo1" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-[#F59E0B] rounded-full flex items-center justify-center cursor-pointer transition-all group">
                  <i className="ri-instagram-line text-gray-400 group-hover:text-white w-5 h-5 flex items-center justify-center"></i>
                </a>
                <a href="https://www.linkedin.com/in/rajeev-mittal-47b51a33?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-[#F59E0B] rounded-full flex items-center justify-center cursor-pointer transition-all group">
                  <i className="ri-linkedin-fill text-gray-400 group-hover:text-white w-5 h-5 flex items-center justify-center"></i>
                </a>
                <a href="https://wa.me/9811017103" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center cursor-pointer transition-all">
                  <i className="ri-whatsapp-line text-white w-5 h-5 flex items-center justify-center"></i>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6 text-[#F59E0B]">Quick Links</h4>
              <ul className="space-y-3 text-gray-300">
                <li><button onClick={() => navigate('/')} className="hover:text-[#F59E0B] cursor-pointer transition-colors">Home</button></li>
                <li><button onClick={() => navigate('/properties')} className="hover:text-[#F59E0B] cursor-pointer transition-colors">Properties</button></li>
                <li><a href="/#services" className="hover:text-[#F59E0B] cursor-pointer transition-colors">Services</a></li>
                <li><button onClick={() => navigate('/blogs')} className="hover:text-[#F59E0B] cursor-pointer transition-colors">Blog</button></li>
                <li><a href="/#contact" className="hover:text-[#F59E0B] cursor-pointer transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6 text-[#F59E0B]">Services</h4>
              <ul className="space-y-3 text-gray-300">
                <li>Home Buying</li>
                <li>Home Selling</li>
                <li>Investment Properties</li>
                <li>Market Analysis</li>
                <li>Consultation</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6 text-[#F59E0B]">Contact Info</h4>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-center">
                  <i className="ri-phone-line mr-3 text-[#F59E0B] w-4 h-4 flex items-center justify-center"></i>
                  (+91) 9811017103
                </li>
                <li className="flex items-center">
                  <i className="ri-mail-line mr-3 text-[#F59E0B] w-4 h-4 flex items-center justify-center"></i>
                  rajeevmittal_dlf@hotmail.com
                </li>
                <li className="flex items-start">
                  <i className="ri-map-pin-line mr-3 text-[#F59E0B] w-4 h-4 flex items-center justify-center mt-1"></i>
                  <span>123, DLF Qutub Plaza, DLF City-1<br />Gurugram, (Hry) 122002</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">RAJEEV MITTAL ESTATES PVT.LTD. All rights reserved.<br />Rera Approved - Registration Number GGM/107/2017/1R/140/Ext1/2022/2021</p>
            <a href="https://readdy.ai/?origin=logo" className="text-[#F59E0B] hover:text-[#d97706] cursor-pointer transition-colors">
              Made with Readdy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlogDetailPage;