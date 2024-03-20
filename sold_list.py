from pynput import mouse
import keyboard
from PIL import ImageGrab
import pytesseract
print(pytesseract)
# Ce script analyse une zone de l'écran pour y trouver du texte et l'écrit dans un fichier texte.

# Configuration de pytesseract
# pytesseract.pytesseract.tesseract_cmd = r'C:\Users\Utilisateur\AppData\Local\Packages\PythonSoftwareFoundation.Python.3.12_qbz5n2kfra8p0\LocalCache\local-packages\Python312\Scripts'

# Fonction pour afficher les coordonnées du clic
# def on_click(x, y, button, pressed):
#     if pressed:
#         print('Mouse clicked at ({0}, {1})'.format(x, y))

# listener = mouse.Listener(on_click=on_click)
# listener.start()

# Fonction pour capturer et analyser une zone de l'écran
def capture_and_analyze():
    # Définir la zone de capture (bbox)
    bbox = (538, 390, 745, 686)  # (x1, y1, x2, y2)

    # Capturer une portion de l'écran
    screenshot = ImageGrab.grab(bbox)

    # Utiliser pytesseract pour extraire le texte
    text = pytesseract.image_to_string(screenshot)

    # Écrire le texte trouvé dans un fichier
    with open("output.txt", "a", encoding="utf-8") as file:
        for line in text.splitlines():
            # Remove special characters except spaces and diacritics and apostrophes and "-"
            line = ''.join(e for e in line if e.isalnum() or e in [" ", "’", "-", "'"])
            # Remove empty lines
            if line.strip() == "":
                continue

            # Remove lines containing "Rune "
            if "Rune " in line:
                continue
            # Remove 1€ and €
            line = line.replace("1€", "")
            line = line.replace("€", "")

            # Replace ‘Amulette de Tragon by Amulette de Traçon
            line = line.replace("Tragon", "Traçon")
            line = line.replace("‘", "")
            # Ronin -> Rōnin
            line = line.replace("Ronin", "Rōnin")
            # Héte -> Hète
            line = line.replace("Héte", "Hète")
            # Replace "Pwak" by "Pwâk",
            line = line.replace("Pwak", "Pwâk")
            # Replace "Pére" by "Père"
            line = line.replace("Pére", "Père")
            # "Griit" -> "Grüt"
            line = line.replace("Griit", "Grüt")
            # "Bréche" -> "Brèche"
            line = line.replace("Bréche", "Brèche")
            print(line)
            file.write(line + ",")

# Boucle pour attendre l'appui sur "C"
while True:
    print("Appuyez sur 'X' pour capturer et analyser...")
    keyboard.wait('x')
    capture_and_analyze()
    print("Texte capturé et écrit dans output.txt.")
    # Display click coordinates