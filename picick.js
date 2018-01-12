var //The ID to Be Used for the Canvas Element//
    //Usually doesn't need to be changed//
    canvasID="pCanvas",
    wrapperID=canvasID+"Wrapper";

    //Canvas Resolution (canvasResH,canvasResV)//
    //Directly Affects DataURL Length/File Size//
    canvasResH=500,
    canvasResV=500,
    
    //Automatically Starts picick and Creates Canvas when the page Loads//
    //If set to False, loadpicick() must be called to do Load the Canvas and Selector//
    loadOnPageLoad=true, 
    
    //If you would Rather Use a Colored Internal Shadow than//
    //a Colored Border Indicator, Change these to your liking and set//
    //"internalShadowIndicator=true"//
    filledShadowColor="rgba(148,255,112,1)",
    unfilledShadowColor="rgba(255,79,79,1)",
    internalShadowIndicator=false,
    
    initialBorderColor="rgba(255,255,255,0.5)",
    borderIndicator=true,
    
    //Set the Border to Specified Colors on Checking whether canvas is filled or not// 
    filledBorderColor=filledShadowColor,
    unfilledBorderColor=unfilledShadowColor,
    
    //If set to true, picSet(dataUrl) will not fire unless
    //the Canvas is Filled with the User's Image//
    filledCanvasRequirement=false,
    
    //Changes the Scroll Amount for MouseWheel Events//
    zoomScrollPercentage=2.5,
    //Changes the Scroll Amount for Zoom Buttons//
    zoomButtonPercentage=5,
    //Changes The Scroll Amount for Touch Devices//
    zoomTouchPercentage=2,
    
    //If Your Getting Jumbled Text, You Can Either Change Your Page Encoding to UTF8
    //Or you can change the Text of the Buttons Here//
    zoomInButtonText="+",
    zoomOutButtonText="–",

    defaultImg=grayguy(),//URL Or Data-URLS are Acceptable//
   
    //Refresh Rate of Canvas Frames per Second//
    fps=40,

    //Size of Canvas in Pixels (NOT Resolution of Output)//
    //Best to Have this relative to the Wrapper//
    width='80%',
    height='80%';

function getStyling(){
 var st='<style type="text/css">';
 //EDITABLE CSS//
 st+="button, input,label, #fileWrapper{";
   st+="user-select:none;";
   st+="border-radius:10px;";
   st+="border-width:0;";
   st+="background-color:lightgrey;";
   st+="display:inline-block;";
   st+="cursor:pointer;";
 st+="}";
 st+="input, textarea, select, button {font-size:100%;}";

 st+="#"+canvasID+"{overflow: hidden;";
   st+="margin:auto;";
   st+="display:block;";
   st+="border-width:2px;";
   st+="border-color:"+initialBorderColor+";";
   st+="border-style:solid;";
   st+="border-radius:50%;";
   st+="width:"+width+";";
   st+="height:"+height+";";
   st+="background:none;";
 st+="position: relative;}";

 st+="#"+wrapperID+"{";
   st+="width:20vw;";
   st+="height:20vw;";
   st+="max-width:30vw;";
   st+="max-height:33vw;";
   st+="margin:auto;";
   st+="margin-top:30vh;";
   st+="display:table;";
   st+="background-color:rgba(0,0,0,0.2);";
   st+="padding:50px;";
   st+="border-style:solid;";
   st+="font-size:1.2em;";
   st+="border-width:2px;";
   st+="border-color:white;";
   st+="border-radius:20px;";
   st+="text-align: center;";
   st+="position:relative;";
 st+="}";

 st+="#imgUpload{";
   st+="float:left;";
   st+="width:1px;";
   st+="height:1px;";
   st+="opacity:0.001;";
   st+="overflow:hidden;";
 st+="}";

 


 st+="#fileWrapper{";
   st+="position:relative;";
   st+="min-height:50%;";
   st+="padding:2;";
   st+="padding-right:10%;";
   st+="padding-left:10%;";
   st+="display:inline-block;";
 st+="}";

 st+="#noscriptImg{";
   st+="max-height:100%;";
   st+="position: absolute;";
   st+="left:50%;";
   st+="top:50%;";
   st+="transform: translate(-50%,-50%);";
 st+="}";

 st+="#buttonRow{";
   st+="position: absolute;";
   st+="left:0;";
   st+="height:9%;";
   st+="width:100%;";
   st+="margin-top:5%;";
   st+="white-space: nowrap;";
 st+="}";

 st+="#zoomButtons{";
   st+="right:10%;";
   st+="position:absolute;";
   st+="bottom:124%;";
 st+="}";
 
 st+="#zoomOutButton{";
   st+="margin-left:15%;";
 st+="}";

 st+="#fileSelectText{";
   st+="display:inline-block;";
   st+="min-width: 30%;";

   
 st+="}";

 st+="#setButton{";
   st+="min-width:20%;";
   st+="padding-right:5%;";
   st+="padding-left:5%;";
   st+="display:inline-block;";
   st+="font:inherit;";
   st+="margin-left:3%;";

 st+="}";

 st+="#setButtonText{";
   st+="display:inline-block;";
 st+="}";


//DO NOT EDIT//
 st+="#fileSelectLabel{";
   st+="background:none;";
   st+="float:left;";
   st+="font:400 1px;";
   st+="opacity:0.001;";
   st+="margin-left:-50%;";
   st+="width:200%;";
   st+="height:200%;";
   st+="position:absolute;";
   st+="left:0;";
   st+="top:0;";
 st+="}";

st+="</style>";
return st;}

