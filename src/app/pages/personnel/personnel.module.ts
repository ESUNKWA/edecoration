import { PersonnelRoutingModule } from './personnel-routing.module';
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbAccordionModule, NgbCollapseModule, NgbDatepickerModule, NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { ArchwizardModule } from "angular-archwizard";
import { NgxMaskModule } from "ngx-mask";
import { UIModule } from "src/app/shared/ui/ui.module";
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { PersonnelComponent } from "./personnel.component";



@NgModule({
    declarations: [PersonnelComponent],
    imports: [
        CommonModule,
        UIModule,
        FormsModule,
        ReactiveFormsModule,
        PersonnelRoutingModule,
        ArchwizardModule,
        NgxMaskModule.forRoot(),
        NgbDatepickerModule,
        NgSelectModule,
        NgbAccordionModule,
        NgbNavModule,
        NgxDocViewerModule
    ]
})

export class PersonnelModule { }
