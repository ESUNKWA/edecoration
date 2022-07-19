import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultComponent } from './default/default.component';
import { SaasComponent } from './saas/saas.component';
import { CryptoComponent } from './crypto/crypto.component';
import { BlogComponent } from './blog/blog.component';
import { AccessGuard } from 'src/app/core/guards/access/access.guard';

const routes: Routes = [
    {
        path: 'default',
        component: DefaultComponent
    },
    {
        path: '',
        component: SaasComponent
    },
    {
        path: 'crypto',
        component: CryptoComponent
    },
    {
        path: 'blog',
        component: BlogComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardsRoutingModule {}
