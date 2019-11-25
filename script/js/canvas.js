var json_body = '{ "images": [{ "key": "empty", "value": { "image": "images/CharacterCreator/Empty/Empty.png", "yOffset": 0, "zOffset": 0 } }, { "key": "purple", "value": { "image": "images/CharacterCreator/BaseBody/Purple.png", "yOffset": 0, "zOffset": 0 } }] }';
var json_clothing = '{"images":[{"key":"empty","value":{"image":"images/CharacterCreator/Empty/Empty.png","yOffset":0,"zOffset":0}},{"key":"worldsWorstHat","value":{"image":"images/CharacterCreator/Accessories/WorldsWorstHat.png","yOffset":0,"zOffset":0}}]}';
var json_clothingDecoration;
var json_heldItem;
var json_hair;
var json_arm;
var json_sleeves;
var json_sleevesDecoration;
var imgSrc_body = "images/CharacterCreator/BaseBody/Purple.png";
var imgSrc_clothing = "images/CharacterCreator/Accessories/WorldsWorstHat.png";
var imgSrc_clothingDecoration = "images/CharacterCreator/Empty/Empty.png";
var imgSrc_heldItem = "images/CharacterCreator/Empty/Empty.png";
var imgSrc_hair = "images/CharacterCreator/Empty/Empty.png";
var imgSrc_arm = "images/CharacterCreator/Empty/Empty.png";
var imgSrc_sleeves = "images/CharacterCreator/Empty/Empty.png";
var imgSrc_sleevesDecoration = "images/CharacterCreator/Empty/Empty.png";
var loadedCharParts = document.getElementsByClassName("charPart");
var i = 0;
var _loop_1 = function () {
    var loadedCharPart = loadedCharParts[i];
    loadedCharPart.onclick = function () {
        var charPartImage = loadedCharPart.firstElementChild;
        alert(charPartImage.src);
    };
};
for (i = 0; i < loadedCharParts.length; i++) {
    _loop_1();
}
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
            console.log("Successfully loaded: " + imagePath);
        });
        image.addEventListener("error", function (err) {
            reject(err);
            console.error("Successfully loaded: " + imagePath);
        });
        image.src = imagePath;
    });
    return promise;
}
/**
 * @description
 * Populates the html panels with elements from the json stored in the json folder.
 */
function PopulatePartButtonsFromJson() {
    // var obj = JSON.parse(json_body);
    // alert(obj.images[0].key);
}
/**
 * @description
 * Draws the elements on the character creation canvas, in-order.
 */
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
//# sourceMappingURL=canvas.js.map