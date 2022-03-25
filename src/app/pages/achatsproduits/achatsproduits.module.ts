import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbNavModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { UIModule } from "src/app/shared/ui/ui.module";
import { AchatProduitRoutingModule } from "./achatsproduits-rounting.module";
import { AchatsproduitsComponent } from "./achatsproduits.component";

@NgModule({
    declarations: [AchatsproduitsComponent],
    imports: [
        CommonModule,
        AchatProduitRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgbNavModule,
        NgbTooltipModule,
        UIModule,
    ]
})
export class AchatProduitModule{}