var c,
    canvasContainer,
    consoleReadout=false,
    fadeInOpacity=0,
    context,
    refreshLoop,
    rect,
    initialpadding=0,
    max,
    maxh,
    dwidth,
    dheight,
    dX,dY,
    dragging,
    draggingOffsetX,draggingOffsetY,
    img,
    fpsmS,
    drawRing,
    toZoom,
    pauseLoop,
    fin1x,fing1y,fing2x,fing2y,
    touchScreen,
    imgtoBottom,
    draggable,
    loopStarted=false,
    selectorLoaded=true,
    LOOP_PAUSED=728733,
    rect;

function setVars(){
     c=document.getElementById(canvasID);
     canvasContainer=c.parentNode;
     c.width=canvasResH;
     c.height=canvasResV;
     maxw=c.width;
     maxh=c.height;
     rect=c.getBoundingClientRect();
}
   


function writeHTML(){
var html=getStyling()+"";

html=html+"<div id='"+wrapperID+"'>";
html=html+"<canvas id='"+canvasID+"'>";
html=html+"<img id='noscriptImg'/>";
html=html+"</canvas>";
html=html+"<noscript style='margin-top:20px;display:inline-block;'>";
html=html+"Unable to Edit Image because Javascript is Disabled or html5 Canvas is not supported.";
html=html+"</noscript>";


html=html+"<div id='buttonRow'>";

html=html+"<div id='zoomButtons'><button  type='button' id='zoomInButton' onclick='zoomIn(zoomButtonPercentage)'>";
html=html+zoomInButtonText;
html=html+"</button>";
html=html+"<button  type='button' id='zoomOutButton'  onclick='zoomOut(zoomButtonPercentage)'>";
html=html+zoomOutButtonText;
html=html+"</button></div>";

html=html+"<div id='fileWrapper'>";
html=html+"<text id='fileSelectText'>Select File</text>";
html=html+"<input id='imgUpload' type='file' name='imgUpload' onchange='readFile();' accept='image/*'>";
html=html+"<label id='fileSelectLabel' for='imgUpload' style=''>.</label>";
html=html+"</div>";



html=html+"<button id='setButton' type='button' onclick='setButtonPressed()'>";
html=html+"<text id='setButtonText'>";
html=html+"Set";
html=html+"</text>";
html=html+"</button>";

html=html+"</div>";
html=html+"</div>";

document.getElementById('picick').parentNode.innerHTML=(html);
}






function initSelector(){
 img=new Image();
 img.setAttribute('crossOrigin', 'anonymous');
  
  dwidth=0,dheight=0;
  dX=0,dY=0;
  dragging=false;
  draggingOffsetX=0,draggingOffsetY=0;
  
 
  fpsmS=1000/fps;
  drawRing=false;
  toZoom=0;
  pauseLoop=false;
  fing1x=0,fing1y=0,fing2x=0,fing2y=0;
  touchScreen=false;
  imgtoBottom=false;
  draggable=false;
 bindings();
}


function readFile(evt){
  //Called When File is Selected//
 var file=document.getElementById('imgUpload').files[0];
  if(file.type.includes("image")){
 var urlCreator = window.URL || window.webkitURL;
 var imageUrl = urlCreator.createObjectURL(file);
    setImage(loadImg(imageUrl));
    drawRing=true;
    draggable=true;
    borderIndicatorCheck();
    }else{exit(0);}
 }

