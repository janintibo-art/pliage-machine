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

## V3
- Course maximale et longueur utile, bibliothèque de 50 presses. Valeurs de départ (250 / 3000 mm) à remplacer par les cotes réelles, y compris après migration V1/V2.
- Perspective orientable, zoom, dimensions longitudinales illustratives. Contrôle toujours en coupe, col de cygne traité de manière conservatrice, pas de simulation des montants en 3D.
- Inversion avant/arrière indépendante pour chaque pli. Recherche bornée à 8 plis et 160 essais, 121 positions par essai ; pas de contrôle de manutention ou de dépliage/retrait.
- 8 références nominales constructeur ; pas de géométrie fabricant certifiée. Les profils nécessitent une saisie utilisateur avant montage. Les sources sont affichées dans l’éditeur ; contours à vérifier.
- Création de contour par points sur grille, saisie des coordonnées toujours possible.
- Sauvegardes JSON V1/V2 conservées ; profils de presse inclus dans les exports.

## V4 — dessin libre et grands rayons

- Pièce : choisir Dessin libre XY, effacer le profil préchargé si nécessaire, toucher la grille ou saisir les coordonnées en mm, puis convertir en cotes et angles. Appliquer la pièce pour sauvegarder et simuler. La conversion normalise le premier côté à l'horizontale et supprime les points collinéaires. Maximum 30 plis.
- Vue À plat : flan rectangulaire schématique avec lignes de pli et longueur théorique, sans déduction de pliage industrielle.
- Grands rayons : sélectionner rayon intérieur/extérieur/mi-épaisseur, angle total, épaisseur, angle intérieur minimal ou nombre imposé, sens et extensions droites. Le modèle est un polygone tangent de rayon à mi-épaisseur R. Pour N plis, delta = angle total/N, pas = 2R tan(delta/2), première et dernière portions = demi-pas + extension. Écart radial maximal = R(sec(delta/2)−1). Les positions sont mesurées depuis le bord théorique, pas des consignes de butées. Comparaison facultative avec le flan disponible.
- Générer la pièce, contrôler les dimensions, appliquer puis simuler les plis. Le format de sauvegarde ne change pas : les paramètres géométriques générés sont conservés sous forme de longueurs et angles ; les champs du calculateur et le brouillon libre non validé ne sont pas sauvegardés.
- Le modèle n'intègre ni retour élastique, ni facteur K, ni rayon réel des petits plis, ni tonnage. Les avertissements sur le V ne valident pas la faisabilité. Les collisions 2D échantillonnées ne couvrent pas le contact local ni les manipulations ; la recherche automatique reste limitée à 8 plis.
- Tests : `npm test` (18 cas).

## V5 — butées arrière et rendu industriel

- Vue 3D par défaut, surfaces métalliques ombrées, bandes de serrage décoratives, épaisseur visible sur chaque côté de la tôle (jonctions simplifiées), deux doigts de butée illustratifs. Retour à la coupe 2D avec le bouton Vue 2D.
- Onglet Plieuse : butée désactivée (valeur par défaut, y compris après migration), automatique ou X manuel. X positif vers l’arrière ; R = cote du dessus du doigt par rapport au dessus de la matrice. X auto = abscisse du bord terminal le plus en arrière au début du pli + demi-épaisseur + 0,1 mm, approximation géométrique. Retrait linéaire durant le premier quart de l’animation. Dimensions et limites X mémorisées avec chaque presse et dans le JSON.
- Contrôle de collision avec la coupe rectangulaire du doigt et dépassement de la plage X ; pas de contrôle de mise en appui, de déplacement en Z, de support de butée, ni de trajectoire de manutention. La coupe ignore la position longitudinale des doigts (peut signaler des conflits qui n’existent pas en 3D). Ne jamais utiliser X calculé comme instruction machine.
- Cinq références nominales supplémentaires (quatre AMADA AFH-ATC, une TRUMPF EV026). Sources affichées ; aucun contour constructeur automatique. Les valeurs du PDF AMADA 2021 ont été relevées dans son tableau textuel ; la planche graphique n’a pas pu être consultée.
- 23 tests géométriques et 1 test d’intégration avec DOM/canvas simulés. Le rendu réel et les compilations natives restent à vérifier.

## V10 — éditeur de profils et vues liées

- Cotes/angles avec insertion de côtés ; dessin XY avec sélection, déplacement, insertion et suppression de sommets, saisie exacte et historique des opérations graphiques.
- Cinq modèles de départ. Profil plié et flan à plat affichés simultanément, vue de volume extrudé indicative, tableau des plis numérotés.
- Enregistrer et simuler transmet le profil au moteur existant. La séquence est conservée si les longueurs et angles restent exactement identiques.
- Limites inchangées : 30 plis, section constante et lignes de pli parallèles ; pas de découpes, perçages ou plis non parallèles. Les positions à plat sont purement géométriques. Aucune validation de sécurité machine. Les modifications non enregistrées ne sont pas conservées en quittant l’éditeur.
- Détails visuels supplémentaires de la presse, hors modèle de collision.

