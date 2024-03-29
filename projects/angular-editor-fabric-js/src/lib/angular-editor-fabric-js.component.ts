import { analyzeAndValidateNgModules, NONE_TYPE } from '@angular/compiler';
import { Component, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { fabric } from 'fabric';

interface keyable {
  [key: string]: any  
}

interface ITextOptionsWithId extends fabric.ITextOptions {
  id: string
}
interface IImageOptionsWithId extends fabric.IImageOptions {
  id: string
}
interface IRectOptionsWithId extends fabric.IRectOptions {
  id: string
}
interface ITriangleOptionsWithId extends fabric.ITriangleOptions {
  id: string
}
interface ICircleOptionsWithId extends fabric.ICircleOptions {
  id: string
}
interface IEllipseOptionsWithId extends fabric.IEllipseOptions {
  id: string
}
@Component({
  selector: 'angular-editor-fabric-js',
  templateUrl: './angular-editor-fabric-js.component.html',
  styleUrls: ['./angular-editor-fabric-js.component.css'],
})
export class FabricjsEditorComponent implements AfterViewInit {
  @ViewChild('htmlCanvas') htmlCanvas: ElementRef;
  @Output() selectedEvent = new EventEmitter<any>();

  private canvas: fabric.Canvas;
  public props = {
    canvasFill: '#ffffff',
    canvasImage: '',
    id: null,
    opacity: null,
    fill: null,
    fontSize: null,
    lineHeight: null,
    charSpacing: null,
    fontWeight: null,
    fontStyle: null,
    textAlign: null,
    fontFamily: null,
    TextDecoration: ''
  };

  public textString: string;
  public url: string | ArrayBuffer = '';
  public size: any = {
    width: 500,
    height: 800
  };

  public json: any;
  private globalEditor = false;
  public textEditor = false;
  private imageEditor = false;
  public figureEditor = false;
  public selected: any;

  public tooltipStr = {};
  public canvasId = 0;


  public state: any[] = [];
  public mods: number = 0;
  public isredoundo = false;

  constructor() { }

  ngAfterViewInit(): void {

    // setup front side canvas
    this.canvas = new fabric.Canvas(this.htmlCanvas.nativeElement, {
      hoverCursor: 'pointer',
      selection: true,
      selectionBorderColor: 'red'
    });

    this.canvas.on({
      'object:moving': (e) => {
        // console.log(e);
      },
      'object:modified': (e) => {
        this.savehistory()
      },
      'object:added': (e) => {
        this.savehistory()
      },
      'selection:updated': (e) => {
        this.selectedObjectFn(e);
      },
      'selection:created': (e) => {
        this.selectedObjectFn(e);
      },
      'selection:cleared': (e) => {
        this.selected = null;
        this.resetPanels();
      },
      'mouse:move': (e) => {
        console.log(e);
        this.canvas.on({
          'mouse:move': (e) => {
            // console.log("canvas", this.canvas);
           
            let tooltip2 = document.getElementById('addImage');
            var p = this.canvas.getPointer(e.e);
            console.log(e.target);
    
            if(e.target != null) {
              tooltip2.style.visibility = "visible";
              tooltip2.style.left = p.x + 430 + "px";
              tooltip2.style.top = p.y + 80 + "px";
              let target: keyable = e.target;
              let cacheKey = target?.id;
              if(cacheKey) {                
                tooltip2.innerHTML = this.tooltipStr[cacheKey];
              }
            } else {
              
              tooltip2.style.visibility = 'hidden';
            }
          }
        });
      }
    });
    this.canvas.setWidth(this.size.width);
    this.canvas.setHeight(this.size.height);
    // get references to the html canvas element & its context
    this.canvas.on('mouse:down', (e) => {
      const canvasElement: any = document.getElementById('canvas');
    });

  }

  selectedObjectFn(e: any) {
    const selectedObject = e.target;
    this.selected = selectedObject;
    selectedObject.hasRotatingPoint = true;
    selectedObject.transparentCorners = false;
    selectedObject.cornerColor = 'rgba(255, 87, 34, 0.7)';

    this.resetPanels();

    if (selectedObject.type !== 'group' && selectedObject) {

      this.getId();
      this.getOpacity();

      switch (selectedObject.type) {
        case 'rect':
        case 'circle':
        case 'triangle':
          this.figureEditor = true;
          this.getFill();
          break;
        case 'i-text':
          this.textEditor = true;
          this.selectedEvent.emit('text');
          this.getLineHeight();
          this.getCharSpacing();
          this.getBold();
          this.getFill();
          this.getTextDecoration();
          this.getTextAlign();
          this.getFontFamily();
          break;
        case 'image':
          break;
      }
    }
  }

  savehistory() {
    if (!this.isredoundo) {
      if (this.mods > 0) {
        this.state = [];
        this.mods = 0;
      }
      console.log('not redoundo')
      this.updateModifications(true);
    }
  }

  updateModifications(savehistory: any) {
    if (savehistory === true) {
      const myjson = JSON.stringify(this.canvas);
      this.state.push(myjson);
    }
  }

  undo() {
    console.log("undo");
    this.isredoundo = true;
    console.log(this.isredoundo);
    if (this.mods < this.state.length) {
      this.canvas.clear().renderAll();

      this.canvas.loadFromJSON(this.state[this.state.length - 1 - this.mods - 1], () => {
        this.canvas.renderAll();
        this.isredoundo = false;
      });
      this.mods += 1;

    }
   
  }

  redo() {
    console.log("redo");
    this.isredoundo = true;
    console.log(this.isredoundo);
    if (this.mods > 0) {
      this.canvas.clear().renderAll();

      this.canvas.loadFromJSON(this.state[this.state.length - 1 - this.mods + 1], () => {
        this.canvas.renderAll();
        this.isredoundo = false;
      });
      
      this.mods -= 1;
    }
   
  }

  setzoom(zoom: number) {
    this.canvas.setZoom(1)  // reset zoom so pan actions work as expected
    this.canvas.setWidth(this.size.width * zoom / 100);
    this.canvas.setHeight(this.size.height * zoom / 100);
    this.canvas.setZoom(zoom / 100)
  }

  /*------------------------Block elements------------------------*/

  // Block "Size"

  changeSize() {
    this.canvas.setWidth(this.size.width);
    this.canvas.setHeight(this.size.height);
  }

  // Block "Add text"
  addText() {
    let id = "texture-"+this.canvasId;
    this.tooltipStr[id] = "tooltip for text";
    this.canvasId++;

    const options: ITextOptionsWithId = {
      left: 10,
      top: 20,
      fontFamily: 'helvetica',
      angle: 0,
      fill: '#000000',
      scaleX: 0.5,
      scaleY: 0.5,
      fontWeight: '',
      hasRotatingPoint: true,
      id: id,
    };
    if (this.textString) {
      const text = new fabric.IText(this.textString, options);

      this.extend(text, this.randomId());
      this.canvas.add(text);
      this.selectItemAfterAdded(text);
      this.textString = '';
    }
  }

  // Block "Add images"

  getImgPolaroid(event: any) {
    const el = event.target;
    fabric.loadSVGFromURL(el.src, (objects, options) => {
      const image = fabric.util.groupSVGElements(objects, options);
      image.set({
        left: 10,
        top: 10,
        angle: 0,
        padding: 10,
        cornerSize: 10,
        hasRotatingPoint: true,
      });
      this.extend(image, this.randomId());
      this.canvas.add(image);
      this.selectItemAfterAdded(image);
    });
  }

  // Block "Upload Image"

  addImageOnCanvas(url) {

    let id = "Image-" + this.canvasId;
    this.tooltipStr[id] = id;
    this.canvasId = this.canvasId + 1;

    const options: IImageOptionsWithId = {
      left: 10,
      top: 10,
      angle: 0,
      padding: 10,
      cornerSize: 10,
      hasRotatingPoint: true,
      id: id,
    }
    if (url) {
      fabric.Image.fromURL(url, (image) => {
        image.set(options);
        console.log(image);
        // this.canvas.on({
        //   'mouse:move': (e) => {
        //     // console.log("canvas", this.canvas);
           
        //     let tooltip2 = document.getElementById('addImage');
        //     var p = this.canvas.getPointer(e.e);
        //     console.log(typeof e.target);
    
        //     if(e.target != null) {
        //       tooltip2.style.visibility = "visible";
        //       tooltip2.style.left = p.x + 430 + "px";
        //       tooltip2.style.top = p.y + 80 + "px";
        //       let target: keyable = e.target;
        //       let cacheKey = target?.cacheKey;
        //       let text = target?.text;
        //       if(cacheKey) {                
        //         tooltip2.innerHTML = this.tooltipStr[cacheKey];
        //         // console.log(cacheKey);
        //       } else if (text){
        //         tooltip2.innerHTML = text;
        //       }
        //       // tooltip2.innerHTML = "cacheKey";
        //       // console.log(tooltip2);
        //     } else {
              
        //       tooltip2.style.visibility = 'hidden';
        //     }
        //   }
        // });

        image.scaleToWidth(200);
        image.scaleToHeight(200);
        this.extend(image, this.randomId());
        this.canvas.add(image);
        this.selectItemAfterAdded(image);
      });
    }
  }

  readUrl(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        this.url = readerEvent.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  removeWhite(url) {
    this.url = '';
  }

  // Block "Add figure"

  addFigure(figure) {
    let add: any;
    let id = "texture-" + this.canvasId;
    this.tooltipStr[id] = figure;
    this.canvasId = this.canvasId + 1;

    switch (figure) {
      case 'rectangle':
        const options_1: IRectOptionsWithId = {
          width: 200, height: 100, left: 10, top: 20, angle: 0,
          fill: '#3f51b5',
          id: id,
        }
        add = new fabric.Rect(options_1);
        break;
      case 'square':
        const options_2: IRectOptionsWithId = {
          width: 100, height: 100, left: 10, top: 20, angle: 0,
          fill: '#4caf50', id: id
        }
        add = new fabric.Rect(options_2);
        break;
      case 'triangle':
        const options_3: ITriangleOptionsWithId = {
          width: 100, height: 100, left: 10, top: 20, fill: '#2196f3', id: id
        }
        add = new fabric.Triangle(options_3);
        break;
      case 'circle':
        const options_4: ICircleOptionsWithId = {
          radius: 50, left: 10, top: 20, fill: '#ff5722', id: id
        };
        add = new fabric.Circle(options_4);
        break;
      case 'ellipse':
        const ellipseOptions: IEllipseOptionsWithId = {
          rx: 80,
          ry: 40,
          fill: '#ff5722',
          stroke: 'green',
          strokeWidth: 3,
          id: id
        };
        add = new fabric.Ellipse(ellipseOptions);
        break;
    }
    console.log(add);
    // this.canvas.on({
    //   'mouse:move': (e) => {
    //     // console.log("canvas", this.canvas);
       
    //     let tooltip2 = document.getElementById('addImage');
    //     var p = this.canvas.getPointer(e.e);
    //     if(e.target != null) {
    //       tooltip2.style.visibility = "visible";
    //       tooltip2.style.left = p.x + 430 + "px";
    //       tooltip2.style.top = p.y + 80 + "px";
    //       let target: keyable = e.target;
    //       let cacheKey = target?.cacheKey;
    //       console.log("cacheKey", cacheKey)
    //       tooltip2.innerHTML = "This is " + this.tooltipStr[id] + " tool";
    //       // tooltip2.innerHTML = "cacheKey";
    //     } else {
    //       tooltip2.style.visibility = 'hidden';
    //     }
    //   }
    // });

    this.extend(add, this.randomId());
    this.canvas.add(add);
    this.selectItemAfterAdded(add);
  }

  /*Canvas*/

  cleanSelect() {
    this.canvas.discardActiveObject().renderAll();
  }

  selectItemAfterAdded(obj) {
    this.canvas.discardActiveObject().renderAll();
    this.canvas.setActiveObject(obj);
  }

  setCanvasFill() {
    if (!this.props.canvasImage) {
      this.canvas.backgroundColor = this.props.canvasFill;
      this.canvas.renderAll();
    }
  }

  extend(obj, id) {
    obj.toObject = ((toObject) => {
      return function () {
        return fabric.util.object.extend(toObject.call(this), {
          id
        });
      };
    })(obj.toObject);
  }

  setCanvasImage() {
    const self = this;
    if (this.props.canvasImage) {
      this.canvas.setBackgroundColor(new fabric.Pattern({ source: this.props.canvasImage, repeat: 'repeat' }), () => {
        self.props.canvasFill = '';
        self.canvas.renderAll();
      });
    }
  }

  randomId() {
    return Math.floor(Math.random() * 999999) + 1;
  }

  /*------------------------Global actions for element------------------------*/

  getActiveStyle(styleName, object) {
    object = object || this.canvas.getActiveObject();
    if (!object) { return ''; }

    if (object.getSelectionStyles && object.isEditing) {
      return (object.getSelectionStyles()[styleName] || '');
    } else {
      return (object[styleName] || '');
    }
  }

  setActiveStyle(styleName, value: string | number, object: fabric.IText) {
    object = object || this.canvas.getActiveObject() as fabric.IText;
    if (!object) { return; }

    if (object.setSelectionStyles && object.isEditing) {
      const style = {};
      style[styleName] = value;

      if (typeof value === 'string') {
        if (value.includes('underline')) {
          object.setSelectionStyles({ underline: true });
        } else {
          object.setSelectionStyles({ underline: false });
        }

        if (value.includes('overline')) {
          object.setSelectionStyles({ overline: true });
        } else {
          object.setSelectionStyles({ overline: false });
        }

        if (value.includes('line-through')) {
          object.setSelectionStyles({ linethrough: true });
        } else {
          object.setSelectionStyles({ linethrough: false });
        }
      }

      object.setSelectionStyles(style);
      object.setCoords();

    } else {
      if (typeof value === 'string') {
        if (value.includes('underline')) {
          object.set('underline', true);
        } else {
          object.set('underline', false);
        }

        if (value.includes('overline')) {
          object.set('overline', true);
        } else {
          object.set('overline', false);
        }

        if (value.includes('line-through')) {
          object.set('linethrough', true);
        } else {
          object.set('linethrough', false);
        }
      }

      object.set(styleName, value);
    }

    object.setCoords();
    this.canvas.renderAll();
  }


  getActiveProp(name) {
    const object = this.canvas.getActiveObject();
    if (!object) { return ''; }

    return object[name] || '';
  }

  setActiveProp(name, value) {
    const object = this.canvas.getActiveObject();
    if (!object) { return; }
    object.set(name, value).setCoords();
    this.canvas.renderAll();
  }

  clone() {
    const activeObject = this.canvas.getActiveObject();
    const activeGroup = this.canvas.getActiveObjects();

    if (activeObject) {
      let clone;
      switch (activeObject.type) {
        case 'rect':
          clone = new fabric.Rect(activeObject.toObject());
          break;
        case 'circle':
          clone = new fabric.Circle(activeObject.toObject());
          break;
        case 'triangle':
          clone = new fabric.Triangle(activeObject.toObject());
          break;
        case 'i-text':
          clone = new fabric.IText('', activeObject.toObject());
          break;
        case 'image':
          clone = fabric.util.object.clone(activeObject);
          break;
      }
      if (clone) {
        clone.set({ left: 10, top: 10 });
        this.canvas.add(clone);
        this.selectItemAfterAdded(clone);
      }
    }
  }

  getId() {
    this.props.id = this.canvas.getActiveObject().toObject().id;
  }

  setId() {
    const val = this.props.id;
    const complete = this.canvas.getActiveObject().toObject();
    this.canvas.getActiveObject().toObject = () => {
      complete.id = val;
      return complete;
    };
  }

  getOpacity() {
    this.props.opacity = this.getActiveStyle('opacity', null) * 100;
  }

  setOpacity() {
    this.setActiveStyle('opacity', parseInt(this.props.opacity, 10) / 100, null);
  }

  getFill() {
    this.props.fill = this.getActiveStyle('fill', null);
  }

  setFill() {
    this.setActiveStyle('fill', this.props.fill, null);
  }

  getLineHeight() {
    this.props.lineHeight = this.getActiveStyle('lineHeight', null);
  }

  setLineHeight() {
    this.setActiveStyle('lineHeight', parseFloat(this.props.lineHeight), null);
  }

  getCharSpacing() {
    this.props.charSpacing = this.getActiveStyle('charSpacing', null);
  }

  setCharSpacing() {
    this.setActiveStyle('charSpacing', this.props.charSpacing, null);
  }

  getFontSize() {
    this.props.fontSize = this.getActiveStyle('fontSize', null);
  }

  setFontSize() {
    this.setActiveStyle('fontSize', parseInt(this.props.fontSize, 10), null);
  }

  getBold() {
    this.props.fontWeight = this.getActiveStyle('fontWeight', null);
  }

  setBold() {
    this.props.fontWeight = !this.props.fontWeight;
    this.setActiveStyle('fontWeight', this.props.fontWeight ? 'bold' : '', null);
  }

  setFontStyle() {
    this.props.fontStyle = !this.props.fontStyle;
    if (this.props.fontStyle) {
      this.setActiveStyle('fontStyle', 'italic', null);
    } else {
      this.setActiveStyle('fontStyle', 'normal', null);
    }
  }

  getTextDecoration() {
    this.props.TextDecoration = this.getActiveStyle('textDecoration', null);
  }

  setTextDecoration(value) {
    let iclass = this.props.TextDecoration;
    if (iclass.includes(value)) {
      iclass = iclass.replace(RegExp(value, 'g'), '');
    } else {
      iclass += ` ${value}`;
    }
    this.props.TextDecoration = iclass;
    this.setActiveStyle('textDecoration', this.props.TextDecoration, null);
  }

  hasTextDecoration(value) {
    return this.props.TextDecoration.includes(value);
  }

  getTextAlign() {
    this.props.textAlign = this.getActiveProp('textAlign');
  }

  setTextAlign(value) {
    this.props.textAlign = value;
    this.setActiveProp('textAlign', this.props.textAlign);
  }

  getFontFamily() {
    this.props.fontFamily = this.getActiveProp('fontFamily');
  }

  setFontFamily() {
    this.setActiveProp('fontFamily', this.props.fontFamily);
  }

  /*System*/


  removeSelected() {
    const activeObject = this.canvas.getActiveObject();
    const activeGroup = this.canvas.getActiveObjects();

    if (activeObject) {
      this.canvas.remove(activeObject);
      // this.textString = '';
    } else if (activeGroup) {
      this.canvas.discardActiveObject();
      const self = this;
      activeGroup.forEach((object) => {
        self.canvas.remove(object);
      });
    }
  }

  bringToFront() {
    const activeObject = this.canvas.getActiveObject();
    const activeGroup = this.canvas.getActiveObjects();

    if (activeObject) {
      activeObject.bringToFront();
      activeObject.opacity = 1;
    } else if (activeGroup) {
      this.canvas.discardActiveObject();
      activeGroup.forEach((object) => {
        object.bringToFront();
      });
    }
  }

  sendToBack() {
    const activeObject = this.canvas.getActiveObject();
    const activeGroup = this.canvas.getActiveObjects();

    if (activeObject) {
      this.canvas.sendToBack(activeObject);
      activeObject.sendToBack();
      activeObject.opacity = 1;
    } else if (activeGroup) {
      this.canvas.discardActiveObject();
      activeGroup.forEach((object) => {
        object.sendToBack();
      });
    }
  }

  confirmClear() {
    // if (confirm('Are you sure?')) {
    this.canvas.clear();

    this.state = [];
    this.mods = 0;
    // }
  }

  rasterize() {
    const image = new Image();
    image.src = this.canvas.toDataURL({ format: 'png' });
    const w = window.open('');
    w.document.write(image.outerHTML);
  }

  rasterizeSVG() {
    const w = window.open('');
    w.document.write(this.canvas.toSVG());
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(this.canvas.toSVG());
  }

  saveCanvasToJSON() {
    const json = JSON.stringify(this.canvas);
    localStorage.setItem('Kanvas', json);
    // console.log('json');
    // console.log(json);

  }

  loadCanvasFromJSON() {
    const CANVAS = localStorage.getItem('Kanvas');
   
    this.canvas.loadFromJSON(CANVAS, () => {
     
      this.canvas.renderAll();
    });

  }

  rasterizeJSON() {
    this.json = JSON.stringify(this.canvas, null, 2);
  }

  resetPanels() {
    this.textEditor = false;
    this.imageEditor = false;
    this.figureEditor = false;
  }

}

