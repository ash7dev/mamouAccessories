-- Vérifier l'utilisateur admin
SELECT
  id,
  email,
  email_confirmed_at,
  created_at,
  aud,
  role
FROM auth.users
WHERE email = 'mamouadmin@gmail.com';

-- Si l'utilisateur existe mais email_confirmed_at est NULL, exécutez ceci :
UPDATE auth.users
SET
  email_confirmed_at = NOW(),
  updated_at = NOW()
WHERE email = 'mamouadmin@gmail.com';

-- Vérifier que l'auth est activée (cette requête doit retourner des résultats)
SELECT * FROM auth.schema_migrations LIMIT 5;
