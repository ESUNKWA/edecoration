import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbNavModule, NgbPaginationModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { UIModule } from "src/app/shared/ui/ui.module";
import { LogistikRoutingModule } from "./logistik-routing.module";
import { LogistikComponent } from "./logistik.component";

@NgModule({
    declarations: [LogistikComponent],
    imports: [
        CommonModule,
        LogistikRoutingModule,
        NgbNavModule,
        NgbTooltipModule,
        UIModule,
        NgbPaginationModule,
        Ng2SmartTableModule,
        FormsModule,
        ReactiveFormsModule,
        NgbPaginationModule,

    ]
})

export class LogistikModule { }