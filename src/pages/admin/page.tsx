
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

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
  bhk: number;
  baths: number;
  sqft: number;
  area?: string;
  created_at: string;
  custom_image: File | string | null;
  custom_image_2: File | string | null;
  custom_image_3: File | string | null;
}

interface Consultation {
  id: number;
  name: string;
  email: string;
  phone: string;
  preferred_date: string;
  preferred_time: string;
  service_type: string;
  message: string;
  status: 'pending' | 'confirmed' | 'completed';
  created_at: string;
}

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
  custom_image?: File | string | null;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [_user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('properties');
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [showEditProperty, setShowEditProperty] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [properties, setProperties] = useState<Property[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const [newProperty, setNewProperty] = useState({
    title: '',
    location: '',
    full_address: '',
    type: 'House',
    status: 'ready-to-move',
    description: '',
    bhk: 1,
    baths: 1,
    sqft: 1000,
    area: '',
    custom_image: null as File | null,  // explicitly defining the type as `File | null`
    custom_image_2: null as File | null,
    custom_image_3: null as File | null,
  });

  const [_editingProperty, _setEditingProperty] = useState<Property | null>(null);

  const [newBlog, setNewBlog] = useState<Partial<Blog>>({
    title: '',
    excerpt: '',
    content: '',
    author: 'Rajeev Mittal',
    status: 'published',
    featured: false,
    tags: [],
    meta_description: '',
    custom_image: null
  });

  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [showAddBlog, setShowAddBlog] = useState(false);
  const [showEditBlog, setShowEditBlog] = useState(false);
  const [blogImagePreview, setBlogImagePreview] = useState<string | null>(null);
  const [editBlogImagePreview, setEditBlogImagePreview] = useState<string | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imagePreview2, setImagePreview2] = useState<string | null>(null);
  const [imagePreview3, setImagePreview3] = useState<string | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [editImagePreview2, setEditImagePreview2] = useState<string | null>(null);
  const [editImagePreview3, setEditImagePreview3] = useState<string | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Redirect to login page if not authenticated
        navigate('/admin/login');
        return;
      }
      
      setUser(user);
      loadData();
    } catch (error) {
      console.error('Auth error:', error);
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    await Promise.all([loadProperties(), loadConsultations(), loadBlogs()]);
  };

  const loadProperties = async () => {
    try {
      console.log('Loading properties from database...')
      const session = await supabase.auth.getSession();
      
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/manage-properties`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.data.session?.access_token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Properties loaded:', data);
        setProperties(data.properties || []);
      } else {
        console.error('Failed to load properties:', response.status, response.statusText);
        const errorData = await response.text();
        console.error('Error details:', errorData);
        setProperties([]);
      }
    } catch (error) {
      console.error('Error loading properties:', error);
      setProperties([]);
    }
  };

  const loadConsultations = async () => {
    try {
      console.log('Loading consultations from database...')
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/manage-consultations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Consultations loaded:', data);
        setConsultations(data.consultations || []);
      } else {
        console.error('Failed to load consultations:', response.status, response.statusText);
        setConsultations([]);
      }
    } catch (error) {
      console.error('Error loading consultations:', error);
      setConsultations([]);
    }
  };

  const loadBlogs = async () => {
    try {
      console.log('Loading blogs from database...')
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/manage-blogs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Blogs loaded:', data);
        setBlogs(data.blogs || []);
      } else {
        console.error('Failed to load blogs:', response.status, response.statusText);
        setBlogs([]);
      }
    } catch (error) {
      console.error('Error loading blogs:', error);
      setBlogs([]);
    }
  };

  const handleImageUpload = (
  e: React.ChangeEvent<HTMLInputElement>,
  imageIndex: number,
  isEdit: boolean = false
) => {
  const file = e.target.files?.[0];  // Ensure we're getting the first file
  if (!file) {
    alert("No file selected");
    return;
  }
  if (!file.type.startsWith('image/')) {
    alert('Please select a valid image file');
    return;
  }
  if (file.size > 5 * 1024 * 1024) { // 5MB size limit
    alert('Image size must be less than 5MB');
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    const result = event.target?.result as string;
    
    if (isEdit && selectedProperty) {
      // Handle editing of images for existing property
      if (imageIndex === 1) {
        setEditImagePreview(result);
        setSelectedProperty({ ...selectedProperty, custom_image: file });
      } else if (imageIndex === 2) {
        setEditImagePreview2(result);
        setSelectedProperty({ ...selectedProperty, custom_image_2: file });
      } else if (imageIndex === 3) {
        setEditImagePreview3(result);
        setSelectedProperty({ ...selectedProperty, custom_image_3: file });
      }
    } else {
      // Handle adding images for new property
      if (imageIndex === 1) {
        setImagePreview(result);
        {setNewProperty({ ...newProperty, custom_image: file});}
      } else if (imageIndex === 2) {
        setImagePreview2(result);
        setNewProperty({ ...newProperty, custom_image_2: file });
      } else if (imageIndex === 3) {
        setImagePreview3(result);
        setNewProperty({ ...newProperty, custom_image_3: file });
      }
    }
  };

  // Ensure we are reading a valid Blob type
  reader.readAsDataURL(file);
};


  const handleBlogImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (isEdit && selectedBlog) {
          setEditBlogImagePreview(result);
          setSelectedBlog({...selectedBlog, custom_image: file});
        } else {
          setBlogImagePreview(result);
          setNewBlog({...newBlog, custom_image: file});
        }
      };
      reader.readAsDataURL(file);
    }
  };

// ✅ Add Property
  const handleAddProperty = async () => {
  if (!newProperty.title || !newProperty.location || !newProperty.description) {
    alert('Please fill in all required fields');
    return;
  }
  if (!newProperty.bhk || !newProperty.baths || !newProperty.sqft) {
    alert('Please fill in all property specifications');
    return;
  }
  

  setIsSubmitting(true);
  try {
    console.log('Adding new property:', newProperty);
    const bhk = isNaN(Number(newProperty.bhk)) ? 1 : Number(newProperty.bhk);
    const baths = isNaN(Number(newProperty.baths)) ? 1 : Number(newProperty.baths);
    const sqft = isNaN(Number(newProperty.sqft)) ? 1000 : Number(newProperty.sqft);
    
    // Convert images to base64 using FileReader and await their results
    const toBase64 = (file?: File | null): Promise<string | null> => {
      return new Promise((resolve) => {
        if (!file) return resolve(null);
        
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });
    };

    // Wait for all images to be converted to Base64
    const [imageData, imageData2, imageData3] = await Promise.all([
      toBase64(newProperty.custom_image),
      toBase64(newProperty.custom_image_2),
      toBase64(newProperty.custom_image_3),
    ]);
    
    const session = await supabase.auth.getSession();
    const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/manage-properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.data.session?.access_token}`,
      },
      body: JSON.stringify({
        title: newProperty.title,
        location: newProperty.location,
        full_address: newProperty.full_address || newProperty.location, // ✅ snake_case
        type: newProperty.type || 'House',
        status: newProperty.status || 'ready-to-move',
        description: newProperty.description,
        area: (newProperty.area) || '',
        bhk,
        baths,
        sqft,
        custom_image: imageData,   // ✅ match backend
        custom_image_2: imageData2, // ✅ match backend
        custom_image_3: imageData3  // ✅ match backend
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Property added successfully:', result);
      
      // Reload properties to get fresh data
      await loadProperties();
      
      // Reset form
      setNewProperty({
        title: '',
        location: '',
        full_address: '',
        type: 'House',
        status: 'ready-to-move',
        description: '',
        bhk: 1,
        baths: 1,
        sqft: 1000,
        area: '',
        custom_image: null,
        custom_image_2: null,
        custom_image_3: null,
      });
      
      setImagePreview(null);
      setImagePreview2(null);
      setImagePreview3(null);
      setShowAddProperty(false);
      alert('Property added successfully!');
    } else {
      const errorData = await response.json();
      console.error('Error adding property:', errorData);
      alert(`Error adding property: ${errorData.error || 'Please try again'}`);
    }
  } catch (error) {
    console.error('Error adding property:', error);
    alert('Error adding property. Please check your connection and try again.');
  } finally {
    setIsSubmitting(false);
  }
};

