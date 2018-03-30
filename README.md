# Chen & Co vous présente la première démo de Chen&Cloud en version alpha
![**working**](https://image.noelshack.com/fichiers/2018/13/5/1522443657-git-working.png)

> **Attention !**
> Vous êtes sur la branche *final-sprint*. Cette branche sert à l'implémentation de modifications non validées sur l'ensemble du projet. Si cette branche a été validée et rendue, alors tenez-la pour version finale du projet, sinon, reportez-vous à la branche *pre-final*.

Les fonctionnalités suivantes sont implémentées:
    
    La gestion des utilisateurs
    La galerie de photos
    Les commentaires
    Le chat
    
Un invité peut interagir avec le chat et créer un nouvel utilisateur.
Un utilisateur peut interagir avec le chat, voir les photos, les commenter et supprimer **ses** commentaires.
Le chat ne possède aucune sécurité pour les utilisateurs, `<script>$('body').empty()</script>` fonctionne parfaitement, mais on peut faire pleins d'autre choses rigolotes.
**request.php** est prévu pour rajouter les photos mais non utilisé.

Le chat est disponible sur [Github](https://github.com/HerrCraziDev/redlinekitten.js), le manuel est fourni avec.
Pour l'installer :`git clone https://github.com/HerrCraziDev/redlinekitten.js.git`

Une démo en ligne du site existe : [chen-and-cloud.tk](http://chen-and-cloud.tk), attention le chat peut ne pas fonctionner en fonction des restrictions de votre réseau.