## V11 — Tôle à plat
Éditeur indépendant des profils de simulation : contour polygonal fermé, coordonnées XY, perçages et rectangles arrondis, encoches de bord, annulation/rétablissement, enregistrement dans le projet JSON. Deux exemples fictifs non cotés pour la fabrication. La validation vérifie les croisements, les découpes hors contour et leurs chevauchements avec des arcs polygonalisés ; elle ne constitue pas une validation industrielle. Pas encore de pliage multidirectionnel, de collision 3D ni de transfert de ce plan à la presse.

## V12 — axes de pli multidirectionnels
Dans Tôle à plat, tracer A puis B (accrochage au bord à 12 pixels, sinon à la grille), ou saisir les quatre coordonnées. Angle intérieur, signe de rotation autour de A→B et côté mobile dans le plan XY. Liste réordonnable, modification, suppression, annulation et export JSON. Les sauvegardes V11 sans `bends` restent valides. 60 axes max. Les axes hors matière extérieure, superposés ou dégénérés sont refusés. Axes partiels, intersections et traversées de découpes sont signalés, non résolus. Les angles proches de zéro ne modélisent pas un pli écrasé. Pas encore de séparation de faces, de pliage 3D ou de contrôle de fabrication pour ce plan.

## V14 — pièces complexes sur la presse
Dans **Tôle à plat → Sur la presse**, le brouillon valide est positionné sur la presse et les profils d’outillage actifs. Choisir le pli, puis avancer dans la phase approche / formage / remontée. Chaque axe est centré et aligné longitudinalement, avec décalage et orientation avant/arrière réglables. Pour P2 et suivants, « Voir le transfert » montre un déplacement rigide indicatif entre la fin du pli précédent et le début du pli courant (rotation interpolée et retrait vers l’avant). Les réglages de placement et longueur d’outil sont temporaires ; le plan et son ordre restent dans le JSON existant. La vue rapprochée tronque les outils et le bâti ; la vue entière utilise la longueur utile.
Les contrôles de longueur, d’angle nominal, d’ouverture et de course sont indicatifs. Les butées manuelles sont schématiques ; les butées automatiques ne sont pas résolues pour ces pièces. Aucun calcul de collision volumétrique, contrôle de contact, validation de trajectoire ou pilotage de machine. Les axes partiels, croisés ou traversant une découpe restent bloqués. Aucun calcul de développé industriel ni de tonnage.

## V15 — interférences volumétriques indicatives

- Dans Tôle à plat → Sur la presse, chaque triangle de tôle est épaissi de part et d’autre de sa fibre moyenne. Les contours de la machine et des outils sont triangulés et extrudés en prismes convexes. Test par axes séparateurs (normales et produits vectoriels des arêtes), avec filtrage par boîtes englobantes et seuil de 0,02 mm sur les projections. Les ouvertures restent vides. Les faces et éléments concernés sont mis en rouge ; l’affichage de la tôle reste à mi-épaisseur.
- Le contrôle utilise le modèle de presse entière, indépendamment du cadrage. Poinçon, matrice, table, tablier, montants simplifiés, serrages et doigts de butée manuels modélisés sont contrôlés ; les butées automatiques ne sont pas résolues. Pas de contrôle entre solides de la machine.
- Les boutons Analyser ce mouvement / Analyser la gamme contrôlent 17 positions uniformes par pli ou transfert (extrémités incluses), avec annulation et accès à la première position signalée. Une modification des paramètres invalide le rapport. Les positions intermédiaires peuvent masquer une collision. Maximum 12 000 triangles de tôle et 350 000 comparaisons par position ; dépassement signalé comme contrôle incomplet.
- Le contact de formage et les chevauchements de prismes proches des charnières à angle vif ne sont pas exclus ; ils peuvent générer des signalements non représentatifs d'une collision réelle. La tolérance et le maillage peuvent aussi masquer de petites interférences. Aucun calcul de rayon réel, de déformation, de trajectoire garantie ou de sécurité. Ne pas utiliser pour autoriser un pliage réel.
- Format JSON inchangé. APK/EXE versionnés V15. Tests géométriques et interface simulée : 62 cas.

## V16 — importation DXF et photo de plan

Dans **Tôle à plat → Importer un DXF ou une photo de plan** :

