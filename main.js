var Animation = function(canvasId) {
  this.canvas = document.getElementById(canvasId);
  this.context = this.canvas.getContext("2d");
  this.t = 0;
  this.timeInterval = 0;
  this.startTime = 0;
  this.lastTime = 0;
  this.frame = 0;
  this.animating = false;
  
  // by Paul Irish
  window.requestAnimFrame = (function(callback){
    return window.requestAnimationFrame || 
      window.webkitRequestAnimationFrame ||
      function(callback){
      window.setTimeout(callback, 1000 / 60);
    };
  })();
};

Animation.prototype.getContext = function getContext(){
  return this.context;
};

Animation.prototype.getCanvas = function(){
  return this.canvas;
};

Animation.prototype.clear = function(){
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

Animation.prototype.setStage = function(func){
  this.stage = func;
};

Animation.prototype.isAnimating = function(){
  return this.animating;
};

Animation.prototype.getFrame = function(){
  return this.frame;
};

Animation.prototype.start = function(){
  this.animating = true;
  var date = new Date();
  this.startTime = date.getTime();
  this.lastTime = this.startTime;
  
  if (this.stage !== undefined){
    this.stage();
  }
  
  this.animationLoop();
};

Animation.prototype.stop = function(){
  this.animating = false;
};

Animation.prototype.getTimeInterval = function(){
  return this.timeInterval;
};

Animation.prototype.getTime = function(){
  return this.t;
};

Animation.prototype.getFps = function(){
  return this.timeInterval > 0 ? 1000 / this.timeInterval : 0;
};

Animation.prototype.animationLoop = function(){
  var that = this;
  
  this.frame++;
  var date = new Date();
  var thisTime = date.getTime();
  this.timeInterval = thisTime - this.lastTime;
  this.t += this.timeInterval;
  this.lastTime = thisTime;
  
  if (this.stage !== undefined){
    this.stage();
  }
  
  if (this.animating){
    window.requestAnimFrame(function(){
      that.animationLoop();
    });
  }
  
};

window.onload = function (){

  var endPointX = 0;
  var endPointY = 0;



  // instantiate new Animation object
  var anim = new Animation("myCanvas");
  var context = anim.getContext();
  var canvas = anim.getCanvas();
  
  // var amplitude = (Math.PI / 4); // 45 degrees
  var v1 = 0.0;
  var v2 = 0.0;
  var m1 = 40;
  var m2 = 40;
  var t1 = (Math.PI / 2);
  var t2 = (Math.PI / 4);
  var pendulumLength = 200;
  var pendulumWidth = 10;
  var rotationPointX = canvas.width/2;
  var rotationPointY = 20;
  var g = 9.8;
  var time   = 0.15;
  var dt1 = 0;
  var dt2 = 0;
  var l1 = 200;
  var l2 = 200;

  
  var endpointvalue = function(){
    this.theta1;
    this.theta2; 
  }

  var gamerestore = function(endpointvalue){
    gameboolean.restoreboolean = true;

    endpoint.theta1 = endpointvalue[0];
    endpoint.theta2 = endpointvalue[1];
    console.log("----------"+endpoint.theta1 );
  }
  var gameboolean = {
    restoreboolean: 'false'
// var restore
  };

  var endpoint = {
    theta1:'',
    theta2:''
  };
  var endpointvalue = new endpointvalue();
  anim.setStage(function(){
    //update
    if(gameboolean.restoreboolean==true){
      t1 = endpoint.theta1;
      t2= endpoint.theta2;
      console.log("----here----");
      gameboolean.restoreboolean=false;
    }


    var mu    =  1+ (m1/m2);
    var d2t1  =  (g*(Math.sin(t2)*Math.cos(t1-t2)-mu*Math.sin(t1))-(l2*dt2*dt2+l1*dt1*dt1*Math.cos(t1-t2))*Math.sin(t1-t2))/(l1*(mu-Math.cos(t1-t2)*Math.cos(t1-t2)));
    var d2t2  =  (mu*g*(Math.sin(t1)*Math.cos(t1-t2)-Math.sin(t2))+(mu*l1*dt1*dt1+l2*dt2*dt2*Math.cos(t1-t2))*Math.sin(t1-t2))/(l2*(mu-Math.cos(t1-t2)*Math.cos(t1-t2)));
    dt1 += d2t1*time;
    dt2 += d2t2*time;
    t1  += dt1*time;
    t2  += dt2*time;
    endpointvalue.theta1 = t1;
    endpointvalue.theta2 = t2;
    
    //clear
    this.clear();
    
    //draw top circle

    
    //draw shaft
    context.beginPath(); 
    endPointX = rotationPointX + (pendulumLength * Math.sin(t1));
    endPointY = rotationPointY + (pendulumLength * Math.cos(t1));
 
    context.beginPath();
    context.moveTo(rotationPointX, rotationPointY);
    context.lineTo(endPointX, endPointY);
    context.lineWidth = pendulumWidth;
    context.strokeStyle = "yellow";
    context.stroke();

    context.beginPath();
    context.arc(rotationPointX, rotationPointY, 15, 0, 2 * Math.PI, false);
    context.fillStyle = "blue";
    context.fill();
  
    
    context.beginPath();
    var endPointX1 =  endPointX + (pendulumLength * Math.sin(t2));
    var endPointY1 =  endPointY + (pendulumLength * Math.cos(t2));
    context.beginPath();
    context.moveTo(endPointX, endPointY);
    context.lineTo(endPointX1, endPointY1);
    context.lineWidth = pendulumWidth;
    context.strokeStyle = "yellow";
    context.stroke();

    //draw bottom circle
    context.beginPath();
    context.arc(endPointX, endPointY, m1, 0, 2 * Math.PI, false);
    context.fill();
    
    //draw bottom circle
    context.beginPath();
    context.arc(endPointX1, endPointY1, m2, 0, 2 * Math.PI, false);
    context.fill();
    
    
  });
  anim.start();

  var socket = io.connect("http://24.16.255.56:8888");

  socket.on("load", function (data) {
      console.log(data);
  });

  var text = document.getElementById("text");
  var saveButton = document.getElementById("save");
  var loadButton = document.getElementById("load");

  saveButton.onclick = function () {
    console.log("save");
    text.innerHTML = "Saved."
    
    var arr1 = [endpointvalue.theta1, endpointvalue.theta2];
    var endpoints = arr1;
    arr1 = [];
    socket.emit("save", { studentname: "Aashish Kumar", statename: "Double Pendulum", data: "Goodbye World", endpoints:endpoints });
  };

  loadButton.onclick = function () {
    console.log("load");
    text.innerHTML = "Loaded."
    socket.emit("load", { studentname: "Aashish Kumar", statename: "Double Pendulum" });
    socket.on("load", function(data){
    gamerestore(data.endpoints);

      console.log(data.endpoints[0]);
    });
  };

};