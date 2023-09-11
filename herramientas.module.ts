import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubtablaComponent } from './subtabla/subtabla.component';
import { TablaComponent } from './tabla/tabla.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PaginationModule,PaginationConfig } from 'ngx-bootstrap/pagination';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
defineLocale('es', esLocale);

import { NgApexchartsModule } from 'ng-apexcharts';
import { FullCalendarModule } from '@fullcalendar/angular';
import { SimplebarAngularModule } from 'simplebar-angular';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { LightboxModule } from 'ngx-lightbox';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { CargandotoolsDirective } from './directives/cargandotools.directive';
import { FormularioComponent as SubFormularioComponent } from './subtabla/formulario/formulario.component';
import { FormularioComponent } from './tabla/formulario/formulario.component';
import { TablaBasicaComponent } from './tabla-basica/tabla-basica.component';
import { TablaselectorComponent } from './tablaselector/tablaselector.component';

import { ExportarComponent } from './exportar/exportar.component';
import { ImportarComponent } from './importar/importar.component';
import { SelectorAddComponent } from './selector-add/selector-add.component';
import { SelectorImageComponent } from './selector-image/selector-image.component';

@NgModule({
  declarations: [
    TablaComponent,
    ExportarComponent,
    ImportarComponent,
    TablaselectorComponent,
    SubtablaComponent,
    CargandotoolsDirective,
    FormularioComponent,
    SubFormularioComponent,
    TablaBasicaComponent,
    SelectorAddComponent,
    SelectorImageComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ProgressbarModule.forRoot(),
    NgApexchartsModule,
    ReactiveFormsModule,

    UIModule,
    WidgetModule,
    FullCalendarModule,
    LightboxModule,
    SimplebarAngularModule,
    NgSelectModule,

    TabsModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    CollapseModule.forRoot(),
    PaginationModule.forRoot(),
    AccordionModule.forRoot(),
    BsDatepickerModule.forRoot(),
    LeafletModule,
  ],
  exports: [
    CommonModule,
    TablaComponent,
    ExportarComponent,
    TablaBasicaComponent,
    TablaselectorComponent,
    SelectorAddComponent,
    SelectorImageComponent,
  ]
})
export class HerramientasModule { }
