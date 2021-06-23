let videoElement = document.querySelector("video");
let recordButton = document.querySelector(".inner-record");
let capturePhoto = document.querySelector(".inner-capture");
let filter=document.querySelectorAll(".filter");
let zoomIn = document.querySelector(".zoomIn");
let zoomOut = document.querySelector(".zoomOut");

let minZoom = 1;
let maxZoom = 3.1;
let currentZoom = 1;

let filterName="none";
let filter_name;
for(let i=0;i<filter.length;i++)
{
filter[i].addEventListener("click", function(e){
  let ImageNo=filter[i].id;
if(ImageNo=='image1')
{
  filterName="grayscale(100%)";
  
}
else if(ImageNo=='image2')
{
  filterName="contrast(200%) brightness(150%)";
 
}
else if(ImageNo=='image3')
{
  filterName=" hue-rotate(90deg)";
  
}
else if(ImageNo=='image4')
{
  filterName="sepia(100%)";
 
}
else if(ImageNo=='image5')
{
  filterName= "brightness(200%)";
}
else
{
  filterName="none";

}


 //   console.log(ImageNo);
  let element = document.getElementById(ImageNo),
  style = window.getComputedStyle(element),
  filter_name = style.getPropertyValue('filter');
  //hume dikhega screen par
  videoElement.style.filter=filter_name;
  console.log(filter_name);
 
 
});
}



let recordingState = false;
let mediaRecorder;

(async function () {
  let constraint = { video: true };
  let mediaStream = await navigator.mediaDevices.getUserMedia(constraint);
  videoElement.srcObject = mediaStream;
  mediaRecorder = new MediaRecorder(mediaStream);
  mediaRecorder.onstart = function () {
    console.log("Inside on start");
  };
  mediaRecorder.ondataavailable = function (e) {
    console.log("Inside on data available");
    console.log(e.data);
    let videoObject = new Blob([e.data], { type: "video/mp4" });
    // console.log(videoObject);
    // videoObject/imageObject => URL
    // aTag

    let videoURL = URL.createObjectURL(videoObject);
    let aTag = document.createElement("a");
    aTag.download = `Video${Date.now()}.mp4`;
    aTag.href = videoURL;
    aTag.click();
  };
  mediaRecorder.onstop = function () {
    console.log("Inside on stop");
  };

  recordButton.addEventListener("click", function () {
    if (recordingState) {
      // already recording is going on
      // stop the recording
      mediaRecorder.stop();
      recordingState = false;
      recordButton.classList.remove("animate-record");
    } else {
      // start the recording
      mediaRecorder.start();
      recordingState = true;
      recordButton.classList.add("animate-record");      
    }
  });

  capturePhoto.addEventListener("click", function () {
    capturePhoto.classList.add("animate-capture");

    setTimeout( function(){
      capturePhoto.classList.remove("animate-capture");
    }   , 1000  );

    //   canvas
    let canvas = document.createElement("canvas");
    
    canvas.width = 640; //video width
    canvas.height = 480; // video height

    let ctx = canvas.getContext("2d");
    if(currentZoom != 1){
      ctx.translate(canvas.width/2 , canvas.height/2);
      ctx.scale(currentZoom , currentZoom);
      ctx.translate(-canvas.width/2 , -canvas.height/2);
    }

    ctx.drawImage(videoElement, 0, 0);

    //capture hone k baad dikhega
    ctx.filter = filterName;
    ctx.drawImage(videoElement, 0, 0);
    
    let aTag = document.createElement("a");

    aTag.download = `Image${Date.now()}.jpg`;
    
    aTag.href = canvas.toDataURL("image/jpg");
    
    aTag.click();
    
   
  });
})();
zoomIn.addEventListener("click", function () {
  if (currentZoom + 0.1 > maxZoom) {
    return;
  }
  currentZoom = currentZoom + 0.1;
  videoElement.style.transform = `scale(${currentZoom})`;
});

zoomOut.addEventListener("click", function () {
  if (currentZoom - 0.1 < minZoom) {
    return;
  }
  currentZoom = currentZoom - 0.1;
  videoElement.style.transform = `scale(${currentZoom})`;
});