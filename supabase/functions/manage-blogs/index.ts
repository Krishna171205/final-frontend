import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-requested-with',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
}

const generateImageUrl = (title: string, category: string = 'real estate') => {
  const prompts = {
    'real estate': `professional real estate blog header image, modern property architecture, luxury building exterior, sophisticated business photography, clean design, ${title.toLowerCase()}`,
    'market analysis': `real estate market analysis visualization, charts and graphs, property investment data, professional business imagery, modern office setting, ${title.toLowerCase()}`,
    'investment': `real estate investment concept, financial growth charts, property portfolio, professional business photography, sophisticated design, ${title.toLowerCase()}`,
    'home buying': `home buying guide imagery, modern house exterior, family-friendly residential property, welcoming entrance, professional real estate photography, ${title.toLowerCase()}`,
    'luxury': `luxury real estate imagery, premium property exterior, sophisticated architecture, high-end residential building, elegant design, ${title.toLowerCase()}`
  }
  
  const prompt = prompts[category] || prompts['real estate']
  return `https://readdy.ai/api/search-image?query=${encodeURIComponent(prompt)}&width=800&height=450&seq=blog${Date.now()}&orientation=landscape`
}

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

const processUploadedImage = (imageData: string) => {
  try {
    if (!imageData.startsWith('data:image/')) {
      throw new Error('Invalid image format')
    }
    return imageData
  } catch (error) {
    console.error('Error processing uploaded image:', error)
    return null
  }
}

