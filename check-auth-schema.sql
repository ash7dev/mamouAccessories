-- Vérifier que le schéma auth existe
SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'auth';

-- Vérifier les tables auth
SELECT table_name FROM information_schema.tables WHERE table_schema = 'auth';

-- Vérifier les migrations auth
SELECT * FROM auth.schema_migrations ORDER BY version DESC LIMIT 5;

-- Vérifier l'utilisateur
SELECT
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at
FROM auth.users
WHERE email = 'mamouadmin@gmail.com';
