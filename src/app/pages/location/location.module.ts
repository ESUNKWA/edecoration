import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbAccordionModule, NgbCollapseModule, NgbDatepickerModule, NgbModule, NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { ArchwizardModule } from "angular-archwizard";
import { NgxMaskModule } from "ngx-mask";
import { UIModule } from "src/app/shared/ui/ui.module";
import { LocationRoutingModule } from "./location-routing.module";
import { LocationComponent } from "./location.component";
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { NotificationModule } from "@progress/kendo-angular-notification";



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
        NgxDocViewerModule,
        NgbModule,
        Ng2SearchPipeModule,
        NotificationModule
    ]
})

export class LocationModule { }