// ✅ Edit Property
const handleEditProperty = async () => {
  if (!selectedProperty) return;

  setIsSubmitting(true);
  try {
    console.log('Updating property:', selectedProperty);

    // let imageData = null;
    //   if (selectedProperty.custom_image instanceof File) {
    //     const reader = new FileReader();
    //     imageData = await new Promise((resolve) => {
    //       reader.onload = (e) => resolve(e.target?.result);
    //       reader.readAsDataURL(selectedProperty.custom_image as File);
    //     });
    //   }
    // let imageData2 = null;
    //   if (selectedProperty.custom_image instanceof File) {
    //     const reader = new FileReader();
    //     imageData = await new Promise((resolve) => {
    //       reader.onload = (e) => resolve(e.target?.result);
    //       reader.readAsDataURL(selectedProperty.custom_image_2 as File);
    //     });
    //   }
    // let imageData3 = null;
    //   if (selectedProperty.custom_image instanceof File) {
    //     const reader = new FileReader();
    //     imageData = await new Promise((resolve) => {
    //       reader.onload = (e) => resolve(e.target?.result);
    //       reader.readAsDataURL(selectedProperty.custom_image_3 as File);
    //     });
    //   }

    const toBase64 = (file: File | null | undefined) =>
      file
        ? new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result);
            reader.readAsDataURL(file);
          })
        : null;

    const [imageData, imageData2, imageData3] = await Promise.all([
      toBase64(selectedProperty.custom_image as File),
      toBase64(selectedProperty.custom_image_2 as File),
      toBase64(selectedProperty.custom_image_3 as File),
    ]);

    // const { data: session } = await supabase.auth.getSession();
    const session = await supabase.auth.getSession();
    

    const response = await fetch(
      `${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/manage-properties`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.data.session?.access_token}`,
        },
            body: JSON.stringify({
        id: selectedProperty.id,
        title: selectedProperty.title,
        location: selectedProperty.location,
        full_address: selectedProperty.full_address, // ✅ snake_case
        type: selectedProperty.type,
        status: selectedProperty.status,
        bhk: Number(selectedProperty.bhk) || 1,
        baths: Number(selectedProperty.baths) || 1,
        sqft: Number(selectedProperty.sqft) || 1000,
        description: selectedProperty.description,
        area: selectedProperty.area,
        custom_image: imageData,   // ✅
        custom_image_2: imageData2, // ✅
        custom_image_3: imageData3  // ✅
      }),

      }
    );
    if (!response.ok) {
      const errorData = await response.json();
        console.error('Error updating property:', errorData);
        alert(`Error updating property: ${errorData.error || 'Please try again'}`);
    }

    const result = await response.json();
    console.log('Property updated successfully:', result);
    } catch (error: any) {
      console.error('Error updating property:', error);
      alert('Error updating property. Please check your connection and try again.');
      
    } finally {
    setIsSubmitting(false);
  } 
  };

// ✅ Delete Property
const handleDeleteProperty = async (id: number) => {
  const property = properties.find((p) => p.id === id);
  if (
    !window.confirm(
      `Are you sure you want to delete "${
        property?.title || 'this property'
      }"?\n\nThis action cannot be undone.`
    )
  ) {
    return;
  }

  setIsSubmitting(true);
  try {
    console.log('Deleting property with ID:', id);

    const { data: session } = await supabase.auth.getSession();

    const response = await fetch(
      `${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/manage-properties`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.session?.access_token}`,
        },
        body: JSON.stringify({ id }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete property');
    }

    console.log('Property deleted successfully');
    setProperties((prev) => prev.filter((p) => p.id !== id));
    alert('Property deleted successfully!');
  } catch (error: any) {
    console.error('Error deleting property:', error);
    alert(error.message || 'Error deleting property. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};


  const handleDeleteConsultation = async (id: number) => {
    const consultation = consultations.find(c => c.id === id);
    
    if (!window.confirm(`Are you sure you want to delete the consultation from "${consultation?.name || 'this client'}"?\n\nThis action cannot be undone.`)) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Deleting consultation with ID:', id);
      
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/manage-consultations`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ id: Number(id) }),
      });

      if (response.ok) {
        console.log('Consultation deleted successfully');
        
        // Immediately update local state
        setConsultations(prevConsultations => prevConsultations.filter(c => c.id !== id));
        
        // Show success feedback
        alert('Consultation deleted successfully!');
        
      } else {
        // Handle HTTP errors
        let errorMessage = 'Unknown error occurred';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`;
        } catch (parseError) {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        
        console.error('Error deleting consultation:', errorMessage);
        alert(`Error deleting consultation: ${errorMessage}`);
      }
    } catch (error) {
      // Handle network and other errors
      console.error('Network error while deleting consultation:', error);
      
      let errorMessage = 'Network connection failed. Please check your internet connection and try again.';
      if (error instanceof Error) {
        errorMessage = error.message.includes('fetch') 
          ? 'Network connection failed. Please check your internet connection and try again.'
          : `Error: ${error.message}`;
      }
      
      alert(`Error deleting consultation: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateConsultationStatus = async (id: number, status: 'pending' | 'confirmed' | 'completed') => {
    try {
      console.log('Updating consultation status:', id, status);
      
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/manage-consultations`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status }),
      });

      if (response.ok) {
        console.log('Consultation status updated successfully');
        await loadConsultations();
      } else {
        const errorData = await response.json();
        console.error('Error updating consultation:', errorData);
        alert(`Error updating consultation: ${errorData.error || 'Please try again'}`);
      }
    } catch (error) {
      console.error('Error updating consultation:', error);
      alert('Error updating consultation. Please try again.');
    }
  };

  const handleAddBlog = async () => {
    if (!newBlog.title || !newBlog.content) {
      alert('Please fill in title and content');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Adding new blog:', newBlog);
      
      let imageData = null;
      if (newBlog.custom_image) {
        const reader = new FileReader();
        imageData = await new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target?.result);
          reader.readAsDataURL(newBlog.custom_image as File);
        });
      }
      
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/manage-blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newBlog.title,
          excerpt: newBlog.excerpt,
          content: newBlog.content,
          author: newBlog.author || 'Rajeev Mittal',
          status: newBlog.status || 'published',
          featured: Boolean(newBlog.featured),
          tags: Array.isArray(newBlog.tags) ? newBlog.tags : [],
          metaDescription: newBlog.meta_description,
          customImage: imageData
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Blog added successfully:', result);
        
        await loadBlogs();
        
        setNewBlog({
          title: '',
          excerpt: '',
          content: '',
          author: 'Rajeev Mittal',
          status: 'published',
          featured: false,
          tags: [],
          meta_description: '',
          custom_image: null
        });
        setBlogImagePreview(null);
        setShowAddBlog(false);
        alert('Blog added successfully!');
      } else {
        const errorData = await response.json();
        console.error('Error adding blog:', errorData);
        alert(`Error adding blog: ${errorData.error || 'Please try again'}`);
      }
    } catch (error) {
      console.error('Error adding blog:', error);
      alert('Error adding blog. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditBlog = async () => {
    if (!selectedBlog) return;

    setIsSubmitting(true);
    try {
      console.log('Updating blog:', selectedBlog);
      
      let imageData = null;
      if (selectedBlog.custom_image instanceof File) {
        const reader = new FileReader();
        imageData = await new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target?.result);
          reader.readAsDataURL(selectedBlog.custom_image as File);
        });
      }
      
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/manage-blogs`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedBlog.id,
          title: selectedBlog.title,
          excerpt: selectedBlog.excerpt,
          content: selectedBlog.content,
          author: selectedBlog.author,
          status: selectedBlog.status,
          featured: Boolean(selectedBlog.featured),
          tags: Array.isArray(selectedBlog.tags) ? selectedBlog.tags : [],
          metaDescription: selectedBlog.meta_description,
          customImage: imageData
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Blog updated successfully:', result);
        
        await loadBlogs();
        
        setShowEditBlog(false);
        setSelectedBlog(null);
        setEditBlogImagePreview(null);
        alert('Blog updated successfully!');
      } else {
        const errorData = await response.json();
        console.error('Error updating blog:', errorData);
        alert(`Error updating blog: ${errorData.error || 'Please try again'}`);
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      alert('Error updating blog. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBlog = async (id: number) => {
    const blog = blogs.find(b => b.id === id);
    
    if (!window.confirm(`Are you sure you want to delete "${blog?.title || 'this blog'}"?\n\nThis action cannot be undone.`)) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Deleting blog with ID:', id);
      
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/manage-blogs`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: Number(id) }),
      });

      if (response.ok) {
        console.log('Blog deleted successfully');
        setBlogs(prevBlogs => prevBlogs.filter(b => b.id !== id));
        alert('Blog deleted successfully!');
      } else {
        let errorMessage = 'Unknown error occurred';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`;
        } catch (parseError) {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        
        console.error('Error deleting blog:', errorMessage);
        alert(`Error deleting blog: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Network error while deleting blog:', error);
      alert('Error deleting blog. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
    navigate('/admin/login');
  };

  // const _formatPrice = (price: number, isRental: boolean = false) => {
  //   if (isRental) {
  //     return `₹${price.toLocaleString()}/mo`;
  //   }
  //   return `₹${price.toLocaleString()}`;
  // };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'read-to-move': return 'bg-blue-600';
      case 'under-construction': return 'bg-green-600';
      case 'ongoing': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  const getConsultationStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <div className="text-sm text-gray-500">Rajeev Mittal Real Estate</div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/')}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium cursor-pointer"
              >
                View Website
              </button>
              <button
                onClick={handleSignOut}
                className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium cursor-pointer"
              >
                Sign Out
              </button>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <i className="ri-user-line text-white w-4 h-4 flex items-center justify-center"></i>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('properties')}
            className={`px-6 py-2 rounded-md font-medium cursor-pointer whitespace-nowrap ${
              activeTab === 'properties'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Properties ({properties.length})
          </button>
          <button
            onClick={() => setActiveTab('consultations')}
            className={`px-6 py-2 rounded-md font-medium cursor-pointer whitespace-nowrap ${
              activeTab === 'consultations'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Consultations ({consultations.filter(c => c.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveTab('blogs')}
            className={`px-6 py-2 rounded-md font-medium cursor-pointer whitespace-nowrap ${
              activeTab === 'blogs'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Blog Posts ({blogs.length})
          </button>
        </div>

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Property Listings</h2>
              <button
                onClick={() => setShowAddProperty(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium whitespace-nowrap cursor-pointer flex items-center"
              >
                <i className="ri-add-line mr-2 w-4 h-4 flex items-center justify-center"></i>
                Add Property
              </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BHK</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sqft</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {properties.map((property) => (
                      <tr key={property.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{property.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(property.status)}`}>
                            {property.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.bhk} BHK</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.sqft} sq ft</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-navy-100 text-navy-800">
                            Price on Call
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedProperty(property);
                                setShowEditProperty(true);
                              }}
                              className="text-blue-600 hover:text-blue-900 cursor-pointer"
                            >
                              <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
                            </button>
                            <button
                              onClick={() => navigate(`/property/${property.id}`)}
                              className="text-green-600 hover:text-green-900 cursor-pointer"
                            >
                              <i className="ri-external-link-line w-4 h-4 flex items-center justify-center"></i>
                            </button>
                            <button
                              onClick={() => handleDeleteProperty(property.id)}
                              className="text-red-600 hover:text-red-900 cursor-pointer"
                            >
                              <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Consultations Tab */}
        {activeTab === 'consultations' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Consultation Requests</h2>
              <div className="flex space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                  <span>Pending ({consultations.filter(c => c.status === 'pending').length})</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                  <span>Confirmed ({consultations.filter(c => c.status === 'confirmed').length})</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preferred Date/Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {consultations.map((consultation) => (
                      <tr key={consultation.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{consultation.name}</div>
                            <div className="text-sm text-gray-500">{consultation.email}</div>
                            <div className="text-sm text-gray-500">{consultation.phone}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {consultation.service_type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>{consultation.preferred_date}</div>
                          <div className="text-gray-500">{consultation.preferred_time}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConsultationStatusColor(consultation.status)}`}>
                            {consultation.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {consultation.message}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {consultation.status === 'pending' && (
                              <button
                                onClick={() => updateConsultationStatus(consultation.id, 'confirmed')}
                                className="text-green-600 hover:text-green-900 cursor-pointer"
                                title="Confirm"
                              >
                                <i className="ri-check-line w-4 h-4 flex items-center justify-center"></i>
                              </button>
                            )}
                            {consultation.status === 'confirmed' && (
                              <button
                                onClick={() => updateConsultationStatus(consultation.id, 'completed')}
                                className="text-blue-600 hover:text-blue-900 cursor-pointer"
                                title="Mark Complete"
                              >
                                <i className="ri-check-double-line w-4 h-4 flex items-center justify-center"></i>
                              </button>
                            )}
                            <a
                              href={`mailto:${consultation.email}`}
                              className="text-blue-600 hover:text-blue-900 cursor-pointer"
                              title="Send Email"
                            >
                              <i className="ri-mail-line w-4 h-4 flex items-center justify-center"></i>
                            </a>
                            <a
                              href={`tel:${consultation.phone}`}
                              className="text-green-600 hover:text-green-900 cursor-pointer"
                              title="Call"
                            >
                              <i className="ri-phone-line w-4 h-4 flex items-center justify-center"></i>
                            </a>
                            <button
                              onClick={() => handleDeleteConsultation(consultation.id)}
                              className="text-red-600 hover:text-red-900 cursor-pointer"
                              title="Delete"
                            >
                              <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Blogs Tab */}
        {activeTab === 'blogs' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Blog Posts</h2>
              <button
                onClick={() => setShowAddBlog(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium whitespace-nowrap cursor-pointer flex items-center"
              >
                <i className="ri-add-line mr-2 w-4 h-4 flex items-center justify-center"></i>
                Add Blog Post
              </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blog Post</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {blogs.map((blog) => (
                      <tr key={blog.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img 
                              alt={blog.title}
                              className="h-12 w-16 rounded object-cover object-top" 
                              src={blog.featured_image}
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 line-clamp-2">{blog.title}</div>
                              <div className="text-sm text-gray-500">{blog.read_time} min read</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {blog.author}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            blog.status === 'published' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {blog.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {blog.featured && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              Featured
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(blog.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedBlog(blog);
                                setShowEditBlog(true);
                              }}
                              className="text-blue-600 hover:text-blue-900 cursor-pointer"
                            >
                              <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
                            </button>
                            <button
                              onClick={() => navigate(`/blog/${blog.slug}`)}
                              className="text-green-600 hover:text-green-900 cursor-pointer"
                            >
                              <i className="ri-external-link-line w-4 h-4 flex items-center justify-center"></i>
                            </button>
                            <button
                              onClick={() => handleDeleteBlog(blog.id)}
                              className="text-red-600 hover:text-red-900 cursor-pointer"
                            >
                              <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {blogs.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="ri-article-line text-gray-400 text-2xl w-8 h-8 flex items-center justify-center"></i>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts yet</h3>
                    <p className="text-gray-500">Create your first blog post to get started.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Property Modal */}
      {showAddProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Add New Property</h3>
              <button 
                onClick={() => {
                  setShowAddProperty(false);
                  setImagePreview(null);
                  setImagePreview2(null);
                  setImagePreview3(null);
                }}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
              </button>
            </div>
            
            <form onSubmit={handleAddProperty}  className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Title</label>
                  <input
                    type="text"
                    value={newProperty.title ?? ""}
                    onChange={(e) => setNewProperty({...newProperty, title: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={newProperty.location ?? ""}
                    onChange={(e) => setNewProperty({...newProperty, location: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Address</label>
                <input
                  type="text"
                  value={newProperty.full_address ?? ""}
                  onChange={(e) => setNewProperty({...newProperty, full_address: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                  <select
                    value={newProperty.type ?? ""}
                    onChange={(e) => setNewProperty({...newProperty, type: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 pr-8"
                  >
                    <option value="House">House</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Flat">Flat</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Duplex">Duplex</option>
                    <option value="Studio">Studio</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={newProperty.status ?? ""}
                    onChange={(e) => setNewProperty({...newProperty, status: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 pr-8"
                  >
                    <option value="For Sale">For Sale</option>
                    <option value="For Rent">For Rent</option>
                    <option value="Investment">Investment</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">BHK</label>
                  <input
                    type="number"
                    min="1"
                    value={newProperty.bhk ?? ""}
                    onChange={(e) => setNewProperty({...newProperty, bhk: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                  <input
                    type="number"
                    min="1"
                    value={newProperty.baths ?? ""}
                    onChange={(e) => setNewProperty({...newProperty, baths: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Square Feet</label>
                  <input
                    type="number"
                    min="1"
                    value={newProperty.sqft ?? ""}
                    onChange={(e) => setNewProperty({...newProperty, sqft: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
                  <select
                    value={newProperty.area ?? ""}
                    onChange={(e) => setNewProperty({...newProperty, area: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 pr-8"
                  >
                    <option value="">Select Area</option>
                    <option value="golf course road">Golf Course Road</option>
                    <option value="golf course extension road">Golf Course Extension Road</option>
                    <option value="dwarka express way">Dwarka Express Way</option>
                    <option value="sohna road">Sohna Road</option>
                    <option value="gurgaon faridabad road">Gurgaon Faridabad Road</option>
                    <option value="other-ncr">Other NCR</option>
                  </select>
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  rows={4}
                  value={newProperty.description ?? ""}
                  onChange={(e) => setNewProperty({...newProperty, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" 
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Images (up to 3)</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Image 1 */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Main Image</label>
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 1, false)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm mb-2"
                    />
                    {imagePreview && (
                      <img 
                        src={imagePreview} 
                        alt="Preview 1" 
                        className="w-full h-24 object-cover object-top rounded border"
                      />
                    )}
                  </div>
                  
                  {/* Image 2 */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Image 2 (Optional)</label>
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 2, false)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm mb-2"
                    />
                    {imagePreview2 && (
                      <img 
                        src={imagePreview2} 
                        alt="Preview 2" 
                        className="w-full h-24 object-cover object-top rounded border"
                      />
                    )}
                  </div>
                  
                  {/* Image 3 */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Image 3 (Optional)</label>
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 3, false)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm mb-2"
                    />
                    {imagePreview3 && (
                      <img 
                        src={imagePreview3} 
                        alt="Preview 3" 
                        className="w-full h-24 object-cover object-top rounded border"
                      />
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Upload images (max 5MB each). First image will be the main display image.</p>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button 
                  type="button"
                  onClick={() => {
                    setShowAddProperty(false);
                    setImagePreview(null);
                    setImagePreview2(null);
                    setImagePreview3(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer whitespace-nowrap"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  onClick={handleAddProperty}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Adding...' : 'Add Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Property Modal */}
      {showEditProperty && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Edit Property</h3>
              <button 
                onClick={() => {
                  setShowEditProperty(false);
                  setEditImagePreview(null);
                  setEditImagePreview2(null);
                  setEditImagePreview3(null);
                }}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
              </button>
            </div>
            
            <form onSubmit={handleEditProperty} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Title</label>
                  <input
                    type="text"
                    value={selectedProperty.title ?? ""}
                    onChange={(e) => setSelectedProperty({...selectedProperty, title: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={selectedProperty.location ?? ""}
                    onChange={(e) => setSelectedProperty({...selectedProperty, location: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Address</label>
                <input
                  type="text"
                  value={selectedProperty.full_address ?? ""}
                  onChange={(e) => setSelectedProperty({...selectedProperty, full_address: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                  <select
                    value={selectedProperty.type ?? ""}
                    onChange={(e) => setSelectedProperty({...selectedProperty, type: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 pr-8"
                  >
                    <option value="House">House</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Flat">Flat</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Duplex">Duplex</option>
                    <option value="Studio">Studio</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedProperty.status ?? ""}
                    onChange={(e) => setSelectedProperty({...selectedProperty, status: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 pr-8"
                  >
                    <option value="For Sale">For Sale</option>
                    <option value="For Rent">For Rent</option>
                    <option value="Investment">Investment</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Area/District</label>
                  <select
                    value={selectedProperty.area ?? ""}
                    onChange={(e) => setSelectedProperty({...selectedProperty, area: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 pr-8"
                  >
                    <option value="">Select Area</option>
                    <option value="golf course road">Golf Course Road</option>
                    <option value="golf course extension road">Golf Course Extension Road</option>
                    <option value="dwarka express way">Dwarka Express Way</option>
                    <option value="sohna road">Sohna Road</option>
                    <option value="gurgaon faridabad road">Gurgaon Faridabad Road</option>
                    <option value="other-ncr">Other NCR</option>
                  </select>
                </div>

                {/* Project Specifications */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">BHK</label>
                  <input 
                    type="number"
                    value={selectedProperty.bhk ?? ""}
                    onChange={(e) => setSelectedProperty({...selectedProperty, bhk: parseInt(e.target.value) || 1})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                  <input 
                    type="number"
                    value={selectedProperty.baths ?? ""}
                    onChange={(e) => setSelectedProperty({...selectedProperty, baths: parseInt(e.target.value) || 1})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sq.ft Area</label>
                  <input 
                    type="number"
                    value={selectedProperty.sqft ?? ""}
                    onChange={(e) => setSelectedProperty({...selectedProperty, sqft: parseInt(e.target.value) || 1000})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
                    min="500"
                  />
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  rows={4}
                  value={selectedProperty.description ?? ""}
                  onChange={(e) => setSelectedProperty({...selectedProperty, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-5 text-sm" 
                />
              </div>

              {/* Images */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Images (up to 3)</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Image 1 */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Main Image</label>
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 1, true)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-5 text-sm mb-2"
                    />
                    {(editImagePreview || selectedProperty.custom_image) && (
                      <img
                        // Ensure both are strings (or create a URL from the file if it's a File)
                        src={editImagePreview 
                          ? editImagePreview 
                          : selectedProperty.custom_image instanceof File 
                          ? URL.createObjectURL(selectedProperty.custom_image) 
                          : selectedProperty.custom_image || ''} // Fallback to an empty string if null
                        alt="Current 1"
                        className="w-full h-24 object-cover object-top rounded border"
                      />
                    )}
                  </div>
                  
                  {/* Image 2 */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Image 2</label>
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 2, true)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-5 text-sm mb-2"
                    />
                    {(editImagePreview2 || selectedProperty.custom_image_2) && (
                      <img 
                        src={editImagePreview2
                          ? editImagePreview2
                          : selectedProperty.custom_image_2 instanceof File 
                          ? URL.createObjectURL(selectedProperty.custom_image_2) 
                          : selectedProperty.custom_image_2 || ''} // Fallback to an empty string if null
                        alt="Current 2" 
                        className="w-full h-24 object-cover object-top rounded border"
                      />
                    )}
                  </div>
                  
                  {/* Image 3 */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Image 3</label>
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 3, true)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-5 text-sm mb-2"
                    />
                    {(editImagePreview3 || selectedProperty.custom_image_3) && (
                      <img 
                        src={editImagePreview3 
                          ? editImagePreview3
                          : selectedProperty.custom_image_3 instanceof File 
                          ? URL.createObjectURL(selectedProperty.custom_image_3) 
                          : selectedProperty.custom_image_3 || ''} // Fallback to an empty string if null
                        alt="Current 3" 
                        className="w-full h-24 object-cover object-top rounded border"
                      />
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Upload new images or leave empty to keep current ones.</p>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button 
                  type="button"
                  onClick={() => {
                    setShowEditProperty(false);
                    setEditImagePreview(null);
                    setEditImagePreview2(null);
                    setEditImagePreview3(null);
                  }}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Blog Modal */}
      {showAddBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Add New Blog Post</h3>
              <button 
                onClick={() => {
                  setShowAddBlog(false);
                  setBlogImagePreview(null);
                }}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleBlogImageUpload(e, false)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-5 text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">Upload an image (max 5MB) or leave empty for auto-generated image</p>
                  </div>
                  {blogImagePreview && (
                    <div className="w-20 h-20 rounded-lg overflow-hidden border">
                      <img 
                        src={blogImagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  type="text"
                  value={newBlog.title}
                  onChange={(e) => setNewBlog({...newBlog, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-5 text-sm" 
                  placeholder="Blog post title"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                <textarea 
                  rows={3}
                  value={newBlog.excerpt}
                  onChange={(e) => setNewBlog({...newBlog, excerpt: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-5 text-sm" 
                  placeholder="Brief description of the blog post"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <input 
                  type="text"
                  value={newBlog.author}
                  onChange={(e) => setNewBlog({...newBlog, author: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-5 text-sm" 
                  placeholder="Author name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  value={newBlog.status}
                  onChange={(e) => setNewBlog({...newBlog, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-5 text-sm pr-8"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                <input 
                  type="text"
                  value={Array.isArray(newBlog.tags) ? newBlog.tags.join(', ') : ''}
                  onChange={(e) => setNewBlog({...newBlog, tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-5 text-sm" 
                  placeholder="real estate, market analysis, investment"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                <textarea 
                  rows={2}
                  value={newBlog.meta_description}
                  onChange={(e) => setNewBlog({...newBlog, meta_description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-5 text-sm" 
                  placeholder="SEO description for search engines"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea 
                  rows={12}
                  value={newBlog.content}
                  onChange={(e) => setNewBlog({...newBlog, content: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-5 text-sm" 
                  placeholder="Write your blog post content here..."
                />
              </div>

              <div className="col-span-2">
                <label className="flex items-center">
                  <input 
                    type="checkbox"
                    checked={newBlog.featured}
                    onChange={(e) => setNewBlog({...newBlog, featured: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Featured post (will appear prominently)</span>
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 mt-6">
              <button 
                onClick={() => {
                  setShowAddBlog(false);
                  setBlogImagePreview(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddBlog}
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Adding...' : 'Add Blog Post'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Blog Modal */}
      {showEditBlog && selectedBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Edit Blog Post</h3>
              <button 
                onClick={() => {
                  setShowEditBlog(false);
                  setEditBlogImagePreview(null);
                }}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              > 
                <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleBlogImageUpload(e, true)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-5 text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">Upload new image or leave empty to keep current</p>
                  </div>
                  <div className="w-20 h-20 rounded-lg overflow-hidden border">
                    <img 
                      src={editBlogImagePreview || selectedBlog.featured_image} 
                      alt="Current" 
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  type="text"
                  value={selectedBlog.title}
                  onChange={(e) => setSelectedBlog({...selectedBlog, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-5 text-sm" 
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                <textarea 
                  rows={3}
                  value={selectedBlog.excerpt}
                  onChange={(e) => setSelectedBlog({...selectedBlog, excerpt: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-5 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <input 
                  type="text"
                  value={selectedBlog.author}
                  onChange={(e) => setSelectedBlog({...selectedBlog, author: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-5 text-sm" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  value={selectedBlog.status}
                  onChange={(e) => setSelectedBlog({...selectedBlog, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-5 text-sm pr-8"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                <input 
                  type="text"
                  value={Array.isArray(selectedBlog.tags) ? selectedBlog.tags.join(', ') : ''}
                  onChange={(e) => setSelectedBlog({...selectedBlog, tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-5 text-sm" 
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                <textarea 
                  rows={2}
                  value={selectedBlog.meta_description}
                  onChange={(e) => setSelectedBlog({...selectedBlog, meta_description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-5 text-sm"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea 
                  rows={12}
                  value={selectedBlog.content}
                  onChange={(e) => setSelectedBlog({...selectedBlog, content: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-5 text-sm"
                />
              </div>

              <div className="col-span-2">
                <label className="flex items-center">
                  <input 
                    type="checkbox"
                    checked={selectedBlog.featured}
                    onChange={(e) => setSelectedBlog({...selectedBlog, featured: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Featured post (will appear prominently)</span>
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 mt-6">
              <button 
                onClick={() => {
                  setShowEditBlog(false);
                  setEditBlogImagePreview(null);
                }}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button 
                onClick={handleEditBlog}
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
