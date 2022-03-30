import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbDatepickerModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { ArchwizardModule } from "angular-archwizard";
import { NgxMaskModule } from "ngx-mask";
import { UIModule } from "src/app/shared/ui/ui.module";
import { LocationRoutingModule } from "./location-routing.module";
import { LocationComponent } from "./location.component";

@NgModule({
    declarations: [LocationComponent],
    imports: [
        CommonModule,
        UIModule,
        FormsModule,
        ReactiveFormsModule,
        LocationRoutingModule,
        ArchwizardModule,
        NgxMaskModule.forRoot(),
        NgbDatepickerModule,
        NgSelectModule
    ]
})

export class LocationModule { }