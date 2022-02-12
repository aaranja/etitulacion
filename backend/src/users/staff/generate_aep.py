import locale
import os
from datetime import datetime
from fpdf import FPDF
from django.core.files.storage import FileSystemStorage


class AEPpdf:
    """
    Class to generate a pdf file of Acta de Examen Profesional.
    """

    def __init__(self, name, enrollment, career):
        locale.setlocale(locale.LC_ALL, "es_MX.UTF-8")
        now = datetime.now()
        fs = FileSystemStorage(location='storage/')
        self.name = name
        self.enrollment = enrollment
        self.career = career
        self.save_path = self.gen_path(enrollment, fs)

    @staticmethod
    def gen_path(enrollment, fs):
        path = os.path.join(fs.location + "/documents/" + str(enrollment) + "/", "preAEP")
        if not os.path.exists(path):
            os.mkdir(path)
        return fs.location + "/documents/" + str(enrollment) + "/preAEP/"

    def generate(self):
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("helvetica", size=16)
        pdf.set_font_size(11)
        pdf.text(51, 20, 'Nombre del documento:     Formato     de')
        pdf.output(self.save_path + "aep_pre.pdf")
        return True
