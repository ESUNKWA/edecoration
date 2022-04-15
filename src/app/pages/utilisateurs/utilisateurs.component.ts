import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilisateursService } from 'src/app/core/services/utilisateurs/utilisateurs.service';
import { userGridData } from '../contacts/usergrid/data';
import { Usergrid } from '../contacts/usergrid/usergrid.model';

@Component({
  selector: 'app-utilisateurs',
  templateUrl: './utilisateurs.component.html',
  styleUrls: ['./utilisateurs.component.scss']
})
export class UtilisateursComponent implements OnInit {
 // bread crumb items
 breadCrumbItems: Array<{}>;

 userGridData: Usergrid[];
  selected;
  userForm: FormGroup;
  submitted = false;
  items: FormArray;
  // Select2 Dropdown
  selectValue: string[];
  usersList: any[] = [];

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder,
    private utilisateurService: UtilisateursService) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Eden décoration' }, { label: 'Liste des utilisateurs', active: true }];

    this.selectValue = ['Photoshop', 'illustrator', 'Html', 'Css', 'Php', 'Java', 'Python'];
    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      designation: ['', [Validators.required]]
    });

    this.utilisateurService._list().subscribe(
      (data: any = {}) => {

        this.usersList = [...data._result];

        console.log(this.usersList);

      },
      (err) => {console.log(err.stack)})

    /**
     * fetches data
     */
    this._fetchData();
  }

  get form() {
    return this.userForm.controls;
  }

  openModal(content: any) {
    this.modalService.open(content);
  }

  private _fetchData() {
    this.userGridData = userGridData;
  }


  saveUser() {
    if (this.userForm.valid) {
      const name = this.userForm.get('name').value;
      const email = this.userForm.get('email').value;
      const designation = this.userForm.get('designation').value;
       this.userGridData.push({
         id: this.userGridData.length + 1,
         name,
         email,
         designation,
         projects: this.selected
       })
       this.modalService.dismissAll()
    }
    this.submitted = true
  }
}
