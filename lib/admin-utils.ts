/**
 * @file admin-utils.ts
 * @description Utility functions for admin access control
 *
 * Functions to check if a user has admin privileges using Clerk.
 */

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

/**
 * Check if the current user is an admin
 * Admin status is determined by Clerk organization membership or user metadata
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return false;
    }

    const user = await currentUser();
    if (!user) {
      return false;
    }

    // Check if user has admin role in public metadata
    const isAdminUser = user.publicMetadata?.role === "admin" || 
                       user.publicMetadata?.isAdmin === true;

    // Alternatively, check organization membership
    // For now, we'll use metadata-based approach
    return isAdminUser;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

/**
 * Require admin access - redirects to home if not admin
 */
export async function requireAdmin() {
  const admin = await isAdmin();
  if (!admin) {
    redirect("/");
  }
}

