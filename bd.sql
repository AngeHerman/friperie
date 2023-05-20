
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
drop table if exists comm_prod cascade;



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
    -- qte int,
    prix DECIMAL(10,2),
    nom_scat VARCHAR(30),
    img VARCHAR(100),
    FOREIGN KEY (nom_scat) REFERENCES scat_prod(nom_scat)
);

CREATE TABLE taille_prod(
    taille VARCHAR(5),
    id_prod int,
    qte int,
    FOREIGN KEY (taille) REFERENCES taille(taille),
    FOREIGN KEY (id_prod) REFERENCES produit(id_prod) ON DELETE CASCADE,
    PRIMARY KEY (id_prod,taille)

);


CREATE  TABLE accessoire(
    id_acc serial PRIMARY KEY,
    prix int,
    img VARCHAR(100),
    qte int,
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
    id_combi serial PRIMARY KEY ,
    nom VARCHAR(30),
    nom_cat_combi VARCHAR(30),
    prix int,
    taille VARCHAR(5),
    FOREIGN KEY (taille) REFERENCES taille(taille),
    FOREIGN KEY (nom_cat_combi) REFERENCES cat_combi(nom_cat_combi)   
);

CREATE TABLE produit_combi(
    id_prod int,
    id_combi int,
    FOREIGN KEY (id_prod) REFERENCES produit(id_prod),
    FOREIGN KEY (id_combi) REFERENCES combinaison(id_combi) ON DELETE CASCADE,
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
    telephone VARCHAR(30),
    email VARCHAR(50)
);

CREATE TABLE commandes(
    id_comm serial PRIMARY KEY,
    adresse VARCHAR(200),
    mail VARCHAR(100),
    prix DECIMAL(10,2),
    valider int
    
);

CREATE TABLE client_comm(
    id_cli int,
    id_comm int,
    FOREIGN KEY (id_cli) REFERENCES client(id_cli),
    FOREIGN KEY (id_comm) REFERENCES commandes(id_comm),
    PRIMARY KEY (id_cli,id_comm)
);

CREATE TABLE comm_prod(
    id_prod int,
    id_comm int,
    qte int,
    taille VARCHAR(5),
    -- UNIQUE(id_prod,id_comm,taille),
    FOREIGN KEY (taille) REFERENCES taille(taille),
    FOREIGN KEY (id_prod) REFERENCES produit(id_prod),
    FOREIGN KEY (id_comm) REFERENCES commandes(id_comm),
    PRIMARY KEY (id_prod,id_comm,taille)
);

-- Insertion des categories
INSERT INTO cat_prod values
('Pantalon'),
('Chemise'),
('Short'),
('Sac'),
('Jupe'),
('Robe');

-- Insertion des sous categories
INSERT INTO scat_prod values
('Jean','Pantalon'),
('Jogging','Pantalon'),
('Short de sport','Short'),
('Jupe courte','Jupe'),
('Jupe longue','Jupe'),
('Veste','Chemise'),
('Sac a main','Sac'),
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
INSERT INTO produit(libelle,prix,nom_scat,img) values
('Jean denim coupe normale',25.5,'Jean','jean_denim_coupe_normal.jpeg'),
('Short de sport Nike',40,'Short de sport','short_sport_nike.jpeg'),
('Jogging Nike',70,'Jogging','joggings_nike.jpeg'),
('Jean Levis',120,'Jean','jean_levis.jpeg'),
('Jupe courte cache cache',15,'Jupe courte','jupe_courte_cachecache.jpeg'),
('Jupe longue together',6,'Jupe longue','jupe_longue_together.jpeg'),
('Pull Only',19.99,'Pull','pull_only.jpeg'),
('Veste Adidas',85.99,'Veste','veste_adidas.jpeg'),
('Manteau Napapijri',35,'Manteau','manteau_napapijri.jpeg'),
('Veste de costume Daniel Hechter',1200,'Costume','veste_costume_daniel_hechter.jpeg'),
('Sac à main Lilith',1800,'Sac a main','sac_main_lilith.jpeg'),
('Robe courte Superdry',45,'Robe courte','robe_courte_superdry.jpeg'),
('T_shirt Kalenji',10,'T_shirt','t_shirt_kalenji.jpeg');

-- Insertion des qte de tailles pour chaque produit
INSERT INTO taille_prod(taille,id_prod,qte) values
('XXS',1,13), -- Le produit 1 (jean denim) a 13 quantité de taille S
('XS',1,2), -- Le produit 1 (jean denim) a 2 quantité de taille M
('S',1,2),
('M',1,0),
('L',1,0),
('XL',1,0),
('XXL',1,0),
('XXS',2,0),
('XS',2,4),
('S',2,6),
('M',2,3),
('L',2,0),
('XL',2,0),
('XXL',2,0),
('XXS',3,0),
('XS',3,0),
('S',3,4),
('M',3,9),
('L',3,2),
('XL',3,0),
('XXL',3,0),
('XXS',4,0),
('XS',4,0),
('S',4,6),
('M',4,7),
('L',4,2),
('XL',4,0),
('XXL',4,0),
('XXS',5,0),
('XS',5,0),
('S',5,8),
('M',5,7),
('L',5,0),
('XL',5,0),
('XXL',5,0),
('XXS',6,0),
('XS',6,0),
('S',6,4),
('M',6,7), 
('L',6,0),
('XL',6,0),
('XXL',6,0),
('XXS',7,0),
('XS',7,0),
('S',7,5),
('M',7,7),
('L',7,6),
('XL',7,0),
('XXL',7,0),
('XXS',8,0),
('XS',8,0),
('S',8,0),
('M',8,7),
('L',8,7),
('XL',8,0),
('XXL',8,0),
('XXS',9,0),
('XS',9,0),
('S',9,4),
('M',9,3),
('L',9,0),
('XL',9,0),
('XXL',9,0),
('XXS',10,0),
('XS',10,0),
('S',10,0),
('M',10,3),
('L',10,2), 
('XL',10,0),
('XXL',10,0),
('XXS',11,0),
('XS',11,0),
('S',11,4),
('M',11,5),
('L',11,5),
('XL',11,0),
('XXL',11,0),
('XXS',12,0),
('XS',12,0),
('S',12,0),
('M',12,13),
('L',12,0),
('XL',12,0),
('XXL',12,0),
('XXS',13,0),
('XS',13,0),
('S',13,4),
('M',13,5),
('L',13,0),
('XL',13,0),
('XXL',13,0);

INSERT INTO cat_combi(nom_cat_combi) values
('Homme'),
('Femme');

INSERT INTO combinaison(nom,nom_cat_combi,prix,taille) values
('Sport','Homme',50,'XS'),
('Classique','Femme',80,'S');

INSERT INTO produit_combi(id_prod,id_combi) values
(3,1),
(13,1),
(6,2),
(7,2),
(11,2);