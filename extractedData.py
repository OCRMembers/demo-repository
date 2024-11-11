import cv2
import numpy as np
import easyocr
import json

# Initialisation de l'OCR en langue anglaise
# EasyOCR est utilisé pour détecter et lire le texte dans les images
reader = easyocr.Reader(['en'])

# Liste pour stocker les données extraites (chaque texte et ses informations)
data_points = []

# Chemin de l'image
image_path = 'Input_Data/inputData_02.jpg'  
# Chargement de l'image en niveaux de gris (noir et blanc) pour simplifier le traitement
image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)

# Binarisation de l'image avec la méthode d'Otsu
# Cela transforme l'image en noir et blanc pour faciliter la détection des contours
_, binary_image = cv2.threshold(image, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

# Détection des contours (les zones de l'image où il y a du texte potentiel)
contours, _ = cv2.findContours(binary_image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# Affichage du nombre total de contours détectés
print(f"Nombre total de contours détectés : {len(contours)}")

# Parcours de chaque contour détecté pour analyser le texte qu'il pourrait contenir
for contour_idx, contour in enumerate(contours):
    print(f"Traitement du contour {contour_idx + 1}/{len(contours)}")

    # Calcul des coordonnées du rectangle englobant chaque contour pour délimiter la zone d'intérêt (ROI)
    x, y, w, h = cv2.boundingRect(contour)
    roi = image[y:y+h, x:x+w]  # Extraction de la région d'intérêt (ROI) pour chaque contour

    # Rotation de la ROI à différents angles pour essayer de lire le texte dans toutes les orientations
    for angle in range(0, 360, 5):
        print(f"  Rotation à {angle}° pour le contour {contour_idx + 1}/{len(contours)}")

        # Calcul de la matrice de rotation pour l'angle actuel
        (roi_h, roi_w) = roi.shape[:2]
        center = (roi_w // 2, roi_h // 2)  # Centre de la ROI pour faire pivoter autour
        rotation_matrix = cv2.getRotationMatrix2D(center, angle, 1.0)
        rotated_roi = cv2.warpAffine(roi, rotation_matrix, (roi_w, roi_h))  # Application de la rotation

        # Lecture du texte dans la ROI tournée en utilisant EasyOCR
        results = reader.readtext(rotated_roi)
        
        # Analyse de chaque résultat détecté par EasyOCR
        for (bbox, text, prob) in results:
            # Si la probabilité de détection est assez élevée (supérieure à 0.1), on garde le texte
            if prob >= 0.1:
                # Récupération des coordonnées de la boîte autour du texte détecté
                top_left = tuple(int(coord) for coord in bbox[0])
                bottom_right = tuple(int(coord) for coord in bbox[2])
                center_x = int((top_left[0] + bottom_right[0]) / 2) + x  # Coordonnée X du centre du texte
                center_y = int((top_left[1] + bottom_right[1]) / 2) + y  # Coordonnée Y du centre du texte

                # Enregistrement des informations sur le texte détecté
                data_points.append({
                    "text": text,  # Le texte détecté
                    "coordinates": (center_x, center_y),  # Position centrale du texte
                    "bounding_box": {"top_left": top_left, "bottom_right": bottom_right},  # Coordonnées de la boîte
                    "width": int(w),  # Largeur de la boîte du contour
                    "height": int(h),  # Hauteur de la boîte du contour
                    "angle": angle,  # Angle de rotation utilisé pour détecter le texte
                    "confidence": prob  # Confiance dans la détection (probabilité)
                })
                # Affichage du texte détecté et du niveau de confiance
                print(f"    Texte détecté : '{text}' avec confiance {prob}, à l'angle {angle}°")
                break  # Sortie de la boucle pour ce contour dès qu'un texte est détecté

# Sauvegarde des données extraites dans un fichier JSON
# Le fichier JSON contiendra les textes détectés et leurs informations
with open('Output_Data/extracted_data_v5.json', 'w', encoding='utf-8') as file:
    json.dump(data_points, file, ensure_ascii=False, indent=4)

# Indication que l'extraction est terminée
print("Extraction terminée. Les données ont été enregistrées dans 'extracted_data_v5.json'.")
