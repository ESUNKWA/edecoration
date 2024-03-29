// tslint:disable-next-line: class-name
export class arrayModel {
    key: string;
    value: string;
}

// tslint:disable-next-line: class-name
export class productModel {
    id: number;
    category: string;
    name: string;
    ratings = 0;
    reviewCount = 0;
    discount: number;
    oriRate: number;
    disRate: number;
    feature: string[];
    specification?: arrayModel[];
    images: string[];
    colorVariant: arrayModel[];
    price?: number;
    manufacture_name?: string;
    manufacture_brand?: string;
}

// tslint:disable-next-line: class-name
export class filterObject {
    discountRates: number[];
    maxVal: number;
    minVal: number;
}

export const productList: productModel[] = [
    {
        id: 1,
        category: 'T-shirts',
        name: 'Robe de mariée',
        ratings: 0,
        reviewCount: 0,
        discount: 10,
        oriRate: 450,
        disRate: 405,
        feature: ['Fit Type: Regular Fit', 'highest quality fabric', 'Suitable for all weather condition', 'Excellent Washing and Light Fastness'],
        specification: [{
            key: 'size',
            value: 'M'
        },
        {
            key: 'color',
            value: 'red'
        }],
        images: ['assets/images/product/img-1.png', 'assets/images/product/img-1a.png', 'assets/images/product/img-1b.png'],
        colorVariant: [{
            key: 'red',
            value: 'assets/images/product/img-1.png'
        },
        {
            key: 'black',
            value: 'assets/images/product/img-1.png'
        }]
    },

];
