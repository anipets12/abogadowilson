# Configuración de Certificados SSL y SSH para Cloudflare

## 1. Certificados SSL de Origen

1. Ingrese a su [panel de Cloudflare](https://dash.cloudflare.com/) y seleccione el dominio.
2. Navegue a **SSL/TLS > Origin Server**.
3. Haga clic en **Create Certificate**.
4. Seleccione usar una clave privada generada por Cloudflare o proporcionar la suya propia.
5. Descargue el certificado y la llave privada.  
   **Importante:** Guárdelos en un directorio seguro (fuera del control de versiones).  
6. Configure su servidor de origen (backend o API) para utilizar estos certificados.

## 2. Claves SSH para Despliegue y Git

1. Genere un par de claves SSH:

   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. Agregue la clave pública a sus repositorios (GitHub/GitLab) y, si es necesario, al despliegue en Cloudflare.

3. Configure su `~/.ssh/config`:

   ```ssh-config
   Host cloudflare-deploy
     HostName api.cloudflare.com
     User your_cloudflare_username
     IdentityFile ~/.ssh/id_ed25519
   ```

## 3. Integración en el Proyecto

- Configure variables de entorno (o CI/CD secrets) para las rutas de sus certificados sin exponerlas.
- La configuración de Wrangler en `wrangler.toml` ya incluye las variables necesarias para Cloudflare.

Con estos pasos su infraestructura estará organizada, segura y sin errores.
