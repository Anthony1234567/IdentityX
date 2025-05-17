// src/hooks/useUser.ts
import { useState, useEffect } from "react";

export interface UserInfo {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export function useUser() {
  const [user, setUser] = useState<UserInfo | null>(() => {
    try {
      const raw = localStorage.getItem("user");
      const parsed = raw ? JSON.parse(raw) : null;
      console.log("[useUser] Initial load from localStorage:", parsed);
      return parsed;
    } catch (err) {
      console.error("[useUser] Error parsing localStorage on init:", err);
      return null;
    }
  });

  useEffect(() => {
    const syncUser = () => {
      try {
        const raw = localStorage.getItem("user");
        const parsed = raw ? JSON.parse(raw) : null;
        console.log("[useUser] Synced user from localStorage:", parsed);
        setUser(parsed);
      } catch (err) {
        console.error("[useUser] Error parsing localStorage during sync:", err);
        setUser(null);
      }
    };

    window.addEventListener("storage", syncUser); // cross-tab sync
    const interval = setInterval(syncUser, 1000); // same-tab polling

    console.log("[useUser] useEffect mounted, listening for updates");

    return () => {
      window.removeEventListener("storage", syncUser);
      clearInterval(interval);
      console.log("[useUser] useEffect cleanup");
    };
  }, []);

  return user;
}
