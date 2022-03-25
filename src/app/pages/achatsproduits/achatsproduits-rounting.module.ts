import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AchatsproduitsComponent } from "./achatsproduits.component";

const routes: Routes = [
    {
        path: '',
        component: AchatsproduitsComponent
    },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AchatProduitRoutingModule{}