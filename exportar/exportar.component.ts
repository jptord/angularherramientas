import { Component, Input } from '@angular/core';
import { read, utils, writeFileXLSX,WorkBook,WorkSheet } from 'xlsx';

interface President { Name: string; Index: number };
@Component({
  selector: 'krn-exportar',
  templateUrl: './exportar.component.html',
  styleUrls: ['./exportar.component.scss']
})

export class ExportarComponent {

  @Input() titulo : any = "exportacion";
  @Input() datosService : any;
  @Input() keyword : string = "" ;
  @Input() encabezados: any;
  @Input() formato: any;

  rows: President[] = [ { Name: "SheetJS", Index: 0 }];
  datos:any;
  conNombredeCampo:boolean = true;
  conIddeCampo:boolean = false;

  @Input() cabeceras: any;

  keys (obj){
    return Object.keys(obj);
  }
  ngOnInit(): void { (async() => {
    this.datosService.getAll(-1,1,'id',false,this.keyword ).subscribe( (res:any) => {
      this.datos = res.content;
    });
  })(); }
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
