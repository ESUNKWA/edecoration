import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbNavModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
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
    ]
})
export class ProduitsModule{}