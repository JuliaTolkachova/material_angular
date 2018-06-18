import {Component, Inject, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface DialogConfig {
  title?: string;
  content?: string;
  ok?: string;
  close: string;
}
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})

export class DialogComponent implements OnInit {

  get dialog(): DialogConfig {
    return this.data;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogConfig,
    public dialogRef: MatDialogRef<DialogComponent>
  ) {}

  ngOnInit() {
  }
}
