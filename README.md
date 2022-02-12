# Proyecto etitulación

## Instalación
### Django backend
#### Requisitos previos
**Antes de empezar recuerda tener instalado mysql server: https://dev.mysql.com/downloads/**
#### En el directorio /backend del proyecto, ejecutar los comandos:
```
# Instalación de dependencías
virtualenv env .
env/bin/activate
pip install -r required_apps
```
**Crear un esquema de base de datos en mysql server**
#### En la terminal ejecuta los comandos:
```
# Logear en mysql
mysql -h localhost -u root -p
# Crear base de datos
CREATE DATABASE etitulacion_db;
```
#### Configurar Django para la conexión hacia la base de datos
Editar con la configuración de mysql el archivo settings.py encontrado en el directorio backend/src/etitulacion/
```
...
WSGI_APPLICATION = 'etitulacion.wsgi.application'

# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'etitulacion_db',
        'USER': 'root',             # set your user
        'PASSWORD': 'password',     # set own database password
        'HOST': '127.0.0.1',        # Or an IP Address that your DB is hosted on
        'PORT': '3306',
    }
}


# Password validation
...
```

### Ejecución
```
# Ejecución del servidor
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

