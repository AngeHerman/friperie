# friperie
Pour lancer le projet  il faut
- Installer d'abord les modules avec les commandes

    npm install express  
    npm install ejs  
    npm install pg  
    npm install dotenv  
    npm install express-session  
    npm install body-parser  
    npm install connect-multiparty  
- Se connecter à psql avec votre nom d'utilisateur an lançant la commande  
    psql -U <psql_username> -W postgres 
- Creer la base de données en lançant les 3 commandes suivantes   
    drop database if exists friperie;  
    CREATE DATABASE friperie;  
    \c friperie <psql_username> localhost 5432;
- Creer les tables de la bases de données et les remplir en faisant un copie-coller du code du fichier init.sql  
- Taper \q ou crtl + d pour quitter psql  
- Lancer la commande : touch .env  
- Remplir votre fichier .env qu'on vient de creer comme suit:  
    PG_HOST=localhost  
    PG_PORT=5432  
    PG_USER= <psql_username>  
    PG_PASSWORD= <psql_password>   
    PG_DATABASE=friperie  
    SESSION_SECRET=1234567890abcdefghijklmnopqrstuvwxyzazerty  

- Si vous n'avez pas de mot de passe psql alors vous devez en créer comme suit sinon ça ne marchera pas 
    - Lancez votre psql : psql
    - Connectez vous à la base postgres: \connect postgres   
    - Lancez : \password <sql_username>  
        Cette dernière vous demandera d'entrer le mot de passe voulu  
    - Lancez : \q pour quitter
- Retournez modifier  PG_PASSWORD= <psql_password> dans votre fichier .env
## Lancer le script init.sql
## node main.js pour lancer le serveur sur localhost::8080

