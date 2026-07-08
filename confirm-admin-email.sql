-- Confirmer l'email de l'utilisateur admin
UPDATE auth.users
SET
  email_confirmed_at = NOW(),
  confirmation_token = '',
  updated_at = NOW()
WHERE email = 'mamouadmin@gmail.com';

-- Vérifier que ça a marché
SELECT
  id,
  email,
  email_confirmed_at,
  created_at,
  confirmation_token
FROM auth.users
WHERE email = 'mamouadmin@gmail.com';
