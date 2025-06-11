
Uu$123456789

>$ npm i xlsx
>$ npm i swiper

    npm i @capacitor/splash-screen
rm -rf android
rm -rf www
ionic build
ionic cap add android
    ionic cap add ios
ionic cap sync
npx capacitor-assets generate
    npx capacitor-assets generate --android --ios
ionic cap open android

npm install @capacitor/assets --save-dev
assets/
├── icon-only.png
├── icon-foreground.png
├── icon-background.png
├── splash.png
└── splash-dark.png
Icon files should be at least 1024px x 1024px. Splash screen files should be at least 2732px x 2732px.

npx capacitor-assets generate

>  error de net::ERR_CACHE_READ_FAILURE 
>$ rm -rf .angular/cache
------------------------------------------------------------------------------------------
-- Create the categories Table
create table if not exists cursos (
  crs_id uuid primary key default gen_random_uuid(),
  crs_name text not null unique,
  crs_description text not null,
  crs_code text not null unique
);


create table if not exists categorias (
  cat_id uuid primary key default gen_random_uuid(),
  cat_title text not null,
  cat_subtitle text not null unique,
  cat_description text not null,
  cat_crs_id uuid references cursos(crs_id) on delete set null,
  created_at timestamp default now()
);


-- Create questions table
create table if not exists preguntas (
  pr_id uuid primary key default gen_random_uuid(),
  pr_question text not null,
  pr_content text not null,
  pr_img text,
  pr_difficulty text not null,
  pr_options jsonb not null,
  pr_answer text not null,
  pr_type text not null,
  pr_tags jsonb not null,
  pr_cat_id uuid references categorias(cat_id) on delete set null,
  created_at timestamp default now()
);


-- Create examen table
create table if not exists examenes (
  exm_id uuid primary key default gen_random_uuid(),
  exm_name text not null,
  exm_usr_id uuid references usuarios(usr_id) on delete set null, -- Creador del examen
  exm_description text not null,
  exm_pr jsonb not null, -- [{"pr_id": "uuid", "pr_point": 1.0}, ...]
  exm_duration text not null,
  exm_state text not null check (exm_state in ('private', 'public')), -- Estado general del examen (private/public)
  exm_access jsonb default '[]', -- Accesos: [{"usr_id": "uuid", "usr_calification": "9.5", "usr_time": "", "usr_attempts": "intento 1"}, ...]
  exm_crs_id uuid references cursos(crs_id) on delete set null,
  created_at timestamp default now()
);

-- Create usuarios Table
create table if not exists usuarios (
  usr_id uuid primary key default gen_random_uuid(),
  usr_username text not null unique, -- nombre de usuario
  usr_name text not null,            -- nombre completo (opcional según tu uso)
  usr_email text not null unique,
  usr_password text,                 -- puede ser null si se usa Google Auth
  usr_recoveryToken text,
  usr_is_google_authenticated boolean default false,
  usr_is_active boolean default true,
  usr_r_id uuid references roles(r_id) on delete set null,
  usr_infp_id uuid references informacion_personal(infp_id) on delete set null,
  created_at timestamp default now(),
  updated_at timestamp
);

create table if not exists roles (
  r_id uuid primary key default gen_random_uuid(),
  r_name text not null unique, -- Nombre del rol
  r_description text null, -- Descripción del rol
  r_level integer not null, -- Nivel del rol (por ejemplo, admin = 1, docente = 2, estudiante = 3)
  r_permissions jsonb default '[]',
  created_at timestamp default now()
);

-- Create informacion personal Table
create table if not exists informacion_personal (
  infp_id uuid primary key default gen_random_uuid(),
  infp_firstName text not null,
  infp_lastName text not null,
  infp_phone text not null,
  infp_address text null,
  infp_birthday date null,
  infp_img text, -- URL o base64 de la imagen
  created_at timestamp default now()
);

-- Create publicidad table
create table if not exists publicidad (
  pub_id uuid primary key default gen_random_uuid(),
  pub_title text not null,
  pub_description text,
  pub_img_url text, -- banner o imagen promocional
  pub_link_url text, -- URL destino al hacer clic
  pub_type text not null, -- ejemplo: 'banner', 'popup', 'video'
  pub_position text not null, -- ejemplo: 'inicio', 'sidebar', 'footer'
  pub_audience jsonb, -- ejemplo: ['docente', 'estudiante']
  pub_priority integer default 0, -- para orden de visualización
  pub_start timestamp, -- fecha de inicio de campaña
  pub_end timestamp, -- fecha de finalización
  pub_is_active boolean default false,
  created_at timestamp default now()
);