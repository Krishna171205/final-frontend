import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-requested-with",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

// Generate placeholder image URL if no image is uploaded
const generateImageUrl = (title: string, type: string) => {
  const prompts = {
    'House': `beautiful modern family house exterior with large windows, manicured lawn, contemporary architecture, residential neighborhood setting, natural lighting, clean architectural lines, inviting entrance, ${title.toLowerCase()}`,
    'Condo': `modern luxury condominium building exterior, sleek glass facade, urban setting, contemporary high-rise architecture, clean lines, sophisticated design, city backdrop, ${title.toLowerCase()}`,
    'Penthouse': `luxury penthouse exterior view, upscale high-rise building, sophisticated architecture, panoramic city views, modern glass design, premium residential building, ${title.toLowerCase()}`,
    'Townhouse': `elegant townhouse exterior, charming residential architecture, well-maintained facade, urban residential setting, classic design elements, inviting entrance, ${title.toLowerCase()}`,
    'Estate': `magnificent luxury estate exterior, grand architecture, expansive grounds, impressive facade, upscale residential property, majestic design, pristine landscaping, ${title.toLowerCase()}`,
    'Duplex': `attractive duplex home exterior, modern residential architecture, symmetrical design, well-maintained property, family-friendly neighborhood, clean contemporary lines, ${title.toLowerCase()}`,
    'Loft': `modern loft building exterior, industrial architecture, converted warehouse style, urban setting, large windows, contemporary residential conversion, ${title.toLowerCase()}`
  };
  
  const prompt = prompts[type] || prompts['House'];
  return `https://readdy.ai/api/search-image?query=${encodeURIComponent(prompt)}&width=600&height=400&seq=prop${Date.now()}&orientation=landscape`;
};

