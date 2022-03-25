import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap";
import { UIModule } from "src/app/shared/ui/ui.module";
import { TarificationRoutingModule } from "./tarification-routing.module";
import { TarificationsComponent } from "./tarifications.component";

@NgModule({
    declarations: [TarificationsComponent],
    imports: [
        CommonModule,
        TarificationRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgbPaginationModule,
        UIModule
    ]
})

export class TarificationModule { }