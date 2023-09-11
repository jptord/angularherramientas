import { AfterViewInit, Component, DoCheck, Input, OnInit, Optional, Renderer2, Self, forwardRef } from '@angular/core';
import {  ControlValueAccessor, FormControl, FormGroup,  NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-selector-image',
  templateUrl: './selector-image.component.html',
  styleUrls: ['./selector-image.component.scss']
})
export class SelectorImageComponent implements AfterViewInit,ControlValueAccessor, DoCheck{

  @Input() config: any;
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

  modalRef?: BsModalRef;
  editarRegistro = false;
  nuevoRegistro = false;
  errorMessages = []
  selector = 0;
  srcImage = '';
  oldValue ='';
  inputField = new FormControl('');
  onChange: any = () => {}
  onTouch: any = () => {}
  constructor(@Self() @Optional() public control: NgControl,
  private sanitizer: DomSanitizer,
  private renderer: Renderer2,) {
    this.control.valueAccessor = this;
  }

  ngAfterViewInit(): void {
    this.inputField.valueChanges.subscribe(value => {
      this.onChange(value.trim());
   });
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


  cargarImagen(event){
    let me = this;
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const ab: ArrayBuffer = e.target.result;

      var blob = new Blob([ab], {type: 'image/jpeg'});
      var urlCreator = window.URL || window.webkitURL;
      var imageUrl = urlCreator.createObjectURL(blob);

      const file = new Blob([ab], { type: "image/jpeg" });

      const fileURL = URL.createObjectURL(file);
      const safeblobUrl =  this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

      this.convertImageToBase64(fileURL, (data64)=> {
        this.resizeBase64Img(data64,256,256).then( (resized64:any) => {
          me.srcImage = resized64;
          this.onChange(me.srcImage);
        });
      });
      //this.renderer.setStyle(this.imagen.nativeElement, "background-color", "blue");
    };
    reader.readAsArrayBuffer(target.files[0]);
  }
  resizeBase64Img(base64, newWidth, newHeight) {
    return new Promise((resolve, reject)=>{
        var canvas = document.createElement("canvas");
        canvas.width = newWidth;
        canvas.height = newHeight;
        let context = canvas.getContext("2d");
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);
        let img = document.createElement("img");
        img.src = base64;
        img.onload = function () {
            context.scale(newWidth/img.width,  newHeight/img.height);
            context.drawImage(img, 0, 0);
            resolve(canvas.toDataURL("image/jpeg",0.5 ));
        }
    });
}

  convertImageToBase64(imgUrl, callback) {
    const image = new Image();
    image.crossOrigin='anonymous';
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      canvas.height = image.naturalHeight;
      canvas.width = image.naturalWidth;
      ctx.drawImage(image, 0, 0);
      const dataUrl = canvas.toDataURL();
      callback && callback(dataUrl)
    }
    image.src = imgUrl;
  }

}
