generator-freestone
==================
![Header La Grange](http://clients.la-grange.ca/grange/grange_header.jpg "Header La Grange")

Scaffolding pour les projets de [La Grange](http://la-grange.ca "La Grange").

Compose la structure de base des projets chez La Grange. Contient donc la structure
des dossiers, ainsi que les principales dépendances JavaScript et SCSS/CSS.

Pour installer le générateur yeoman de lagrange
-----------------------------------------------
Cloner le projet de generateur et y aller dans la console 

	git clone https://github.com/LaGrangeMtl/generator-freestone.git
	cd generator-freestone

Y mettre une référence dans node_modules :

	npm link

Installer le générateur

	npm install -g generator-freestone

Après on peut scaffolder en faisant

	yo freestone


Notes importantes
-----------------
* AVANT DE yo lagrange UN PROJET, PULLEZ POUR ÊTRE SUR D'AVOIR LA BONNE VERSION
* Le scaffolding a des dépendances gérées par Bower, notamment le framework frontend. Pour être certain d'avoir la bonne version du framework, ce dernier doit être à jour.
* Lors d'un commit, le faire le plus clair possible et mettre en détail les choses longues à expliquer dans le champ description pour qu'on puisse suivre les modifications facilement.
* Il est important de bien documenter chaque ajout et modification majeure à ce projet qui affecte le _workflow_ sur le [système de documentation](http://workflow.grange "Documentation workflow") prévu à cet effet.

Structure des dossiers
----------------------

TODO