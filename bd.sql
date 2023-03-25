drop table if exists cat_prod cascade;
drop table if exists scat_prod cascade;
drop table if exists taille cascade;
drop table if exists produit cascade;
drop table if exists accessoire cascade;
drop table if exists prod_acc cascade;
drop table if exists cat_combi cascade;
drop table if exists combinaison cascade;
drop table if exists produit_combi cascade;
drop table if exists gerant cascade;
drop table if exists client cascade;
drop table if exists commandes cascade;
drop table if exists client_comm cascade;


CREATE TABLE cat_prod(
    nom VARCHAR(30) PRIMARY KEY
)

CREATE TABLE scat_prod(
    nom VARCHAR(30) PRIMARY KEY,
    nom_cat VARCHAR(30),
    FOREIGN KEY (nom_cat) REFERENCES cat_prod(nom)
)

CREATE TABLE taille(
    taille VARCHAR(5) PRIMARY KEY
)

CREATE TABLE produit(
    id serial PRIMARY KEY,
    libelle VARCHAR(30) PRIMARY KEY,
    qte int,
    nom_scat VARCHAR(30),
    img VARCHAR(100),
    taille VARCHAR(5),
    FOREIGN KEY (taille) REFERENCES taille(taille),
    FOREIGN KEY (nom_scat) REFERENCES scat_prod(nom)
)

CREATE  TABLE accessoire(
    id serial PRIMARY KEY,
    nom VARCHAR(30)
)

CREATE TABLE prod_acc(
    id_prod int,
    id_acc int,
    FOREIGN KEY (id_prod) REFERENCES produit(id),
    FOREIGN KEY (id_acc) REFERENCES accessoire(id),
    PRIMARY KEY (id_prod,id_acc)
)

CREATE TABLE cat_combi(
    nom VARCHAR(30) PRIMARY KEY
)

CREATE TABLE combinaison(
    id serial PRIMARY KEY,
    nom VARCHAR(30),
    nom_cat_combi VARCHAR(30),
    FOREIGN KEY (nom_cat_combi) REFERENCES cat_combi(nom)   
)

CREATE TABLE produit_combi(
    id_prod int,
    id_combi int,
    FOREIGN KEY (id_prod) REFERENCES produit(id),
    FOREIGN KEY (id_combi) REFERENCES combinaison(id),
    PRIMARY KEY (id_prod,id_combi)
)

CREATE TABLE gerant(
    id serial PRIMARY KEY,
    nom VARCHAR(30),
    age int,
)

CREATE TABLE client(
    id serial PRIMARY KEY,
    nom VARCHAR(30),
    prenom VARCHAR(30),
    adresse VARCHAR(200),
    mdp VARCHAR(30),
)

CREATE TABLE commandes(
    id serial PRIMARY KEY,
    adresse VARCHAR(200),
    mail VARCHAR(100),
    prix int,
    
)

CREATE TABLE client_comm(
    id_client int,
    id_comm int,
    FOREIGN KEY (id_client) REFERENCES client(id),
    FOREIGN KEY (id_comm) REFERENCES
)