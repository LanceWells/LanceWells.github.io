/**
 * @description
 * Creates a promise on loading an image. Borrowed from an answer to this this StackOverflow question:
 * https: //stackoverflow.com/questions/47579213/draw-image-to-canvas-in-particular-order-while-loading-from-url-to-image-object

 * @param {String} imagePath The relative location of the image to be loaded. On a failure, this promise will
 * fail to resolve. On a success, the promise will resolve.

 * @returns {Promise} A promise on the resolution to an image being loaded.
 */
function LoadImage(imagePath) {
    return new Promise((resolve, reject) => {
        let image = new Image();
        image.addEventListener("load", () => {
            resolve(image);
        });
        image.addEventListener("error", (err) => {
            reject(err);
        });
        image.src = imagePath;
    });
}

function draw() {
    var canvas = document.getElementById('tutorial');
    if (canvas.getContext('2d')) {
        var ctx = canvas.getContext('2d');
        var imageSources =
        [
            "images/CharacterCreator/BaseBody/Purple.png",
            "images/CharacterCreator/Accessories/WorldsWorstHat.png",
        ];

        Promise
            .all(imageSources.map(i => LoadImage(i)))
            .then((images) => {
                images.forEach((image) => {
                    ctx.drawImage(image, 0, 0);
                })
            })
    }
}