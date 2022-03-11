import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `<!-- To render ColorPicker. -->
            <input ejs-colorpicker type="color" id="colorpicker" />`,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'canva-demo';
}
