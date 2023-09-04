let sketch = function(p){
  let canvas;
  let dMouse = [];
  let closest = 0;
  let isEditMode = false;

  let fill_H_Slider, fill_S_Slider, fill_B_Slider, fill_O_Slider;
  let fill_H_Value, fill_S_Value, fill_B_Value, fill_O_Value;
  let stroke_H_Slider, stroke_S_Slider, stroke_B_Slider, stroke_O_Slider;
  let stroke_H_Value, stroke_S_Value, stroke_B_Value, stroke_O_Value;

  let shapes = [{
    fill_H : 360,
    fill_S : 0,
    fill_B : 100,
    fill_O : 100,
    stroke_H : 0,
    stroke_S : 0,
    stroke_B : 0,
    stroke_O : 0,
    indices : []
  }];

  let shapeIndex = 0;

  let tParameters;

  let capture;

  p.setup = function(){
    canvas = p.createCanvas(640, 480);
    canvas.id('canvas');
    p.colorMode(p.HSB, 360, 100, 100, 100);

    fill_H_Value = p.createDiv();
    fill_H_Value.class('valueDisplay');
    fill_H_Slider = p.createSlider(0, 360, 0, 10);
    fill_H_Slider.class('Slider');

    fill_S_Value = p.createDiv();
    fill_S_Value.class('valueDisplay');
    fill_S_Slider = p.createSlider(0, 100, 0, 10);
    fill_S_Slider.class('Slider');

    fill_B_Value = p.createDiv();
    fill_B_Value.class('valueDisplay');
    fill_B_Slider = p.createSlider(0, 100, 100, 10);
    fill_B_Slider.class('Slider');

    fill_O_Value = p.createDiv();
    fill_O_Value.class('valueDisplay');
    fill_O_Slider = p.createSlider(0, 100, 100, 10);
    fill_O_Slider.class('Slider');

    stroke_H_Value = p.createDiv();
    stroke_H_Value.class('valueDisplay');
    stroke_H_Slider = p.createSlider(0, 360, 0, 10);
    stroke_H_Slider.class('Slider');

    stroke_S_Value = p.createDiv();
    stroke_S_Value.class('valueDisplay');
    stroke_S_Slider = p.createSlider(0, 100, 0, 10);
    stroke_S_Slider.class('Slider');

    stroke_B_Value = p.createDiv();
    stroke_B_Value.class('valueDisplay');
    stroke_B_Slider = p.createSlider(0, 100, 0, 10);
    stroke_B_Slider.class('Slider');

    stroke_O_Value = p.createDiv();
    stroke_O_Value.class('valueDisplay');
    stroke_O_Slider = p.createSlider(0, 100, 0, 10);
    stroke_O_Slider.class('Slider');

/*     e_button = p.createDiv();
    e_button.class('valueDisplay');
    e_button_value = p.text("e: button is to edit ");
    e_button_value.class('Slider'); */

    tParameters = {
      fill_H : fill_H_Slider.value(),
      fill_S : fill_S_Slider.value(),
      fill_B : fill_B_Slider.value(),
      fill_O : fill_O_Slider.value(),
      stroke_H : stroke_H_Slider.value(),
      stroke_S : stroke_S_Slider.value(),
      stroke_B : stroke_B_Slider.value(),
      stroke_O : stroke_O_Slider.value()
    }

    capture = p.createCapture(p.VIDEO);
    capture.size(p.width, p.height);
    capture.hide();
  }

  p.draw = function(){
    p.clear();
    if(detections != undefined){
      if(detections.multiFaceLandmarks != undefined && detections.multiFaceLandmarks.length >= 1){
        p.drawShapes();
        if(isEditMode == true){
          p.faceMesh();
          p.editShapes();
        }
        p.glow();
      }
    }

    fill_H_Value.html("Fill Hue: " + fill_H_Slider.value());
    fill_S_Value.html("Fill Saturation: " + fill_S_Slider.value());
    fill_B_Value.html("Fill Brightness: " + fill_B_Slider.value());
    fill_O_Value.html("Fill Opacity: " + fill_O_Slider.value());

    stroke_H_Value.html("Stroke Hue: " + stroke_H_Slider.value());
    stroke_S_Value.html("Stroke Saturation: " + stroke_S_Slider.value());
    stroke_B_Value.html("Stroke Brightness: " + stroke_B_Slider.value());
    stroke_O_Value.html("Stroke Opacity: " + stroke_O_Slider.value());

    e_button.html("e: button is to edit ");
    c_button.html("c: button is to complete shape ");
    z_button.html("z: button is to undo ");
    d_button.html("d: button is to delete ");
    s_button.html("s: button is to save screenshot ");
    up_button.html("up: button is to swap upwards between shapes ");
    down_button.html("down: button is swap downwards between shapes ");
/* 
    p.textSize(20);
    p.textAlign(RIGHT);
    p.text("Buttons:", width / 2, height / 2); */
  }

  p.faceMesh = function(){
    p.stroke(255);
    p.strokeWeight(3);

    p.beginShape(p.POINTS);
    for(let i=0; i<detections.multiFaceLandmarks[0].length; i++){
      let x = detections.multiFaceLandmarks[0][i].x * p.width;
      let y = detections.multiFaceLandmarks[0][i].y * p.height;
      p.vertex(x, y);

      let d = p.dist(x, y, p.mouseX, p.mouseY);
      dMouse.push(d);
    }
    p.endShape();

    let minimum = p.min(dMouse);
    closest = dMouse.indexOf(minimum);

    p.stroke(0, 100, 100);
    p.strokeWeight(10);
    p.point(
      detections.multiFaceLandmarks[0][closest].x * p.width,
      detections.multiFaceLandmarks[0][closest].y * p.height
    );

    dMouse.splice(0, dMouse.length);
  }

  p.mouseClicked = function(){
    if(p.mouseX >= 0 && p.mouseX <= p.width){
      if(p.mouseY >= 0 && p.mouseY <= p.height){
        if(isEditMode == true){
          shapes[shapeIndex].indices.push(closest);
          console.log(shapes);
        }
      }
    }
  }

  p.drawShapes = function(){
    for(let s = 0; s < shapes.length; s++){
      p.fill(
        shapes[s].fill_H,
        shapes[s].fill_S,
        shapes[s].fill_B,
        shapes[s].fill_O
      );
      p.stroke(
        shapes[s].stroke_H,
        shapes[s].stroke_S,
        shapes[s].stroke_B,
        shapes[s].stroke_O
      );
      p.strokeWeight(3);

      if(isEditMode == true){
        if(s == shapeIndex) 
        p.glow('rgba(255, 255, 255, 100)');
        else p.glow('rgba(255, 255, 255, 0)');
      }else if(isEditMode == false){
        p.glow('rgba(255, 255, 255, 100)');
      }

      p.beginShape();
        for(let i = 0; i < shapes[s].indices.length; i++){
          p.vertex(
            detections.multiFaceLandmarks[0][shapes[s].indices[i]].x * p.width,
            detections.multiFaceLandmarks[0][shapes[s].indices[i]].y * p.height,
          );
        }
      p.endShape();
    }
  }

  p.editShapes = function(){
    // --- fill ---
    if(tParameters.fill_H != fill_H_Slider.value()){
      tParameters.fill_H = fill_H_Slider.value();
      shapes[shapeIndex].fill_H = fill_H_Slider.value();
    }
    if(tParameters.fill_S!= fill_S_Slider.value()){
      tParameters.fill_S = fill_S_Slider.value();
      shapes[shapeIndex].fill_S = fill_S_Slider.value();
    }
    if(tParameters.fill_B != fill_B_Slider.value()){
      tParameters.fill_B = fill_B_Slider.value();
      shapes[shapeIndex].fill_B = fill_B_Slider.value();
    }
    if(tParameters.fill_O != fill_O_Slider.value()){
      tParameters.fill_O = fill_O_Slider.value();
      shapes[shapeIndex].fill_O = fill_O_Slider.value();
    }

    // --- stroke ---
    if(tParameters.stroke_H != stroke_H_Slider.value()){
      tParameters.stroke_H = stroke_H_Slider.value();
      shapes[shapeIndex].stroke_H = stroke_H_Slider.value();
    }
    if(tParameters.stroke_S != stroke_S_Slider.value()){
      tParameters.stroke_S = stroke_S_Slider.value();
      shapes[shapeIndex].stroke_S = stroke_S_Slider.value();
    }
    if(tParameters.stroke_B != stroke_B_Slider.value()){
      tParameters.stroke_B = stroke_B_Slider.value();
      shapes[shapeIndex].stroke_B = stroke_B_Slider.value();
    }
    if(tParameters.stroke_O != stroke_O_Slider.value()){
      tParameters.stroke_O = stroke_O_Slider.value();
      shapes[shapeIndex].stroke_O = stroke_O_Slider.value();
    }
  }

  p.keyTyped = function(){
    if(p.key === 'e') isEditMode = !isEditMode;

    if(p.key === 'c'){
      if(shapes[shapes.length-1].indices.length > 0){
        shapes.push(
          {
            fill_H : 0,
            fill_S : 0,
            fill_B : 100,
            fill_O : 100,
            stroke_H : 0,
            stroke_S : 0,
            stroke_B : 0,
            stroke_O : 0,
            indices : []
          }
        );
        shapeIndex = shapes.length-1;
      }
      console.log(shapes);
    }

    if(p.key === 'z'){
      if(shapes[shapeIndex] != undefined){
        if(shapes[shapeIndex].indices.length > 0) shapes[shapeIndex].indices.pop();
      }
      console.log(shapes[shapeIndex].indices);
    }

    if(p.key === 'd'){
      shapes = [
        {
          fill_H : 0,
          fill_S : 0,
          fill_B : 100,
          fill_O : 100,
          stroke_H : 0,
          stroke_S : 0,
          stroke_B : 0,
          stroke_O : 0,
          indices : []
        }
      ];
      shapeIndex = 0;
      console.log(shapes);
    }

    if(p.key === 's'){
      p.image(capture.get(0, 0, p.width, p.height), 0, 0, p.width, p.height);
      p.drawShapes();
      p.glow();
      p.saveCanvas('screenshot', 'png');
    }
  }

  p.keyPressed = function(){
    if(p.keyCode === p.UP_ARROW){
      if(shapes[shapeIndex] != undefined){
        if(shapes[shapeIndex].indices.length == 0 && shapes.length > 1) shapes.splice(shapeIndex, 1);
        if(shapeIndex < shapes.length-1) shapeIndex++;
      }
    } else if(p.keyCode === p.DOWN_ARROW){
      if(shapes[shapeIndex] != undefined){
        if(shapes[shapeIndex].indices.length == 0 && shapes.length > 1) shapes.splice(shapeIndex, 1);
        if(shapeIndex > 0) shapeIndex--;
      }
    }
    console.log(shapeIndex);
  }

  p.glow = function(glowColor){
    p.drawingContext.shadowOffsetX = 0;
    p.drawingContext.shadowOffsetY = 0;
    p.drawingContext.shadowBlur = 30;
    p.drawingContext.shadowColor = glowColor;
  }
}

let myp5 = new p5(sketch);
