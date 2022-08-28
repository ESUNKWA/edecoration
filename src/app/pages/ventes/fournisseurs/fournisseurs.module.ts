import { FournisseursComponent } from './fournisseurs.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule, NgbNavModule, NgbPaginationModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FournisseursRoutingModule } from './fournisseurs-routing.module';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';

@NgModule({
    declarations: [FournisseursComponent],
    imports: [
      CommonModule,
        FournisseursRoutingModule,
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

export class FournisseursModule { }
