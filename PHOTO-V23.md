# V23 — Reconnaissance assistée des plans photographiés

Dans Tôle à plat, ouvrir Importations puis Photo de plan. Charger une image locale. Pour redresser, indiquer les dimensions d’un rectangle réel du plan et toucher ses quatre coins dans l’ordre haut gauche, haut droit, bas droit, bas gauche. Le résultat est temporaire ; recalibrer sur une cote connue et vérifier une seconde cote indépendante. La photo originale peut être restaurée.

Détecter les formes et traits. Régler le seuil et la simplification, relancer si nécessaire. Examiner les suggestions une par une (surbrillance jaune). Un contour fermé peut remplacer le dessin, ou être ajouté comme découpe polygonale. Un trait isolé préremplit seulement les coordonnées d’un pli : vérifier ses extrémités, son angle, son sens, sa face mobile et son ordre avant de l’ajouter. Aucun ajout automatique de pli. Le remplacement du contour efface les anciennes découpes et les plis après confirmation et reste annulable.

Le moteur travaille sur une image réduite à 1200 pixels sur son plus grand côté. Il détecte des composantes sombres isolées et fermées, ou des traits minces isolés ; la bordure des traits est approximée, pas leur axe exact pour les contours. Des textes, cadres et cotes peuvent être proposés à tort. Les contours interrompus ou fusionnés peuvent être manqués. Pas d’OCR, de reconnaissance des pointillés ou d’interprétation du sens des plis. Le traitement ne constitue pas un relevé métrologique et ne doit pas servir à valider un pliage réel.

Les images restent locales, ne sont pas incluses dans les sauvegardes. Exporter le projet JSON après validation du dessin. Aucun changement au moteur de collision ni à la recherche de gamme.
