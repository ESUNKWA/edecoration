import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalendarComponent } from './calendar/calendar.component';
import { ChatComponent } from './chat/chat.component';
import { DefaultComponent } from './dashboards/default/default.component';
import { FilemanagerComponent } from './filemanager/filemanager.component';
import { CategoriesModule } from './categories/categories.module';
import { SaasComponent } from './dashboards/saas/saas.component';
import { AccessGuard } from '../core/guards/access/access.guard';

const routes: Routes = [
  { path: '', redirectTo: 'dashboards' },

  { path: 'calendar', component: CalendarComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'filemanager', component: FilemanagerComponent },
  { path: 'ecommerce', loadChildren: () => import('./ecommerce/ecommerce.module').then(m => m.EcommerceModule) },
  { path: 'crypto', loadChildren: () => import('./crypto/crypto.module').then(m => m.CryptoModule) },
  { path: 'email', loadChildren: () => import('./email/email.module').then(m => m.EmailModule) },
  { path: 'invoices', loadChildren: () => import('./invoices/invoices.module').then(m => m.InvoicesModule) },
  { path: 'projects', loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule) },
  { path: 'tasks', loadChildren: () => import('./tasks/tasks.module').then(m => m.TasksModule) },
  { path: 'contacts', loadChildren: () => import('./contacts/contacts.module').then(m => m.ContactsModule) },
  { path: 'blog', loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule) },
  { path: 'pages', loadChildren: () => import('./utility/utility.module').then(m => m.UtilityModule) },
  { path: 'ui', loadChildren: () => import('./ui/ui.module').then(m => m.UiModule) },
  { path: 'form', loadChildren: () => import('./form/form.module').then(m => m.FormModule) },
  { path: 'tables', loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule) },
  { path: 'icons', loadChildren: () => import('./icons/icons.module').then(m => m.IconsModule) },
  { path: 'charts', loadChildren: () => import('./chart/chart.module').then(m => m.ChartModule) },
  { path: 'maps', loadChildren: () => import('./maps/maps.module').then(m => m.MapsModule) },

  { path: 'dashboard', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule) },
  { path: 'categories', loadChildren: () => import('./categories/categories.module').then(m => m.CategoriesModule) },
  { path: 'produits', loadChildren: () => import('./produits/produits.module').then(m => m.ProduitsModule) },
  { path: 'tarification', loadChildren: () => import('./tarifications/tarification.module').then(m => m.TarificationModule) },
  { path: 'achat', loadChildren: () => import('./achatsproduits/achatsproduits.module').then(m => m.AchatProduitModule) },
  { path: 'commune', loadChildren: () => import('./communes/communes.module').then(m => m.CommunesModule) },
  { path: 'logistik', loadChildren: () => import('./logistik/logistik.module').then(m => m.LogistikModule) },
  { path: 'location', loadChildren: () => import('./location/location.module').then(m => m.LocationModule) },
  { path: 'utilisateurs', loadChildren: () => import('./utilisateurs/utilisateurs.module').then(m => m.UtilisateursModule) },
  { path: 'personnel', loadChildren: () => import('./personnel/personnel.module').then(m => m.PersonnelModule) },

  { path: 'fournisseurs', loadChildren: () => import('./ventes/fournisseurs/fournisseurs.module').then(m => m.FournisseursModule) },
  { path: 'articles', loadChildren: () => import('./ventes/articles/articles.module').then(m => m.ArticlesModule) },
  { path: 'achats', loadChildren: () => import('./ventes/achats/achats.module').then(m => m.AchatsModule) },
  { path: 'shop', loadChildren: () => import('./ventes/ecommerce/ecommerce.module').then(m => m.EcommerceModule) },
  { path: 'venteproduits', loadChildren: () => import('./ventes/venteproduits/venteproduits.module').then(m => m.VenteProduitModule) },


  { path: 'test', loadChildren: () => import('./test/test.module').then(m => m.TestModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
