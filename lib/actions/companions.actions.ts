"use server";

import { auth } from "@clerk/nextjs/server";
import createSupabaseClient from "../supabase";
import { CreateCompanion, GetAllCompanions } from "@/types";
import { toast } from "sonner";

export async function createCompanion(FormData: CreateCompanion) {
  const { userId: author } = await auth();
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("companions")
    .insert({ ...FormData, author })
    .select();

  if (error || !data) {
    return error?.message || "Failed to create companion";
  }

  return data[0];
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
    throw new Error(error?.message || "Failed to get companions");
  }
  return data;
}

export async function getCompanionById(id: string) {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("companions")
    .select()
    .eq("id", id);

  if (error || !data) {
    throw new Error(error?.message || "Failed to get companion");
  }
  return data[0];
}

export const addToSessionHistory = async (companionId: string) => {
  const supabase = createSupabaseClient();
  const { userId } = await auth();
  const { data, error } = await supabase
    .from("session_history")
    .insert({ companion_id: companionId, user_id: userId })
    .select();

  if (error || !data) {
    throw new Error(error?.message || "Failed to add to session history");
  }
  return data;
};

export const getSessionHistory = async (limit = 10) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("session_history")
    .select(`companions:companion_id (*)`)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    throw new Error(error?.message || "Failed to get session history");
  }

  return data.map((session) => session.companions);
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
    toast.error(error?.message || "Failed to get session history");
    return [];
  }

  return data.map((session) => session.companions);
};

export const getUserCompanions = async (userId: string) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("companions")
    .select()
    .eq("author", userId);

  if (error || !data) {
    toast.error(error?.message || "Failed to get user companions");
    return [];
  }

  return data;
};
