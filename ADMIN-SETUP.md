# 🔐 Configuration du Compte Administrateur

Ce guide explique comment créer le compte administrateur pour accéder à l'espace d'administration.

---

## 📋 Informations du Compte Admin

**Email :** `mamouadmin@gmail.com`
**Mot de passe :** `Wala Chicgirl2003`

⚠️ **IMPORTANT** : Changez ce mot de passe après la première connexion !

---

## 🚀 Étape 1 : Créer le Compte Admin

### Option A : Via l'Interface Supabase (Recommandée)

1. **Connectez-vous à Supabase**
   - Allez sur : https://supabase.com/dashboard/project/hsnkxtjwfkyzvxisodjs

2. **Ouvrez la section Authentication**
   - Dans le menu de gauche, cliquez sur **"Authentication"**
   - Cliquez sur **"Users"**

3. **Créez l'utilisateur admin**
   - Cliquez sur le bouton **"Add user"** (en haut à droite)
   - Sélectionnez **"Create new user"**

4. **Remplissez les informations**
   ```
   Email: mamouadmin@gmail.com
   Password: Wala Chicgirl2003
   Auto Confirm User: ✅ (COCHEZ CETTE CASE !)
   ```

5. **Créez l'utilisateur**
   - Cliquez sur **"Create user"**
   - L'utilisateur apparaîtra dans la liste avec un badge "Confirmed"

### Option B : Via SQL (Alternative)

Si vous préférez créer l'utilisateur via SQL :

```sql
-- À exécuter dans le SQL Editor de Supabase
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'mamouadmin@gmail.com',
  crypt('Wala Chicgirl2003', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);
```

---

## ✅ Étape 2 : Vérifier le Compte

1. Dans **Authentication > Users**, vous devriez voir :
   ```
   Email: mamouadmin@gmail.com
   Status: ✅ Confirmed
   Provider: Email
   Created: [date]
   ```

2. Le compte est prêt à être utilisé !

---

## 🔒 Sécurité - À FAIRE APRÈS LA PREMIÈRE CONNEXION

### 1. Changez le mot de passe

Une fois l'application développée, connectez-vous et changez immédiatement le mot de passe :

1. Connectez-vous avec `mamouadmin@gmail.com` / `Wala Chicgirl2003`
2. Allez dans Paramètres (quand on l'aura développé)
3. Changez le mot de passe pour quelque chose de plus sécurisé

### 2. Activez la double authentification (Plus tard)

Supabase supporte 2FA, vous pourrez l'activer plus tard via :
- Authentication > Policies > MFA
- Ou via l'interface utilisateur quand on l'aura développée

---

## 📊 Ordre d'Exécution Complet

Suivez cet ordre précis :

1. ✅ **Créer le compte admin** (VOUS ÊTES ICI)
   - Via Authentication > Users > Add user

2. ⏳ **Exécuter le script SQL** (ENSUITE)
   - SQL Editor > Coller `supabase-schema.sql` > Run

3. ⏳ **Tester la connexion** (APRÈS)
   - Lancer `npm run dev`
   - Aller sur `/admin/login` (quand développé)
   - Se connecter avec les identifiants

---

## 🆘 Problèmes Courants

### "Email already registered"
- L'utilisateur existe déjà
- Solution : Utilisez-le directement ou supprimez-le d'abord

### "User not confirmed"
- Vous avez oublié de cocher "Auto Confirm User"
- Solution : Dans Authentication > Users, cliquez sur l'utilisateur > Confirm User

### "Invalid password"
- Le mot de passe ne respecte pas les règles Supabase
- Solution : Assurez-vous que `Wala Chicgirl2003` est accepté (majuscule, chiffres, ≥8 caractères)

---

## 🎯 Prochaines Étapes

Une fois le compte admin créé :

1. ✅ Compte admin créé
2. ➡️ Exécuter le script SQL ([SETUP-DATABASE.md](SETUP-DATABASE.md))
3. ➡️ Développer la page de login admin
4. ➡️ Tester la connexion

---

**🔐 Compte admin créé avec succès ? Passez à l'exécution du script SQL !**
