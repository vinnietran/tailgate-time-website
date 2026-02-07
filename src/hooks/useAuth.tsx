import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../lib/firebase";
import { mockUser } from "../data/mockUser";
import { debugAuthLog } from "../utils/debug";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      debugAuthLog("state-changed", {
        uid: currentUser?.uid ?? null,
        email: currentUser?.email ?? null
      });
    });

    return () => unsubscribe();
  }, []);

  const value = useMemo(() => ({ user, loading }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
