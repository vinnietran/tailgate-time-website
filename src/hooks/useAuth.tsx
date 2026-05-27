import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { mockUser } from "../data/mockUser";
import { debugAuthLog } from "../utils/debug";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  adminLoading: boolean;
  refreshAdminClaim: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  isAdmin: false,
  adminLoading: true,
  refreshAdminClaim: async () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  const loadAdminAccess = useCallback(async (currentUser: User | null) => {
    if (!currentUser || !db) {
      setIsAdmin(false);
      setAdminLoading(false);
      return;
    }

    setAdminLoading(true);
    try {
      const snapshot = await getDoc(doc(db, "users", currentUser.uid));
      setIsAdmin(snapshot.exists() && snapshot.data()?.admin === true);
    } catch (error) {
      console.error("Failed to resolve admin access", error);
      setIsAdmin(false);
    } finally {
      setAdminLoading(false);
    }
  }, []);

  useEffect(() => {
    debugAuthLog("init", {
      hasAuth: Boolean(auth),
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? "set" : "missing"
    });

    if (!auth) {
      if (import.meta.env.DEV) {
        setUser(mockUser);
        debugAuthLog("fallback:mock-user", { uid: mockUser.uid });
      }
      setLoading(false);
      setAdminLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      void loadAdminAccess(currentUser);
      debugAuthLog("state-changed", {
        uid: currentUser?.uid ?? null,
        email: currentUser?.email ?? null
      });
    });

    return () => unsubscribe();
  }, [loadAdminAccess]);

  const refreshAdminClaim = useCallback(async () => {
    await loadAdminAccess(auth?.currentUser ?? null);
  }, [loadAdminAccess]);

  const value = useMemo(
    () => ({ user, loading, isAdmin, adminLoading, refreshAdminClaim }),
    [adminLoading, isAdmin, loading, refreshAdminClaim, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
