import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TarificationsComponent } from "./tarifications.component";

const routes: Routes = [
    {
        path: '',
        component: TarificationsComponent
    },
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TarificationRoutingModule { }