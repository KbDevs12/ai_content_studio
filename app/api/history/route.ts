import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET /api/histories — fetch user's histories from Supabase
export async function GET() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized",
        data: [],
      },
      { status: 401 },
    );
  }

  const { data, error } = await supabase
    .from("histories")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        data: [],
      },
      { status: 500 },
    );
  }

  // Handle empty histories
  if (!data || data.length === 0) {
    return NextResponse.json({
      success: true,
      empty: true,
      message: "No histories found",
      data: [],
    });
  }

  return NextResponse.json({
    success: true,
    empty: false,
    data,
  });
}

// POST /api/histories — save a new histories item
export async function POST(req: Request) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { topic, contentType, tone, language, output } = body;

  if (!topic || !contentType || !output) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("histories")
    .insert({
      user_id: user.id,
      topic,
      content_type: contentType,
      tone,
      language,
      output,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}

// DELETE /api/histories — clear all histories for user
export async function DELETE() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("histories")
    .delete()
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
