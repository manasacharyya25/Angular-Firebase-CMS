import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  dataModel: Event;

  constructor() {
    this.dataModel = new Event("Event")
   }

  ngOnInit(): void {
  }

  submit() {
    console.log(this.dataModel);
  }
}
