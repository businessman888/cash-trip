-- Adicionar constraint UNIQUE para evitar respostas duplicadas
ALTER TABLE quiz_responses 
ADD CONSTRAINT unique_user_question UNIQUE (user_id, question_key);

-- Garantir que as políticas RLS estão corretas para user_profiles
-- Remover políticas antigas se existirem e recriar
DROP POLICY IF EXISTS "Service can insert profiles" ON user_profiles;
DROP POLICY IF EXISTS "Service can update profiles" ON user_profiles;

-- Criar políticas corretas onde usuário pode inserir/atualizar seu próprio perfil
CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);



