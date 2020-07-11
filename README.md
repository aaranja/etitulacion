# Proyecto etitulación

## Instalación
### Django backend
#### En el directorio /backend del proyecto, ejecutar los comandos:
```
# Instalación de dependencías
virtualenv env .
env/bin/activate
pip install -r required_apps
```

```
# Ejecución del servidor
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