//Start Bindings//
function bindings(){
 
 c.ontouchstart=function(e){
 if(pauseLoop){return LOOP_PAUSED;}
 clickedCanvas(e.touches[0]);
 };
  

 c.onmousedown = function(e){
 if(pauseLoop){return LOOP_PAUSED;}
 clickedCanvas(e);
 };
 
 canvasContainer.onwheel = function(e){
 e.preventDefault();
 };
 canvasContainer.ontouchmove = function(e){
 e.preventDefault();
 };
 c.onwheel = function(e){
  e.preventDefault();
  if(pauseLoop){return LOOP_PAUSED;}
    if(e.deltaY>0){
    zoomOut(zoomScrollPercentage);}
    else{zoomIn(zoomScrollPercentage);}
 }
 
 c.mouseover= function(e){
  if(pauseLoop){return LOOP_PAUSED;}
 }
 
 document.onmousemove = function(e){
 if(pauseLoop){return LOOP_PAUSED;}
  if(dragging){draggingImage(e);}
 };

 document.onmouseup = function(e){
 if(pauseLoop){return LOOP_PAUSED;}
 dragging=false;
 };

 c.ontouchmove = function(e){
 touchScreen=true;
 event.preventDefault();
 if(pauseLoop){return LOOP_PAUSED;}

 if((e.touches.length)==1){
 if(dragging){draggingImage(e.touches[0]);}}
 else{
 if(fing1x<e.touches[0].clientX
   &fing2x>e.touches[1].clientX){zoomIn(zoomTouchPercentage);}
 else if(e.touches[0].clientX<fing1x
   &e.touches[1].clientX>fing2x){zoomOut(zoomTouchPercentage);}

 fing1x=e.touches[0].clientX;
 fing1y=e.touches[0].clientY;
 fing2x=e.touches[1].clientX;
 fing2y=e.touches[1].clientY;

 }}

 document.ontouchend = function(e){
 dragging=false;
 };

 }
//End Bindings//

function zoomIn(percentage){
  if(drawRing){
	dwidth=dwidth*(1.0+(percentage*0.01));
  
	dheight=dheight*(1.0+(percentage*0.01));
  
  dX=dX-(dwidth*((percentage*0.01))/2);
 
  dY=dY-(dheight*((percentage*0.01))/2);
   
  if(filledCanvasRequirement&borderIndicator){
  borderIndicatorCheck();}

  }
 }
 
function zoomOut(percentage){
 if(drawRing){
 
 dwidth=dwidth*(1.0-(percentage*0.01));

 dheight=dheight*(1.0-(percentage*0.01));

 dX=dX+(dwidth*((percentage*0.01))/2);
  
 dY=dY+(dheight*((percentage*0.01))/2);

 if(filledCanvasRequirement&borderIndicator){
    borderIndicatorCheck();}}
 }

function clickedCanvas(mouse){
	var x = (mouse.clientX - rect.left)*(c.width/c.offsetWidth);
  var y = (mouse.clientY - rect.top)*(c.height/c.offsetHeight);
  if(x>=0&y>=0){
  if(x>=dX&y>=dY){
  if(x<=dX+dwidth&y<=dY+dheight||touchScreen){
   draggingOffsetX=x-dX;
   draggingOffsetY=y-dY;
   dragging=true;}}}
 }

function borderIndicatorCheck(){
  if(borderIndicator){
  if(circleFilled()){
    c.style.borderColor=filledBorderColor;return true;
    }else{
  c.style.borderColor=unfilledBorderColor;return false;}}
 return -1;}

function setButtonPressed(){
 pause();
 if(!filledCanvasRequirement|circleFilled()){
 context.clearRect(0, 0, c.width, c.height);
 context.drawImage(img, dX, dY,dwidth,dheight);
 var dataURL = c.toDataURL();
 picSet(dataURL);}
 else{notFilled();return false;}
 return true;}

function draggingImage(event){
 if(draggable){borderIndicatorCheck();
 rect=c.getBoundingClientRect();
 
 var x=(event.clientX-rect.left)*(c.width/c.offsetWidth);
 var y=(event.clientY-rect.top)*(c.height/c.offsetWidth);

 dX=x-draggingOffsetX;
 dY=y-draggingOffsetY;
 }}

function circleFilled(){
 if(dX<=0&dY<=0&dX+dwidth>=c.width&dY+dheight>=c.height){

 return 1;}
 return 0;}

