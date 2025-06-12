import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { authApi } from '../services/api';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  showWelcomePopup: boolean;
  setShowWelcomePopup: (show: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);

  useEffect(() => {
    // Initial session check
    const checkUser = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError.message);
          setUser(null);
        } else if (session?.user) {
          setUser(session.user);
          // NÃO mostrar popup na verificação inicial da sessão
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          setLoading(false);
          // Mostrar popup apenas em login ativo, não em verificação de sessão
          if (event === 'SIGNED_IN') {
            setShowWelcomePopup(true);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setLoading(false);
          setShowWelcomePopup(false);
        } else if (session?.user) {
          setUser(session.user);
          setLoading(false);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    // Cleanup subscription
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        throw error;
      }
      
      if (data?.user) {
        console.log('Login successful:', data.user.email);
        setUser(data.user);
        toast.success('Login realizado com sucesso!');
        
        // Mostrar popup APENAS no login manual
        setShowWelcomePopup(true);
        
        // Force a small delay to ensure state is updated
        setTimeout(() => {
          setLoading(false);
        }, 100);
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      toast.error(error.message || 'Falha ao fazer login');
      setLoading(false);
      throw error;
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      if (data?.user) {
        setUser(data.user);
        toast.success('Conta criada com sucesso!');
        // Mostrar popup apenas em signup manual
        setShowWelcomePopup(true);
      }
    } catch (error: any) {
      toast.error(error.message || 'Falha ao criar conta');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setShowWelcomePopup(false);
      toast.success('Logout realizado com sucesso');
    } catch (error: any) {
      toast.error(error.message || 'Falha ao fazer logout');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      showWelcomePopup, 
      setShowWelcomePopup, 
      login, 
      signup, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};