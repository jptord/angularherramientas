import { Component, OnInit ,Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { ApiServicio } from 'src/app/core/services/apiservicio';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { NotificacionService } from 'src/app/core/services/notificacion.service';

@Component({
  selector: 'tabla-basica',
  templateUrl: './tabla-basica.component.html',
  styleUrls: ['./tabla-basica.component.scss']
})
export class TablaBasicaComponent implements OnInit {
  @Input() datosService : ApiServicio;
  @Input() titulo: string ='';
  @Input() encabezados: any;
  @Input() botonNuevo = true;
  @Input() templateFila: TemplateRef<any>;
  @Input() textoBuscar: string = 'Ingrese criterio de busqueda';
  @Output() crearNuevo: EventEmitter<any> = new EventEmitter();
  @Output() alFiltrar: EventEmitter<any> = new EventEmitter();

  cabeceras: any;
  datosTabla: any =[];
  datos: any;
  porPagina = 10;
  pagActual = 1;
  total = 0;
  inputBuscar:string= '';
  buscar = false;

  objectKeys = Object.keys;

  constructor(public notif: NotificacionService){}

  ngOnInit(): void{
    this.cabeceras = this.objectKeys(this.encabezados.cabeceras);
    this.obtenerDatos();
  }

  irNuevo(){
    this.crearNuevo.emit();
  }
  buscarKeyDown(buscar){
    if(!this.inputBuscar || this.inputBuscar == '' || buscar){
      this.buscar = true;
      this.obtenerDatos();
    }
  }

  public obtenerDatos(){
    if(this.buscar){
      console.log('buscar',this.inputBuscar);
      this.datosService.search(this.porPagina, this.pagActual, this.inputBuscar).subscribe(
        (data)=>{
          this.datos = data['content'];
          this.pagActual = data['pagination']['pages'];
          this.total =  data['pagination']['rowsNumber'];
          this.porPagina = data['pagination']['perPage'];
    }, error=>{
      this.notif.alertError(error);
    });
    }else{
       this.datosService.getAll(this.porPagina, this.pagActual).subscribe((data)=>{
        this.datos = data['content'];
        this.pagActual = data['pagination']['pages'];
        this.total =  data['pagination']['rowsNumber'];
        this.porPagina = data['pagination']['perPage'];
      }, error=>{
        this.notif.alertError(error);
      });
    }
  }

  pageChanged(event: PageChangedEvent){
    console.log('hola page changed',event);
    this.pagActual = event.page;
    this.obtenerDatos();
  }
}
