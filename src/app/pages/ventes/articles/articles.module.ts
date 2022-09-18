import { NgxMaskModule } from 'ngx-mask';
import { ArticlesComponent } from './articles.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule, NgbNavModule, NgbPaginationModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ArticlesRoutingModule } from './articles-routing.module';

@NgModule({
    declarations: [ArticlesComponent],
    imports: [
      CommonModule,
      ArticlesRoutingModule,
        NgbNavModule,
        NgbTooltipModule,
        UIModule,
        NgbPaginationModule,
        Ng2SmartTableModule,
        FormsModule,
        ReactiveFormsModule,
        NgbPaginationModule,
        Ng2SearchPipeModule,
        NgxMaskModule
    ]
})

export class ArticlesModule { }
