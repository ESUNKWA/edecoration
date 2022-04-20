import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule, NgbNavModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { UIModule } from "src/app/shared/ui/ui.module";
import { ProduitsRoutingModule } from "./produits-routing.module";
import { ProduitsComponent } from "./produits.component";



@NgModule({
    declarations: [ProduitsComponent],
    imports: [
        CommonModule,
        ProduitsRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgbNavModule,
        NgbTooltipModule,
        UIModule,
        Ng2SearchPipeModule,
        NgbModule
    ]
})
export class ProduitsModule{}