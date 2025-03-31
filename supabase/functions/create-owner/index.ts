
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// تكوين أساسي لـ CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

console.log("Hello from create-owner function!");

serve(async (req) => {
  // إذا كان طلب OPTIONS، ارجع استجابة CORS فقط
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // استخراج بيانات الطلب
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return new Response(
        JSON.stringify({
          error: "البيانات غير مكتملة، يرجى تقديم البريد الإلكتروني وكلمة المرور والاسم"
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // تكوين عميل Supabase باستخدام مفاتيح السر
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "تكوين الخادم غير صحيح" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // التحقق مما إذا كان البريد الإلكتروني موجودًا بالفعل
    const { data: existingUsers, error: existingError } = await supabase
      .from("user_roles")
      .select("*")
      .eq("role", "owner");

    if (existingError) {
      throw existingError;
    }

    if (existingUsers && existingUsers.length > 0) {
      return new Response(
        JSON.stringify({ error: "مالك النظام موجود بالفعل" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // إنشاء المستخدم
    const { data: user, error: userError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    });

    if (userError) {
      throw userError;
    }

    // التحقق من إنشاء المستخدم بنجاح
    if (!user || !user.user || !user.user.id) {
      throw new Error("فشل إنشاء المستخدم");
    }

    // إضافة دور المالك للمستخدم
    const { error: roleError } = await supabase
      .from("user_roles")
      .insert([{ user_id: user.user.id, role: "owner" }]);

    if (roleError) {
      // محاولة حذف المستخدم الذي تم إنشاؤه حديثًا إذا فشلت إضافة الدور
      await supabase.auth.admin.deleteUser(user.user.id);
      throw roleError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "تم إنشاء حساب المالك بنجاح",
        user: user.user,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message || "حدث خطأ أثناء إنشاء حساب المالك"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
