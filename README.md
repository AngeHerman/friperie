# Friperie Web Boutique

Ce guide vous permettra de lancer le projet de la boutique web de friperie.

## Prérequis

Assurez-vous d'avoir Node.js et PostgreSQL installés sur votre machine.

## Installation

1. **Installer les modules Node.js nécessaires :**

    ```bash
    npm install express ejs pg dotenv express-session body-parser connect-multiparty
    ```

2. **Se connecter à PostgreSQL :**

    Ouvrez un terminal et connectez-vous à PostgreSQL avec votre nom d'utilisateur en lançant la commande suivante :

    ```bash
    psql -U <psql_username> -W postgres
    ```

3. **Créer la base de données :**

    Exécutez les commandes suivantes dans PostgreSQL pour créer la base de données :

    ```sql
    DROP DATABASE IF EXISTS friperie;
    CREATE DATABASE friperie;
    \c friperie <psql_username> localhost 5432;
    ```

4. **Créer les tables et les remplir :**

    Copiez-collez le contenu du fichier `init.sql` pour créer et remplir les tables de la base de données.

5. **Quitter PostgreSQL :**

    Tapez `\q` ou appuyez sur `Ctrl + D` pour quitter PostgreSQL.

6. **Configurer les variables d'environnement :**

    Créez un fichier `.env` :

    ```bash
    touch .env
    ```

    Remplissez le fichier `.env` avec les informations suivantes :

    ```plaintext
    PG_HOST=localhost
    PG_PORT=5432
    PG_USER=<psql_username>
    PG_PASSWORD=<psql_password>
    PG_DATABASE=friperie
    SESSION_SECRET=1234567890abcdefghijklmnopqrstuvwxyzazerty
    ```

7. **Si vous n'avez pas de mot de passe PostgreSQL :**

    Si vous n'avez pas encore de mot de passe PostgreSQL, suivez ces étapes pour en créer un :

    - Lancez PostgreSQL :

      ```bash
      psql
      ```

    - Connectez-vous à la base `postgres` :

      ```sql
      \connect postgres
      ```

    - Définissez le mot de passe pour l'utilisateur :

      ```sql
      \password <psql_username>
      ```

      Entrez le mot de passe souhaité lorsque demandé.

    - Quittez PostgreSQL :

      ```sql
      \q
      ```

    - Mettez à jour le mot de passe dans votre fichier `.env` :

      ```plaintext
      PG_PASSWORD=<psql_password>
      ```

## Lancer le projet

1. **Initialiser la base de données :**

    Exécutez le script `init.sql` si ce n'est pas déjà fait.

2. **Démarrer le serveur :**

    Lancez le serveur avec la commande suivante :

    ```bash
    node main.js
    ```

    Le serveur sera accessible sur `localhost:8080`.

## Licence

Ce projet est sous la [GNU General Public License v3.0 (GPL v3)](LICENSE). Pour plus de détails, veuillez consulter le fichier `LICENSE` dans ce répertoire.

## Auteurs
- **Ange Herman**
- **Jasen Steeve**

---
