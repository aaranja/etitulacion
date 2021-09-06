from django.core.files.storage import FileSystemStorage
from django.core.files import File 
import os
import PyPDF2

class Files():
	def constructor(self):
		super(self)

	# method to save a file with graduate enrollment
	def save(self, file, keyName, enrollment):
		fs = FileSystemStorage(location="storage/documents/"+str(enrollment)+"/"+keyName+"/")
		file_name =  fs.save(file.name, file)
		return True

	# method to remove a file with graduate enrollment
	def remove(self, keyName, enrollment):
		fs = FileSystemStorage(location="storage/documents/"+str(enrollment)+"/")
		# get all file from path 
		for listfile in fs.listdir(keyName+"/"):
			# the first list is null
			if len(listfile) != 0:
				for name in listfile:
					# delete each file
					fs.delete(keyName+"/"+name)
		return True;

	def get(self, keyName, enrollment):
		fs = FileSystemStorage(location="storage/documents/"+str(enrollment)+"/")
		for listfile in fs.listdir(keyName+"/"):
			
			if len(listfile) !=0:
				for file in listfile:
					path = fs.location+"\\"+keyName+"\\"+file
					pdf_file = open(path,'rb')
					read_pdf = pdf_file.read()
					pdf_file.close()
					return read_pdf
		return None