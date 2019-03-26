var Button = document.querySelector('button'); //sameas getElement but returns the element even when theyre not in the page and with slightly more info, also slightly slower
var evt = new MouseEvent("window", {"bubbles":true, "cancelable":false}); //required on mozilla
var imagem = document.getElementById("image1");
var centroimg = getCoords(imagem);
var X1,Y1,FX1,FY1,currentangle,oldangle,oldtime,newtime,vel,angle,multaccel;
var rotateflag = 0;
var velrotateflag = 0;
document.dispatchEvent(evt);
setInterval(runningevents, 1) //runs functions every 1 ms setInterval(function,time,arg1,arg2,...)
imagem.ondragstart = function() { return false; }; //makes imagebox not drageable
function getCoords(elem) 
{
  let box = elem.getBoundingClientRect();
  return { //returns object, use . to get
    Y: box.top + pageYOffset + 250,
    X: box.left + pageXOffset + 250 // 250 half of image height
  };
}
function runningevents()
{
  var time = Date.now()
  var st = window.getComputedStyle(imagem, null); //get CSS info
  var tr = st.getPropertyValue("transform"); //get CSS info from transform
  var values = tr.split('(')[1].split(')')[0].split(',');
  var a = values[0];
  var b = values[1];
  var copyangle =(Math.atan2(b, a) * (180/Math.PI));
  setTimeout(function(){setoldtime(copyangle, time); },50); //same as setInterval, but runs only once, you can also make a pseudo function like here, so you can put the args inside
  var print1 = "Oldangle = " + oldangle + ", New angle = " + copyangle + ", oldtime:" + oldtime + ", newtime:" + Date.now();
  document.getElementById("pos").innerHTML = print1;
}
function setoldtime(anglee,time)
{
  oldtime = time;
  oldangle = anglee;
};
function setnewtime()
{
  var st = window.getComputedStyle(imagem, null);
  var tr = st.getPropertyValue("transform");
  var values = tr.split('(')[1].split(')')[0].split(',');
  var a = values[0];
  var b = values[1];
  var currentangle =(Math.atan2(b, a) * (180/Math.PI));
  if (currentangle < -120 && oldangle > 120)
  {
    var angle1 = 180 - Math.abs(currentangle);
    var angle2 = 180 - oldangle;
    angle2 = angle1 + angle2;
  }
  else if (currentangle > 120 && oldangle < -120)
  {
    var angle1 = 180 - Math.abs(oldangle);
    var angle2 = 180 - currentangle;
    angle2 = -(angle1 + angle2);
  }
  else
  {
    var angle1 = currentangle;
    var angle2 = oldangle;
    angle2 = angle1 - angle2;
  }
  newtime = Date.now();
  newtime = newtime-oldtime;
  vel = angle2/newtime;
  vel = vel * 5;
  if(vel > 15)
  {vel=15;}
  if(vel <-15)
  {vel = -15;}
  var print = "vel= " + vel + ", time= " + newtime;
  document.getElementById("vel").innerHTML = print;
  velrotateflag = 1;
  multaccel =0.92;
  requestAnimationFrame(velrotate);//runs the function and forces screen update, makes thing smooth; remember that the function must call itself after
}
function velrotate()
{
  if (velrotateflag == 1)
  {
    var angle2 =  5 * vel;
    vel = (vel * multaccel)
    if (multaccel > 0.5)
    {
      multaccel = multaccel + 0.0005;
    }
    if (multaccel >=0.97)
    {multaccel = multaccel - 0.0005 }
    if (vel < 0.1 && vel > -0.1)
    {vel = 0;}
    var st = window.getComputedStyle(imagem, null);
    var tr = st.getPropertyValue("transform")
    var values = tr.split('(')[1].split(')')[0].split(',');
    var a = values[0];
    var b = values[1];
    currentangle =(Math.atan2(b, a) * (180/Math.PI));
    angle2 = angle2 + currentangle;
    if (angle2 < 0)
      {
          angle2 = angle2 + 360;
      }
    imagem.style.transform = "rotate("+angle2+"deg)";//set CSS
    requestAnimationFrame(velrotate);
  }
}
function actloop(evt) //html can call functions with events on every platform
{
    var cord,dist;
    X1= evt.pageX; //pos based on page, so equal in all clients
    Y1= evt.pageY;
    dist = Math.sqrt(Math.pow(X1 - centroimg.X , 2) + Math.pow(Y1 - centroimg.Y, 2));
    cord = "X:" + X1 + ", Y: " + Y1 + ", dist centro: " + dist;
    document.getElementById("demo").innerHTML = cord //edit the p text
    if ((dist > 220) && (rotateflag == 1))
    {
      rotateflag = 0;
      setnewtime();
    }
    if (rotateflag == 1)
    {
      angle = Math.atan2(FY1 - centroimg.Y , FX1-centroimg.X) - Math.atan2(Y1 - centroimg.Y, X1 - centroimg.X);
      angle = (angle * 360 / (2*Math.PI)) * -1;
      if (angle < 0)
      {
          angle = angle + 360;
      }
      angle = angle + currentangle;
      imagem.style.transform = "rotate("+angle+"deg)";
    }
};
imagem.onmousedown = function()
{
  FX1 = X1;
  FY1 = Y1;
  rotateflag = 1;
  vel = 0;
  velrotateflag = 0;
  var st = window.getComputedStyle(imagem, null);
  var tr = st.getPropertyValue("transform")
  var values = tr.split('(')[1].split(')')[0].split(',');
  var a = values[0];
  var b = values[1];
  currentangle =(Math.atan2(b, a) * (180/Math.PI));
}
document.getElementById("page").onmouseup = function()
{
  if (rotateflag == 1)
  {
    rotateflag = 0;
    setnewtime();
  }
};
Button.onclick = function() 
{
  if (document.getElementById("page").style.backgroundColor == "grey")
  {
    document.getElementById("page").style.backgroundColor = "lightblue"
  }
  else
  {
    if (document.getElementById("page").style.backgroundColor == "lightblue")
    {
      document.getElementById("page").style.backgroundColor = "red"
    }
    else
    {
      document.getElementById("page").style.backgroundColor = "grey"
    }
  }
}