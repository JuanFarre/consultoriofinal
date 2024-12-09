import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-nota',
  templateUrl: './nota.component.html',
  styleUrls: ['./nota.component.css']
})
export class NotaComponent {
  nota: any;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: { nota: string }){
    this.nota = data.nota;
  }
}
