/**
 * @description
 * Creates a promise on loading an image. Borrowed from an answer to this this StackOverflow question:
 * https: //stackoverflow.com/questions/47579213/draw-image-to-canvas-in-particular-order-while-loading-from-url-to-image-object

 * @param {String} imagePath The relative location of the image to be loaded. On a failure, this promise will
 * fail to resolve. On a success, the promise will resolve.

 * @returns {Promise} A promise on the resolution to an image being loaded.
 */
function LoadImage(imagePath: string): Promise<any> {
    var promise = new Promise(function(resolve, reject){
        let image = new Image();
        image.addEventListener("load", () => {
            resolve(image);
        });
        image.addEventListener("error", (err) => {
            reject(err);
        });
        image.src = imagePath;
    });
    return promise;
}

var imgSrc_body : string = "images/CharacterCreator/BaseBody/Purple.png";
var imgSrc_clothing : string = "images/CharacterCreator/Accessories/WorldsWorstHat.png";
var imgSrc_clothingDecoration: string;
var imgSrc_heldItem: string;
var imgSrc_hair: string;
var imgSrc_arm: string;
var imgSrc_sleeves: string;
var imgSrc_sleevesDecoration: string;

function DrawCharacterCanvas() {
    var canvas = document.getElementById('tutorial') as HTMLCanvasElement;
    if (canvas.getContext('2d')) {
        var ctx = canvas.getContext('2d');
        var imageSources =
            [
                imgSrc_body,
                imgSrc_clothing,
            ];

        Promise
            .all(imageSources.map(i => LoadImage(i)))
            .then((images) => {
                images.forEach((image) => {
                    ctx.drawImage(image, 0, 0);
                });
            });
    }
}