import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";

async function generatePdfKitResume(data: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "LETTER",
        margins: { top: 36, bottom: 36, left: 36, right: 36 }
      });

      const buffers: Buffer[] = [];
      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (err) => reject(err));

      // Color palette definitions matching styling
      const COLOR_PRIMARY = "#1A365D"; // Deep Navy
      const COLOR_BODY = "#2D3748";    // Charcoal / Slate
      const COLOR_SUB = "#718096";     // Cool Grey

      // --- HEADER ---
      doc.font("Helvetica-Bold")
         .fontSize(18)
         .fillColor(COLOR_PRIMARY)
         .text(data.name.toUpperCase(), { align: "center" });
         
      doc.moveDown(0.2);
      
      doc.font("Helvetica-Bold")
         .fontSize(10.5)
         .fillColor(COLOR_SUB)
         .text(data.role, { align: "center" });
         
      doc.moveDown(0.4);
      
      doc.font("Helvetica")
         .fontSize(8.5)
         .fillColor(COLOR_BODY)
         .text(data.contacts, { align: "center" });
         
      doc.moveDown(0.8);

      // Section header helper
      const addSectionHeader = (title: string) => {
        doc.font("Helvetica-Bold")
           .fontSize(11)
           .fillColor(COLOR_PRIMARY)
           .text(title.toUpperCase());
           
        // Draw line below section header
        const y = doc.y + 2;
        doc.moveTo(36, y)
           .lineTo(576, y)
           .strokeColor(COLOR_PRIMARY)
           .lineWidth(1.2)
           .stroke();
           
        doc.moveDown(0.6);
      };

      // --- PROFESSIONAL SUMMARY ---
      addSectionHeader("Professional Summary");
      doc.font("Helvetica")
         .fontSize(9.5)
         .fillColor(COLOR_BODY)
         .text(data.summary, { align: "justify" });
         
      doc.moveDown(0.8);

      // --- TECHNICAL SKILLS ---
      addSectionHeader("Technical Skills");
      let skillsY = doc.y;
      (data.skills || []).forEach((s: any) => {
        doc.font("Helvetica-Bold")
           .fontSize(9)
           .fillColor(COLOR_PRIMARY)
           .text(`${s.category}:`, 36, skillsY, { width: 130 });
           
        doc.font("Helvetica")
           .fontSize(9)
           .fillColor(COLOR_BODY)
           .text(s.items, 166, skillsY, { width: 410, align: "justify" });
           
        skillsY = doc.y + 14;
      });
      
      doc.y = skillsY;
      doc.moveDown(0.6);

      // --- PROFESSIONAL EXPERIENCE ---
      addSectionHeader("Professional Experience");
      
      (data.jobs || []).forEach((job: any) => {
        const startY = doc.y;
        
        doc.font("Helvetica-Bold")
           .fontSize(10)
           .fillColor(COLOR_PRIMARY)
           .text(job.role, 36, startY, { width: 360 });
           
        doc.font("Helvetica-Bold")
           .fontSize(10)
           .fillColor(COLOR_PRIMARY)
           .text(job.period, 396, startY, { width: 180, align: "right" });
           
        doc.moveDown(0.1);
        const subY = doc.y;
        
        doc.font("Helvetica-Bold")
           .fontSize(9)
           .fillColor(COLOR_SUB)
           .text(job.company, 36, subY, { width: 360 });
           
        doc.font("Helvetica")
           .fontSize(9)
           .fillColor(COLOR_SUB)
           .text(job.location, 396, subY, { width: 180, align: "right" });
           
        doc.moveDown(0.15);
        const techY = doc.y;
        
        doc.font("Helvetica-BoldOblique")
           .fontSize(8.5)
           .fillColor(COLOR_PRIMARY)
           .text("Technologies Utilized: ", 36, techY, { width: 110 });
           
        doc.font("Helvetica-Oblique")
           .fontSize(8.5)
           .fillColor(COLOR_BODY)
           .text(job.tech, 146, techY, { width: 430 });
           
        doc.moveDown(0.2);
        
        (job.bullets || []).forEach((bullet: string) => {
          const bulletY = doc.y;
          doc.font("Helvetica")
             .fontSize(9)
             .fillColor(COLOR_PRIMARY)
             .text("•", 36, bulletY, { width: 12 });
             
          doc.font("Helvetica")
             .fontSize(9)
             .fillColor(COLOR_BODY)
             .text(bullet, 48, bulletY, { width: 528, align: "justify" });
             
          doc.moveDown(0.1);
        });
        
        doc.moveDown(0.4);
      });

      // --- SELECTED PROJECTS ---
      addSectionHeader("Selected Projects");
      
      (data.projects || []).forEach((proj: any) => {
        doc.font("Helvetica-Bold")
           .fontSize(10)
           .fillColor(COLOR_PRIMARY)
           .text(proj.title);
         
        doc.moveDown(0.1);
        const projTechY = doc.y;
        
        doc.font("Helvetica-BoldOblique")
           .fontSize(8.5)
           .fillColor(COLOR_PRIMARY)
           .text("Technologies: ", 36, projTechY, { width: 75 });
         
        doc.font("Helvetica-Oblique")
           .fontSize(8.5)
           .fillColor(COLOR_SUB)
           .text(proj.tech, 111, projTechY, { width: 465 });
         
        doc.moveDown(0.1);
        
        doc.font("Helvetica")
           .fontSize(9)
           .fillColor(COLOR_BODY)
           .text(proj.desc, { align: "justify" });
         
        doc.moveDown(0.3);
      });

      // --- EDUCATION & CERTIFICATIONS ---
      addSectionHeader("Education & Certifications");
      
      (data.education || []).forEach((edu: any) => {
        const curY = doc.y;
        doc.font("Helvetica-Bold")
           .fontSize(10)
           .fillColor(COLOR_PRIMARY)
           .text(edu.title, 36, curY, { width: 360 });
         
        doc.font("Helvetica-Bold")
           .fontSize(10)
           .fillColor(COLOR_PRIMARY)
           .text(edu.period, 396, curY, { width: 180, align: "right" });
         
        doc.moveDown(0.1);
        const curSubY = doc.y;
        
        doc.font("Helvetica-Bold")
           .fontSize(9.5)
           .fillColor(COLOR_SUB)
           .text(edu.org, 36, curSubY, { width: 360 });
         
        doc.font("Helvetica")
           .fontSize(9.5)
           .fillColor(COLOR_SUB)
           .text(edu.org.includes("Abuja") ? "Abuja, Nigeria" : "Remote", 396, curSubY, { width: 180, align: "right" });
         
        doc.moveDown(0.4);
      });
      
      doc.moveDown(0.2);
      
      if (data.certs && data.certs.length > 0) {
        doc.font("Helvetica-Bold")
           .fontSize(10)
           .fillColor(COLOR_PRIMARY)
           .text("Professional Certifications (EarlyCode Training Institute)");
         
        doc.moveDown(0.2);
        
        (data.certs || []).forEach((cert: any) => {
          const certY = doc.y;
          doc.font("Helvetica")
             .fontSize(9.5)
             .fillColor(COLOR_PRIMARY)
             .text("•", 36, certY, { width: 12 });
             
          doc.font("Helvetica")
             .fontSize(9.5)
             .fillColor(COLOR_BODY)
             .text(cert.title, 48, certY, { width: 348 });
             
          doc.font("Helvetica")
             .fontSize(9.5)
             .fillColor(COLOR_BODY)
             .text(cert.period, 396, certY, { width: 180, align: "right" });
             
          doc.moveDown(0.15);
        });
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

// Resilient self-healing helper to upload to portfolio-assets first, and fallback to portfolio-images
async function uploadToSupabaseBucket(
  supabaseClient: any,
  filePath: string,
  fileBody: Buffer,
  contentType: string
): Promise<string> {
  // 1. Attempt upload to portfolio-assets
  try {
    const { error: uploadErr } = await supabaseClient.storage
      .from("portfolio-assets")
      .upload(filePath, fileBody, {
        contentType,
        upsert: true
      });

    if (!uploadErr) {
      const { data } = supabaseClient.storage
        .from("portfolio-assets")
        .getPublicUrl(filePath);
      if (data?.publicUrl) return data.publicUrl;
    }
  } catch (err) {
    console.warn("Attempt to upload to portfolio-assets failed:", err);
  }

  // 2. Fallback to portfolio-images under project-images/ folder path
  const fallbackPath = `project-images/${filePath.split("/").pop()}`;
  const { error: fallbackErr } = await supabaseClient.storage
    .from("portfolio-images")
    .upload(fallbackPath, fileBody, {
      contentType,
      upsert: true
    });

  if (fallbackErr) {
    throw new Error(`Storage upload failed for both portfolio-assets and portfolio-images: ${fallbackErr.message}`);
  }

  const { data: fallbackData } = supabaseClient.storage
    .from("portfolio-images")
    .getPublicUrl(fallbackPath);

  if (!fallbackData?.publicUrl) {
    throw new Error("Could not retrieve public URL for fallback storage upload.");
  }

  return fallbackData.publicUrl;
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized access: Bearer token required" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || "";
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Supabase configuration missing on server" }, { status: 500 });
    }

    // Initialize client with authorization token to respect RLS settings on storage/tables
    const supabaseServer = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false
      },
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    });

    // Verify token and retrieve user
    const { data: { user }, error: userError } = await supabaseServer.auth.getUser(token);
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized access: Invalid token" }, { status: 401 });
    }

    // Verify admin role in profiles table
    const { data: profile, error: profileError } = await supabaseServer
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin privilege required" }, { status: 403 });
    }

    // Fetch dynamic resume data from Supabase tables
    const { data: dbSettings } = await supabaseServer.from("site_settings").select("*").eq("id", "primary").maybeSingle();
    const { data: dbExperiences } = await supabaseServer.from("experiences").select("*").order("sort_order", { ascending: true });
    const { data: dbProjects } = await supabaseServer.from("projects").select("*").order("sort_order", { ascending: true });
    const { data: dbSkills } = await supabaseServer.from("skill_groups").select("*").order("sort_order", { ascending: true });
    const { data: dbEducation } = await supabaseServer.from("education").select("*").order("sort_order", { ascending: true });
    const { data: dbCertifications } = await supabaseServer.from("certifications").select("*").order("created_at", { ascending: true });

    // Format contact layout fields for compiler
    const contactLine = [
      `Email: dnnaji26@gmail.com`,
      `Phone: +234 810 689 0380`,
      `GitHub: github.com/D33yan`,
      `LinkedIn: linkedin.com/in/divine-nnaji-23b771393`,
      `Portfolio: divinethe.dev`
    ].join("   |   ");

    const payload = {
      name: "Divine Chibueze Nnaji (Navie)",
      role: "Fullstack Software Engineer & AI Systems Developer",
      contacts: contactLine,
      summary: dbSettings?.seo_description || "Dynamic, results-driven Fullstack Software Engineer...",
      skills: (dbSkills || []).map(s => ({
        category: s.title,
        items: (s.skills || []).join(", ")
      })),
      jobs: (dbExperiences || []).map(e => ({
        role: e.role,
        company: e.company,
        location: e.location || "Remote",
        period: e.period,
        tech: (e.tech || []).join(", "),
        bullets: e.bullets || []
      })),
      projects: (dbProjects || []).map(p => ({
        title: p.title,
        tech: (p.tech || []).join(", "),
        desc: p.description
      })),
      education: (dbEducation || []).map(edu => ({
        title: edu.title,
        org: edu.org,
        period: edu.period
      })),
      certs: (dbCertifications || []).map(c => ({
        title: c.title,
        period: c.period
      }))
    };

    // Compile PDF in-memory using PDFKit
    try {
      const pdfBuffer = await generatePdfKitResume(payload);

      // Upload using fallback function
      const publicUrl = await uploadToSupabaseBucket(
        supabaseServer,
        "branding/Divine_Nnaji_CV.pdf",
        pdfBuffer,
        "application/pdf"
      );

      // Update resume_url in site_settings table
      const { error: updateError } = await supabaseServer
        .from("site_settings")
        .update({ resume_url: publicUrl })
        .eq("id", "primary");

      if (updateError) throw updateError;

      return NextResponse.json({ 
        success: true, 
        message: "PDF CV successfully generated in-memory and uploaded to Supabase Storage.",
        url: publicUrl
      });
    } catch (compileErr: any) {
      console.error("PDFKit compile/upload failed:", compileErr);
      return NextResponse.json({ error: `CV compilation failed: ${compileErr.message}` }, { status: 500 });
    }
  } catch (err: any) {
    console.error("Generate PDF API Error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
