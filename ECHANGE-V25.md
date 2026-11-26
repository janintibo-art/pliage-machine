# Passerelle Pliage Machine — format d’échange 1

Dans Sauvegarder → Projets → Échanger une pièce, exporter la pièce **enregistrée** ou importer un fichier JSON compatible. Ce format est indépendant des sauvegardes complètes. Il ne contient ni commandes machine, ni résultats de tonnage, ni développé industriel, ni validation de sécurité. Les dimensions sont nominales et les données de coupe sont géométriques. L'autre application doit implémenter ce contrat ; aucune intégration externe n'est active.

## Enveloppe obligatoire

- `format`: `pliage-machine.exchange`
- `version`: entier `1` (les versions inconnues sont refusées)
- `units`: `mm-deg` (millimètres et degrés ; aucune conversion implicite)
- `kind`: `profile` ou `flat`
- `piece`: objet selon le type ci-dessous.

### Profil simple : exemple complet

```json
{"format":"pliage-machine.exchange","version":1,"units":"mm-deg","kind":"profile","piece":{"lengths":[45,110,45],"turns":[90,-90],"order":[0,1],"flips":[false,false],"t":2,"width":300,"material":"Acier"}}
```

`lengths` : longueurs à mi-épaisseur en mm (2 à 31 côtés). `turns` : rotations signées du profil (0 à plat, ±90 = équerre), entre -170 et 170. `order` : permutation des indices de plis, à partir de zéro. `flips` : booléen par indice de pli (inversion avant/arrière). `t` : épaisseur. `width` : longueur de pli. `material` : Acier, Inox, Aluminium ou Autre.

### Tôle complexe : exemple complet

```json
{"format":"pliage-machine.exchange","version":1,"units":"mm-deg","kind":"flat","piece":{"name":"Exemple","thickness":2,"contour":[[0,0],[200,0],[200,100],[0,100]],"cuts":[{"kind":"circle","x":100,"y":50,"d":20}],"bends":[{"a":[30,0],"b":[30,100],"angle":90,"sign":1,"side":"left"}]}}
```

Contour : liste ordonnée de sommets XY en mm, boucle fermée implicitement (ne pas répéter le premier point). Découpes : cercle `kind:circle` et centre `x,y`, diamètre `d` ; rectangle `kind:rect` et centre `x,y`, largeur `w`, hauteur `h`, rayon de coin `r` ; polygone `kind:poly` et `points`. Les découpes doivent être intérieures et disjointes. Plis : extrémités `a,b` en XY, angle **intérieur** en degrés (180 à plat), `sign` ±1 suivant la convention de pliage de Pliage Machine, `side` left/right par rapport à l'axe dirigé A→B. Le tableau est dans l'ordre des opérations. Pour un pli écrasé : `kind:"hem"`, `angle:0`, `preAngle` entre 10 et 90 ; sa fermeture n'est pas simulée. Jusqu'à 180 sommets, 80 découpes, 60 axes ; limites géométriques de l'éditeur existant. Les plis partiels ou croisés peuvent être enregistrés mais ne sont pas tous simulables.

## Comportement

L'import présente un résumé avant remplacement explicite du type de pièce correspondant. La presse, les outils, l'autre type de pièce et les bibliothèques restent inchangés. Le dessin non enregistré du type remplacé est perdu après confirmation. Les champs non reconnus sont ignorés ; les données métier ne sont jamais exécutées. Les montages multipostes temporaires, rapports de collision et photos ne sont pas exportés. Pour conserver tout le projet, utiliser la sauvegarde JSON habituelle. Fichier limité à 3 Mo. Aucun réseau ni partage automatique.
