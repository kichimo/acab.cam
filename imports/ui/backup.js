//generate preview image and compress it in gzip format 
var video = document.createElement('video');
// video.width = 320;
// video.height = 240;

var canvas = document.createElement('canvas');
// canvas.width = 320;
// canvas.height = 240;
var context = canvas.getContext('2d');
video.setAttribute('src', URL.createObjectURL(event.target.files[0]));
video.load();
video.play();

video.addEventListener('loadeddata', function () {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    var dataURI = canvas.toDataURL('image/jpeg', 0.1);
    console.log(dataURI)
    gzip(dataURI)
        .then((compressed) => {
            var b64encoded = btoa(String.fromCharCode.apply(null, compressed));
            console.log(b64encoded)
        })
});
