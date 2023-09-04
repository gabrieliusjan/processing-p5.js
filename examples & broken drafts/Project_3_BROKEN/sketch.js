let canvas;
let dMouse = [];
let closest = 0;
let isEditMode = false;

let shapes = [[]];
let shapeIndex = 0;

//let glow;

/*
let sample2DArray = [[0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0]]
*/

function setup() {
  canvas = createCanvas(640, 480);
  canvas.id('canvas');

  colorMode(HSB);
}

function draw(){
  clear();
  if(detections != undefined){
    if(detections.multiFaceLandmarks != undefined && detections.multiFaceLandmarks.length >= 1){
      drawShapes();
      if(isEditMode == true) faceMesh();
      glow();
    }
  }
}

faceMesh = function(){
  stroke(255);
  strokeWeight(3);
  // displays face detection landmarks
  beginShape(POINTS);
  for(let i=0; i<detections.multiFaceLandmarks[0].length; i++){
    let x = detections.multiFaceLandmarks[0][i].x * p.width;
    let y = detections.multiFaceLandmarks[0][i].y * p.height;
    vertex(x, y);

    let d = dist(x, y, mouseX, mouseY);
    dMouse.push(d);
  }
  endShape();
  
  let minimum = min(dMouse);
  closest = dMouse.indexOf(minimum);

  stroke(0, 100, 100);
  strokeWeight(10);
  point(
    detections.multiFaceLandmarks[0][closest].x * p.width,
    detections.multiFaceLandmarks[0][closest].y * p.height
  );

  dMouse.splice(0, dMouse.length);
}
// if edit mode is enabled starts drawing shapes, logs it on the console as well
mouseClicked = function(){
  if(isEditMode == true) shapes[shapeIndex].push(closest);
  console.log(shapes);
}
// draws shapes on face in edit mode
drawShapes = function(){
  for(let s = 0; s < shapes.length; s++){
    if(s == shapeIndex) fill(0, 0, 50);
    else p.fill(0, 0, 0);
    stroke(0, 0, 100);
    strokeWeight(3);

    beginShape();
      for(let i = 0; i < shapes[s].length; i++){
        vertex(
          detections.multiFaceLandmarks[0][shapes[s][i]].x * p.width,
          detections.multiFaceLandmarks[0][shapes[s][i]].y * p.height,
        );
      }
    endShape();
  }
}

keyTyped = function(){
  // enable edit mode
  if(key === 'e') isEditMode = !isEditMode;
  // complete shapes button
  if(key === 'c'){
    if(shapes[shapes.length-1].length > 0){
      shapes.push([]);
      shapeIndex = shapes.length-1;
    }
    console.log(shapes);
  }
  // undo shapes button
  if(key === 'z'){
    if(shapes[shapeIndex] != undefined){
      if(shapes[shapeIndex].length > 0) shapes[shapeIndex].pop();
    }
    console.log(shapes[shapeIndex]);
  }
  // delete shapes button
  if(key === 'd'){
    shapes = [[]];
    shapeIndex = 0;
    console.log(shapes);
  }
}
// cycle trough shapes in edit mode
keyPressed = function(){
  if(keyCode === UP_ARROW){
    if(shapes[shapeIndex] != undefined){
      if(shapes[shapeIndex].length == 0 && shapes.length > 1) shapes.splice(shapeIndex, 1);
      if(shapeIndex < shapes.length-1) shapeIndex++;
    }
  } else if(p.keyCode === DOWN_ARROW){
    if(shapes[shapeIndex] != undefined){
      if(shapes[shapeIndex].length == 0 && shapes.length > 1) shapes.splice(shapeIndex, 1);
      if(shapeIndex > 0) shapeIndex--;
    }
  }
  console.log(shapeIndex);
}

glow = function(){
  drawingContext.shadowOffsetX = 0;
  drawingContext.shadowOffsetY = 0;
  drawingContext.shadowBlur = 30;
  drawingContext.shadowColor = 'rgba(255, 255, 255, 100)';
}
