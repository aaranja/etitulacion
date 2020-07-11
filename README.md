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
##### Ejecución
**Crear un esquema de base de datos en mysql server**
En la terminal ejecuta los comandos

```
# Ejecución del servidor
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

