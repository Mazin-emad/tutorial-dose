"use server";

import { auth } from "@clerk/nextjs/server";
import createSupabaseClient from "../supabase";
import { CreateCompanion, GetAllCompanions } from "@/types";
import { revalidatePath } from "next/cache";

export async function createCompanion(FormData: CreateCompanion) {
  const { userId: author } = await auth();
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("companions")
    .insert({ ...FormData, author })
    .select();

  if (error || !data) {
    return { success: false, message: "Error: " + error?.message };
  }

  return { success: true, data: data[0] };
}

export async function getCompanions({
  limit = 10,
  page = 1,
  topic,
  subject,
}: GetAllCompanions) {
  const supabase = createSupabaseClient();
  let q = supabase.from("companions").select();

  // Apply subject filter
  if (subject) {
    q = q.eq("subject", subject);
  }

  // Apply topic search (searches in both topic and name fields)
  if (topic) {
    q = q.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
  }

  const { data, error } = await q.range(limit * (page - 1), limit * page - 1);

  if (error || !data) {
    return { success: false, message: "Error: " + error?.message };
  }
  return { success: true, data };
}

export async function getCompanionById(id: string) {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("companions")
    .select()
    .eq("id", id);

  if (error || !data) {
    return { success: false, message: "Error: " + error?.message };
  }
  return { success: true, data: data[0] };
}

export const addToSessionHistory = async (companionId: string) => {
  const supabase = createSupabaseClient();
  const { userId } = await auth();
  const { data, error } = await supabase
    .from("session_history")
    .insert({ companion_id: companionId, user_id: userId })
    .select();

  if (error || !data) {
    return { success: false, message: "Error: " + error?.message };
  }
  return { success: true, data };
};

export const getSessionHistory = async (limit = 10) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("session_history")
    .select(`companions:companion_id (*)`)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return { success: false, message: "Error: " + error?.message };
  }

  return { success: true, data: data.map((session) => session.companions) };
};

export const getUserSessionHistory = async (userId: string, limit = 10) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("session_history")
    .select(`companions:companion_id (*)`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    console.error(error?.message);
    return { success: false, message: "Error: " + error?.message };
  }

  return { success: true, data: data.map((session) => session.companions) };
};

export const getUserCompanions = async (userId: string) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("companions")
    .select()
    .eq("author", userId);

  if (error || !data) {
    console.error(error?.message);
    return { success: false, message: "Error: " + error?.message };
  }

  return { success: true, data };
};

export const newUserPermissions = async () => {
  const { userId, has } = await auth();
  if (has({ plan: "pro" })) {
    return true;
  }

  let limit = 0;
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("companions")
    .select("*", { count: "exact" })
    .eq("author", userId);

  if (error || !data) {
    console.error("Failed to get user companions:", error?.message);
    return false;
  }

  if (has({ plan: "basic" })) {
    limit = 3;
  } else {
    limit = 10;
  }

  if (data.length >= limit) {
    return false;
  }

  return true;
};

export const addBookmark = async (companionId: string, path: string) => {
  const supabase = createSupabaseClient();
  const { userId } = await auth();

  // First, fetch current bookmarks
  const { data: companion, error: fetchError } = await supabase
    .from("companions")
    .select("bookmarks")
    .eq("id", companionId)
    .single();

  if (fetchError || !companion) {
    console.error("Failed to fetch current bookmarks:", fetchError?.message);
    return { success: false, error: "Failed to fetch current bookmarks" };
  }

  if (companion.bookmarks?.includes(userId)) {
    return { success: true, message: "Already bookmarked" };
  }

  const updatedBookmarks = [...(companion.bookmarks || []), userId];

  const { error: updateError } = await supabase
    .from("companions")
    .update({ bookmarks: updatedBookmarks })
    .eq("id", companionId);

  if (updateError) {
    console.error("Failed to add bookmark:", updateError.message);
    return { success: false, error: "Failed to add bookmark" };
  }

  revalidatePath(path);
  return { success: true, message: "Bookmark added successfully" };
};

export const removeBookmark = async (companionId: string, path: string) => {
  const supabase = createSupabaseClient();
  const { userId } = await auth();

  const { data: companion, error: fetchError } = await supabase
    .from("companions")
    .select("bookmarks")
    .eq("id", companionId)
    .single();

  if (fetchError || !companion) {
    console.error("Failed to fetch current bookmarks:", fetchError?.message);
    return { success: false, error: "Failed to fetch current bookmarks" };
  }

  const updatedBookmarks = (companion.bookmarks || []).filter(
    (id: string) => id !== userId
  );

  const { error: updateError } = await supabase
    .from("companions")
    .update({ bookmarks: updatedBookmarks })
    .eq("id", companionId);

  if (updateError) {
    console.error("Failed to remove bookmark:", updateError.message);
    return { success: false, error: "Failed to remove bookmark" };
  }

  revalidatePath(path);
  return { success: true, message: "Bookmark removed successfully" };
};

export const getUserBookmarks = async () => {
  const supabase = createSupabaseClient();
  const { userId } = await auth();

  const { data, error } = await supabase
    .from("companions")
    .select("*")
    .contains("bookmarks", [userId]);

  if (error) {
    console.log(error);
    return { success: false, message: "Error: " + error?.message };
  }

  return { success: true, data };
};
