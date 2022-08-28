import { NgSelectModule } from '@ng-select/ng-select';
import { AchatsRoutingModule } from './achats-routing.module';
import { AchatsComponent } from './achats.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule, NgbNavModule, NgbPaginationModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';

@NgModule({
    declarations: [AchatsComponent],
    imports: [
      CommonModule,
      AchatsRoutingModule,
        NgbNavModule,
        NgbTooltipModule,
        UIModule,
        NgbPaginationModule,
        Ng2SmartTableModule,
        FormsModule,
        ReactiveFormsModule,
        NgbPaginationModule,
        Ng2SearchPipeModule,
        NgSelectModule
    ]
})

export class AchatsModule { }
