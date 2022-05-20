import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule, NgbNavModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { NgxMaskModule } from "ngx-mask";
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
        Ng2SearchPipeModule,
        NgbModule,
        NgxMaskModule.forRoot(),
    ]
})
export class AchatProduitModule{}