const estimateReadTime = (content: string): number => {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Missing Supabase configuration')
      return new Response(JSON.stringify({ 
        error: 'Server configuration error' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const supabaseClient = createClient(supabaseUrl, serviceRoleKey)

    // GET - Fetch blogs
    if (req.method === 'GET') {
      const url = new URL(req.url)
      const isPublic = url.searchParams.get('public') === 'true'
      const slug = url.searchParams.get('slug')
      const featured = url.searchParams.get('featured') === 'true'
      
      console.log('Fetching blogs, public:', isPublic, 'slug:', slug, 'featured:', featured)
      
      let query = supabaseClient.from('blogs').select('*')
      
      if (isPublic) {
        query = query.eq('status', 'published')
      }
      
      if (slug) {
        query = query.eq('slug', slug).single()
      } else {
        if (featured) {
          query = query.eq('featured', true)
        }
        query = query.order('created_at', { ascending: false })
      }

      const { data: blogs, error } = await query

      if (error) {
        console.error('GET blogs error:', error)
        return new Response(JSON.stringify({ 
          error: 'Failed to fetch blogs',
          details: error.message 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      console.log(`Successfully fetched ${Array.isArray(blogs) ? blogs.length : 1} blog(s)`)

      return new Response(JSON.stringify({ 
        success: true,
        blogs: blogs || [],
        blog: !Array.isArray(blogs) ? blogs : null
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // POST - Add new blog
    if (req.method === 'POST') {
      const body = await req.json()
      console.log('Adding new blog with data:', body)
      
      if (!body.title || !body.content) {
        console.error('Missing required fields')
        return new Response(JSON.stringify({ 
          error: 'Missing required fields: title, content' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      
      const slug = generateSlug(body.title)
      const readTime = estimateReadTime(body.content)
      
      let featuredImage = generateImageUrl(body.title, body.category || 'real estate')
      
      if (body.customImage) {
        console.log('Processing uploaded image for new blog')
        const processedImage = processUploadedImage(body.customImage)
        if (processedImage) {
          featuredImage = processedImage
          console.log('Using uploaded image for new blog')
        }
      }
      
      const blogData = {
        title: String(body.title).trim(),
        slug: slug,
        excerpt: String(body.excerpt || '').trim() || body.content.substring(0, 150) + '...',
        content: String(body.content).trim(),
        featured_image: featuredImage,
        author: String(body.author || 'Rajeev Mittal').trim(),
        status: String(body.status || 'published').trim(),
        featured: Boolean(body.featured),
        tags: Array.isArray(body.tags) ? body.tags : [],
        meta_description: String(body.metaDescription || '').trim() || body.content.substring(0, 160),
        read_time: readTime
      }

      console.log('Inserting blog with validated data')
      
      const { data, error } = await supabaseClient
        .from('blogs')
        .insert([blogData])
        .select()
        .single()

      if (error) {
        console.error('Insert blog error:', error)
        return new Response(JSON.stringify({ 
          error: 'Failed to add blog to database',
          details: error.message 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      console.log('Blog added successfully with ID:', data.id)

      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Blog added successfully',
        blog: data 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // PUT - Update existing blog
    if (req.method === 'PUT') {
      const body = await req.json()
      console.log('Updating blog with data:', body)
      
      if (!body.id) {
        console.error('Missing blog ID for update')
        return new Response(JSON.stringify({ 
          error: 'Blog ID is required for update' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      
      const { data: existingBlog, error: fetchError } = await supabaseClient
        .from('blogs')
        .select('*')
        .eq('id', body.id)
        .single()

      if (fetchError || !existingBlog) {
        console.error('Blog not found for update, ID:', body.id, fetchError)
        return new Response(JSON.stringify({ 
          error: 'Blog not found' 
        }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      const slug = body.title && body.title !== existingBlog.title ? generateSlug(body.title) : existingBlog.slug
      const readTime = body.content ? estimateReadTime(body.content) : existingBlog.read_time

      const updateData = {
        title: String(body.title || existingBlog.title).trim(),
        slug: slug,
        excerpt: String(body.excerpt !== undefined ? body.excerpt : existingBlog.excerpt).trim(),
        content: String(body.content || existingBlog.content).trim(),
        author: String(body.author || existingBlog.author).trim(),
        status: String(body.status || existingBlog.status).trim(),
        featured: Boolean(body.featured !== undefined ? body.featured : existingBlog.featured),
        tags: Array.isArray(body.tags) ? body.tags : existingBlog.tags,
        meta_description: String(body.metaDescription !== undefined ? body.metaDescription : existingBlog.meta_description).trim(),
        read_time: readTime,
        updated_at: new Date().toISOString()
      }
      
      if (body.customImage) {
        console.log('Processing new uploaded image for blog ID:', body.id)
        const processedImage = processUploadedImage(body.customImage)
        
        if (processedImage) {
          console.log('Using new uploaded image')
          updateData.featured_image = processedImage
        }
      } else if (body.title !== existingBlog.title) {
        console.log('Generating new default image for updated blog')
        const imageUrl = generateImageUrl(updateData.title, body.category || 'real estate')
        updateData.featured_image = imageUrl
      }
      
      console.log('Updating blog with ID:', body.id)
      
      const { data, error } = await supabaseClient
        .from('blogs')
        .update(updateData)
        .eq('id', body.id)
        .select()
        .single()

      if (error) {
        console.error('Update blog error:', error)
        return new Response(JSON.stringify({ 
          error: 'Failed to update blog in database',
          details: error.message 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      console.log('Blog updated successfully:', data.title)

      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Blog updated successfully',
        blog: data 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // DELETE - Remove blog
    if (req.method === 'DELETE') {
      const body = await req.json()
      const blogId = body.id || body.blogId
      
      console.log('DELETE request received with body:', body)
      console.log('Attempting to delete blog with ID:', blogId)
      
      if (!blogId || isNaN(parseInt(blogId))) {
        console.error('Invalid or missing blog ID for deletion:', blogId)
        return new Response(JSON.stringify({ 
          error: 'Valid blog ID is required for deletion',
          receivedId: blogId
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      
      const numericId = parseInt(blogId)
      console.log('Parsed blog ID as numeric:', numericId)
      
      const { data: blogToDelete, error: fetchError } = await supabaseClient
        .from('blogs')
        .select('*')
        .eq('id', numericId)
        .maybeSingle()

      if (fetchError) {
        console.error('Error checking blog existence:', fetchError)
        return new Response(JSON.stringify({ 
          error: 'Database error while checking blog',
          details: fetchError.message 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      if (!blogToDelete) {
        console.error('Blog not found for deletion, ID:', numericId)
        return new Response(JSON.stringify({ 
          error: 'Blog not found with the specified ID',
          searchedId: numericId
        }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      console.log('Found blog to delete:', blogToDelete.title, 'ID:', blogToDelete.id)
      
      const { error: deleteError } = await supabaseClient
        .from('blogs')
        .delete()
        .eq('id', numericId)

      if (deleteError) {
        console.error('Delete blog error:', deleteError)
        return new Response(JSON.stringify({ 
          error: 'Failed to delete blog from database',
          details: deleteError.message 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      console.log('Blog deleted successfully:', blogToDelete.title)

      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Blog deleted successfully',
        deletedBlog: {
          id: blogToDelete.id,
          title: blogToDelete.title
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ 
      error: 'Method not allowed',
      allowedMethods: ['GET', 'POST', 'PUT', 'DELETE']
    }), { 
      status: 405, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Manage blogs function error:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})