- DXF ASCII 2D : LWPOLYLINE (avec bulges), LINE, ARC et CIRCLE. Les lignes/arcs ouverts sont raccordés à 0,002 mm si leurs extrémités permettent une boucle non ambiguë ; une seule tôle extérieure, avec perçages et découpes polygonales internes. Les arcs sont polygonalisés à 5° maximum, dans les limites de 180 sommets par contour et 80 découpes. Les découpes polygonales importées sont conservées, affichées, sauvegardées et supprimables, mais pas encore éditables sommet par sommet. Les SPLINE, INSERT, anciennes POLYLINE, DXF binaires et géométries non planes sont refusés si présents dans la sélection. Les annotations usuelles ne sont pas importées. Les unités proviennent de $INSUNITS (mm, cm, m, pouces, pieds) ou d'un choix explicite de l'utilisateur. Le filtre de calque facultatif permet de ne lire que la géométrie voulue. Un calque LINE de plis facultatif peut être importé avec angle intérieur, sens et côté mobile initiaux saisis par l'utilisateur ; ces paramètres et l'ordre d'apparition dans le DXF doivent être vérifiés individuellement. Lire le résumé avant d'appliquer. Le brouillon reste intact en cas d'erreur. Import annulable, épaisseur reprise du brouillon.
- Photo JPEG/PNG/WebP locale (12 Mo, 25 Mpx max) : calque temporaire d'opacité réglable. Calibrer par deux points et une cote connue ; angle cible facultatif pour redresser la rotation dans le plan. La photo n'est pas envoyée sur Internet ni enregistrée dans le JSON. Aucun redressement de perspective, OCR ni reconnaissance automatique. Vérifier plusieurs cotes. Le mode Nouveau contour sur photo permet de tracer un polygone puis de remplacer le contour, les découpes et les plis existants après confirmation ; les outils habituels ajoutent les découpes et plis. Enregistrer la géométrie ou exporter en JSON. Une photo oblique ne constitue pas une source de dimensions fiables.
- Aucun changement du moteur de collision ou de la cinématique de pliage. Le format JSON est étendu aux découpes polygonales ; les anciennes sauvegardes restent lisibles en V16, les nouveaux contours polygonaux ne sont pas compatibles avec la V15. 69 tests automatisés. Vérification complémentaire dans Chromium avec le HTML et les scripts chargés localement en mémoire, pas de compilation native ni test de la boîte de dialogue Android.

## V17 — plis spéciaux

- Dans Tôle à plat → Lignes de pliage → Plis spéciaux : générer deux axes parallèles à partir de A/B, côté mobile et angle du premier pli. Le soyage utilise un décalage à mi-épaisseur et deux rotations opposées identiques ; entraxe = hauteur / sin(180° − angle intérieur). Il s’agit de deux plis à angles vifs, pas d’un outil à soyer.
- Le double pli accepte un entraxe et un angle secondaire indépendants, avec sens identique ou opposé. Les deux lignes restent indépendantes dans la gamme. Les axes hors tôle ou ambigus et les axes rencontrant des découpes sont refusés par le générateur.
- Le pli écrasé enregistre un prépli et une fermeture nominale à 0°. Sa simulation et l’analyse de collision sont bloquées tant que la fermeture et l’outillage ne sont pas modélisés. Les projets contenant ce type ne doivent pas être utilisés sur les versions antérieures.
- Les anciennes sauvegardes restent lisibles. Aucun nouveau calcul de développé industriel ou de tonnage.

## V18 — recherche de gamme 3D

Dans Tôle à plat → Sur la presse → Recherche automatique de gamme 3D. De 1 à 12 plis, 12/24/40 candidats maximum ; permutation de l’ordre et retournements, offsets associés aux axes d'origine, outillage inchangé. Chaque candidat est comparé à la forme finale initiale (écart maximum 0,005 mm après alignement rigide des faces), puis contrôlé sur 9 positions par pli et transfert. Priorité aux contrôles complets, puis aux alertes nominales, puis au nombre de positions et de paires en recouvrement. Recherche non exhaustive, les contacts de formage restent comptés. Pas de recherche de longueur d'outillage ou de trajectoire. Proposition applicable uniquement si meilleure et sans contrôle incomplet ; application au brouillon, annulable, sauvegarde manuelle de l'ordre. Les orientations et offsets restent temporaires. Après application, refaire l’analyse de gamme à 17 positions par mouvement et vérifier avec les moyens validés de l’atelier. L'absence de signalement n'est pas une garantie. Aucun changement de format JSON, aucun calcul de tonnage/développé industriel.