function drawLoop(){
 context=c.getContext('2d');
 context.clearRect(0, 0, c.width, c.height);
 context.beginPath();
 context.shadowBlur=0;
 context.shadowColor='#000000';
 if(img!=null){
 context.drawImage(img, dX, dY,dwidth,dheight);}

 var radius=(dwidth/2);
 context.beginPath();
 context.arc(-(c.width*2), (c.height/2), (c.width/2), 0, 2 * Math.PI,false);

 context.lineWidth = 5;
 context.shadowBlur=30;
 context.shadowOffsetX=(c.width*2+(c.width/2));
 
 if(drawRing&internalShadowIndicator){
  if(circleFilled()){
 context.strokeStyle=filledShadowColor;
 context.shadowColor=filledShadowColor;}else{
 context.strokeStyle=unfilledShadowColor;
 context.shadowColor=unfilledShadowColor;}
 context.stroke();}
 }

function loadImg(path){
 img.src = path;
 return(img);}

function setImage(toUse){
 startLoop();

 img=toUse;

 img.onload= function(){
 	dX=0,dY=0;
 dwidth=(img.width);
 dheight=(img.height);
 draggingOffsetX=0,draggingOffsetY=0;
 if((dwidth-(maxw-initialpadding))>(dheight-(maxh-initialpadding))){
 dheight=dheight*((maxw-initialpadding)/dwidth);
 dwidth=(maxw-initialpadding);
 }else{
 dwidth=dwidth*((maxh-initialpadding)/dheight);
 dheight=(maxh-initialpadding);}

 if(dwidth<(maxw)){
 dX=((maxw)-dwidth)/2;}
 if(dheight<(maxh)){
 dY=((maxh)-dheight)/2;}
 
 if(imgtoBottom){dY=c.height-dheight;imgtoBottom=false;}
 resume();}
 }

function pause(){pauseLoop=true;}
function resume(){pauseLoop=false;}
function isPaused(){return pauseLoop;}


function setDefault(){
 if(consoleReadout){console.log("Setting Default Image...");}
 drawRing=false;
 imgtoBottom=true;
 setImage(loadImg(defaultImg));
 draggable=false;
 }

function touchZoomedIn(){}



function startLoop(){
 if(consoleReadout){console.log('Starting Loop...');}
 if(!loopStarted){
 refreshLoop=setInterval(function(){
 if(!isPaused()){drawLoop();}else{
  if(consoleReadout){console.log('Paused Loop.');}}
 },fpsmS);loopStarted=true;}
 }




window.onresize=function(){
  if(selectorLoaded){rect=c.getBoundingClientRect();}
};


window.onload=function(){
  if(loadOnPageLoad){
  loadpicick();}
 }

function loadpicick(){
  selectorLoaded=false;
  writeHTML();
  setVars();
  initSelector();
  setDefault();
  selectorLoaded=true;}

function picSet(){
  console.log("function picSet() must be declared after including picick src file.");
 }
function notFilled(){
  console.log("function notFilled() must be declared after including picick src file.");
}

function startingPic(){return -1;}

