import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';



@Pipe({ name: 'LockFilter' })
export class SearchPipe implements PipeTransform {
    transform(value: any, args?: any): any {
        if (!value) return null;
        if (!args) return value;
        args = args.toLowerCase();
        return value.filter(function (item) {
            return JSON.stringify(item).toLowerCase().includes(args);
        });
    }
}

@Pipe({ name: 'filterDossier' })
export class SearchDossierPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items) return [];
        if (!searchText) return items;
        searchText = searchText.toLowerCase();
        return items.filter(it => {
            return it.matricule.toLowerCase().includes(searchText) ||
                it.nom.toLowerCase().includes(searchText) ||
                it.prenom.toLowerCase().includes(searchText) ||
                it.contact.toLowerCase().includes(searchText) ||
                it.sexe.toLowerCase().includes(searchText);
        });
    }
}

@Pipe({ name: 'pointReplacer' })
export class PointReplacerPipe implements PipeTransform {
    transform(value: string, args: any[]): string {
        if (value) {
            return value.replace(',', '.');
        }
        return '';
    }
}