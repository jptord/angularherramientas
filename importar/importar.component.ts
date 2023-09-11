import { Component, EventEmitter, Input, Output } from '@angular/core';
import { read, utils, writeFileXLSX,WorkBook,WorkSheet } from 'xlsx';

interface President { Name: string; Index: number };
@Component({
  selector: 'krn-importar',
  templateUrl: './importar.component.html',
  styleUrls: ['./importar.component.scss']
})

export class ImportarComponent {

  @Input() titulo : any = "exportacion";
  @Input() datosService : any;
  @Input() keyword : string = "" ;
  @Input() encabezados: any;
  @Input() formato: any;
  @Input() cabeceras: any;
  @Output() alImportar: EventEmitter<any> = new EventEmitter();

  tipoEntrada : any ;
  rows : President[]          = [ { Name: "SheetJS", Index: 0 }];
  datos : any                 = null;
  conNombredeCampo : boolean  = true;
  conIddeCampo : boolean      = false;
  archivo : DataTransfer      = null;
  extension : string          = null;
  texto : string              = null;
  tabOption : string          = 'tab-leer';
  validacion: string          = '';
  avance : string             = '';
  progreso : number           = 0;
  importando : boolean        = false;
  
  cabecerasImportacion : any  = null;

  keys (obj){
    return Object.keys(obj);
  }
  getFileNameWithExt(event) {

    if (!event || !event.target || !event.target.files || event.target.files.length === 0) {
      return;
    }
  
    const name = event.target.files[0].name;
    const lastDot = name.lastIndexOf('.');
  
    const fileName = name.substring(0, lastDot);
    const ext = name.substring(lastDot + 1);
  
    return {name: fileName, ext: ext};
    
  }
  getExt(event) {

    if (!event || !event.target || !event.target.files || event.target.files.length === 0) {
      return;
    }
  
    const name = event.target.files[0].name;
    const lastDot = name.lastIndexOf('.');
  
    const fileName = name.substring(0, lastDot);
    const ext = name.substring(lastDot + 1);
  
    return ext;
    
  }

  ngOnInit(): void { (async() => {
    /*this.datosService.getAll(-1,1,'id',false,this.keyword ).subscribe( (res:any) => {
      this.datos = res.content;
    });*/
  })(); }


  comenzarImportacion(){
    this.importando = true;
    this.progreso = (0 / (this.datos.length-1)) * 100 ;
    this.avance = `0 de ${this.datos.length} completados `;
    this.registroRecursivo(this.datos, 0);
    
  }
  registroRecursivo(datos,index){
    if (index >= datos.length) {
      this.alImportar.emit(true);
      return;
    }
    let registro_temp = datos[index];
    let registro = {};
    this.cabecerasImportacion.forEach(cabecera => {
      if (cabecera.seleccion!=null && cabecera.seleccion!='' && cabecera.seleccion!='null' )
        registro[cabecera.nombre] = registro_temp[cabecera.nombre];
    });
    console.log("cabecerasImportacion---",this.cabecerasImportacion);
    console.log("registro---",registro);
    this.datosService.register ( registro ).subscribe( (res:any) => {
      console.log(res);
      console.log("index",index);
      this.progreso = (index / (this.datos.length-1)) * 100 ;
      this.avance = `${index} de ${this.datos.length} completados `;
      this.registroRecursivo(this.datos, index+1);
      this.importando = true;

    }, (error)=>{
      this.importando = true;
    });
  }

  onSave(): void {
    let datos_temp = [];
    this.datos.forEach( data => {
      let row = [];
      this.keys(data).forEach( (campo) => {
        console.log("campo",campo);
        console.log("this.formato.cabeceras",this.formato.cabeceras);
        if (this.formato.cabeceras[campo]===undefined ) return;
        if (this.formato.cabeceras[campo].visibleCheck)
          if (this.conNombredeCampo)
            row[this.formato.cabeceras[campo].texto] = this.mascara( data[campo], data, this.formato.cabeceras[campo]);
          else
              row[campo] = this.mascara( data[campo], data, this.formato.cabeceras[campo]);
      });
      datos_temp.push(row);
    });
    console.log("datos_temp",datos_temp);

    const ws = utils.json_to_sheet(datos_temp);
    //sheet_to_csv
    console.log("ws",ws);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Data");
    writeFileXLSX(wb, this.titulo+".xlsx");
  }

  alSubir(event:any){
    const target: DataTransfer = <DataTransfer>(event.target);
    this.archivo    = target;
    this.extension  = this.getExt(event);
    this.datos = null;
    console.log("archivo",this.archivo);
  }

  leerDatos(){
    if (this.tipoEntrada == 'texto'){
      this.leerTexto(this.texto);     
    }
    if (this.tipoEntrada == 'archivo'){
      this.leerArchivo();
    }
    this.tabOption = 'tab-datos';
  }

  leerTexto(texto){
    try{
      this.datos = JSON.parse(texto);
      console.log("this.datos",this.datos);
      if (!Array.isArray( this.datos )){
        this.datos = null;
        this.validacion = 'El contenido JSON no es un array'
      }
      this.crearCabeceras(this.datos);      

    } catch(e){
      this.datos = null;
    } 
  }

  crearCabeceras(datos){
    let cabeceras = [];
    if (datos.length<=0) throw new Error('El array no contiene datos');
    let primeraFila = datos[0];
    this.keys(primeraFila).forEach( nombrecampo => {
      cabeceras.push ( {
        nombre: nombrecampo,
        seleccion : nombrecampo
      })
    });
    console.log("cabeceras",cabeceras);
    this.cabecerasImportacion = cabeceras;
  }

  leerExcel(ab){

  }

  leerArchivo(){
    console.log("leyendo archivo");
    if (this.archivo.files.length !== 1) throw new Error('No se puede usar archivos múltiples');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      var enc = new TextDecoder("utf-8");
      const ab: ArrayBuffer = e.target.result;

      if (this.extension.toLowerCase() == 'json')
        this.leerTexto(enc.decode(ab));
      if (this.extension.toLowerCase() == 'xls')
        this.leerExcel(ab);
            

      
      //console.log(enc.decode(ab));      
    };
    reader.readAsArrayBuffer(this.archivo.files[0]);
  }

  cambiarTab(event){
    this.tabOption =  event.target.getAttribute('data-bs-target').replace("#","");
  }

  onFileChange(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const ab: ArrayBuffer = e.target.result;
      const wb: WorkBook = read(ab);

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.datos = utils.sheet_to_json(ws, {header: 1});
    };
    reader.readAsArrayBuffer(target.files[0]);
  }
  mascara(valor,data,campo){
    if (this.conIddeCampo) return valor;
    if (campo.mascara=== undefined) return valor;
    else
      if (Array.isArray(data[campo.mascara.campo])){
        let arrValues = [];
        data[campo.mascara.campo].forEach(element => arrValues.push(element[campo.mascara.valor]));
        return arrValues.join(" ");
      }else
        return data[campo.mascara.campo][campo.mascara.valor];
  }
}
