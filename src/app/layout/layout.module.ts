import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
//Import the library
import { CarouselModule } from 'ngx-owl-carousel-o';   
import { LayoutComponent, NgbdModalConfirmAutofocus } from './layout.component';
import { LayoutRoutingModule } from './layout.routing';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FabricjsEditorModule } from 'projects/angular-editor-fabric-js/src/public-api';
import { ColorPickerModule } from 'ngx-color-picker';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    LayoutComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    FormsModule,
    ReactiveFormsModule,  
    CarouselModule,
    NgxSkeletonLoaderModule,
    InfiniteScrollModule,  
    FabricjsEditorModule,
    ColorPickerModule,
    NgbModule
  ],
  entryComponents: [NgbdModalConfirmAutofocus]
})
export class LayoutModule { }
