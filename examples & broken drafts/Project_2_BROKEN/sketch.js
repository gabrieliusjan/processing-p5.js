//P5.JS
let sketch = function(p) {
  let canvas;
  p.setup = function() {
    canvas = createCanvas(426, 240);
    canvas.id('canvas');
  }
  p.draw = function() {
    p.clear();
    if(detections != undefined) {
      if(detections.multiFaceLandmarks != undefined && detections.multiFaceLandmarks.length >= 1) {
        p.faceMesh();
      }
    }
  }
  p.faceMesh = function() {
    p.stroke(255);
    p.strokeWeight(3);
    
    p.beginShape(p.POINTS);
    for(let i=0; i<detections.multiFaceLandmarks[0].length; i++){
      let x = detections.multiFaceLandmarks[0][i].x * p.width;
      let y = detections.multiFaceLandmarks[0][i].y * p.heidth;
      p.vertex(x, y);
    }
    p.endShape();
  }
}

let myp5 = new p5(sketch);