# Pliage Machine — V2

V2 : correctif de compilation Android (SDK sans paquet obsolète `tools`), sans changement du moteur de simulation ni des données locales.

Prototype autonome Android / Windows, en français, pour préparer et visualiser une séquence de pliage hors commande numérique. Aucun accès machine, aucune permission Internet Android.

## Démarrage

1. Dans **Pièce**, saisir les longueurs sur la fibre moyenne, les angles intérieurs (180° plat, 90° équerre), le signe de chaque pli, l'épaisseur et la longueur de pli. Appliquer.
2. Dans **Plieuse**, saisir l'ouverture libre maximale entre la pointe du poinçon et le haut de matrice, la profondeur du col de cygne, les largeurs en coupe du tablier et de la table.
3. Dans **Catalogue**, monter un poinçon et une matrice. Les dix outils de départ sont génériques et non certifiés. Les filtres TRUMPF et AMADA restent vides tant que des profils constructeur ne sont pas saisis par l'utilisateur.
4. Dans **Mes outils**, générer un contour simple ou saisir une liste de coordonnées X,Y en mm. Poinçon : origine à la pointe, Y positif. Matrice : origine au centre du V, niveau des épaules Y=0, Y négatif. Renseigner la source de ses cotes. Les outils marqués d'une marque par l'utilisateur ne sont pas vérifiés.
5. Dans **Simulation**, changer l'ordre des plis par les flèches, choisir le pli et lancer l'animation ou utiliser le curseur. L'analyse balaie 121 positions par pli. Les avertissements signalent des interférences ou des incompatibilités dans le modèle. Une absence de signalement ne prouve pas l'absence de collision réelle.
6. Dans **Projets**, exporter un JSON indépendant avant toute mise à jour ou désinstallation. Import JSON validé. La dernière configuration est mémorisée localement.

## Sources constructeur (aucune référence dimensionnée embarquée)

- TRUMPF : https://www.trumpf.com/fr_FR/produits/services/services-machines-systemes-et-laser/outillages/outils-de-pliage/
- AMADA : https://www.amada.eu/fr-en/products/tooling/

## Moteur et limites

Les segments de la fibre moyenne sont rigides et articulés aux lignes de pliage. La cinématique symétrique en coupe est une approximation du pliage en l'air ; le pli actif pivote pendant la descente, les plis précédents sont conservés. Pour chaque état, les distances segment/polygone et les intersections entre segments non adjacents sont comparées à l'épaisseur. Le contact de formage attendu est exclu sur une portion locale des deux côtés du pli actif (longueur dépendant du V, de l'épaisseur et de l'angle). Cette exclusion peut masquer une interférence locale. Les outils sont des polygones, le bâti est simplifié, le balayage discret peut manquer une collision intermédiaire. La vue pseudo-3D extrude la coupe, avec profondeur visuelle plafonnée ; elle ne calcule pas de collisions spatiales. Pas de butées, déplacement de la pièce entre plis, rotation de manipulation, segmentation longitudinale, rayon de pli réel, retour élastique, tonnage, calcul de développé industriel, contrôle de fixation ou de course maximale.

**Ne pas utiliser pour valider une opération réelle, piloter la presse ou remplacer le logiciel constructeur et les procédures de sécurité.** Vérifier chaque opération avec les données réelles et les moyens validés de l'atelier.

## Compilation

`npm test` teste le moteur sans dépendances. GitHub Actions compile un APK de développement (`assembleDebug`, SDK 35, Java 17, Gradle 8.9) et un EXE portable Electron x64 (Windows). Les fichiers sont publiés dans Artifacts du workflow. APK de test : la signature debug du runner peut varier entre les compilations ; sauvegarder le JSON avant changement de version. L'EXE n'est pas signé commercialement. L'interface et les compilations natives restent à valider sur appareils réels.
