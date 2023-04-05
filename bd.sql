
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
    nom_cat VARCHAR(30) PRIMARY KEY
);

CREATE TABLE scat_prod(
    nom_scat VARCHAR(30) PRIMARY KEY,
    nom_cat VARCHAR(30),
    FOREIGN KEY (nom_cat) REFERENCES cat_prod(nom_cat)
);

CREATE TABLE taille(
    taille VARCHAR(5) PRIMARY KEY
);

CREATE TABLE produit(
    id_prod serial PRIMARY KEY,
    libelle VARCHAR(60),
    qte int,
    nom_scat VARCHAR(30),
    img VARCHAR(100),
    FOREIGN KEY (taille) REFERENCES taille(taille),
    FOREIGN KEY (nom_scat) REFERENCES scat_prod(nom_scat)
);

CREATE TABLE taille_prod(
    taille VARCHAR(5),
    id_prod int,
    int qte,
    FOREIGN KEY (taille) REFERENCES taille(taille),
    FOREIGN KEY (id_prod) REFERENCES produit(id_prod),
    PRIMARY KEY (id_prod,taille)

);


CREATE  TABLE accessoire(
    id_acc serial PRIMARY KEY,
    nom VARCHAR(30)
);

CREATE TABLE prod_acc(
    id_prod int,
    id_acc int,
    FOREIGN KEY (id_prod) REFERENCES produit(id_prod),
    FOREIGN KEY (id_acc) REFERENCES accessoire(id_acc),
    PRIMARY KEY (id_prod,id_acc)
);

CREATE TABLE cat_combi(
    nom_cat_combi VARCHAR(30) PRIMARY KEY
);

CREATE TABLE combinaison(
    id_combi serial PRIMARY KEY,
    nom VARCHAR(30),
    nom_cat_combi VARCHAR(30),
    FOREIGN KEY (nom_cat_combi) REFERENCES cat_combi(nom_cat_combi)   
);

CREATE TABLE produit_combi(
    id_prod int,
    id_combi int,
    FOREIGN KEY (id_prod) REFERENCES produit(id_prod),
    FOREIGN KEY (id_combi) REFERENCES combinaison(id_combi),
    PRIMARY KEY (id_prod,id_combi)
);

CREATE TABLE gerant(
    id_gerant serial PRIMARY KEY,
    nom VARCHAR(30),
    age int
);

CREATE TABLE client(
    id_cli serial PRIMARY KEY,
    nom VARCHAR(30),
    prenom VARCHAR(30),
    adresse VARCHAR(200),
    mdp VARCHAR(30)
);

CREATE TABLE commandes(
    id_comm serial PRIMARY KEY,
    adresse VARCHAR(200),
    mail VARCHAR(100),
    prix int
    
);

CREATE TABLE client_comm(
    id_cli int,
    id_comm int,
    FOREIGN KEY (id_cli) REFERENCES client(id_cli),
    FOREIGN KEY (id_comm) REFERENCES commandes(id_comm)
);

-- Insertion des categories
INSERT INTO cat_prod values
('Pantallon'),
('Chemise'),
('Short');

-- Insertion des sous categories
INSERT INTO scat_prod values
('Jean','Pantallon'),
('Tee-shirt','Chemise'),
('Short de sport','Short');

-- Insertion des tailles
INSERT INTO taille values
('XXS'),
('XS'),
('S'),
('M'),
('L'),
('XL'),
('XXL');

-- Insertion des produits
INSERT INTO produit(libelle,qte,nom_scat,img) values
('Jean denim coupe normale',15,'Jean','jean_denim_coupe_normal'),
('short de sport nike',12,'Short de sport','short_sport_nike.jpeg');

-- Insertion des qte de tailles pour chaque produit
INSERT INTO taille_prod values
('S',1,15) -- Le produit 1 (jean denim) a 15 quantité de taille S
('M',1,25); -- Le produit 1 (jean denim) a 25 quantité de taille M




