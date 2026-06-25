import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { getSupabaseServerClient } from "./supabase";

export const getUserFn = createServerFn().handler(async () => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    return { user: null };
  }
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) return { user: null };
    return data;
  } catch (err) {
    return { user: null };
  }
});

export const loginFn = createServerFn()
  .validator(z.object({ email: z.string().email(), password: z.string() }))
  .handler(async ({ data: formInput }) => {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formInput.email,
      password: formInput.password,
    });
    if (error) throw new Error(error.message);
    return data;
  });
  
export const signUpFn = createServerFn()
  .validator(z.object({ email: z.string().email(), password: z.string() }))
  .handler(async ({ data: formInput }) => {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase.auth.signUp({
      email: formInput.email,
      password: formInput.password,
    });
    if (error) throw new Error(error.message);
    return data;
  });

export const logoutFn = createServerFn().handler(async () => {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
  return { success: true };
});

export const sendPasswordResetEmailFn = createServerFn()
  .validator(z.object({ email: z.string().email(), redirectTo: z.string() }))
  .handler(async ({ data: formInput }) => {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.auth.resetPasswordForEmail(formInput.email, {
      redirectTo: formInput.redirectTo,
    });
    if (error) throw new Error(error.message);
    return { success: true };
  });

export const updatePasswordFn = createServerFn()
  .validator(z.object({ password: z.string() }))
  .handler(async ({ data: formInput }) => {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.auth.updateUser({ password: formInput.password });
    if (error) throw new Error(error.message);
    return { success: true };
  });

export const setSessionFn = createServerFn()
  .validator(z.object({ access_token: z.string(), refresh_token: z.string() }))
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.auth.setSession({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    });
    if (error) throw new Error(error.message);
    return { success: true };
  });

export const exchangeCodeFn = createServerFn()
  .validator(z.object({ code: z.string() }))
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(data.code);
    if (error) throw new Error(error.message);
    return { success: true };
  });
