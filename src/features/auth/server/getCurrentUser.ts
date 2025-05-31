import axiosServer from "@/shared/lib/axiosServer";
import { AuthUser } from "@/shared/types/user";

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const res = await axiosServer.get("/auth/me");
    return res.data;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}
