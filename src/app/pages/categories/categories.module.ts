import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule, NgbNavModule, NgbPaginationModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { UIModule } from '../../shared/ui/ui.module';
import { CategoriesRoutingModule } from './categories-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoriesComponent } from './categories.component';
import { SearchDossierPipe, SearchPipe } from 'src/app/table.pipe';
import { DataTablesModule } from 'angular-datatables';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
    declarations: [CategoriesComponent,SearchPipe],
    imports: [
        CommonModule,
        CategoriesRoutingModule,
        NgbNavModule,
        NgbTooltipModule,
        UIModule,
        NgbPaginationModule,
        Ng2SmartTableModule,
        FormsModule,
        ReactiveFormsModule,
        NgbPaginationModule,
        DataTablesModule,
        Ng2SearchPipeModule,
        NgbModule
    ]
})

export class CategoriesModule { }
