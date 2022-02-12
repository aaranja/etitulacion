def get_career(key):
    career_types = {
        'electromecanica': "Ingeniería Electromecánica",
        'electronica': "Ingeniería Electrónica",
        'gestion': "Ingeniería en Gestión Empresarial",
        'industrial': "Ingeniería Industrial",
        'sistemas': "Ingeniería en Sistemas Computacionales",
        'mecatronica': "Ingeniería Mecatrónica",
        'administracion': "Licenciatura en Administración",
    }
    return career_types[key]
