import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 2,
        label: 'Tableau de bords',
        icon: 'bx bxs-home',
        link: '/edeco/dashboards', 
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
                //parentId: 29
            },{
              id: 30,
              label: 'Produits',
              link: '/edeco/produits',
              //parentId: 29
          },{
            id: 30,
            label: 'Tarifications',
            link: '/edeco/tarification',
            //parentId: 29
        },{
            id: 30,
            label: 'Achats de produits',
            link: '/edeco/achat',
            //parentId: 29
        }
        ]
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
                parentId: 36
            },
            {
              id: 37,
              label: 'Logistiques',
              link: '/edeco/logistik',
              parentId: 36
          },
          {
            id: 37,
            label: 'Location',
            link: '/edeco/location',
            parentId: 36
        }
        ]
    },
    {
        id: 39,
        label: 'Gestion du personnel',
        icon: 'bx bxs-user-plus',
        subItems: [
            {
                id: 40,
                label: 'Personnels',
                link: '/edeco/projects/grid',
                parentId: 38
            }
        ]
    },
    {
        id: 44,
        label: 'Formation et stage',
        icon: 'bx-task',
        subItems: [
            {
                id: 45,
                label: 'MENUITEMS.TASKS.LIST.TASKLIST',
                link: '/edeco/tasks/list',
                parentId: 44
            }
        ]
    },
    {
        id: 48,
        label: 'Gestion des utilisateurs',
        icon: 'bxs-user-detail',
        subItems: [
            {
                id: 49,
                label: 'Profils',
                link: '/edeco/contacts/grid',
                parentId: 48
            },
            {
              id: 49,
              label: 'Utilisateurs',
              link: '/edeco/contacts/grid',
              parentId: 48
          }
        ]
    }
];

