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
      const { data: properties, error } = await supabaseClient
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        return new Response(
          JSON.stringify({ error: "Failed to fetch properties", details: error.message }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      return new Response(
        JSON.stringify({ success: true, properties: properties || [] }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
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
    if (req.method === "PUT") {
  const body = await req.json();

  // ✅ Validate required field: ID
  if (!body.id) {
    return new Response(
      JSON.stringify({ error: "Property ID is required for update" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  // ✅ Fetch the existing property
  const { data: existing, error: fetchError } = await supabaseClient
    .from("properties")
    .select("*")
    .eq("id", body.id)
    .single();

  if (fetchError || !existing) {
    return new Response(
      JSON.stringify({ error: "Property not found" }),
      {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  // ✅ Set fallback generated images if none are provided
  let image1 = existing.custom_image || generateImageUrl(body.title || existing.title, body.type || existing.type);
  let image2 = existing.custom_image_2 || generateImageUrl(body.title || existing.title, body.type || existing.type);
  let image3 = existing.custom_image_3 || generateImageUrl(body.title || existing.title, body.type || existing.type);

  // ✅ Handle uploaded custom images
  if (body.custom_image) {
    console.log("Admin: Processing uploaded image (1) for update");
    image1 = body.custom_image;
  }
  if (body.custom_image_2) {
    console.log("Admin: Processing uploaded image (2) for update");
    image2 = body.custom_image_2;
  }
  if (body.custom_image_3) {
    console.log("Admin: Processing uploaded image (3) for update");
    image3 = body.custom_image_3;
  }

  // ✅ Prepare clean updated data (replica of POST structure)
  const updateData = {
    title: String(body.title || existing.title).trim(),
    location: String(body.location || existing.location).trim(),
    full_address: String(body.full_address || existing.full_address || body.location || existing.location).trim(),
    type: String(body.type || existing.type || "House").trim(),
    status: String(body.status || existing.status || "ready-to-move").trim(),
    bhk: String(body.bhk || existing.bhk || "1").trim(),
    baths: String(body.baths || existing.baths || "1").trim(),
    sqft: String(body.sqft || existing.sqft || "1000").trim(),
    description: String(body.description || existing.description || "").trim(),
    area: String(body.area || existing.area || "").trim(),
    custom_image: image1,
    custom_image_2: image2,
    custom_image_3: image3,
  };

  // ✅ Update the property in database
  const { data, error } = await supabaseClient
    .from("properties")
    .update(updateData)
    .eq("id", body.id)
    .select()
    .single();

  if (error) {
    return new Response(
      JSON.stringify({ error: "Failed to update property", details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  return new Response(
    JSON.stringify({ success: true, message: "Property updated successfully", property: data }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
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
