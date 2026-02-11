# Configuracion y Uso de Keycloak con OnERP

## Tabla de Contenidos

1. [Que es Keycloak](#que-es-keycloak)
2. [Arquitectura de Autenticacion](#arquitectura-de-autenticacion)
3. [Instalacion de Keycloak](#instalacion-de-keycloak)
4. [Configuracion del Realm](#configuracion-del-realm)
5. [Configuracion del Cliente (Client)](#configuracion-del-cliente-client)
6. [Roles y Permisos](#roles-y-permisos)
7. [Atributos Personalizados](#atributos-personalizados)
8. [Variables de Entorno en Next.js](#variables-de-entorno-en-nextjs)
9. [Flujo de Autenticacion](#flujo-de-autenticacion)
10. [Refresh de Tokens](#refresh-de-tokens)
11. [Logout Federado](#logout-federado)
12. [Configuracion para Desarrollo](#configuracion-para-desarrollo)
13. [Configuracion para Produccion](#configuracion-para-produccion)
14. [Solucion de Problemas](#solucion-de-problemas)

---

## Que es Keycloak

Keycloak es un servidor de gestion de identidades y acceso (IAM) de codigo abierto mantenido por Red Hat. Proporciona:

- **Single Sign-On (SSO):** Un unico inicio de sesion para multiples aplicaciones.
- **Federacion de identidades:** Conexion con LDAP, Active Directory, u otros proveedores.
- **Gestion centralizada de usuarios:** Crear, editar y administrar usuarios desde una consola.
- **Roles y permisos:** Control de acceso basado en roles (RBAC).
- **Protocolos estandar:** OpenID Connect (OIDC), OAuth 2.0, SAML 2.0.

OnERP utiliza Keycloak como su proveedor de identidad mediante el protocolo **OpenID Connect** a traves de NextAuth.js v5.

---

## Arquitectura de Autenticacion

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Navegador  │────>│   Next.js    │────>│   Keycloak   │
│   (Usuario)  │<────│   (OnERP)    │<────│   (IAM)      │
└──────────────┘     └──────────────┘     └──────────────┘
                           │
                     ┌─────┴─────┐
                     │ NextAuth   │
                     │ v5 (JWT)   │
                     └───────────┘
```

**Flujo resumido:**

1. El usuario hace clic en "Continuar con SSO" en OnERP.
2. NextAuth redirige al usuario a la pagina de login de Keycloak.
3. El usuario se autentica en Keycloak (usuario/contrasena, 2FA, etc.).
4. Keycloak devuelve un `authorization_code` a NextAuth.
5. NextAuth intercambia el codigo por tokens (`access_token`, `refresh_token`, `id_token`).
6. NextAuth almacena los tokens en un JWT de sesion (cookie encriptada).
7. El usuario accede a OnERP con la sesion activa.

---

## Instalacion de Keycloak

### Opcion 1: Docker (Desarrollo)

```bash
docker run -d \
  --name keycloak \
  -p 8080:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:latest \
  start-dev
```

Acceder a la consola: `http://localhost:8080/admin`

### Opcion 2: Docker Compose (Desarrollo con base de datos)

```yaml
# docker-compose.yml
version: '3.8'
services:
  keycloak-db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: keycloak
      POSTGRES_USER: keycloak
      POSTGRES_PASSWORD: keycloak_db_password
    volumes:
      - keycloak_data:/var/lib/postgresql/data

  keycloak:
    image: quay.io/keycloak/keycloak:latest
    command: start-dev
    environment:
      KC_DB: postgres
      KC_DB_URL: jdbc:postgresql://keycloak-db:5432/keycloak
      KC_DB_USERNAME: keycloak
      KC_DB_PASSWORD: keycloak_db_password
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: admin
    ports:
      - "8080:8080"
    depends_on:
      - keycloak-db

volumes:
  keycloak_data:
```

```bash
docker compose up -d
```

### Opcion 3: Produccion

Para produccion, Keycloak debe ejecutarse con:

```bash
docker run -d \
  --name keycloak \
  -p 8443:8443 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=<contrasena_segura> \
  -e KC_DB=postgres \
  -e KC_DB_URL=jdbc:postgresql://<db-host>:5432/keycloak \
  -e KC_DB_USERNAME=<db-user> \
  -e KC_DB_PASSWORD=<db-password> \
  -e KC_HOSTNAME=auth.sudominio.com \
  -e KC_PROXY=edge \
  -v /path/to/certs:/opt/keycloak/conf/certs \
  quay.io/keycloak/keycloak:latest \
  start --optimized
```

Requisitos de produccion:
- Base de datos externa (PostgreSQL recomendado).
- HTTPS obligatorio (certificado TLS).
- Proxy inverso (Nginx, Traefik, o load balancer).
- `KC_HOSTNAME` configurado con el dominio real.

---

## Configuracion del Realm

Un **Realm** es un espacio aislado de gestion de identidades. OnERP requiere su propio realm.

### Crear el Realm

1. Acceder a la consola de administracion: `http://localhost:8080/admin`
2. En el menu superior izquierdo, hacer clic en el nombre del realm actual ("master").
3. Seleccionar **Create Realm**.
4. Nombre: `onerp` (o el nombre que desee).
5. Hacer clic en **Create**.

### Configurar el Realm

En **Realm Settings**:

| Campo | Valor recomendado |
|---|---|
| Display Name | OnERP |
| HTML Display Name | `<strong>OnERP</strong>` |
| User-managed access | OFF |
| Frontend URL | (vacio en dev, URL publica en prod) |

En la pestana **Login**:

| Opcion | Dev | Prod |
|---|---|---|
| User registration | ON (si desea autoregistro) | Segun politica |
| Forgot password | ON | ON |
| Remember me | ON | ON |
| Login with email | ON | ON |
| Duplicate emails | OFF | OFF |
| Verify email | OFF | ON |

En la pestana **Tokens**:

| Campo | Valor recomendado |
|---|---|
| Access Token Lifespan | 5 minutos |
| SSO Session Idle | 30 minutos |
| SSO Session Max | 10 horas |
| Refresh Token Max Reuse | 0 |
| Client Session Idle | 30 minutos |

---

## Configuracion del Cliente (Client)

El cliente es la representacion de OnERP dentro de Keycloak.

### Crear el Cliente

1. En el realm `onerp`, ir a **Clients** > **Create client**.
2. Configurar:

| Campo | Valor |
|---|---|
| Client type | OpenID Connect |
| Client ID | `onerp-app` |
| Name | OnERP Application |
| Client authentication | ON |
| Authorization | OFF |

3. Hacer clic en **Next**.

### Configurar URLs

| Campo | Desarrollo | Produccion |
|---|---|---|
| Root URL | `http://localhost:3000` | `https://app.sudominio.com` |
| Home URL | `http://localhost:3000` | `https://app.sudominio.com` |
| Valid redirect URIs | `http://localhost:3000/*` | `https://app.sudominio.com/*` |
| Valid post logout redirect URIs | `http://localhost:3000/*` | `https://app.sudominio.com/*` |
| Web origins | `http://localhost:3000` | `https://app.sudominio.com` |

### Obtener el Client Secret

1. Ir a **Clients** > `onerp-app` > pestana **Credentials**.
2. Copiar el valor de **Client secret**.
3. Este valor se usa en la variable de entorno `KEYCLOAK_SECRET`.

---

## Roles y Permisos

OnERP utiliza **Realm Roles** para controlar el acceso.

### Roles Actuales

| Rol | Proposito |
|---|---|
| `sysAdmin` | Administrador del sistema. Acceso a `/dashboard/admin`. |
| `erp_user` | Usuario ERP estandar. Acceso a `/dashboard`. |
| `sales_manager` | Gestor de ventas. |
| `inventory_manager` | Gestor de inventario. |

### Crear un Rol

1. Ir a **Realm Roles** > **Create role**.
2. Nombre: `sysAdmin` (respetando mayusculas).
3. Descripcion: "Administrador del sistema OnERP".
4. Guardar.

### Asignar Roles a Usuarios

1. Ir a **Users** > seleccionar un usuario.
2. Pestana **Role mapping** > **Assign role**.
3. Seleccionar los roles necesarios.

### Mapeo de Roles al Token

Para que los roles aparezcan en el `access_token`, Keycloak los incluye por defecto en `realm_access.roles`. OnERP lee esta estructura:

```json
{
  "realm_access": {
    "roles": ["sysAdmin", "erp_user"]
  }
}
```

Si los roles no aparecen, verificar en **Client Scopes** > `roles` > **Mappers** que el mapper `realm roles` este configurado con:
- Token Claim Name: `realm_access.roles`
- Add to access token: ON

---

## Atributos Personalizados

OnERP utiliza un atributo personalizado `company_id` para asociar usuarios a empresas.

### Configurar el Atributo

1. Ir a **Users** > seleccionar un usuario > **Attributes**.
2. Agregar:
   - Key: `company_id`
   - Value: ID de la empresa (ej. `uuid-de-la-empresa`)

### Mapear el Atributo al Token

1. Ir a **Client Scopes** > **Create client scope**.
   - Name: `company_id`
   - Protocol: OpenID Connect
   - Type: Default
2. Dentro del scope, crear un **Mapper**:
   - Mapper type: User Attribute
   - Name: `company_id`
   - User Attribute: `company_id`
   - Token Claim Name: `company_id`
   - Claim JSON Type: String
   - Add to ID token: ON
   - Add to access token: ON
3. Ir a **Clients** > `onerp-app` > **Client scopes** > **Add client scope**.
4. Agregar `company_id` como "Default".

---

## Variables de Entorno en Next.js

Crear o editar el archivo `.env.local`:

```bash
# Keycloak
KEYCLOAK_ID=onerp-app
KEYCLOAK_SECRET=<client-secret-de-keycloak>
KEYCLOAK_ISSUER=http://localhost:8080/realms/onerp

# NextAuth
AUTH_SECRET=<cadena-aleatoria-de-32-caracteres>
AUTH_URL=http://localhost:3000

# Alias (compatibilidad)
NEXTAUTH_SECRET=$AUTH_SECRET
NEXTAUTH_URL=$AUTH_URL
```

### Generar AUTH_SECRET

```bash
openssl rand -base64 32
```

### Valores por Entorno

| Variable | Desarrollo | Produccion |
|---|---|---|
| `KEYCLOAK_ID` | `onerp-app` | `onerp-app` |
| `KEYCLOAK_SECRET` | Secret del cliente | Secret del cliente |
| `KEYCLOAK_ISSUER` | `http://localhost:8080/realms/onerp` | `https://auth.sudominio.com/realms/onerp` |
| `AUTH_SECRET` | Cualquier cadena aleatoria | Cadena segura unica |
| `AUTH_URL` | `http://localhost:3000` | `https://app.sudominio.com` |

---

## Flujo de Autenticacion

### Archivos Involucrados

| Archivo | Funcion |
|---|---|
| `src/auth.config.ts` | Define el proveedor Keycloak con las credenciales. |
| `src/auth.ts` | Configura NextAuth: callbacks JWT/session, refresh de tokens, logout federado. |
| `src/middleware.ts` | Protege rutas. Redirige usuarios no autenticados. |
| `src/app/login/page.tsx` | Pagina de login. Muestra boton SSO. |
| `src/app/page.tsx` | Landing page publica. Tambien permite iniciar sesion. |

### Middleware de Proteccion

El middleware (`src/middleware.ts`) controla el acceso:

- **Rutas publicas:** `/`, `/api/auth/*`, `/auth/*`
- **Rutas protegidas:** Todo bajo `/dashboard/*`
- **Rutas de admin:** `/dashboard/admin` requiere rol `sysAdmin`

Si un usuario no autenticado accede a una ruta protegida, es redirigido a `/`.

### Sesion en el Cliente

Para acceder a la sesion en componentes de cliente:

```tsx
"use client";
import { useSession } from "next-auth/react";

export function MiComponente() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Cargando...</p>;
  if (!session) return <p>No autenticado</p>;

  return <p>Hola, {session.user?.name}</p>;
}
```

Para componentes de servidor:

```tsx
import { auth } from "@/auth";

export default async function Pagina() {
  const session = await auth();
  const roles = session?.roles ?? [];
  const companyId = session?.company_id;
  // ...
}
```

---

## Refresh de Tokens

OnERP renueva automaticamente los tokens expirados usando el `refresh_token` de Keycloak.

### Como Funciona

1. En cada request, el callback `jwt` de NextAuth verifica si `expires_at` ya paso.
2. Si expiro, llama a `refreshAccessToken()` que contacta a Keycloak:
   - Endpoint: `{KEYCLOAK_ISSUER}/protocol/openid-connect/token`
   - Grant type: `refresh_token`
3. Si la renovacion es exitosa, actualiza `accessToken`, `id_token` y `expires_at`.
4. Si falla (ej. refresh token expirado), establece `error: "RefreshTokenError"`.
5. La sesion recibe este error y la aplicacion puede forzar re-login.

### Manejo del Error de Refresh

En el layout o un componente global:

```tsx
"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

export function SessionGuard({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshTokenError") {
      signOut({ callbackUrl: "/" });
    }
  }, [session?.error]);

  return <>{children}</>;
}
```

---

## Logout Federado

Cuando un usuario cierra sesion en OnERP, tambien se cierra la sesion en Keycloak.

### Como Funciona

El evento `signOut` en `src/auth.ts` realiza un logout en Keycloak:

```
GET {KEYCLOAK_ISSUER}/protocol/openid-connect/logout?id_token_hint={id_token}
```

Esto invalida la sesion SSO en Keycloak, evitando que el usuario vuelva a entrar automaticamente sin credenciales.

### Ejecutar Logout desde la Aplicacion

```tsx
import { signOut } from "next-auth/react";

// En un componente de cliente:
<Button onClick={() => signOut({ callbackUrl: "/" })}>
  Cerrar Sesion
</Button>
```

---

## Configuracion para Desarrollo

### Checklist

- [ ] Keycloak corriendo en `http://localhost:8080`
- [ ] Realm `onerp` creado
- [ ] Cliente `onerp-app` creado con:
  - Client authentication: ON
  - Valid redirect URIs: `http://localhost:3000/*`
  - Web origins: `http://localhost:3000`
- [ ] Al menos un usuario creado con contrasena establecida
- [ ] Roles `sysAdmin` y/o `erp_user` asignados
- [ ] `.env.local` configurado con las variables correctas
- [ ] `npm run dev` ejecutando la aplicacion

### Crear un Usuario de Prueba

1. Ir a **Users** > **Add user**.
2. Completar:
   - Username: `admin`
   - Email: `admin@test.com`
   - First Name: `Admin`
   - Last Name: `Test`
   - Email verified: ON
3. Guardar, luego ir a pestana **Credentials**.
4. **Set password**: `admin` (desactivar "Temporary").
5. Ir a **Role mapping** > asignar `sysAdmin`.

### Tema Personalizado OnERP

El proyecto incluye un tema personalizado en `keycloak/themes/onerp/` que aplica el branding corporativo de OnERP a la pantalla de login de Keycloak.

**Estructura del tema:**

```
keycloak/themes/onerp/
└── login/
    ├── theme.properties          # Hereda de keycloak.v2, carga CSS custom
    └── resources/
        ├── css/
        │   └── login.css         # Estilos corporativos OnERP
        └── img/
            └── logo.png          # Logo de OnERP
```

**Caracteristicas del tema:**
- Hereda de `keycloak.v2` (tema base moderno)
- Colores corporativos (azul ejecutivo hue 255)
- Status rail (barra azul 2px en la tarjeta de login)
- Logo OnERP centrado sobre el formulario
- Inputs, botones y alertas con el design system
- Soporte para dark mode automatico (`prefers-color-scheme`)
- Responsive para movil

**Como activarlo:**

1. Levantar Keycloak con Docker Compose (el volumen ya esta configurado):
   ```bash
   docker compose up -d
   ```
2. Acceder a la consola de admin: `http://localhost:8080/admin`
3. Ir a **Realm Settings** > **Themes**.
4. En **Login theme** seleccionar: `onerp`.
5. Guardar.

**Para produccion:**
El mismo volumen aplica. Solo asegurarse de que el path del volumen sea correcto en el servidor:
```yaml
volumes:
  - ./keycloak/themes/onerp:/opt/keycloak/themes/onerp
```

**Para modificar el tema:**
Editar `keycloak/themes/onerp/login/resources/css/login.css`. Los cambios se reflejan al recargar la pagina de login (no requiere reiniciar Keycloak en modo `start-dev`).

---

## Configuracion para Produccion

### Checklist

- [ ] Keycloak con HTTPS (certificado TLS valido)
- [ ] Base de datos PostgreSQL externa
- [ ] `KC_HOSTNAME` configurado (ej. `auth.sudominio.com`)
- [ ] `KC_PROXY=edge` si esta detras de un proxy
- [ ] Cliente configurado con URLs de produccion
- [ ] `AUTH_SECRET` generado con `openssl rand -base64 32`
- [ ] Variables de entorno configuradas en el servidor/plataforma
- [ ] Backup de la base de datos de Keycloak configurado
- [ ] Rate limiting en el proxy para endpoints de auth

### Nginx como Proxy Inverso

```nginx
server {
    listen 443 ssl;
    server_name auth.sudominio.com;

    ssl_certificate /etc/letsencrypt/live/auth.sudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/auth.sudominio.com/privkey.pem;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffer_size 128k;
        proxy_buffers 4 256k;
        proxy_busy_buffers_size 256k;
    }
}
```

### Seguridad Adicional

1. **Politica de contrasenas**: Realm Settings > Authentication > Password Policy.
   - Minimo 8 caracteres
   - Al menos 1 mayuscula, 1 numero, 1 especial
   - Historial de contrasenas: 3

2. **Brute force protection**: Realm Settings > Security Defenses > Brute Force Detection.
   - Enabled: ON
   - Max login failures: 5
   - Wait increment: 60 segundos

3. **OTP/2FA**: Authentication > Required Actions.
   - Configure OTP como accion requerida para roles administrativos.

4. **Session limits**: Sessions > configurar maximo de sesiones por usuario.

---

## Solucion de Problemas

### Error: "Invalid redirect URI"

**Causa:** La URI de redireccion de NextAuth no coincide con las configuradas en Keycloak.

**Solucion:**
1. Ir a Clients > `onerp-app` > Settings.
2. Verificar que "Valid redirect URIs" incluya: `http://localhost:3000/*` (o la URL de produccion).
3. Verificar "Web origins" tambien.

### Error: "PKCE verification failed"

**Causa:** Mismatch en el metodo PKCE entre NextAuth y Keycloak.

**Solucion:** En el proveedor de NextAuth, verificar que no se este forzando un metodo PKCE incorrecto.

### Error: "RefreshTokenError" constante

**Causa:** El refresh token expiro o fue revocado.

**Solucion:**
1. Verificar los tiempos de sesion en Realm Settings > Tokens.
2. Asegurarse de que `SSO Session Idle` sea mayor al tiempo que un usuario puede estar inactivo.
3. El usuario debe volver a iniciar sesion.

### El token no contiene roles

**Causa:** El mapper de roles no esta configurado.

**Solucion:**
1. Ir a Client Scopes > `roles` > Mappers.
2. Verificar que `realm roles` tenga "Add to access token: ON".
3. Si no existe, crear un mapper de tipo "User Realm Role" con Token Claim Name: `realm_access.roles`.

### El token no contiene `company_id`

**Causa:** El scope personalizado no esta asociado al cliente.

**Solucion:**
1. Verificar que el atributo exista en el perfil del usuario.
2. Verificar que el mapper este creado en el client scope.
3. Verificar que el client scope este asignado al cliente como "Default".

### Keycloak no arranca

**Causa comun:** Puerto 8080 ocupado o base de datos no disponible.

**Solucion:**
```bash
# Verificar logs
docker logs keycloak

# Verificar puerto
lsof -i :8080

# Reiniciar
docker restart keycloak
```

### CORS error en produccion

**Causa:** "Web origins" no configurado correctamente.

**Solucion:**
1. En Clients > `onerp-app` > Settings > Web origins.
2. Agregar la URL exacta del frontend (sin trailing slash).
3. Alternativa: usar `+` para permitir todos los redirect URIs registrados.
