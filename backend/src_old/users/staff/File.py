from django.core.files.storage import FileSystemStorage
from PIL import Image


class File:
    """
    Class to get, save and remove a file into a location
    """

    def __init__(self, location):
        self.fs = FileSystemStorage(location=location)

    def save(self, file):
        try:
            print(self.fs.location)
            self.fs.save(file.name, file)
            return True
        except:
            print("Error al guardar")
            return False

    def replace(self, file):
        try:
            for file_list in self.fs.listdir(""):
                if len(file_list) != 0:
                    for name in file_list:
                        self.fs.delete(name)
            return self.save(file)
        except:
            print("Error al reemplazar")
            return False

    def get(self, key_name):
        for file_list in self.fs.listdir(key_name + "/"):
            if len(file_list) != 0:
                for file in file_list:
                    path = self.fs.location + "/" + key_name + "/" + file
                    # image = Image.open(path)
                    pdf_file = open(path, 'rb').read()
                    # read_pdf = pdf_file.read()
                    return pdf_file
        return None

    def remove(self, keyname):
        for file_list in self.fs.listdir(keyname + "/"):
            # the first list is null
            if len(file_list) != 0:
                for name in file_list:
                    # delete each file
                    self.fs.delete(keyname + "/" + name)
        return True