function grayguy(){
  return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAX10lEQVR4Xu2de3xdVZXH19rnpmketNCapNQqqFOmUHAUgmKbe889faVAsQpDlOHlCMpDPjo66AAqn6gzIyCCjIJURpBhpJgq0mkJBNqec+5Na8QII4IPOqhFxTatCJSEPO7daz6rXjRNk/bec1/nsfbn039692Pt79q/nHP2Y20ESUJACExJAIWNEBACUxMQgcjoEAIHISACkeEhBEQgMgaEgDcC8gTxxk1KRYSACCQijpZueiMgAvHGTUpFhIAIJCKOlm56IyAC8cZNSkWEgAgkIo6WbnojIALxxk1KRYSACCQijpZueiMgAvHGTUpFhIAIJCKOlm56IyAC8cZNSkWEgAgkIo6WbnojIALxxs1TqZ6engbDMFqmT5/enMlkmhBxEQDUAMCZAPCmPCodA4CvE9EIIj6rtf4JAOwZGRl5YeXKlS/kUV6yFEhABFIgsEKzb9iwoX7GjBltiNhGRG9lIRBRCyJOA4DDAcCrD14FgJeIaA8isjjSALANALabprm9UDsl/+QEvDpHeE5NAG3brs1ms2+MxWLnIeJZAHBcBYFlAOB7AHDvyy+/vGnVqlXDiKgr2H6omhKBlNCdruueQET8tHgvEZ2IiLNLWL2Xqn5ERA8BwMNNTU0/Xrhw4aiXSqJcRgRSAu/btj1PKXU1AJwBAE0AML0E1ZakCiLKIuJufv3SWt9hWdbDJak4IpWIQDw6uqury5g1a9ZbampqzgGASwFgjseqKl1sCxFdR0Rpy7KGK9140NoTgXjwmG3bhyPiBUqpDxPRQg9VVLvIH4joYcMw1sTj8R9W2xg/ty8CKdA76XT6GK31ZgCYV2BRP2bfAwBXmab5TT8a5webRCB5eqG7u7upvr7+AwBwOSIenWexoGTjWa+bEonEDxCRgmJ0JewUgeRBeevWrcdnMpmvAEAcAHj9ImyJRfFLAPiaaZq3hq1zxfRHBHIQemvWrKk59thj301ENwHAG4sBHaCy1yPiLYlE4g8BsrlspopApkCbTqeP0Fpfzu/oANBYNg/4r2JeaHwQET+USCR4ejjSSQQyhfsdx7kTEc8HgFjURkhu5f3nRPRR0zS3RK3/4/srApng/VQq1cTrBADwwSgPjFzf/w8RL00kEjxrF8kkAhnndt5tO3369FsA4ILcLttIDooJnX6OiK5IJpMboghDBJLzum3bjUqp2wHg3CgOhEP0mXcMvz+KTxIRCADkXqtuFnEcVCbbDcNItrW1PR+lPyAiEABwHOcORORFwMh9kBc42B8fHh4+tb29faDAcoHNHmmB9Pf31wwNDZ1FRGsD68EKG46IG0dHRy9etmzZrgo3XZXmoiwQdF2Xd+J+DQCOqAr9YDY6prX+d8uyOoNpfmFWR1Ygvb29b8xmsw8AwNsLQya5mYDW+lLLsr4BAKHeuxVJgfT19c0YGRm5PneOQ0a8NwLPKaU6wr5dPpICcRznGkTkVwSOKCLJGwF+ctw/d+7cc+fPnz/irQr/l4qcQDZv3vyOWCy2PkAnAP0+ii5MJBL3hHWbfOQE4jgOO5M/zg2/j7yA2LdXKRWPx+Mcoyt0KVICcRznZER8LHRerH6H7t61a9dFHR0d2eqbUloLIiOQVCp1JBFtBIATS4tQagOAnQBwoWmaj4SNRiQEQkSqt7f3s1rrSMzdV2mQPmia5qoqtV22ZiMhENu2j1ZK3S9rHmUbR/sq1lpblmU55W2lsrVHQiCu634EEW8iojCeJ6/siDl4az82DMNqa2vb6yejirEl9ALJLQr+DABeXwwoKZsXgVGl1HnxeHxdXrkDkCn0AkmlUu8hou8HwBehMJGI1jU2Nn6gtbV1KAwdCrVAOAKiUorPVMt+q8qN1t+NjY2Zy5Yt+1XlmixfS6EWiOM4yxGRg6IdVj6EUvMkBK4zTZODeQc+hVYgnZ2dKplMXoWIn5dV84qP0+3Dw8Nvb29vH6x4yyVuMLQC6e7untHQ0PAoALyjxMykuvwInG6aZnd+Wf2bK7QCcRwnjogp/6IPt2WI+ODOnTvP7ujo4KviAptCK5BUKvVVDlcTWM8E3/CnDMM4va2t7bkgdyWUAlm/fv1hM2fOfDKEUdiDNNb+mM1mz12yZElPkIyeaGsoBZJKpUwiCtWWhyAOMiK6JplMfjGItr9mc+gEQkQcjOGTiMhHaiVVl0C3aZqnV9eE4loPnUD6+/vrX3nllQcQcXlxaKR0sQQQ8Wf19fUnB3lVPXQC2bRpU0ssFmOBnFKsg6V88QQMwzi+ra3t6eJrqk4NoROI67q8rYTD+UTlwpvqjJw8W0XE2xOJxGV5ZvddttAJxLbtlUqpbwPALN/RjqBBiHhPIpHgaPmBTKETiOu6HwaANYH0RjiN3j06Ojp/+fLlLwWxe6ETiOM4n83tvwqiP0Jps9a6ybIsvnI6cCl0AnFdl29DWhI4T4TY4Gw2u2DJkiV8i27gUugE4jjOZkQUgfhoKOZW1O/1kUl5mxIqgdi2HTMMwyaitrwJSMZKEDjXNE0RSCVIH6yNXMT2XwBAXbVtkfb/SoAjWSYSifuCyCRUTxDXdd8EAKE46hnEwXQQmy8xTfOOIF6VIAIJ2Uj0Y3eI6M6BgYHLOjo6Rv1o38FsEoEEzWMBtJeI7mpqarp04cKFIpBq+k9esapJf+q2iehbTU1Nl4hAquwfEUiVHTBF8yIQn/hFBOITR0wwQ16xfOIXEYhPHHGgGV9paGj4VGtr65hvLZzCsFB9pKfT6TdrrZ8NmhMiYC/fHfJfQexnqARi2/YcpRQHqpZ7z/01GmUl3S/+kM2KfvHEfnaIQPziFtd1NwHAUr/YI3YAENGZyWQykBH2Q/WKxYPRcZz1iPhuGZj+IYCIzYlEYrd/LMrfktAJxHXdjwHAV/JHIDnLTUAEUm7CBdSfSqUuJaLbACB04i8Ag2+yEtG2oaGhJaeddtqIb4wqwJDQDSLHcc4AgHsQcWYBHCRr+QjcbZrmB8pXfXlrDp1A0un0SVpr/iB8Q3nRSe15ErjINM0788zru2yhE8jWrVubx8bGOHDcu3xHO3oGaQA42jTN3wa166ETSFdX17Tm5ubbEfEfg+qUsNhNRL8kolbLsl4Jap9CJ5DcVO9HEfGWoDolLHYT0SPJZLI9yP0JpUBc1z0BAJ4MsmNCYDtvTPy4aZq3BrkvoRRIV1dXY0tLy48AYEGQnRNw2weI6P3JZNIOcj9CKZDca9bnEPHaIDsn4LY/OTw8vKq9vT2wH+jMP7QCSafTx2it+2Rnb3Vkhoh3ZLPZyy3LylTHgtK0GlqBbNu2rW5sbOwhADBLg0pqKYQAIq5MJBKBvp8w1E+Qzs5OZVnW1QDweQBQhThX8hZNIKW1Xhr0p0eoBZL7DjkZER+Wu0KKHvCFVhDY8x8TOxraVyzuaO4p0gUAZxXqYcnvjQAR7TAMY0k8Hg9FhMtQCyT3FDkDEXlvluHN5VKqAAK8teTmXbt2XRPEKIqT9TP0Aunq6jKam5sfkltvCxjm3rMOKaUS8Xj8x96r8FfJ0AuEcadSqdOJiKOLN/oLf+is+Z9du3ad2dHRkQ1LzyIhkHQ6fUQ2m72Xpx7D4jgf9mM3Iq5KJBKP+dA2zyZFQiC5b5FzEDGQl7h49m7lCpJS6vp4PM7T6qFKkRGIbduNiHi/fIuUfvzyzBUR/b1lWf2lr726NUZGIIx506ZNLTU1NT8BgJbqYg9X64j41dmzZ18ZxOjth/JEpATCMGzb7lRKXQMANYeCI7/nReB3WusTLMt6Ma/cAcsUOYE88sgjc2tra9cBwKKA+cqP5g5orU8P46vVa7AjJxDuuOu6fE00b0GRp0hxsvtcIpHgYwVUXDX+LR1JgeRE0gkA/wIA0/3rHl9b9lRNTc3KRYsW/d7XVhZpXGQFkkqljiSitbId3tMI+gMRrU4mk3xqM9QpsgJhr6ZSqbcS0YMAMC/UXi5t54YR8epEIhGJ8K6RFgiPG8dxTgWAuxBRpn7zEBIR3bB3797PnXHGGUN5ZA98lsgLhI8d27a9Wil1NwDMCLxHy9uBHyqlTo3H438qbzP+qV0EAgC843fOnDmXExHH0hImB45PPlf+4PDw8Lnt7e2D/hm+5bdEBkOOMUdkbGlp4ajwF5Ufe+Ba2GwYxgfb2tqeC5zlRRosAhkHsL+/v35wcPAOADhb1kj2gdFE9EMiWhHk8KHFaEQEMoGebduvU0rxDVVfBIDmYuAGvCyLY/3o6OgVK1aseD7gffFsvghkEnREhI7jrEZEnt063DPdABdERMcwjPctXrx4IMDdKNp0EcgUCPnDvaWl5WIA+AQAHFM06eBUMEREnY7jfLmzs5PPmEc6iUAO4f4tW7YsNAzj6wCwOOzxtRBxh9b6tpGRkVujNls11TAQgeTx97G3t/ewTCZzKyKen0f2oGb5DQCsME1ze1A7UA67RSB5UuXvEtd1VyEiR2p8W57FgpCNz5LfFYvF/iPsGw+9OEMEUgA1IlKO48zl26sQ8TMAMK2A4r7LSkTd2Wz235RSj4UhTGg5AItAPFJ1XXcRIl5PRCcCQL3HaqpRbBQAfkNE3yKimy3LGq6GEUFpUwRShKd6e3vnZrPZ5QBwIQAkfB69MUtETyilvj02NrZh6dKlzxbR9cgUFYGUwNUbNmyonzlz5ru11hfkoqbESlBtKasY1Fpfmclk1i5btuzlMJ8ALCU0rksEUkKi/f39NYODg3EiOh8RjwOA46vx+kVEWUT8FRE9hYgba2pqHli0aNELJexqZKoSgZTB1bzxcd68eU2ZTIYFspSI3oOIRxFROT/qeVFvmD+8AeARROxtaGh4vrW19aUydDEyVYpAKuDqnp6ehlgsdrhhGPwKtgoA5gAAb2HhiPN1EzZGTuWT8YER+LASb0F/lYg43M73lVJPZrPZTZZl7alAlyLThAikwq62bXv64OBgXWNj4wJEPIyI/hYR5+bMYNEsnORjfycAPDPO1CcAgIXx64aGht+3trZG4nRfhV21rzkRSDWo798m8iIk/9e6detiTU1N9bFYbD+/DA0Nja5YseLV14ohYuT3SFXKbSKQSpGWdgJJQARSAbfxzuCmpqa/sB4dHa2tra3lBUbPW+kRkUN+/nS8+clkkmevQhvErQKuOqAJEUiR1G3bjjU3N6sdO3ZgXV3dYVxdLBabQURnERF/hM8kIt7D9bpxTcUQcRZvXfHafG4qd/e48hoRe4ho37eK1npsbGxsbU1NDatRv/jii4NHHXUUhTHAtFeG+ZQTgeRDKZcnd0ZkrtZ6tlLqGK31LEQ8AQCO5JkoRHxtSzwLww+3We3NHZvNIOJWABgjIhcRR7TWT8ZisVczmcwO13VflrMfkw8EEchBBMKCmDdv3syRkZEVhmGcQETvJKJ9U7SIOBMAavmBEbDJjjEAICJ6AREzRPQ8Iu7RWttKqecaGho2nnTSSa/Kq9qfB4YIJCcQft1Jp9Ozs9nsbETk+9XfCgAc5PpNAHBEAQ+aQGclIl5HSSmlntJab8xms88rpQaTyeRLURRNpAWS2xryLiJ6CwCczP8Q8WgAmBX204N5qJg/9nkh8teIyOfSf6q1flRr/cTSpUtDHbB6PJtICqSvr2/GyMjI5QBwTm6/lOeP5TwGWtiycOC4x7TWd8+bN++++fPnj4Stg5ETyKOPPjqzpqbmOETkcD77viUmzCqF2cfl6hsvVu4AgB8g4oZsNvuL3bt3/6yjo4PPm4QmhfoJkkqljstmsx1KqTYAODY32xTqPldpZHIklAFE/InW+ru7d+/+XkdHx19W/qtkU0maDdVg6ezsVKZpzsh9ZK8ioosQsaEkpKSSQgjsIqLbtNbr9+7d+6vVq1e/wjNnhVTgl7yhEAgv1iHi2wHgvYjIM0+8zVyEUd1RxoLYg4hPAsADAPCdRCIxfmGzutbl2XrgBbJly5a/MwzjC3zuInedmnxw5+n8CmbjtRee+dqYyWSuC9IsWBAFgn19fc2jo6NxrfX7ELEdAPZt8ZAUCAK/BYC7s9nsfdu3b3/mkksuYfH4NgVKIHz2u7Gx8RylFAdwe6dcwOnbcZWPYduJaCMRfcOyrF/kU6AaeQIhkKeffnranj17lgHAjbnZqGqwkjbLQ4Bnu24aGxu7eenSpX/y21kXXwuET98hYhwALgOA0xCR9z5JCieBXwPA9xBxbSKReNwvXfStQFKp1IlEdC0RJRGR7w70ra1+cWbQ7cht4f8TEV0zMDDw335YS/HdoNu2bdvrM5nM2UTEMXDl4zvoo96D/bnXrB/xGNBap6p5u5VvBGLbdiPf7EREVyBiq1yB5mFkha/IbiLahIhfMk2TA1VUPPlCIBwWp66u7usccK3iBKTBIBB4EREvSyQS91Xa2KoKpLu7e0Z9ff15iHiFzE5V2vWBa49X5h/QWt9gWVZfpayvmkD4RtmhoSGOMH6qT46nVoq5tOOdAO8g3qm1/ipP+VfiyoaKC4Q3FCaTSRMReU2DI3tIEgKFEuBAef+ZyWRuWLJkCR8ZLttGyIoKpKenp7muru4fiOhqAGiSqdtCx4Xkn0CgDxGv27Jly4ZyBZ2omED4/nFEvAcReVNhjbhaCJSCABHxJsjPJpPJu0pR38Q6yi6Q116pAOBaRDTlqVEON0qdWutbAOA6y7I4jnHJUtkF4rruCgDga5TfXDKrpSIhcCABvkHr0WnTpl1cystIyyaQ7u7u2oaGBl704+0ivFVEkhCoBIHHtdark8kkf7wXHeS7LALhe8Wz2eynAODT8kpViTEhbUwg8ITW+nrLsr5TLJmyCMRxnGsB4BrZfVuse6S8RwI87buXiM5LJpMbPNaxr1hJBcJPjkwmcxUi8jRuSesuppNSNrIESGt9/jPPPNPl9eRiyQZx7pvjMwBwVS5ebWS9Ih33FQGe1fon0zQ9vW6VRCAcVcQwjI8T0fXy5PDV4BBj/kyAg3Wf5TjO+kIXFIsWSG7D4ZWIyE+PousTjwqBMhH4IwB8zLbttYWIpOgBbdt2p1KKZ6z4tlZJQsCvBPZd+RCLxcy2tran8zXSs0D44slUKvXPAHCDPDnyxS35fEDgfwGgwzTN7fnY4kkgLA7XdVcCwNrcRTL5tCV5hIBfCNixWOxDixcvfvZQBnkSiG3bxyulugHgDYdqQH4XAj4lcKNpmp88lG0FCySVSh2ptb4NEd9zqMrldyHgYwKaj104jnPjwT7aCxIIT+cqpfg01yXy3eFj14tp+RIYIKKLk8nkxqmiz+ctkNxH+YcB4MsSOT1f/pIvAATc0dHRC5YvX/7cZLbmLRDXdfkyS/7uWBCATouJQiBfAoSI3925c+d5k92OlZdActtIvg8APHOVV5l8rZN8QsAHBPgsyUeTyeRtE2055GDnu8Kbm5svQMQ7fdARMUEIlIvATwHgfaZp/nx8A4cUyObNm4+KxWL3SwSScvlF6vUJgQwRfSGZTHLI27+kQwmEV8uvIyJeMTd80hExQwiUi0BGax0fH5juoAJxXZfv/XMAQI7MlsslUq/fCKRra2vPPuWUU3axYVMKZNu2bbNGR0c3I+Lb/NYDsUcIlJHAGCJ+Oh6P38gB6SYVCK95pNPpCwHgViKqL6MxUrUQ8COBPsMwzmpra3t+UoH09fXNGBkZWQcAy2Va14/+E5vKTGAEAD5imuY3JxWI4zjLEZEXBWNlNkSqFwK+JEBEvxkYGDjuAIHwukdLS8tmAOAoiJKEQGQJIOInDhBIb2/vKZlMxpGQPZEdF9LxvxL4wX4C4VtllVJrAOACoSQEhADsmSiQv1FK8Z6r4wWOEBACsP80byqV+hAR3SrXE8jQEAJ/JrDfE8RxHL7I/UyBIwSEwASBuK7L58s54sMsgSMEhMCBAuFjtLcLGCEgBP5KYN8r1po1a2oWLFjwEADw9WiShIAQyBHYJ5DcmY/H5fVKxoUQ2J/APoG4rssbE78BANMEkBAQAuNesfiSTQ6gpZT6V9l7JUNDCEx4gvT09DRMnz6dz5t3CBwhIAQmCMS27TlKqfUA8A6BIwSEwASB5OJd8e5djnslSQgIgXEEOEo732N+LwDMFjJCQAhMeII4jvNJROQ7PiQJASEwgQA/Qa4EgC8JGSEgBA4kwHGvbiOiywSOEBACkwtkUCKXyNAQApMT+H+AaGmIS9TN9gAAAABJRU5ErkJggg==";
 }