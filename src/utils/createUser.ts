import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export const createNewUser = async (email: string, password: string) => {
  try {
    console.log('Criando usuário:', email);
    
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: undefined // Desabilita confirmação por email
      }
    });

    if (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }

    console.log('Usuário criado com sucesso:', data);
    return data;
  } catch (error: any) {
    console.error('Erro na criação do usuário:', error);
    throw error;
  }
};

// Função para criar o usuário específico
export const createJoaoUser = async () => {
  try {
    const result = await createNewUser('joao@criativfy.com.br', '12345678');
    toast.success('Usuário João criado com sucesso!');
    return result;
  } catch (error: any) {
    toast.error(`Erro ao criar usuário: ${error.message}`);
    throw error;
  }
};