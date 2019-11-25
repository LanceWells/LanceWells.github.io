var json_body = '{"images":[{"image":"images/CharacterCreator/Empty/Empty.png","yOffset":0,"zOffset":0},{"image":"images/CharacterCreator/BaseBody/Purple.png","yOffset":0,"zOffset":0}]}';
var json_clothing = '{"images":[{"image":"images/CharacterCreator/Empty/Empty.png","yOffset":0,"zOffset":0},{"image":"images/CharacterCreator/Clothing/WorldsWorstHat.png","yOffset":0,"zOffset":0}]}';
var json_clothingDecoration;
var json_heldItem;
var json_hair;
var json_arm;
var json_sleeves;
var json_sleevesDecoration;
var imgSrc_body = "images/CharacterCreator/Empty/Empty.png";
var imgSrc_clothing = "images/CharacterCreator/Empty/Empty.png";
var imgSrc_clothingDecoration = "images/CharacterCreator/Empty/Empty.png";
var imgSrc_heldItem = "images/CharacterCreator/Empty/Empty.png";
var imgSrc_hair = "images/CharacterCreator/Empty/Empty.png";
var imgSrc_arm = "images/CharacterCreator/Empty/Empty.png";
var imgSrc_sleeves = "images/CharacterCreator/Empty/Empty.png";
var imgSrc_sleevesDecoration = "images/CharacterCreator/Empty/Empty.png";
var panelId_body = "Panel_BaseBody";
var panelId_clothing = "Panel_Clothing";
var panelId_clothingDecoration = "Panel_ClothingDecoration";
var panelId_heldItem = "Panel_HeldItem";
var panelId_hair = "Panel_Hair";
var panelId_arm = "Panel_Arm";
var panelId_sleeves = "Panel_Sleeves";
var panelId_sleevesDecoration = "Panel_SleevesDecoration";
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
 * Populates the accordion file (specified by idToPopulate) with images in the json provided by the json
 * parameter.
 * @param json The json that contains a series of image elements. Note that this must contain an array with
 * elements that contain an "image" key with a string field.
 * @param idToPopulate The id of the accordion panel to populate the new image-buttons with.
 */
function PopulateCharImagePanel(json, idToPopulate) {
    var clothingJson = JSON.parse(json);
    var i = 0;
    var buttonPanel = document.getElementById(idToPopulate);
    for (i = 0; i < clothingJson.images.length; i++) {
        var imgSrc = clothingJson.images[i].image;
        var imgHtml = '<div class="charPart" style="float: left"><img src="'
            + imgSrc
            + '"><button class="charPartButton"></button></div>';
        buttonPanel.insertAdjacentHTML('afterbegin', imgHtml);
    }
}
/**
 * @description
 * Draws the elements on the character creation canvas, in-order.
 */
function DrawCharacterCanvas() {
    var canvas = document.getElementById('tutorial');
    if (canvas.getContext('2d')) {
        var ctx = canvas.getContext('2d');
        // We're drawing, so always assume there's stuff on the canvas! Clear it out so we can redraw!
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var imageSources = [
            imgSrc_body,
            imgSrc_clothing,
            imgSrc_clothingDecoration,
            imgSrc_heldItem,
            imgSrc_hair,
            imgSrc_arm,
            imgSrc_sleeves,
            imgSrc_sleevesDecoration
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
/**
 * @description
 * Decorates all of the character part buttons with their respective callback functions when clicked.
 */
function DecorateCharacterPartButtons() {
    var loadedCharParts = document.getElementsByClassName("charPart");
    var i = 0;
    var _loop_1 = function () {
        var loadedCharPart = loadedCharParts[i];
        loadedCharPart.onclick = function () {
            var charPartImage = loadedCharPart.firstElementChild;
            var imageSrc = charPartImage.src;
            // All of these divs should be nested in larger 'panel' class divs, which contain an id that
            // represents which character customization bit this specific button changes. Use a switch-case to
            // determine which of our character customization strings we should update.
            var panel = loadedCharPart.parentElement;
            var panelId = panel.id;
            switch (panelId) {
                case panelId_body:
                    imgSrc_body = imageSrc;
                    break;
                case panelId_clothing:
                    imgSrc_clothing = imageSrc;
                    break;
                case panelId_clothingDecoration:
                    imgSrc_clothingDecoration = imageSrc;
                    break;
                case panelId_heldItem:
                    imgSrc_heldItem = imageSrc;
                    break;
                case panelId_hair:
                    imgSrc_hair = imageSrc;
                    break;
                case panelId_arm:
                    imgSrc_arm = imageSrc;
                    break;
                case panelId_sleeves:
                    imgSrc_sleeves = imageSrc;
                    break;
                case panelId_sleevesDecoration:
                    imgSrc_sleevesDecoration = imageSrc;
                    break;
                default:
                    break;
            }
            // We've updated something. Re-draw!
            DrawCharacterCanvas();
        };
    };
    for (i = 0; i < loadedCharParts.length; i++) {
        _loop_1();
    }
}
/**
 * @description
 * Populates the html panels with elements from the json stored in the json folder.
 */
function PopulatePartButtonsFromJson() {
    // First, get all of the json from our JSON strings, and populate the accordions with that info.
    PopulateCharImagePanel(json_clothing, panelId_clothing);
    PopulateCharImagePanel(json_body, panelId_body);
    // Now, add the callbacks to every button!
    DecorateCharacterPartButtons();
}
//# sourceMappingURL=canvas.js.map