
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from "firebase/auth";
import { auth, storage } from "../lib/firebase";
import { useToast } from "./use-toast";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

type AuthContextType = {
  user: FirebaseUser | null;
  isLoading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, username: string, displayName: string) => Promise<void>;
  updateUserProfile: (displayName: string, photoURL?: File) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta.",
      });
    } catch (err) {
      const error = err as Error;
      toast({
        title: "Falha no login",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (email: string, password: string, username: string, displayName: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, {
        displayName: displayName || username
      });
      setUser(result.user);
      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo à nossa comunidade.",
      });
    } catch (err) {
      const error = err as Error;
      toast({
        title: "Falha no cadastro",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateUserProfile = async (displayName: string, photoFile?: File) => {
    if (!user) return;

    try {
      let photoURL = user.photoURL;

      if (photoFile) {
        const storageRef = ref(storage, `avatars/${user.uid}`);
        const snapshot = await uploadBytes(storageRef, photoFile);
        photoURL = await getDownloadURL(snapshot.ref);
      }

      await updateProfile(user, {
        displayName,
        photoURL
      });

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      });
    } catch (err) {
      const error = err as Error;
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      toast({
        title: "Logout realizado",
        description: "Até logo!",
      });
    } catch (err) {
      const error = err as Error;
      toast({
        title: "Falha ao sair",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        logout,
        register,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
