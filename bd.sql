
drop table if exists cat_prod cascade;
drop table if exists scat_prod cascade;
drop table if exists taille cascade;
drop table if exists taille_prod cascade;
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
    FOREIGN KEY (nom_scat) REFERENCES scat_prod(nom_scat)
);

CREATE TABLE taille_prod(
    taille VARCHAR(5),
    id_prod int,
    qte int,
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
('Pantalon'),
('Chemise'),
('Short'),
('Sac'),
('Jupe'),
('Robe'),
('Veste');

-- Insertion des sous categories
INSERT INTO scat_prod values
('Jean','Pantalon'),
('Jogging','Pantalon'),
('Short de sport','Short'),
('Jupe courte','Jupe'),
('Jupe longue','Jupe'),
('Veste','Chemise'),
('Sac à main','Sac'),
('Pull','Chemise'),
('T_shirt','Chemise'),
('Manteau','Chemise'),
('Costume','Chemise'),
('Robe courte','Robe');


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
('Jean denim coupe normale',15,'Jean','jean_denim_coupe_normal.jpeg'),
('Short de sport Nike',12,'Short de sport','short_sport_nike.jpeg'),
('Jogging Nike',13,'Jogging','joggings_nike.jpeg'),
('Jean Levis',14,'Jean','jean_levis.jpeg'),
('Jupe courte cache cache',12,'Jupe courte','jupe_courte_cachecache.jpeg'),
('Jupe longue together',12,'Jupe longue','jupe_longue_together.jpeg'),
('Pull Only',14,'Pull','pull_only.jpeg'),
('Veste Adidas',13,'Veste','veste_adidas.jpeg'),
('Manteau Napapijri',11,'Manteau','manteau_napapijri.jpeg'),
('Veste de costume Daniel Hechter',7,'Costume','veste_costume_daniel_hechter.jpeg'),
('Sac à main Lilith',9,'Sac à main','sac_main_lilith.jpeg'),
('Robe courte Superdry',4,'Robe courte','robe_courte_superdry.jpeg');

-- Insertion des qte de tailles pour chaque produit
INSERT INTO taille_prod(taille,id_prod,qte) values
('S',1,13), -- Le produit 1 (jean denim) a 13 quantité de taille S
('M',1,2), -- Le produit 1 (jean denim) a 2 quantité de taille M
('XS',2,4),
('S',2,6),
('M',2,3),
('S',3,4),
('M',3,9),
('L',3,2),
('S',4,6),
('M',4,7),
('L',4,2),
('S',5,8),
('M',5,7),
('S',6,4),
('M',6,7), 
('S',7,5),
('M',7,7),
('L',7,6),
('M',8,7),
('L',8,7),
('S',9,4),
('M',9,3),
('M',10,3),
('L',10,2), 
('S',11,4),
('M',11,5),
('L',11,5),
('M',12,13);

