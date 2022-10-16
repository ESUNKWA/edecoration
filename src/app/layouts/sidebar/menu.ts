import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 2,
        label: 'Tableau de bords',
        icon: 'bx bxs-home',
        link: '/edeco/dashboard',
        code: 'exp'
    },
    {
        id: 29,
        label: 'Gestion des produits',
        icon: 'bx bxs-folder-minus',
        subItems: [
            {
                id: 30,
                label: 'Catégories',
                link: '/edeco/categories',
                code: 'exp'
            },{
              id: 30,
              label: 'Produits',
              link: '/edeco/produits',
              code: 'exp'
          },{
            id: 30,
            label: 'Tarifications',
            link: '/edeco/tarification',
            code: 'exp'
        },{
            id: 30,
            label: 'Achats de produits',
            link: '/edeco/achat',
            code: 'exp'
        }
        ],
        code: 'exp'
    },
    {
        id: 36,
        label: 'Location des produits',
        icon: 'bx bxs-add-to-queue',
        subItems: [
            {
                id: 37,
                label: 'Communes',
                link: '/edeco/commune',
                code: "exp"
            },
            {
              id: 37,
              label: 'Logistiques',
              link: '/edeco/logistik',
              code: "exp"
          },
          {
            id: 37,
            label: 'Location',
            link: '/edeco/location',
            code: "exp"
        }
        ],
        code: 'exp'
    },
    {
        id: 39,
        label: 'Gestion du personnel',
        icon: 'bx bxs-user-plus',
        subItems: [
            {
                id: 40,
                label: 'Personnels',
                link: '/edeco/personnel',
                parentId: 38
            }
        ],
        code: 'admin'
    },
    {
        id: 48,
        label: 'Gestion des utilisateurs',
        icon: 'bxs-user-detail',
        subItems: [
            {
              id: 49,
              label: 'Utilisateurs',
              link: '/edeco/utilisateurs',
              parentId: 48
          }
        ],
        code: 'admin'
    },
    {
      id: 2,
      label: '---------------------------',
      code: 'exp'
  },
    {
      id: 48,
      label: 'Gestion des fournisseurs',
      icon: 'bxs-wallet-alt',
      link: '/edeco/fournisseurs',
      code: 'admin'
  },{
    id: 48,
    label: 'Gestion des produits',
    icon: 'bx bx-folder-minus',
    subItems: [
        {
          id: 49,
          label: 'Produits',
          link: '/edeco/articles',
          parentId: 48,
          code: "exp"
      },{
        id: 49,
        label: 'Achats de produits',
        link: '/edeco/achats',
        parentId: 48,
        code: "exp"
    }
    ],
    code: 'exp'
},{
  id: 48,
  label: 'Gestion des ventes',
  icon: 'bxs-shopping-bag',
  subItems: [
      {
        id: 49,
        label: 'Saisie une vente',
        link: '/edeco/shop/products',
        parentId: 48,
        code: "exp"
    },
    {
      id: 49,
      label: 'Voir les vente',
      link: '/edeco/venteproduits',
      parentId: 48,
      code: "exp"
    }
  ],
  code: 'exp'
}
];

