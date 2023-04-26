function Produit(id, libelle, categorie,img) {
    this.id = id;
    this.libelle = libelle;
    this.categorie = categorie;
    this.img = img;
    
}

module.exports = new Produit();