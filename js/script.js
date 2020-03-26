const video = document.getElementById('video')

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('../weights'),
    faceapi.nets.faceLandmark68Net.loadFromUri('../weights'),
    faceapi.nets.faceRecognitionNet.loadFromUri('../weights'),
    faceapi.nets.faceExpressionNet.loadFromUri('../weights')
]).then(startVideo)
var constraints = { video: { facingMode: "user" }, audio: false };// Define constants
function startVideo() {
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function (stream) {
            video.srcObject = stream;
        })
        .catch(function (error) {
            console.error("Oops. Something is broken.", error);
        });
    // navigator.getUserMedia(
    //     { video: {} },
    //     stream => video.srcObject = stream,
    //     err => console.error(err)
    // )
}

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = { width: video.clientWidth, height: video.clientHeight }
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks()
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    }, 100)
})
