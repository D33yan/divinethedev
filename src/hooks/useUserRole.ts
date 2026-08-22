"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useUserRole() {
  const [role, setRole] = useState<"admin" | "viewer" | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setEmail(session.user.email || "");
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single();
          if (profile) {
            setRole(profile.role);
          }
        }
      } catch (err) {
        console.error("Failed to retrieve profile credentials:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRole();
  }, []);

  return {
    role,
    email,
    isAdmin: role === "admin",
    loading
  };
}
