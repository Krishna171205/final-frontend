import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-requested-with',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
    
    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Missing Supabase configuration')
      return new Response(JSON.stringify({ 
        error: 'Server configuration error' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // POST - Create new admin account
    if (req.method === 'POST') {
      const body = await req.json()
      console.log('Creating admin account for:', body.email)
      
      // Validate required fields
      if (!body.email || !body.password) {
        return new Response(JSON.stringify({ 
          error: 'Email and password are required' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(body.email)) {
        return new Response(JSON.stringify({ 
          error: 'Please enter a valid email address' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Validate password length
      if (body.password.length < 6) {
        return new Response(JSON.stringify({ 
          error: 'Password must be at least 6 characters long' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      try {
        // Use service role key for admin operations
        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

        // Create user in auth.users with admin privileges
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: body.email.toLowerCase().trim(),
          password: body.password,
          email_confirm: true, // Auto-confirm email for admin users
          user_metadata: {
            role: 'admin',
            created_by: 'admin_registration',
            full_name: body.fullName || '',
          }
        })

        if (authError) {
          console.error('Auth creation error:', authError)
          
          if (authError.message.includes('already registered')) {
            return new Response(JSON.stringify({ 
              error: 'An account with this email already exists' 
            }), {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
          }
          
          return new Response(JSON.stringify({ 
            error: authError.message || 'Failed to create admin account'
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

        if (!authData.user) {
          return new Response(JSON.stringify({ 
            error: 'Failed to create user account' 
          }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

        console.log('Admin account created successfully:', authData.user.email)

        // Create admin_users record manually since we can't rely on triggers
        try {
          await supabaseAdmin
            .from('admin_users')
            .insert({
              id: authData.user.id,
              email: authData.user.email,
              role: 'admin'
            })
        } catch (insertError) {
          console.log('Admin_users record may already exist or will be created by trigger')
        }

        return new Response(JSON.stringify({ 
          success: true,
          message: 'Admin account created successfully',
          user: {
            id: authData.user.id,
            email: authData.user.email,
            role: 'admin'
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      } catch (error) {
        console.error('Error creating admin account:', error)
        return new Response(JSON.stringify({ 
          error: 'Failed to create admin account. Please try again.' 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
    }

    // GET - Get admin user info (requires valid JWT)
    if (req.method === 'GET') {
      const authHeader = req.headers.get('Authorization')
      if (!authHeader) {
        return new Response(JSON.stringify({ 
          error: 'Authorization header required' 
        }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Create client with user's token for authenticated requests
      const supabaseUser = createClient(supabaseUrl, anonKey || '', {
        global: {
          headers: { Authorization: authHeader }
        }
      })

      const { data: { user }, error: userError } = await supabaseUser.auth.getUser()
      
      if (userError || !user) {
        return new Response(JSON.stringify({ 
          error: 'Invalid or expired token' 
        }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Get admin user data
      const { data: adminData, error: adminError } = await supabaseUser
        .from('admin_users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (adminError) {
        console.error('Error fetching admin data:', adminError)
        return new Response(JSON.stringify({ 
          error: 'Failed to fetch admin data' 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      return new Response(JSON.stringify({ 
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: adminData?.role || 'admin',
          created_at: adminData?.created_at,
          last_login: adminData?.last_login
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Method not allowed
    return new Response(JSON.stringify({ 
      error: 'Method not allowed' 
    }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Admin auth function error:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})