### V19 — Habillage de la presse pour les pièces complexes
Dans Tôle à plat > Sur la presse, le mode Habillage détaillé affiche des brides, vis, rails, un socle, des carénages et un pupitre illustratifs. La peau de tôle est extrudée visuellement à l'épaisseur nominale, avec des jonctions à angle vif. Les vues Perspective, Face et Profil sont accessibles en un clic. Désactiver l'habillage pour retrouver la géométrie technique du modèle. Les accessoires décoratifs ne sont pas inclus dans les collisions ; les résultats du moteur V18 restent inchangés. Aucun pilotage de machine ni validation de sécurité.

### V20 — Catalogue visuel et import DXF d'outillage
- 25 fiches nominales (13 anciennes + 12 nouvelles), sources publiques AMADA/TRUMPF. Les fiches sans contour restent non montables ; leur schéma n'est pas une géométrie constructeur.
- Recherche par référence, marque et type ; aperçus en coupe et extrusion illustrative des profils enregistrés.
- Import DXF ASCII d'un contour fermé unique, sans découpe, avec unité, calque et origine XY renseignés par l'utilisateur ; 100 sommets maximum. Les arcs sont polygonalisés. Vérifier la géométrie et l'origine avant enregistrement.
- Aucun changement de moteur de pliage, de collision ou de format de sauvegarde. Les longueurs d'aperçu ne sont pas des longueurs de montage.

### V21 — Montage multiposte
- Dans Tôle à plat > Sur la presse > Montage multiposte : ajouter jusqu’à 12 postes (80 segments au total), choisir les poinçons et matrices montables, saisir le centre longitudinal X et les listes de longueurs séparées par des points-virgules. Les segments d’une même rangée et d’un même poste sont jointifs ; les espaces entre postes sont libres.
- Affecter le pli actif à un poste. Le décalage longitudinal est relatif au centre de ce poste. Les deux rangées ont des longueurs indépendantes, mais un centre commun. Tous les postes sont représentés et testés contre la pièce. Le montage est limité aux hauteurs de référence identiques (pas d’adaptateurs), les segments sont des extrusions de contours, sans contrôle des fixations, ni de compatibilité physique entre outils.
- La recherche de gamme conserve les affectations en testant les ordres et orientations ; elle ne choisit pas automatiquement les postes. Les réglages restent temporaires et les affectations sont réinitialisées si le plan change ou si un poste est supprimé. Le montage n’est pas inclus dans le JSON.
- Les limites V15–V18 restent applicables : échantillonnage, contacts de formage et charnières idéalisés, pas de validation de production.

## V22 — Diagnostic des interférences 3D

Dans Tôle à plat → Sur la presse, choisir le seuil de proximité (0 à 20 mm, 0 désactive la mesure), puis 17, 33 ou 65 positions par mouvement. Les distances sont les distances entre les prismes triangulés de la tôle et des solides machine représentés, non les distances certifiées sur une presse réelle. Le seuil de recouvrement reste 0,02 mm. Un recouvrement près du pli actif peut être annoté comme contact possible, mais il reste rouge et compté dans tous les résultats. Aucun contact n'est automatiquement accepté. Les limites de calcul sont signalées ; la recherche de gamme conserve ses 9 positions et son classement précédent. Les rayons réels, la déformation et les collisions entre positions restent non résolus. Les réglages sont temporaires.

## V24 — ergonomie
- Navigation organisée par métier : Concevoir, Équiper, Simuler, Sauvegarder. Tôle complexe mène aux trois vues du même dessin.
- Réglages du plan répartis en quatre panneaux contextuels (Contour, Découpes, Plis, Encoches) ; les modes de dessin ouvrent les paramètres correspondants. Boutons de retour au plan et d’accès aux contrôles.
- Mode atelier : masquer temporairement la navigation principale pour travailler sur le dessin ou la simulation ; bouton de sortie dans la barre du plan. Vues pièce pliée et presse sur toute la largeur ; réglages caméra et recherche de gamme repliables. Aucun changement des formats de sauvegarde ou des moteurs de calcul.
- Les modèles restent indicatifs et ne valident pas la sécurité du pliage réel.

## V25 — Passerelle inter-applications
- Sauvegarder → Projets → Échanger une pièce : export et import JSON de géométrie enregistrée, avec résumé et confirmation avant remplacement. Le format versionné est décrit dans `ECHANGE-V25.md` (exemples profil simple et tôle complexe).
- Un import ne remplace que le type de pièce sélectionné ; presse, outillage, bibliothèques et autre type de pièce sont conservés. Enregistrer ses brouillons avant import. Aucun calcul externe, réseau ou commande machine. La compatibilité avec l'autre logiciel nécessite un adaptateur dans celui-ci.
- Export Android par sélecteur de documents, nom distinct de la sauvegarde complète ; Windows par téléchargement local. Les limitations de simulation existantes restent inchangées.
