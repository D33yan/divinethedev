import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import os from "os";

const execPromise = promisify(exec);

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

    const supabaseServer = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false
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

    // Format fields for compiler
    const contactLine = [
      `Email: <a href="mailto:dnnaji26@gmail.com" color="#1A365D">dnnaji26@gmail.com</a>`,
      `Phone: +234 810 689 0380`,
      `GitHub: <a href="https://github.com/D33yan" color="#1A365D">github.com/D33yan</a>`,
      `LinkedIn: <a href="https://linkedin.com/in/divine-nnaji-23b771393" color="#1A365D">linkedin.com/in/divine-nnaji-23b771393</a>`,
      `Portfolio: <a href="https://divinethe.dev" color="#1A365D">divinethe.dev</a>`
    ].join("  |  ");

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

    // Save JSON data temporarily in OS writeable temp directory
    const tempJsonFile = path.join(os.tmpdir(), `temp_resume_payload_${Date.now()}.json`);
    const tempPdfFile = path.join(os.tmpdir(), `Divine_Nnaji_CV_${Date.now()}.pdf`);
    fs.writeFileSync(tempJsonFile, JSON.stringify(payload, null, 2), "utf-8");

    // Spawn Python script compilation
    try {
      const scriptPath = path.join(process.cwd(), "scripts", "generate_cv_pdf.py");
      await execPromise(`python "${scriptPath}" "${tempJsonFile}" "${tempPdfFile}"`);

      if (!fs.existsSync(tempPdfFile)) {
        throw new Error("Python script executed but output PDF was not found in temp directory.");
      }

      // Read PDF file into Buffer
      const pdfBuffer = fs.readFileSync(tempPdfFile);

      // Upload directly to Supabase storage bucket 'portfolio-images'
      const { error: uploadError } = await supabaseServer.storage
        .from("portfolio-images")
        .upload("branding/Divine_Nnaji_CV.pdf", pdfBuffer, {
          contentType: "application/pdf",
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Retrieve secure public URL
      const { data: publicUrlData } = supabaseServer.storage
        .from("portfolio-images")
        .getPublicUrl("branding/Divine_Nnaji_CV.pdf");

      const publicUrl = publicUrlData?.publicUrl;
      if (!publicUrl) throw new Error("Could not retrieve public URL for uploaded PDF.");

      // Update resume_url in site_settings table
      const { error: updateError } = await supabaseServer
        .from("site_settings")
        .update({ resume_url: publicUrl })
        .eq("id", "primary");

      if (updateError) throw updateError;

      return NextResponse.json({ 
        success: true, 
        message: "PDF CV successfully generated and uploaded to Supabase Storage.",
        url: publicUrl
      });
    } catch (execErr: any) {
      console.error("Python exec compilation failed:", execErr);
      return NextResponse.json({ error: `Python compilation failed: ${execErr.message}` }, { status: 500 });
    } finally {
      // Clean up temp files
      if (fs.existsSync(tempJsonFile)) {
        fs.unlinkSync(tempJsonFile);
      }
      if (fs.existsSync(tempPdfFile)) {
        fs.unlinkSync(tempPdfFile);
      }
    }
  } catch (err: any) {
    console.error("Generate PDF API Error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
