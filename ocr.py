import cv2
import pytesseract
from pdf2image import convert_from_path
import os


POPPLER_PATH = r'C:\poppler-24.08.0\Library\bin'


pytesseract.pytesseract.tesseract_cmd = r'C:\Users\USER\AppData\Local\Programs\Tesseract-OCR\tesseract.exe'

def preprocess_image(image_path):
    """Prétraite l'image pour améliorer l'OCR."""
    
    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)

    
    blurred = cv2.GaussianBlur(image, (5, 5), 0)

    
    _, binary = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    
    preprocessed_path = "preprocessed_image.png"
    cv2.imwrite(preprocessed_path, binary)

    return preprocessed_path

def extract_text_from_image(image_path):
    """Extrait le texte d'une image après prétraitement."""
    try:
        
        preprocessed_image = preprocess_image(image_path)

        
        text = pytesseract.image_to_string(preprocessed_image)

       
        os.remove(preprocessed_image)

        return text
    except Exception as e:
        print(f"Erreur lors de l'extraction de l'image : {e}")
        return None

def ocr_system(file_path, file_type):
    """Système OCR principal."""
    if file_type.lower() == 'pdf':
        print("Traitement du PDF...")
        try:
            pages = convert_from_path(file_path, poppler_path=POPPLER_PATH)
            text = ""
            for page in pages:
               
                page.save("temp_page.png", "PNG")
                text += extract_text_from_image("temp_page.png") + "\n"
                os.remove("temp_page.png")
            print("Texte extrait :")
            print(text)
        except Exception as e:
            print(f"Erreur lors du traitement du PDF : {e}")
    elif file_type.lower() == 'image':
        print("Traitement de l'image...")
        text = extract_text_from_image(file_path)
        if text:
            print("Texte extrait :")
            print(text)
        else:
            print("Aucun texte n'a été extrait.")
    else:
        print("Type de fichier non pris en charge.")


file_path = r'C:\Users\USER\PycharmProjects\OCRProject\PAS-2024-.pdf'
file_type = 'pdf'  

ocr_system(file_path, file_type)