const jsonResponse = (obj: any, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

// Validate and process base64 image
// const processUploadedImage = (imageData: string) => {
//   try{ if (!imageData.startsWith('data:image/')) {
//     console.error('Invalid image format');
//     return null;
//   }
//   return imageData}
//   catch (error) {
//     console.error('Error processing uploaded image:', error)
//     return null
//   } 
// };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const supabaseClient = createClient(supabaseUrl, serviceRoleKey);

    // Fetch properties (GET)
    if (req.method === "GET") {
      const url = new URL(req.url)
      const page = parseInt(url.searchParams.get("page") || "1")
      const limit = parseInt(url.searchParams.get("limit") || "6") // default to 10 items per page

      // Simulate a network delay (latency)

      // Fetch paginated properties from the database
      const { data: properties, error } = await supabaseClient
        .from("properties")
        .select("id, title, location, type, status, custom_image, custom_image_2, custom_image_3, created_at,full_address,bhk,baths,sqft, description, area ")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("GET properties error:", error)
        return jsonResponse({ error: "Failed to fetch properties" }, 500)
      }

      return jsonResponse({
        success: true,
        page,
        count: properties?.length ?? 0,
        properties: properties ?? []
      })
    }


    // Add property (POST)
    if (req.method === "POST") {
      const body = await req.json();

      // Validate required fields
      if (!body.title || !body.location || !body.description) {
        return new Response(
          JSON.stringify({ error: "Missing required fields: title, location, description" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      let image1 = generateImageUrl(body.title, body.type || "House");
      let image2 = generateImageUrl(body.title, body.type || "House");
      let image3 = generateImageUrl(body.title, body.type || "House");

      // Handle custom image uploads
      if (body.custom_image) {
        console.log('Admin: Processing uploaded image for new property')
        image1=body.custom_image;
        // const processedImage = processUploadedImage(body.custom_image);
        // if (processedImage) {
        //   image1 = processedImage;
        //   console.log('Admin: Using uploaded image for new property')
        // }
      }
      if (body.custom_image_2) {
        console.log('Admin: Processing uploaded image for new property');
        image2=body.custom_image_2;
        // const processedImage = processUploadedImage(body.custom_image_2);
        // if (processedImage) {
        //   image2 = processedImage;
        //   console.log('Admin: Using uploaded image for new property')
        // }
      }
      if (body.custom_image_3) {
        console.log('Admin: Processing uploaded image for new property');
        image3 = body.custom_image_3
        // const processedImage = processUploadedImage(body.custom_image_3);
        // if (processedImage) {
        //   image3 = processedImage;
        //   console.log('Admin: Using uploaded image for new property')
        // }
      }

      const propertyData = {
        title: String(body.title).trim(),
        location: String(body.location).trim(),
        full_address: String(body.fullAddress || body.location).trim(),
        type: String(body.type || 'House').trim(),
        status: String(body.status || 'read-to-move').trim(),
        bhk: String(body.bhk || 'read-to-1').trim(),
        baths: String(body.baths || '1').trim(),
        sqft: String(body.sqft || '1000').trim(),
        description: String(body.description).trim(),
        area: String(body.area || '').trim(),
        custom_image: image1,
        custom_image_2: image2,
        custom_image_3: image3,
      };

      // Insert property into the database
      const { data, error } = await supabaseClient
        .from("properties")
        .insert([propertyData])
        .select()
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ error: "Failed to add property", details: error.message }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: "Property added successfully", property: data }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

// Update property (PUT)
// Update property (PUT)
if (req.method === "PUT") {
  const body = await req.json();

  // Validate required fields
  if (!body.id || !body.title || !body.location || !body.description) {
    return new Response(
      JSON.stringify({
        error:
          "Missing required fields: id, title, location, description",
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  // Handle image values (custom images override generated)
  let image1 = generateImageUrl(body.title, body.type || "House");
  let image2 = generateImageUrl(body.title, body.type || "House");
  let image3 = generateImageUrl(body.title, body.type || "House");

  if (body.custom_image) {
    console.log("Admin: Updating uploaded image (1)");
    image1 = body.custom_image;
  }
  if (body.custom_image_2) {
    console.log("Admin: Updating uploaded image (2)");
    image2 = body.custom_image_2;
  }
  if (body.custom_image_3) {
    console.log("Admin: Updating uploaded image (3)");
    image3 = body.custom_image_3;
  }

  // Accept either camelCase fullAddress or snake_case full_address, fallback to location
  const fullAddr = (body.fullAddress || body.full_address || body.location || "").toString().trim();

  const propertyData = {
    title: String(body.title).trim(),
    location: String(body.location).trim(),
    full_address: fullAddr,
    type: String(body.type || "House").trim(),
    status: String(body.status || "ready-to-move").trim(),
    bhk: String(body.bhk || "1").trim(),
    baths: String(body.baths || "1").trim(),
    sqft: String(body.sqft || "1000").trim(),
    description: String(body.description).trim(),
    area: String(body.area || "").trim(),
    custom_image: image1,
    custom_image_2: image2,
    custom_image_3: image3,
  };

  try {
    const { data, error } = await supabaseClient
      .from("properties")
      .update(propertyData)
      .eq("id", body.id)
      .select()
      .single();

    if (error) {
      return new Response(
        JSON.stringify({
          error: "Failed to update property",
          details: error.message,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Property updated successfully",
        property: data,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error updating property:", err);
    return new Response(
      JSON.stringify({ error: "Failed to update property" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
}




    // Delete property (DELETE)
    if (req.method === "DELETE") {
      const body = await req.json();
      const propertyId = body.id || body.propertyId;

      if (!propertyId || isNaN(parseInt(propertyId))) {
        return new Response(
          JSON.stringify({ error: "Valid property ID is required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      const numericId = parseInt(propertyId);

      const { data: existing } = await supabaseClient
        .from("properties")
        .select("*")
        .eq("id", numericId)
        .maybeSingle();

      if (!existing) {
        return new Response(JSON.stringify({ error: "Property not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error: deleteError } = await supabaseClient
        .from("properties")
        .delete()
        .eq("id", numericId);

      if (deleteError) {
        return new Response(
          JSON.stringify({ error: "Failed to delete property", details: deleteError.message }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Property deleted successfully",
          deletedProperty: { id: existing.id, title: existing.title },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed", allowedMethods: ["GET", "POST", "PUT", "DELETE"] }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message, stack: error.stack }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
