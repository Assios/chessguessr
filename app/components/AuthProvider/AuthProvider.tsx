import { createContext, ReactNode, useEffect, useState } from "react";
import { observeAuth } from "~/firebase/authUtils";
import { getUserFromFirestore } from "~/firebase/utils";

export interface PlayerStats {
  gamesPlayed: number;
  currentStreak: number;
  lastPlayed: string | null;
  guesses: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    failed: number;
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconUrl?: string;
  achieved: boolean;
}

export interface AppUser {
  uid: string;
  email: string;
  emailVerified: boolean;
  username: string;
  stats: PlayerStats;
  emailHash: string;
  lastUpdatedUsername: any;
  importedLocalStorageDate: string | null;
  achievements: string[];
}

interface AuthContextType {
  user: AppUser | null;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  updateUser: any;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const updateUser = (updatedUser: AppUser) => {
    setUser(updatedUser);
  };

  useEffect(() => {
    const unsubscribe = observeAuth(async (firebaseUser) => {
      if (firebaseUser) {
        const appUser = await getUserFromFirestore(firebaseUser.uid);
        if (appUser) {
          setUser({
            ...appUser,
            emailVerified: firebaseUser.emailVerified,
          });
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, setIsAuthenticated, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
