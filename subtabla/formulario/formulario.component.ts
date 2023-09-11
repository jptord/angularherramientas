import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-formulario-tools',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss']
})
export class FormularioComponent implements OnInit {
  @Input() estructuraDatos: any;
  @Output() alGuardar = new EventEmitter<any>();
  @Output() alActualizar = new EventEmitter<any>();
  @Input() editarid: number | string | null;
  @Input() dataEdit: any;
  grupoFormulario: FormGroup;
  id = null;
  submitted = false;

  constructor(private formBuilder: FormBuilder) { }


  objectKeys = Object.keys;

  ngOnInit(): void {
    this.cargarDatosStore();
  }

  construirFormulario() {
    let dataFB = {};
    this.formularioData.formulario.forEach((f: any) => {
      let validadores = [];
      f.rules.forEach(r => {
        switch (r.name) {
          case 'required': validadores.push(Validators.required); break;
          case 'min': validadores.push(Validators.minLength(parseInt(r.full[1]))); break;
          case 'max': validadores.push(Validators.maxLength(parseInt(r.full[1]))); break;
          case 'string': validadores.push(Validators.required); break;
        }
      });

      dataFB[f.field] = ['', validadores];
    });
    this.grupoFormulario = this.formBuilder.group(dataFB);
    this.cargarDatosEdit();
  }

  cargarDatosEdit() {
    console.log("this.dataEdit:", this.dataEdit);
    if (this.dataEdit != null) {
      let valores = [];
      this.formularioData.formulario.forEach((f: any) => {
        //valores[f.field] = this.dataEdit[f.field];
      });
      console.log("valores", valores);
      this.grupoFormulario.patchValue(this.dataEdit);
    }
  }


  formularioData: any;

  cargarDatosStore() {
    console.log("this.estructuraDatos:", this.estructuraDatos);
    this.estructuraDatos.store.dataService.subscribe(
      (res: any) => {
        this.formularioData = res.data;
        console.log("formularioData:", this.formularioData);
        this.construirFormulario();
      },
      (err: any) => {

      });
  }

  get form() {
    return this.grupoFormulario.controls;
  }
  relRules(r) {
    let s: string = r;
    switch (r) {
      case 'required': s = 'required'; break;
      case 'max': s = 'maxlength'; break;
      case 'min': s = 'minlength'; break;
      case 'string': s = 'required'; break;
    };
    //console.log("relrule",s );
    return s;
  }
  relRules2(c, r) {
    let s: string = r;
    switch (r) {
      case 'required': s = 'required'; break;
      case 'max': s = 'maxlength'; break;
      case 'min': s = 'minlength'; break;
      case 'string': s = 'required'; break;
    };
    if (this.formularioData.messages[c + '.' + s] !== undefined) return this.formularioData.messages[c + '.' + s];
    else return false;
    //console.log("relrule",s );
  }




  guardar() {
    console.log("this.grupoFormulario", this.grupoFormulario);
    if (this.grupoFormulario.valid) {
      if (this.dataEdit == null) {
        this.alGuardar.emit({ valores: this.grupoFormulario.value });
        /*  this.seccionesService.register(this.grupoFormulario.value).subscribe(
            data => {
              this.notificacion.successStandar();
              this.alCrear.emit(data);
            },
            (error: HttpErrorResponse) => {
              if (typeof error != 'string') {
                let msg = [];
                Object.keys(error).forEach((e, i) => {
                  msg.push(`${error[e]} `);
                });
                this.notificacion.alertError(msg.join('<br>'));
              }
              else
                this.notificacion.alertError(error);
            });*/
      } else {
        this.alActualizar.emit({ key: this.dataEdit[this.formularioData.key], valores: this.grupoFormulario.value });
        /*this.seccionesService.update(this.grupoFormulario.value).subscribe(
          data => {
            this.notificacion.successStandar();
            this.alGuardar.emit(data);
          },
          (error: HttpErrorResponse) => {
            if (typeof error != 'string') {
              let msg = [];
              Object.keys(error).forEach((e, i) => {
                msg.push(`${error[e]} `);
              });
              this.notificacion.alertError(msg.join('<br>'));
            }
            else
              this.notificacion.alertError(error);
          });*/
      }
    }
    this.submitted = true;
  }
}
