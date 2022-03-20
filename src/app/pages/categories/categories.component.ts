import { DecimalPipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';
import { AdvancedSortableDirective, SortEvent } from '../tables/advancedtable/advanced-sortable.directive';
import { Table } from '../tables/advancedtable/advanced.model';
import { AdvancedService } from '../../core/services/advanced.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoriesService } from 'src/app/core/services/categories/categories.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  providers: [AdvancedService, DecimalPipe]
})
export class CategoriesComponent implements OnInit {
// bread crum data
breadCrumbItems: Array<{}>;
tables$: Observable<Table[]>;
total$: Observable<number>;
@ViewChildren(AdvancedSortableDirective) headers: QueryList<AdvancedSortableDirective>;

datas: Observable<Table[]>;
modalTitle: any = '';
modeAppel: any = 'création';
  categoriesTab: any = [];

  constructor(public service: AdvancedService, private modalService: NgbModal, private categories: CategoriesService) {
    this.datas = service.tables$;
    this.tables$ = service.tables$;
    this.total$ = service.total$;
  }



  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Eden décoration' }, { label: 'Catégories de produits', active: true }];

    this.categories._getproduits().subscribe(
      (data: any) => {
        this.categoriesTab = [...data._result];
        console.log(this.categoriesTab);

      },
      (err) => {console.log(err.stack);
      }
    )

  }


  fctSaisieCat(largeDataModal: any){
    this.modeAppel = 'création';
    this.modalTitle = 'Saisie d\'une nouelle catégorie de produit';
    console.log(this.modeAppel);

    this.largeModal(largeDataModal);
  }
  fctModiCat(largeDataModal: any){
    this.modeAppel = 'modif';
    this.modalTitle = 'Modification catégorie de produit';
    console.log(this.modeAppel);

    this.largeModal(largeDataModal);
  }

  //Appel de la modal
  largeModal(exlargeModal: any) {
    this.modalService.open(exlargeModal, { size: 'lg', centered: true });
  }

  //Filtre datatable
  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

}
