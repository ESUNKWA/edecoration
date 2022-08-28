import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbNavModule, NgbPaginationModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { UIModule } from "src/app/shared/ui/ui.module";
import { communesRoutingModule } from "./communes-rounting.module";
import { CommunesComponent } from "./communes.component";

@NgModule({
    declarations: [CommunesComponent],
    imports: [
        CommonModule,
        communesRoutingModule,
        NgbNavModule,
        NgbTooltipModule,
        UIModule,
        NgbPaginationModule,
        Ng2SmartTableModule,
        FormsModule,
        ReactiveFormsModule,
        NgbPaginationModule,
        Ng2SearchPipeModule
    ]
})

export class CommunesModule { }
