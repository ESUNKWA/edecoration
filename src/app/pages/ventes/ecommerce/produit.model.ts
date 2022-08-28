// tslint:disable-next-line: class-name
export class arrayModel {
    key: string;
    value: string;
}

// tslint:disable-next-line: class-name
export class produitModel {
    id: number;
    r_categorie: string;
    r_nom_produit: string;
    r_prix_vente: number;
    r_image: string;
}

// tslint:disable-next-line: class-name
export class filterObject {
    discountRates: number[];
    maxVal: number;
    minVal: number;
}

export const productList: produitModel[] = [
    {
        id: 1,
        r_categorie: 'T-shirts',
        r_nom_produit: 'Robe de mariée',
        r_prix_vente: 500000,
        r_image: 'assets/images/product/img-1.png',
    },

];
