
import { filter } from 'rxjs/operators';

import { Component, Input, OnInit, Output, TemplateRef, EventEmitter, enableProdMode, ViewChild, ElementRef } from '@angular/core';

import { NotificacionService } from 'src/app/core/services/notificacion.service';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { ApiServicio } from 'src/app/core/services/apiservicio';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'tabla-normal',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.scss']
})

export class TablaComponent implements OnInit {
  modalRef?: BsModalRef;

  @Input() datosService : any;
  @Input() titulo: string ='';
  @Input() encabezados: any;
  @Input() formato: any;
  @Input() botonNuevo = true;
  @Input() botonImportar = false;
  @Input() botonExportar = false;
  @Input() soloLectura = false;
  @Input() campoEstado:any = 'estado';
  @Input() valueEstado:any = 'habilitado';
  @Input() textoBuscar: string = 'Ingrese criterio de búsqueda';
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
  estaCargando = true;

  pagination = {
    size : 10,
    page : 1,
    sortBy : 'id',
    descending : false,
    rowsNumber : 0,
    pages : 0
  }

  cabeceras: any;
  datosTabla: any =[];
  datos: any;

  inputBuscar:string= '';
  buscar = false;

  objectKeys = Object.keys;

  /*filtros */

  config_autoclose: any = false;
  mostrarTodas() {
    this.cabeceras.forEach(key => {
      let campo = this.formato.cabeceras[key];
      if (campo.buscable && campo.buscableCheck && campo.visible) {
        campo.visibleCheck = true;
      }
    });
  }
  ampliar() {
    this.smallTable = !this.smallTable;
  }

  constructor(public notificacionService: NotificacionService,
    private modalService: BsModalService){}

  ngOnInit(): void{
    this.cabeceras = this.objectKeys(this.formato.cabeceras);
    this.obtenerDatos();
  }

  buscarKeyDown(buscar){
    if (buscar.keyCode!==undefined)
      if (buscar.keyCode == 13){
        this.buscar = true;
        this.obtenerDatos();
        return;
      }
      if (buscar.keyCode == 27){
        this.buscar = false;
        this.obtenerDatos();
        return;
      }
  }

  public obtenerDatos(){
    if(this.buscar){
    /*  this.datosService.search(this.porPagina, this.pagActual, this.inputBuscar).subscribe(
        (data)=>{
      this.datos = data['data']['data'];
      this.pagActual = data['data']['current_page'];
      this.total = data['data']['total'];
      this.porPagina = data['data']['per_page'];
    }, error=>{
      this.notificacionService.alertError(error);
    });*/
      this.datosService[this.getAll](this.pagination.size, this.pagination.page, this.pagination.sortBy, this.pagination.descending,this.inputBuscar).subscribe((result:any)=>{
        this.datos = result.content;
        this.pagination.rowsNumber = result.pagination.rowsNumber;
        this.pagination.pages = result.pagination.pages;
        this.estaCargando = false;

      }, error=>{
        this.notificacionService.alertError(error);
      });
    }else{
      this.datosService[this.getAll](this.pagination.size, this.pagination.page, this.pagination.sortBy, this.pagination.descending ).subscribe((result:any)=>{
        this.datos = result.content;
        this.pagination.rowsNumber = result.pagination.rowsNumber;
        this.pagination.pages = result.pagination.pages;
        this.estaCargando = false;

      }, error=>{
        this.notificacionService.alertError(error);
      });
    }
  }

  resetButtons = (event) => {
    let tableButtons: any = document.getElementsByClassName("colCabecera");;
    [...tableButtons].map((button) => {
      if (button !== event.target) {
        button.removeAttribute("data-dir");
      }
    });

  };
  ordenar(e) {
    this.resetButtons(e);
    if (e.target.getAttribute("data-dir") == "desc") {
      this.pagination.sortBy = e.target.id;
      this.pagination.descending = false;
      e.target.setAttribute("data-dir", "asc");
    } else {
      e.target.setAttribute("data-dir", "desc");
      this.pagination.sortBy = e.target.id;
      this.pagination.descending = true;
    }
    this.obtenerDatos();
  }

  pageChanged(event: PageChangedEvent){
    this.pagination.page = event.page;
    this.obtenerDatos();
  }

  mascara(valor,data,campo){
    if (campo.mascara=== undefined) return valor;
    else
      if (Array.isArray(data[campo.mascara.campo])){
        let arrValues = [];
        data[campo.mascara.campo].forEach(element => arrValues.push(element[campo.mascara.valor]));
        return arrValues.join(" ");
      }else
        if (data[campo.mascara.campo]!=null)
          return data[campo.mascara.campo][campo.mascara.valor];
        else
          return "";
  }
  exportar(template) {
    this.modalRef = this.modalService.show(template, {
      class: `modal-xl modal-fullscreen-xl-down modal-dialog-centered`,
    });
  }
}
