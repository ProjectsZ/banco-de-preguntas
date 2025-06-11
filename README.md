
# VERSION 0.8
0.8.5
- creacion de un nuevo componente que use la libreria angular PDF view, PARA VISUALIZAR PDFs linkeados de la red
- Fixed tab Quiz, 
- Fixed modal Review Quiz, que se muestre un espaciado entre los botones y nose vean tan pegados y que al realizar la accion se cierre el modal de manera automatica
- Fixed ventana toast, para que no cierre el cambio de otros modal activos
- Se agrando el boton icono para mostrar significado en la busqueda del diccionario, por palabras
- En la imagen de las quiz, se adjunta una imagen de referencia y en algunas ocaciones diche imagen muestra texto para leer o pistas de la respeusta entorno a la pregunta, como las letras son pequeñas (ya que se ajusta al ancho de la pantalla) se tendrá que aplicar opciones para darle zoom (1, 1.5, 2 como maximo) y tambien se aplicara filtros (gray, tono, brillo, invertir color, etc)
0.8.4
- se corrige el tag de las etiquetas, lo normal es que se presente un # + palabra clave, pero en caso de que la etiqueta tenga un @ eso indicara que es un nombre o apellido especifico de algun profesional, docente o administrador.
- Agregando al componente quiz, un bloque de publicidad, siendo esta contratada por inversionistas locales o nacionales segun la demanda de marketeo, en la que consiste en tener un banner que se muestre en forma de slider y que si la publicidad contratada es de grado 0 (se repite 3 veces en la secuencia), en 1 (se repite 2) y en 2 (solo una vez), luego se desplaza con las navegaciones.
- Se corrige el componente favoritos, y se muestra cada carga de examenes propios del usuario, como tambien poder crear mas examenes como ESTUDIANTE (5 examenes), DOCENTE (20 examenes), ADMIN (iliminitado), PLUS, PRO Y TEAM (Ilimitado), tambien se agrego la opcion de busqueda por nombre
- Corrigiendo el componente perfil de usuario, en donde se permite cambiar datos personales y agregar información personal del usuario

## version 0.7
- En el componente register, para los del rol de administrador se les mostrara todos los usuarios presentes (registrados) y tambien podrá modificarlos o crear unos nuevos.
- Creacion del componente perfil de usuario, donde permita al usuario comun a cambiar sus contrasenhas (con validacion y seguridad donde se cumpla que por lo menos tenga una letra mayuscula, minuscula, simbolos y numeros y debe contar con 8 digitos minimo), se creo un apartado para que edite su perfil personal
-----> Se creo la mascota de la app (que se muestra como toast o modal), que tiene un prompt interactivo que cada vez que incistes con mas veces el empieza a decir palabras mas coloquiales (siendo el nivel de su severidad o temperamento del 1 al 10)
- se agrega botones de fab, para por controles el del flash card de preguntas (se responde las preguntas introduciendolas, y se evalua si la respuesta coincide en porcentaje con lo introducido y si coincide por mas de 70% se muestra el contexto y los tags y la respuesta) y un boton de agregar la pregunta a un apartado separado denominado "examen favoritos o mis examenes" (limitarlo para usuarios free en 5 creaciones de examenes de 20 preguntas maximas y otros planes como plus (20 y 40 por examenes), team (30 y 50 max) )
- se adiciona un boton en el estado de todas las preguntas del resultado, para que soloi puedan ver la respuesta y no las demas alternativas
- Se corrigio el resaltado de textos contenidos como respuesta o explicacion
- Se asigno los roles, en donde administradores tienen acceso total, docentes de lectura y escritura pero limitado, y solo estudiantes con lectura.
- se agrego monedas, que te dara privilegios para ver la respuesta de cada pregunta
- se agrego icono de vista para respuestas de cada pregunta

