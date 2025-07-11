"use server";

import { auth } from "@clerk/nextjs/server";
import createSupabaseClient from "../supabase";
import { CreateCompanion } from "@/types";

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
