import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// import { FabricjsEditorModule } from 'projects/angular-editor-fabric-js/src/public-api';
import { LayoutModule } from './layout/layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPickerModule } from '@syncfusion/ej2-angular-inputs';
import { enableRipple } from '@syncfusion/ej2-base';

enableRipple(true);

@NgModule({
  declarations: [AppComponent],

  imports: [
    BrowserModule,
    ColorPickerModule ,
    // FabricjsEditorModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    LayoutModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
