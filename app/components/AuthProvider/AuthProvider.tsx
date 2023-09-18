import { createContext, ReactNode, useEffect, useState } from "react";
import { observeAuth } from "~/firebase/authUtils";
import { getUserFromFirestore } from "~/firebase/utils";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "~/firebase/firebaseConfig";

export interface UserProgress {
  xp: number;
  level: number;
}

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
  progress: UserProgress;
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

  const updateUser = (updatedFields: Partial<AppUser>) => {
    setUser((prevUser) => ({ ...prevUser, ...updatedFields }));
  };

  useEffect(() => {
    const unsubscribeAuth = observeAuth(async (firebaseUser) => {
      if (firebaseUser) {
        const appUser = await getUserFromFirestore(firebaseUser.uid);
        if (appUser) {
          setUser({
            ...appUser,
            emailVerified: firebaseUser.emailVerified,
          });
          setIsAuthenticated(true);

          const userDocRef = doc(db, "users", firebaseUser.uid);
          const unsubscribeFirestore = onSnapshot(userDocRef, (docSnapshot) => {
            if (docSnapshot.exists) {
              const data = docSnapshot.data() as AppUser;
              updateUser(data);
            }
          });

          return () => {
            unsubscribeAuth();
            unsubscribeFirestore();
          };
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
      unsubscribeAuth();
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
