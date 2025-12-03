
import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

const supabase = createClient(
  import.meta.env.VITE_PUBLIC_SUPABASE_URL,
  import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY
);

interface Property {
  id: number;
  title: string;
  location: string;
  full_address: string;
  type: string;
  status: string;
  description: string;
  bhk: number | string;
  baths: number | string;
  sqft: number | string;
  area?: string;
  created_at?: string;
  custom_image?: File | string | null;
  custom_image_2?: File | string | null;
  custom_image_3?: File | string | null;
}

const PropertyDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [_filterArea, setFilterArea] = useState(searchParams.get("area") || "all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [_isScrolled, setIsScrolled] = useState(false);
  const [, setCurrentPage] = useState("home");

  useEffect(() => {
    loadProperty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    const areaParam = searchParams.get("area");
    if (areaParam) {
      setFilterArea(areaParam);
    }
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    const observerOptions = { root: null, rootMargin: "0px", threshold: 0.5 };
    const sections = document.querySelectorAll("section");
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setCurrentPage(entry.target.id);
      });
    };
    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    sections.forEach((s) => observer.observe(s));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [searchParams]);

  // Improved loadProperty with better logging + graceful fallback
const loadProperty = async () => {
  if (!id) {
    console.error("No id param found in route, redirecting to /properties");
    navigate("/properties");
    return;
  }

  setLoading(true);
  try {
    const base = import.meta.env.VITE_PUBLIC_SUPABASE_URL || "";
    const session = await supabase.auth.getSession();
    const url = `${base}/functions/v1/get-properties?id=${encodeURIComponent(id)}`;

    console.log("[loadProperty] requesting", url);
    const res = await fetch(url,{ headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${session.data.session?.access_token}` } });

    // always try to parse JSON for diagnostics
    let json: any = null;
    try {
      json = await res.json();
    } catch (parseErr) {
      console.error("[loadProperty] failed to parse JSON response", parseErr);
    }

    // If response is not OK, log body and try list fallback
    if (!res.ok) {
      console.warn("[loadProperty] response not ok", res.status, json);
      // fallback: try fetching full list (older API behaviour)
      const listUrl = `${base}/functions/v1/manage-properties`;
      console.log("[loadProperty] fallback: requesting full list", listUrl);
      const listRes = await fetch(listUrl);
      const listJson = await listRes.json().catch(() => null);
      console.log("[loadProperty] list response:", listRes.status, listJson);
      const foundInList = listJson?.properties?.find((p: any) => String(p.id) === id);
      if (foundInList) {
        normalizeAndSet(foundInList);
        return;
      }
      // show server message if any
      const serverMessage = json?.error || json?.message || `Status ${res.status}`;
      console.error("[loadProperty] server returned error:", serverMessage);
      // don't throw generic; navigate back or show friendly message
      navigate("/properties");
      return;
    }

    // res.ok: try to locate a single property
    const prop = json?.property ?? (Array.isArray(json?.properties) ? json.properties.find((p: any) => String(p.id) === id) : null);

    if (!prop) {
      console.warn("[loadProperty] property missing in response:", json);
      // fallback to list as above
      const listUrl = `${base}/functions/v1/manage-properties`;
      const listRes = await fetch(listUrl);
      const listJson = await listRes.json().catch(() => null);
      const foundInList = listJson?.properties?.find((p: any) => String(p.id) === id);
      if (foundInList) {
        normalizeAndSet(foundInList);
        return;
      }
      // final fallback: log and redirect to properties
      console.error(`[loadProperty] Property with id=${id} not found after fallbacks.`);
      navigate("/properties");
      return;
    }

    // success
    normalizeAndSet(prop);
  } catch (error) {
    console.error("Error loading property:", error);
    navigate("/properties");
  } finally {
    setLoading(false);
  }
};


  const normalizeAndSet = (raw: any) => {
    // Convert numeric-ish fields to numbers if possible
    const bhkNum = raw.bhk ? Number(raw.bhk) : undefined;
    const bathsNum = raw.baths ? Number(raw.baths) : undefined;
    const sqftNum = raw.sqft ? Number(raw.sqft) : undefined;

    const normalized: Property = {
      ...raw,
      bhk: Number.isNaN(bhkNum) ? raw.bhk : bhkNum,
      baths: Number.isNaN(bathsNum) ? raw.baths : bathsNum,
      sqft: Number.isNaN(sqftNum) ? raw.sqft : sqftNum,
    };

    setProperty(normalized);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready-to-move":
        return "bg-blue-600";
      case "under-construction":
        return "bg-green-600";
      case "Fresh Booking":
        return "bg-purple-600";
      default:
        return "bg-gray-600";
    }
  };

  // robust image source resolver
  const resolveImageSrc = (img?: File | string | null) => {
    if (!img) return "";
    if (typeof img === "string") {
      // If it's a data URI or normal URL
      return img;
    }
    // if it's a File (local), create object URL
    try {
      return URL.createObjectURL(img);
    } catch {
      return "";
    }
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
            onClick={() => navigate("/properties")}
            className="btn-luxury text-white px-8 py-3 rounded-lg font-semibold cursor-pointer"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white-50">
      {/* -- NAV + mobile menu code kept identical to your original -- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 bg-off-white-500/95 backdrop-blur-sm shadow-lg `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0">
              <button onClick={() => { navigate("/"); }} className="flex items-center">
                <img src="/image.png" alt="Rajeev Mittal Logo" className="h-16 w-auto cursor-pointer" />
              </button>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <button onClick={() => navigate("/")} className={'home'}>Home</button>
                <button onClick={() => navigate("/properties")} className={'px-3 py-2 text-sm font-medium cursor-pointer bg-navy-600 hover:bg-navy-700 text-white rounded-full font-semibold transform hover:scale-105'}>Properties</button>
                <button onClick={() => navigate("/about")} className={''}>About</button>
                <button onClick={() => navigate("/blogs")} className={'blog'}>Blog</button>
                <button onClick={() => navigate("/areas")} className={''}>Areas</button>
              </div>
            </div>

            <div className="hidden md:block">
              <a href="https://wa.me/9811017103?text=Hi%2C%20I%27m%20interested%20in%20premium%20properties%20across%20Gurugram%20locations.%20Please%20share%20more%20details." target="_blank" rel="noopener noreferrer" className="bg-navy-500 hover:bg-off-white-500 text-off-white-300 hover:text-navy-500 px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 whitespace-nowrap cursor-pointer">
                Book Private Consultation
              </a>
            </div>

            <div className="md:hidden fixed top-4 right-4 z-50">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white cursor-pointer p-4 rounded-full transition-transform duration-300 transform hover:scale-105">
                <div className="w-6 h-1 bg-white mb-1"></div>
                <div className="w-6 h-1 bg-white mb-1"></div>
                <div className="w-6 h-1 bg-white mb-1"></div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar + overlay kept same as original */}
      <nav className="fixed top-0 left-0 right-0 bg-off-white-500 z-50 shadow-md">
        <div className={`fixed top-0 right-0 bottom-0 w-64 bg-off-white-700 shadow-lg z-40 transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}`}>
          <button onClick={() => setIsSidebarOpen(false)} className="absolute top-4 right-4 text-gray-700 hover:text-red-500 transition-colors" aria-label="Close Sidebar">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="w-64 flex flex-col items-center py-12 space-y-6">
            <HashLink smooth to="/#home" className="text-lg text-gray-900 hover:text-indigo-500" onClick={() => setIsSidebarOpen(false)}>Home</HashLink>
            <HashLink smooth to="/properties" className="text-lg text-gray-900 hover:text-indigo-500" onClick={() => setIsSidebarOpen(false)}>Properties</HashLink>
            <HashLink smooth to="/about" className="text-lg text-gray-900 hover:text-indigo-500" onClick={() => setIsSidebarOpen(false)}>About</HashLink>
            <HashLink smooth to="/blogs" className="text-lg text-gray-900 hover:text-indigo-500" onClick={() => setIsSidebarOpen(false)}>Blog</HashLink>
            <HashLink smooth to="/#testimonials" className="text-lg text-gray-900 hover:text-indigo-500" onClick={() => setIsSidebarOpen(false)}>Testimonials</HashLink>
            <HashLink smooth to="/#contact" className="text-lg text-gray-900 hover:text-indigo-500" onClick={() => setIsSidebarOpen(false)}>Contact</HashLink>
            <div className="px-6 pt-4">
              <a href="https://wa.me/9811017103?text=Hi%2C%20I%27m%20interested%20in%20premium%20properties%20across%20Gurugram%20locations.%20Please%20share%20more%20details." target="_blank" rel="noopener noreferrer" className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 block text-center">Book Private Consultation</a>
            </div>
          </div>
        </div>

        {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-50 z-30"></div>}
      </nav>

      {/* Breadcrumb */}
      <div className="bg-off-white-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 text-sm text-gray-500">
            <button onClick={() => navigate("/")} className="hover:text-navy-500 cursor-pointer transition-colors">Home</button>
            <i className="ri-arrow-right-s-line w-4 h-4 flex items-center justify-center"></i>
            <button onClick={() => navigate("/properties")} className="hover:text-navy-500 cursor-pointer transition-colors">Properties</button>
            <i className="ri-arrow-right-s-line w-4 h-4 flex items-center justify-center"></i>
            <span className="text-navy-500">{property.title}</span>
          </div>
        </div>
      </div>

      {/* Header + Images + Specs (kept your UI, only using resolveImageSrc) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-navy-900 mb-4 font-serif">{property.title}</h1>

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

        <div className="relative">
          <img
            alt={property.title}
            className="w-full max-h-[600px] object-contain rounded-lg bg-gray-50"
            src={resolveImageSrc(property.custom_image)}
          />
        </div>

        <div className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4"></div>
        </div>

        {/* Specs */}
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

        {/* About + Contact */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-navy-900 mb-6 font-serif">About Project</h2>
          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-gray-700 leading-relaxed">{property.description}</p>
          </div>

          <div className="flex justify-center">
            <a href="https://wa.me/9811017103?text=Hi%2C%20I%27m%20interested%20in%20premium%20properties%20across%20Gurugram%20locations.%20Please%20share%20more%20details." target="_blank" rel="noopener noreferrer" className="bg-green-500 hover:bg-green-600 text-white px-10 py-4 rounded-lg text-lg font-semibold whitespace-nowrap cursor-pointer transition-colors shadow-lg flex items-center">
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

export default PropertyDetail;