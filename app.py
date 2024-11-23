from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import cv2
import easyocr
import numpy as np
from scipy.spatial import distance
import traceback

# Initialisation de l'application Flask
app = Flask(__name__)
CORS(app)  # Autoriser les requêtes cross-origin (React/Frontend)

# Répertoires pour les fichiers temporaires
UPLOAD_FOLDER = 'uploads'
RESULT_FOLDER = 'results'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULT_FOLDER, exist_ok=True)

# -------------------- FONCTIONS UTILITAIRES -------------------- #

def preprocess_image(image_path):
    """
    Prétraite une image pour faciliter l'extraction des données.
    """
    try:
        image = cv2.imread(image_path)
        if image is None:
            raise FileNotFoundError(f"Image introuvable au chemin : {image_path}")
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        _, binary = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY_INV)
        return image, gray, binary
    except Exception as e:
        raise RuntimeError(f"Erreur dans le prétraitement : {str(e)}")

def extract_text_with_easyocr(image):
    """
    Extrait les textes d'une image à l'aide d'EasyOCR.
    """
    try:
        reader = easyocr.Reader(['en'], gpu=False)
        results = reader.readtext(image, detail=1)
        extracted_texts = []

        for (bbox, text, prob) in results:
            if prob > 0.5:  # Filtrer les résultats avec une confiance suffisante
                x, y = int((bbox[0][0] + bbox[1][0]) / 2), int((bbox[0][1] + bbox[2][1]) / 2)
                extracted_texts.append((text.strip(), (x, y)))

        return extracted_texts
    except Exception as e:
        raise RuntimeError(f"Erreur dans l'extraction de texte : {str(e)}")

def filter_valid_values(texts):
    """
    Filtre les textes pour ne conserver que les valeurs numériques entre 3 et 4 chiffres.
    """
    valid_values = []
    for text, coords in texts:
        if text.lstrip('-').isdigit() and 3 <= len(text.lstrip('-')) <= 4:
            valid_values.append((int(text), coords))
    return valid_values

def extract_contours(image):
    """
    Extrait les contours d'une image.
    """
    try:
        edges = cv2.Canny(image, 50, 150)
        contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        return contours
    except Exception as e:
        raise RuntimeError(f"Erreur dans l'extraction des contours : {str(e)}")

def match_depth_to_curves(contours, texts):
    """
    Associe les valeurs extraites aux coordonnées des contours.
    """
    matched_depths = []
    for contour in contours:
        for point in contour:
            x, y = point[0]
            closest_text, min_dist = None, float('inf')
            for text, (tx, ty) in texts:
                dist = distance.euclidean((x, y), (tx, ty))
                if dist < min_dist:
                    min_dist = dist
                    closest_text = text
            if closest_text:
                matched_depths.append((x, y, closest_text))
    return matched_depths

def create_ascii_grid(output_path, matched_depths):
    """
    Crée un fichier ASCII Grid contenant les profondeurs associées aux coordonnées.
    """
    try:
        header = """# Type: scattered data
# Version: 6
# Description: Converted from image contours
# Format: free
# Field: 1 x
# Field: 2 y
# Field: 3 z meters
# Field: 4 column
# Field: 5 row
# Projection: Local Rectangular
# Units: meters
# End:
"""
        data_lines = []
        for i, (x, y, z) in enumerate(matched_depths):
            col = i % 10 + 1
            row = i // 10 + 1
            data_lines.append(f"{x:.6f} {y:.6f} {z:.6f} {col} {row}")

        with open(output_path, "w") as file:
            file.write(header)
            file.write("\n".join(data_lines))
    except Exception as e:
        raise RuntimeError(f"Erreur dans la création du fichier ASCII : {str(e)}")

def clean_up(file_path):
    """
    Supprime un fichier temporaire pour libérer de l'espace.
    """
    if os.path.exists(file_path):
        os.remove(file_path)

# -------------------- ENDPOINTS FLASK -------------------- #

@app.route('/upload', methods=['POST'])
def upload_image():
    """
    Endpoint pour le téléchargement d'une image et le traitement des données.
    """
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'Aucun fichier envoyé.'}), 400

        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'Nom de fichier invalide.'}), 400

        # Sauvegarde temporaire de l'image
        image_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(image_path)

        # Prétraitement de l'image
        original_image, gray_image, binary_image = preprocess_image(image_path)

        # Extraction de texte
        extracted_texts = extract_text_with_easyocr(gray_image)
        valid_texts = filter_valid_values(extracted_texts)

        # Extraction des contours
        contours = extract_contours(gray_image)

        # Association des valeurs aux contours
        matched_depths = match_depth_to_curves(contours, valid_texts)

        # Génération du fichier ASCII Grid
        output_ascii_path = os.path.join(RESULT_FOLDER, 'ascii_grid_output_map.asc')
        create_ascii_grid(output_ascii_path, matched_depths)

        # Nettoyer l'image temporaire
        clean_up(image_path)

        return jsonify({'ascii_file': output_ascii_path})

    except Exception as e:
        return jsonify({'error': str(e), 'traceback': traceback.format_exc()}), 500

@app.route('/download', methods=['GET'])
def download_ascii_file():
    """
    Endpoint pour télécharger le fichier ASCII Grid.
    """
    try:
        file_path = request.args.get('file_path', '')
        if not os.path.exists(file_path):
            return jsonify({'error': 'Fichier introuvable.'}), 404
        return send_file(file_path, as_attachment=True)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# -------------------- LANCEMENT DU SERVEUR -------------------- #
if __name__ == '__main__':
    app.run(debug=True)
