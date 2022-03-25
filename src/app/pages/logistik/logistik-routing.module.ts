import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LogistikComponent } from "./logistik.component";

const routes: Routes = [
    {
        path: '',
        component: LogistikComponent
    },
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LogistikRoutingModule { }