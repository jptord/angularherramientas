import { AfterViewInit, Component, DoCheck, Input, OnInit, Optional, Self, forwardRef } from '@angular/core';
import {  ControlValueAccessor, FormControl, FormGroup,  NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';

@Component({
  selector: 'app-selector-add',
  templateUrl: './selector-add.component.html',
  styleUrls: ['./selector-add.component.scss'],

})
export class SelectorAddComponent implements AfterViewInit,ControlValueAccessor, DoCheck{

  @Input() config: TextInputConfigModel;
  @Input() verificationPending: boolean;
  @Input() errors: any;
  @Input() submitted: any = false;
  @Input() label: any = "";
  @Input() valid: boolean;
  @Input() isDisabled = false;
  @Input() autocapitalize = false;

  @Input() campoNombre:string = 'nombre';
  @Input() campoValor:string = 'id';

  @Input() showAdd = true;
  @Input() showEdit = true;

  @Input() templateNuevo:any = null;
  @Input() templateEditar:any = null;

  @Input() dataArray = [];

  editarRegistro = false;
  nuevoRegistro = false;
  errorMessages = []
  selector = 0;
  oldValue ='';
  inputField = new FormControl('');
  onChange: any = () => {}
  onTouch: any = () => {}
  constructor(@Self() @Optional() public control: NgControl) {
    this.control.valueAccessor = this;
  }

  ngAfterViewInit(): void {
    this.inputField.valueChanges.subscribe(value => {
      this.onChange(value.trim());
   });
   //this.setDisabledState(this.isDisabled);
  }
  setDisabledState?(isDisabled: boolean): void {

  }
  ngDoCheck(): void {
    if (this.valid) {
      this.inputField.setErrors(null);
      this.errorMessages = []
    } else {
        this.inputField.setErrors(this.errors);
        //this.errorMessages = getErrorMessages(this.config.errorMessages, this.errors);
    }
  }

  writeValue(value): void {
    this.selector = value
  }

  onTouched: () => void = () => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  alCambiar(e){
    console.log("this.selector",this.selector);
    //console.log(this.control.control.errors);

    this.onChange(this.selector);
  }
  close(){
    this.editarRegistro = false;
    this.nuevoRegistro = false;
  }
}

  export interface TextInputConfigModel {
    label: string,
    placeholder?: string,
    type?: string,
    hint?: string,
    showValidTick?: boolean;
    showInvalidCross?: boolean;
    errorMessages?: any;
  }
