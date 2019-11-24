/**
 * @description
 * Creates a promise on loading an image. Borrowed from an answer to this this StackOverflow question:
 * https: //stackoverflow.com/questions/47579213/draw-image-to-canvas-in-particular-order-while-loading-from-url-to-image-object

 * @param {String} imagePath The relative location of the image to be loaded. On a failure, this promise will
 * fail to resolve. On a success, the promise will resolve.

 * @returns {Promise} A promise on the resolution to an image being loaded.
 */
function LoadImage(imagePath) {
    var promise = new Promise(function (resolve, reject) {
        var image = new Image();
        image.addEventListener("load", function () {
            resolve(image);
        });
        image.addEventListener("error", function (err) {
            reject(err);
        });
        image.src = imagePath;
    });
    return promise;
}
var imgSrc_body = "images/CharacterCreator/BaseBody/Purple.png";
var imgSrc_clothing = "images/CharacterCreator/Accessories/WorldsWorstHat.png";
var imgSrc_clothingDecoration;
var imgSrc_heldItem;
var imgSrc_hair;
var imgSrc_arm;
var imgSrc_sleeves;
var imgSrc_sleevesDecoration;
function DrawCharacterCanvas() {
    var canvas = document.getElementById('tutorial');
    if (canvas.getContext('2d')) {
        var ctx = canvas.getContext('2d');
        var imageSources = [
            imgSrc_body,
            imgSrc_clothing,
        ];
        Promise
            .all(imageSources.map(function (i) { return LoadImage(i); }))
            .then(function (images) {
            images.forEach(function (image) {
                ctx.drawImage(image, 0, 0);
            });
        });
    }
}
