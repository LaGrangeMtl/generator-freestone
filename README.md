generator-freestone
==================
![Header La Grange](http://clients.la-grange.ca/grange/grange_header.jpg "Header La Grange")

Scaffolding pour les projets de [La Grange](http://la-grange.ca "La Grange").

Compose la structure de base des projets chez La Grange. Contient donc la structure
des dossiers, ainsi que les principales dépendances JavaScript et SCSS/CSS.

Il sert à générer une structure de dossier pour un nouveau projet, il est donc installé globalement, une seule fois. On l'appelle par la suite pour générer le projet.

Le cloner sur son poste permet d'y apporter des modifications, si ce n'est pas votre cas, vous pouvez passer les étapes de `git` et `link`.

Pour installer le générateur de La Grange
-----------------------------------------------

Cloner le projet de generateur et `cd` dans le dossier

```sh
git clone https://github.com/LaGrangeMtl/generator-freestone.git
cd generator-freestone
```

Y mettre une référence dans node_modules :

```sh
npm link
```

Installer le générateur

```sh
npm install -g generator-freestone
```

Après on peut scaffolder en faisant

```sh
yo freestone
```

Notes importantes
-----------------
* AVANT DE yo lagrange UN PROJET, PULLEZ POUR ÊTRE SUR D'AVOIR LA BONNE VERSION
* Lors d'un commit, le faire le plus clair possible et mettre en détail les choses longues à expliquer dans le champ description pour qu'on puisse suivre les modifications facilement.
* Il est important de bien documenter chaque ajout et modification majeure à ce projet qui affecte le _workflow_ sur le [système de documentation](http://workflow.grange "Documentation workflow") prévu à cet effet.