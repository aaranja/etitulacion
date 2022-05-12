import os

from django.core.files.storage import FileSystemStorage


def make_directory(pathname):
    path = os.path.join(pathname)
    if not os.path.exists(path):
        os.mkdir(path)


class Files:
    """
    Class to get, save and remove a pdf file of graduate folder
    """

    def constructor(self):
        super(self)

    @staticmethod
    def make_directory(pathname):
        path = os.path.join(pathname)
        if not os.path.exists(path):
            os.mkdir(path)

    @staticmethod
    def exists(file_system):
        return 0 < len(file_system.listdir(""))

    def save(self, file, key_name, enrollment):
        """
        Method to save a file with graduate enrollment and key_name document.
        :param file: The file to save, type: PDF.
        :param key_name: The file key_name to create the name document folder.
        :param enrollment: The graduate key to create the path to store documents folder.
        :return: True if document is saved.
        """
        fs = FileSystemStorage(location="storage/documents/" + str(enrollment) + "/" + key_name + "/")
        # self.make_directory(fs.location)
        if os.path.exists(fs.location):
            self.remove(key_name, enrollment)
        file_name = fs.save(file.name, file)
        print(file_name)
        return True

    @staticmethod
    def remove(key_name, enrollment):
        """
        Method to remove a file with graduate enrollment and keyname document.
        :param key_name: The file keyname to search the name document folder.
        :param enrollment: The graduate key to create the path to store documents folder.
        :return: True if document is removed.
        """
        fs = FileSystemStorage(location="storage/documents/" + str(enrollment) + "/")
        # get all file from path
        for file_list in fs.listdir(key_name + "/"):
            # the first list is null
            if len(file_list) != 0:
                for name in file_list:
                    # delete each file
                    fs.delete(key_name + "/" + name)
        return True

    @staticmethod
    def get(key_name, enrollment):
        """
        Method to get a file with graduate enrollment and keyname document.
        :param key_name: The file keyname to search the name document folder.
        :param enrollment: The graduate key to create the path to store documents folder.
        :return: The PDF document if is stored. If is not stored, return None.
        """
        fs = FileSystemStorage(location="storage/documents/" + str(enrollment) + "/")
        for file_list in fs.listdir(key_name + "/"):
            if len(file_list) != 0:
                for file in file_list:
                    path = fs.location + "/" + key_name + "/" + file
                    pdf_file = open(path, 'rb')
                    read_pdf = pdf_file.read()
                    pdf_file.close()
                    return read_pdf
        return None
