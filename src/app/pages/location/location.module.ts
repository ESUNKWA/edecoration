import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbAccordionModule, NgbCollapseModule, NgbDatepickerModule, NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { ArchwizardModule } from "angular-archwizard";
import { NgxMaskModule } from "ngx-mask";
import { UIModule } from "src/app/shared/ui/ui.module";
import { LocationRoutingModule } from "./location-routing.module";
import { LocationComponent } from "./location.component";
import { NgxDocViewerModule } from 'ngx-doc-viewer';



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
        NgSelectModule,
        NgbAccordionModule,
        NgbNavModule,
        NgxDocViewerModule
    ]
})

export class LocationModule { }