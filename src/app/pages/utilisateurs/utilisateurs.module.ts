import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap";
import { UIModule } from "src/app/shared/ui/ui.module";
import { UtilisateursComponent } from './utilisateurs.component';
import { UtilisateursRoutingModule } from './utilisateurs-routing.module';
import { NgSelectModule } from "@ng-select/ng-select";

@NgModule({
    declarations: [UtilisateursComponent],
    imports: [
        CommonModule,
        UtilisateursRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgbPaginationModule,
        UIModule,
        NgSelectModule
    ]
})

export class UtilisateursModule { }
