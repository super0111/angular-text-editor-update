import { Component, HostListener, OnInit, ViewChild ,Type} from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { FabricjsEditorComponent } from 'projects/angular-editor-fabric-js/src/public-api';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-modal-confirm-autofocus',
  template: `
  <div class="modal-body">
    <p><strong>Are you sure you want to clean?</strong></p>
    <p>All elements and informations will be permanently deleted.
    <span class="text-danger">This operation can not be undone.</span>
    </p>
    <div class="text-end">
      <button type="button" class="btn btn-outline-secondary" (click)="modal.close(false)">Cancel</button>
      <button type="button" class="btn btn-danger ms-2" (click)="modal.close(true)">Ok</button>
    </div>
  </div>
  `
})
export class NgbdModalConfirmAutofocus {
  constructor(public modal: NgbActiveModal) {}
  clearcanvas() {
    this.modal.close();
  }
}


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  @ViewChild('canvas', { static: false }) canvas: FabricjsEditorComponent;

  constructor(private _modalService: NgbModal) { }
  slidesStore = [];
  backToSchoole = [];
  covidTemplates = [];
  photosGallery = [];
  istabedViewed: boolean = false;
  tabselected = 0;
  zoom = 100
  @HostListener("window:scroll", [])
  ngOnInit(): void {
    this.ShowHide(false);
  }

  ShowHide(data: boolean = false) {
    if (data) {
      this.istabedViewed = true;
    }
    else {
      this.istabedViewed = false;
    }
  }

  zoomChange(e) {
    this.zoom = e;
    this.canvas.setzoom(this.zoom);
  }

  setzoom(zoom: number) {
    this.zoom = zoom;
    this.canvas.setzoom(zoom);
  }

  openTryFunction(id:number) {

    if(this.istabedViewed){
      this.ShowHide(false);
      this.tabselected = id;
    }
  }

  canvasselect(event) {
    if(event == 'text'){
      this.openTryFunction(3);
      document.getElementById('v-pills-texts-tab').click()
    }
  }

  public addFigure(figure) {
    this.canvas.addFigure(figure);
  }

  public confirmClear() {
    const modalRef = this._modalService.open(NgbdModalConfirmAutofocus);

    modalRef.result.then((userResponse) => {
      if(userResponse){
        this.canvas.confirmClear();
      }
    });

    // this.canvas.confirmClear();
  }
  public addPhotos(event) {
    this.canvas.addImageOnCanvas(event.target.src);
  }

  public getImgPolaroid(event) {
    this.canvas.getImgPolaroid(event)
  }

  public removeSelected() {
    this.canvas.removeSelected();
  }

  public sendToBack() {
    this.canvas.sendToBack();
  }

  public bringToFront() {
    this.canvas.bringToFront();
  }

  public clone() {
    this.canvas.clone();
  }

  public cleanSelect() {
    this.canvas.cleanSelect();
  }

  public changeSize() {
    this.canvas.changeSize();
  }

  public addText(val) {
    this.canvas.textString = "Hello World.";
    this.canvas.addText();
    this.canvas.props.fontSize = val;
    this.canvas.setFontSize();
  }

  public setTextAlign(value) {
    this.canvas.setTextAlign(value);
  }

  public setBold() {
    this.canvas.setBold();
  }

  public setFontStyle() {
    this.canvas.setFontStyle();
  }

  public hasTextDecoration(value) {
    this.canvas.hasTextDecoration(value);
  }

  public setTextDecoration(value) {
    this.canvas.setTextDecoration(value);
  }

  public setFontSize() {
    this.canvas.setFontSize();
  }

  public setLineHeight() {
    this.canvas.setLineHeight();
  }

  public setCharSpacing() {
    this.canvas.setCharSpacing();
  }

  public undo(){
    this.canvas.undo();
  }

  public redo(){
    this.canvas.redo();
  }

  public rasterize() {
    this.canvas.rasterize();
  }

  public rasterizeSVG() {
    this.canvas.rasterizeSVG();
  }

  public saveCanvasToJSON() {
    this.canvas.saveCanvasToJSON();
  }

  public loadCanvasFromJSON() {
    this.canvas.loadCanvasFromJSON();
  }

  public setCanvasFill() {
    this.canvas.setCanvasFill();
  }

  public setCanvasImage() {
    this.canvas.setCanvasImage();
  }

  public setId() {
    this.canvas.setId();
  }

  public setOpacity() {
    this.canvas.setOpacity();
  }

  public setFill() {
    this.canvas.setFill();
  }

  public setFontFamily() {
    this.canvas.setFontFamily();
  }

}


















