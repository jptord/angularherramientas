
import { filter } from 'rxjs/operators';

import { Component, Input, OnInit, Output, TemplateRef, EventEmitter, enableProdMode, ViewChild, ElementRef } from '@angular/core';
import { SubtablaComponent } from '../subtabla/subtabla.component';


@Component({
  selector: 'krn-tabla',
  templateUrl: './tablaselector.component.html',
  styleUrls: ['./tablaselector.component.scss']
})

export class TablaselectorComponent implements OnInit {
  ngOnInit(): void {

  }
  @ViewChild('tablaA') tablaA: SubtablaComponent;
  @ViewChild('tablaB') tablaB: SubtablaComponent;
  @Input() isSubtable:any=false;
  @Input() datosService : any;
  @Input() titulo: string ='';
  @Input() encabezados: any;
  @Input() formato: any;
  @Input() botonNuevo = true;
  @Input() botonImportar = false;
  @Input() botonExportar = true;
  @Input() soloLectura = false;
  @Input() campoEstado:any = 'estado';
  @Input() valueEstado:any = 'habilitado';
  @Input() textoBuscar: string = 'Ingrese criterio de busqueda';
  @Output() alCrear: EventEmitter<any> = new EventEmitter();
  @Output() alFiltrar: EventEmitter<any> = new EventEmitter();
  @Output() alEditar: EventEmitter<any> = new EventEmitter();
  @Output() alDeshabilitar: EventEmitter<any> = new EventEmitter();
  @Output() alHabilitar: EventEmitter<any> = new EventEmitter();
  @Output() alEliminar: EventEmitter<any> = new EventEmitter();
  @Output() alImportar: EventEmitter<any> = new EventEmitter();
  @Output() alExportar: EventEmitter<any> = new EventEmitter();

  @Input() getAll: any;
  @Input() templateFila: TemplateRef<any>;
  @Input() templateTbody:any;
  @Input() templateOptions:any;
  @Input() conOpciones:boolean = true;
  @Input() softDelete = false;
  @Input() smallTable = false;

  public obtenerDatos(){
    if (this.isSubtable)
      this.tablaB.obtenerDatos();
    else
        this.tablaA.obtenerDatos();
  }
}
