import { DecimalPipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';
import { AdvancedSortableDirective, SortEvent } from '../tables/advancedtable/advanced-sortable.directive';
import { Table } from '../tables/advancedtable/advanced.model';
import { AdvancedService } from '../../core/services/advanced.service';
import { editableTable } from '../tables/advancedtable/data';

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

settings = {
  columns: {
    id: {
      title: 'ID',
    },
    name: {
      title: 'Full Name',
      filter: {
        type: 'list',
        config: {
          selectText: 'Select...',
          list: [
            { value: 'Glenna Reichert', title: 'Glenna Reichert' },
            { value: 'Kurtis Weissnat', title: 'Kurtis Weissnat' },
            { value: 'Chelsey Dietrich', title: 'Chelsey Dietrich' },
          ],
        },
      },
    },
    email: {
      title: 'Email',
      filter: {
        type: 'completer',
        config: {
          completer: {
            data: editableTable,
            searchFields: 'email',
            titleField: 'email',
          },
        },
      },
    },
  },
};
  datas: Observable<Table[]>;;

  constructor(public service: AdvancedService) {
    this.datas = service.tables$;
    this.tables$ = service.tables$;
    this.total$ = service.total$;
  }



  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Eden décoration' }, { label: 'Catégories de produits', active: true }];

    console.log(this.datas);

  }

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
