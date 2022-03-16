import locale
import os
from datetime import datetime
from fpdf import FPDF
from django.core.files.storage import FileSystemStorage


class CDN_PDF:
    """
    Class to generate a pdf file of Constancia de NO inconveniencia.
    """

    def __init__(self, name, enrollment, career, preview=False):
        locale.setlocale(locale.LC_ALL, "es_MX.UTF-8")
        now = datetime.now()
        fs = FileSystemStorage(location='storage/')
        self.dd = str(now.day)
        self.mm = str(now.strftime("%B"))
        self.yyyy = str(now.year)
        self.logo_path = fs.location + "/img/logo_ite.png"
        self.seal_path = fs.location + "/settings/cni/seal/seal.png"
        self.signature_path = fs.location + "/settings/cni/signature/signature.png"
        self.services_name = "DRA. SARA EUGENIA HERNÁNDEZ AYÓN"
        self.enrollment = enrollment
        self.name = name
        self.career = career
        self.save_path = self.gen_path(preview, enrollment, fs)

    @staticmethod
    def gen_path(is_preview, enrollment, fs):
        if is_preview:
            path = os.path.join(fs.location + "/settings/cni/preview/")
            if not os.path.exists(path):
                os.mkdir(path)
            return fs.location + "/settings/cni/preview/"
        else:
            path = os.path.join(fs.location + "/documents/" + str(enrollment) + "/", "CDNI")
            if not os.path.exists(path):
                os.mkdir(path)
            return fs.location + "/documents/" + str(enrollment) + "/CDNI/"

    def generate(self):
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("helvetica", size=16)

        # rectangulo principal
        pdf.rect(x=20, y=16, w=170, h=20)
        # primer divisor horizontal
        pdf.rect(x=130, y=26, w=60, h=0)
        # primer divisor vertical
        pdf.rect(x=50, y=16, w=0, h=20)
        # segundo divisor horizontal
        pdf.rect(x=50, y=31, w=140, h=0)
        # segundo divisor vertical
        pdf.rect(x=130, y=16, w=0, h=20)

        # signature position
        pdf.image(self.signature_path, x=80, y=178, w=50, h=30)

        # seal position
        pdf.image(self.seal_path, x=140, y=150, w=50, h=30)

        pdf.set_font_size(11)
        pdf.text(51, 20, 'Nombre del documento:     Formato     de')
        pdf.text(51, 25, 'Constancia de NO Inconveniencia para Acto')
        pdf.text(51, 30, 'Protocolario para la Titulación Integral')
        pdf.text(51, 35, 'Referencia a la Norma ISO 9001:2015  8.5.1')
        pdf.image(self.logo_path, x=26, y=17, w=18, h=18)

        # right side
        pdf.text(131, 20, 'Código: ITE-AC-PO-006-02')
        pdf.text(131, 30, 'Revisión: O')
        pdf.text(131, 35, 'Página 1 de 1')

        pdf.set_margin(20)
        pdf.ln(30)
        pdf.set_font(style="B")
        pdf.multi_cell(0, 5, 'CONSTANCIA DE NO INCONVENIENCIA PARA '
                             'EL ACTO PROTOCOLARIO PARA LA TITULACIÓN INTEGRAL',
                       align='C')
        pdf.ln(8)
        pdf.set_font(style="")
        pdf.cell(0, 8, 'Ensenada, Baja California a ' + self.dd + ' de ' + self.mm + ' de ' + self.yyyy, align='R')
        pdf.ln(20)
        pdf.set_font(style="B")
        pdf.cell(0, 8, 'C. ' + self.name)
        pdf.set_font(style="")
        pdf.ln(16)
        pdf.cell(0, 8, 'No. Control ' + str(self.enrollment))
        pdf.ln(8)
        pdf.cell(29, 8, 'Egresado (a) de ')
        pdf.set_font(style="B")
        pdf.underline = True
        pdf.cell(0, 8, str(self.career).upper(), ln=0)
        pdf.set_font(style="")
        pdf.ln(20)

        pdf.multi_cell(0, 8,
                       'Me permito informarle de acuerdo a su solicitud, '
                       'que no existe inconveniente para que pueda UD. '
                       'presentar su Acto  Protocolario para la Titulación  '
                       'Integral, ya que su expediente quedó integrado para tal efecto.')
        pdf.ln(25)
        pdf.set_font(style="B")
        pdf.cell(0, 8, "A   T   E   N   T   A   M   E   N   T   E", align='C')
        pdf.ln(20)
        pdf.cell(0, 8, self.services_name, align='C')
        pdf.ln(7)
        pdf.cell(0, 8, "JEFE (A) DEL DEPARTAMENTO DE SERVICIOS ESCOLARES", align='C')
        pdf.set_font(style="")
        pdf.ln(20)
        pdf.cell(0, 8, "c.c.p- División de Estudios Profesionales")
        pdf.ln(10)
        pdf.cell(0, 8, "c.c.p- Archivo")
        pdf.ln(28)
        pdf.set_font_size(8)
        pdf.set_font(style="B")
        pdf.cell(0, 5,
                 'ITE-AC-PO-006-02    Toda copia en PAPEL es un "Documento No Controlado" '
                 'a excepción del original    Rev. O',
                 align="C")
        pdf.output(self.save_path + "constancia_no_inconvenientes.pdf")

        return True

    def is_valid(self):
        return self.enrollment is not None and self.name is not None
