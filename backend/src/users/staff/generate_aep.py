import locale
import os
from datetime import datetime
from django.core.files.storage import FileSystemStorage
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from svglib.svglib import svg2rlg

from reportlab.pdfbase.pdfmetrics import registerFontFamily
from reportlab.platypus import Paragraph, SimpleDocTemplate, Table, TableStyle
from reportlab.pdfbase.ttfonts import TTFont

pdfmetrics.registerFont(TTFont('Arial', 'arial.ttf'))
pdfmetrics.registerFont(TTFont('SansBold', 'SansSerifFLF-Demibold.ttf'))
pdfmetrics.registerFont(TTFont('Arial-BoldItalic', 'arialbi.ttf'))
pdfmetrics.registerFont(TTFont('Arial-Bold', 'arialbd.ttf'))
pdfmetrics.registerFont(TTFont('Arial-Italic', 'ariali.ttf'))
pdfmetrics.registerFont(TTFont('SansSerif', 'SansSerifFLF.ttf'))

registerFontFamily('Arial', normal='Arial', bold='Arial-Bold', italic='Arial-Italic', boldItalic='Arial-BoldItalic')
filename = './python-logo.png'


class AEPpdf:
    """
    Class to generate a pdf file of Acta de Examen Profesional.
    """

    def __init__(self, arp_data):
        print(arp_data)
        locale.setlocale(locale.LC_ALL, "es_MX.UTF-8")
        fs = FileSystemStorage(location='storage/')
        self.name = arp_data['first_name'] + " " + arp_data['last_name']
        self.enrollment = str(arp_data['enrollment'])
        self.career = arp_data['career']
        self.record_date = datetime.strptime(arp_data['record_date'], '%Y-%m-%dT%H:%M:%S.%fZ')
        self.record_book = str(arp_data['record_book'])
        self.record_page = str(arp_data['record_page'])
        self.titulation = arp_data['titulation_type']
        self.city = arp_data['city']
        self.arp_date = datetime.strptime(arp_data['date'], '%Y-%m-%dT%H:%M:%S.%fZ')
        self.now_date = datetime.now()
        self.code = arp_data['code']
        self.president = arp_data['president_id']
        self.secretary = arp_data['secretary_id']
        self.vocal = arp_data['vocal_id']
        self.services_lead = arp_data['services_lead']
        self.director = arp_data['director']
        self.save_path = self.gen_path(arp_data['enrollment'], fs)
        self.edu_path = fs.location + "/img/logo-educacion_2.svg"
        self.line_path = fs.location + "/img/linea-vertical-separador-logos_2.svg"
        self.tecnm_path = fs.location + "/img/logo-tecnm_2.svg"

    @staticmethod
    def gen_path(enrollment, fs):
        path = os.path.join(fs.location + "/documents/" + str(enrollment) + "/", "preAEP")
        if not os.path.exists(path):
            os.mkdir(path)
        return fs.location + "/documents/" + str(enrollment) + "/preAEP/"

    @staticmethod
    def paragraph_model(msg):
        """
        添加一段文字
        :param msg:
        :return:
        """
        # 设置文字样式

        style = ParagraphStyle(
            name='justified',
            fontName='Arial',
            leading=10,
            alignment=TA_JUSTIFY,
            fontSize=9,
        )

        return Paragraph(msg, style=style)

    @staticmethod
    def paragraph_centered(msg):
        """
                添加一段文字
                :param msg:
                :return:
                """
        # 设置文字样式

        style = ParagraphStyle(
            name='left',
            fontName='SansBold',
            leading=10,
            alignment=TA_CENTER,
            fontSize=12,
        )

        return Paragraph(msg, style=style)

    @staticmethod
    def paragraph_footer(msg):
        style = ParagraphStyle(
            name='footer',
            fontName='SansSerif',
            leading=10,
            alignment=TA_CENTER,
            fontSize=9,
        )

        return Paragraph(msg, style=style)

    def generate(self):
        parts = []
        try:
            scale = .60
            svg = svg2rlg(self.edu_path)
            svg.scale(1 * scale, 1 * scale)
            line_logo = svg2rlg(self.line_path)
            line_logo.scale(.75, .75)
            tecnm_logo = svg2rlg(self.tecnm_path)
            tecnm_logo.scale(.75, .75)

            data = [[svg, line_logo, tecnm_logo]]
            table = Table(data, colWidths=[260, 40, 90], rowHeights=50)
            table.hAlign = "LEFT"
            table.vAlign = "MIDDLE"
            table.setStyle(TableStyle([
                # ('VALIGN', (0, 0), (-1, -1), 'MIDDLE',(0, 0, 0,)),
                ('HALIGN', (0, 0), (-1, -1), 'TOP'),
                ('LEFTPADDING', (0, 0), (-1, -1), 0, (0, 0, 0,)),
                ('TOPPADDING', (0, 0), (-1, -1), 0, (0, 0, 0,)),
                # ('GRID', (0, 0), (-1, -1), 0.01 , (0, 0, 0,)),
                # ('BOX', (0, 0), (-1, -1), 0.25, colors.black),

            ]))

            # img_data.width = 90

            parts.append(table)

            text = "<br /><br /><h1><b>INSTITUTO TECNOLÓGICO DE ENSENADA</b></h1><br/>" \
                   "<br /><br />CERTIFICACIÓN DE ACTA DE EXAMEN PROFESIONAL<br/><br /><br />"

            title_paragraph = self.paragraph_centered(text)
            parts.append(title_paragraph)

            text = "El suscrito Director del Instituto Tecnológico de <u>Ensenada</u>, " \
                   "certifica que en el Libro para Actas de Examen Profesional Nº <u>" + \
                   self.record_book + "</u> autorizado el día <u>" + str(self.record_date.strftime("%d")) + \
                   "</u> del mes de <u>" + str(self.record_date.strftime("%B")) + \
                   "</u> de <u>" + str(self.record_date.year) + \
                   "</u> por la Dirección de Servicios Escolares y Estudiantiles de " \
                   "la Dirección General del Tecnológico Nacional de México, se encuentra " \
                   "asentada en la foja número <u>" + self.record_page + \
                   "</u> el Acta que a la letra dice: <br /><br />"
            first_paragraph = self.paragraph_model(text)
            parts.append(first_paragraph)

            text = "De acuerdo con el instructivo vigente de Titulación, que no tiene como " \
                   "requisito la sustentación del Examen Profesional para efecto de " \
                   "obtención de Título, en las opciones VII, IX y Titulación Integral, " \
                   "el jurado HACE CONSTAR: que el (la) C. <u>" + self.name + "</u>, " + \
                   "con el número de control <u>" + self.enrollment + "</u>, " + \
                   "egresado del Instituto Tecnológico de <u>Ensenada</u>, " \
                   "clave <u>" + self.code + "</u>, que cursó la carrera de: <u>" + \
                   self.career + "</u>, cumplió satisfactoriamente con lo estipulado " \
                                 "en la opción <u>" + self.titulation + "</u>. <br /><br />"
            second_paragraph = self.paragraph_model(text)
            parts.append(second_paragraph)

            text = "El (la) presidente (a) del Jurado le hizo saber a él (la) sustentante el " \
                   "Código de Ética Profesional y le tomó la Protesta de Ley, una vez escrita " \
                   "y leída la firmaron las personas que en el acto protocolario intervinieron, " \
                   "para los efectos legales a que haya lugar, se asienta la presente en la " \
                   "ciudad de <u>" + self.city + "</u>, el día <u>" + self.arp_date.strftime("%d") \
                   + "</u> de <u>" + self.arp_date.strftime("%B") + "</u> del año <u>" + str(self.arp_date.year) \
                   + "</u>.<br /><br />"
            third_paragraph = self.paragraph_model(text)
            parts.append(third_paragraph)

            text = "Rubrican " \
                   "<br />Presidente(a): " \
                   "<i><u>" + self.president['profession'] + " &nbsp; " + self.president['full_name'] + \
                   " &nbsp; Céd. Prof. " + str(self.president['id_card']) + " </u></i>" \
                                                                            "<br />Secretario(a): <i><u>" + \
                   self.secretary['profession'] + " &nbsp; " + self.secretary['full_name'] + \
                   " &nbsp; Céd. Prof. " + str(self.secretary['id_card']) + " </u></i>" \
                                                                            "<br />Vocal: <i><u>" + self.vocal[
                       'profession'] + " &nbsp; " + self.vocal['full_name'] + \
                   " &nbsp; Céd. Prof. " + str(self.vocal['id_card']) + " </u></i>" \
                                                                        "<br /><br /><br />"
            fourth_paragraph = self.paragraph_model(text)
            parts.append(fourth_paragraph)

            text = "Se extiende esta certificación a los <u>" + self.now_date.strftime(
                "%d") + "</u> días del mes de <u>" + self.now_date.strftime(
                "%B") + "</u> del año <u>" + self.now_date.strftime("%Y") + "</u>.<br /><br /><br />"
            fifth_paragraph = self.paragraph_model(text)
            parts.append(fifth_paragraph)

            text = "COJETO <br /><br /><br /> <br /><br />Jefa del Departamento <br/>de Servicios Escolares<br />" \
                   + self.services_lead
            sixth_paragraph = self.paragraph_model(text)
            parts.append(sixth_paragraph)

            text = "<br /><br /><br /><br /><br /> <br /><br />" + self.director.upper() + "<br/>" \
                                                                                           "DIRECTOR"

            footer_paragraph = self.paragraph_footer(text)
            parts.append(footer_paragraph)

            summary_name = SimpleDocTemplate(self.save_path + "aep_pre.pdf", pagesize=letter, leftMargin=140,
                                             rightMargin=67, topMargin=65)
            summary_name.build(parts)

        except (RuntimeError, TypeError, NameError):
            print(TypeError)
            return False
        return True
