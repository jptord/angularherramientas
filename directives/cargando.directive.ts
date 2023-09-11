import { Directive, ElementRef, HostBinding, Input, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

@Directive({
  selector: '[appCargando]'
})
export class CargandoDirective implements OnInit, OnChanges {

  @HostBinding("style.position")
  hostPosition: string = "relative";

  @Input() public cargando: boolean = false;
  uid: string;

  constructor(
    private renderer: Renderer2,
    private targetEl: ElementRef) { }

  ngOnInit(): void {
    this.uid = "loading-container-" + uuidv4();
    const loadingContainer = this.renderer.createElement("div");
    this.renderer.setStyle(
      loadingContainer,
      "display",
      this.cargando ? "flex" : "none"
    );
    this.renderer.setStyle(loadingContainer, "justify-content", "center");
    this.renderer.setStyle(loadingContainer, "align-items", "center");
    this.renderer.setStyle(loadingContainer, "margin", "0");
    this.renderer.setStyle(loadingContainer, "padding", "0");
    this.renderer.addClass(loadingContainer, this.uid);
    this.renderer.setStyle(loadingContainer, "position", "absolute");
    this.renderer.setStyle(loadingContainer, "top", "0");
    this.renderer.setStyle(loadingContainer, "background", "#fff");
    this.renderer.setStyle(loadingContainer, "opacity", "1");
    this.renderer.setStyle(loadingContainer, "width", "100%");
    this.renderer.setStyle(loadingContainer, "height", "100%");
    this.renderer.setStyle(loadingContainer, "z-index", "1000");

    // estilo 1
    /*const spinnerContainer = this.renderer.createElement("div");
    this.renderer.addClass(spinnerContainer, "lds-barras");
    const spinnerInnerDiv1 = this.renderer.createElement("div");
    const spinnerInnerDiv2 = this.renderer.createElement("div");
    const spinnerInnerDiv3 = this.renderer.createElement("div");

    this.renderer.appendChild(spinnerContainer, spinnerInnerDiv1);
    this.renderer.appendChild(spinnerContainer, spinnerInnerDiv2);
    this.renderer.appendChild(spinnerContainer, spinnerInnerDiv3);*/

    // estilo skote
    const spinnerContainer = this.renderer.createElement("div");
    this.renderer.addClass(spinnerContainer, "spinner-chase");

    for (let i=0; i<6; i++){
      const spinnerInnerDiv1 = this.renderer.createElement("div");
      this.renderer.addClass(spinnerInnerDiv1, "chase-dot");
      this.renderer.appendChild(spinnerContainer, spinnerInnerDiv1);
    }

    this.renderer.appendChild(loadingContainer, spinnerContainer);
    this.renderer.appendChild(this.targetEl.nativeElement, loadingContainer);
  }

  ngOnChanges(simpleChanges: SimpleChanges): void {
    if (simpleChanges.cargando) {
      const container = this.targetEl.nativeElement;
      const div = container.querySelector("." + this.uid);
      if (div) {
        this.renderer.setStyle(
          div,
          "display",
          this.cargando ? "flex" : "none"
        );
      }
    }
  }
}