## version 0.6
- Se agrego el componente examenes donde muestra todos los examenes que uno creo
- Creando menu y panle del usuario
- agregando componente share: file <files-path name="my_docs" path="docs/"/> en android/app/src/main/res/xml/file_paths.xml
- En el componente diccionario, mejorando el disenho del button para mostrar información de la palabra y orientando por color las preferencias: Si la escala va de 0 a 9, con el color rojo para la calificación más baja (0) y verde para la calificación más alta (9),
6 - Amarillo verdoso (#8BC34A), 7 - Verde claro (#4CAF50), 8 - Verde (#388E3C), 9 - Verde más oscuro (#1B5E20), 10 - Verde esmeralda (#00C853): El valor más alto.


## version 0.5
- Eliminacion/ poner en stand by el color dark o modo oscuro
- Agregando subida por data xls, a diccionario

## version 0.4
- Correxion de la posicion X y Y del componente flotante o diccionario flotante, con valores minimos por defecto.
- correxion y generar el APK, pruebas en dispositivos reales.
npm i @capacitor/splash-screen
rm -rf android
ionic build
ionic cap add android
ionic cap add ios
ionic cap sync
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


## version 0.3
- Se agrega un loading spinner para mostrar que se esta cargando la peticion, en caso de que se inicie esto debe bloquear cualquier accion o evento.
- Se crea un login, se usa una cuenta email como usario y una contrasenha.
- Se corregira el tiempo del componente de generacion de examenes, y se dara una proporcion de 1m:30s o 90s a cada pregunta, en caso de que aya varias preguntas estos se deben acumular a un tiempo total.
- Se agrega tooltip, a las palabras senhaladas o resaltadas en negrita, y se despliega una ventana flotante al hacer click en dichas palabras, los datos se toman de la data solicitada previamente del BD, en caso de que antes se aya hecho la peticion, entonces reusar la data obtenida previamente, caso contrario solicitarla.

## version 0.2
- Se propone un filtro, en caso de que la nota sea menos que la mitad del valor total de tu score, se bloquea de manera automatica el boton de ver respuestas.
- Se agrega un model, sobre los "result" o calificacion obtenida luego de haber tomado el examen generado, se propone el tiempo tomado, tiempo de duración, respuestas correctas, incorrectas, saltados y un boton para tomar de nuevo, y tambien un boton para ver las respuestas.
- Se crea un model, para la estructura de la pregunta, el tiempo, con sus alternativas, se agrega un boton "next" para pasar a la siguiente pregunta, y otro "<" para retroceder, y para finalizar un boton de "submit".
- Se implementa en el tab3, el "Time for quiz" que viene ser la seleccion de preguntas desde el curso especifico y el tema seleccionado, luego se propone la cantidad de preguntas a responder según uno desee, y lo siguiente seria la implementacion del tiempo total, y el voton play para iniciar.
- Se crea el tab2, diccionario para almacenar palabras claves, de manera ordenada y subrayada.

### version 0.1 
- Se crea un servicio supabase, para la subida de la pregunta por *.xls a la base de datos supabase.
- Se implemento un menu 'Upload excel file', para subir preguntas desde una tabla *.xls, el soporte de subida es aceptado en grandes cantidades (probado sin problemas con mas de 150 preguntas)
- Se implemento un componente add-questions, para agregar multiples preguntas donde se tomara datos como: dificultas, tipo de pregunta, seleccionar la categoria o tema, la pregunta a plantear, 4 opciones y 1 respuesta, una explicacion y etiquetas.
- Se crep el tab3, donde se presentara el componenete Quiz, donde tendra un menu (setting), para configurar y agregar questions.
- Se creo el tab1, donde se presentara el componente Home (PAUSA)
- Se creo un tab con tres opciones principales: Home, Dictionary y Quiz




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
  usr_coin int not null, 
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

-- Create planes Table
create table if not exists planes (
  plan_id uuid primary key default gen_random_uuid(),
  plan_name text not null unique,           -- Nombre del plan (PLUS, PRO, TEAM)
  plan_description text not null,            -- Descripción del plan
  plan_price_usd numeric(10,2) not null,      -- Precio en dólares
  plan_duration_days int not null,            -- Duración de la suscripción en días
  plan_max_users int not null,                -- Máximo de usuarios permitidos
  plan_created_at timestamp default now()     -- Fecha de creación
);


-- Create subscriptions Table
create table if not exists subscriptions (
  subs_id uuid primary key default gen_random_uuid(),
  subs_usr_id uuid not null references usuarios(usr_id) on delete cascade, -- Usuario dueño
  subs_plan_id uuid not null references plans(plan_id) on delete cascade,   -- Plan adquirido
  subs_start_date timestamp default now(),    -- Fecha inicio de la suscripción
  subs_expiration_date timestamp not null,    -- Fecha de expiración
  subs_is_active boolean default true,        -- Estado de la suscripción (activa/inactiva)
  subs_created_at timestamp default now()     -- Fecha de creación del registro
);
