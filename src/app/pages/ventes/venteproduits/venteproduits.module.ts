import { NgxMaskModule } from 'ngx-mask';
import { VenteproduitsComponent } from './venteproduits.component';
import { NgSelectModule } from '@ng-select/ng-select';;
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbAlertModule, NgbNavModule, NgbPaginationModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { VenteProduitRoutingModule } from './venteproduits-routing.module';

@NgModule({
    declarations: [VenteproduitsComponent],
    imports: [
      CommonModule,
      VenteProduitRoutingModule,
        NgbNavModule,
        NgbTooltipModule,
        UIModule,
        NgbPaginationModule,
        Ng2SmartTableModule,
        FormsModule,
        ReactiveFormsModule,
        NgbPaginationModule,
        Ng2SearchPipeModule,
        NgSelectModule,
        NgxMaskModule,
        NgbAlertModule
    ]
})

export class VenteProduitModule { }
