var json_body: string                   = '{ "images": [{ "key": "empty", "value": { "image": "images/CharacterCreator/Empty/Empty.png", "yOffset": 0, "zOffset": 0 } }, { "key": "purple", "value": { "image": "images/CharacterCreator/BaseBody/Purple.png", "yOffset": 0, "zOffset": 0 } }] }';
var json_clothing: string               = '{"images":[{"key":"empty","value":{"image":"images/CharacterCreator/Empty/Empty.png","yOffset":0,"zOffset":0}},{"key":"worldsWorstHat","value":{"image":"images/CharacterCreator/Accessories/WorldsWorstHat.png","yOffset":0,"zOffset":0}}]}';
var json_clothingDecoration: string;
var json_heldItem: string;
var json_hair: string;
var json_arm: string;
var json_sleeves: string;
var json_sleevesDecoration: string;

var imgSrc_body: string                 = "images/CharacterCreator/BaseBody/Purple.png";
var imgSrc_clothing: string             = "images/CharacterCreator/Accessories/WorldsWorstHat.png";
var imgSrc_clothingDecoration: string   = "images/CharacterCreator/Empty/Empty.png";
var imgSrc_heldItem: string             = "images/CharacterCreator/Empty/Empty.png";
var imgSrc_hair: string                 = "images/CharacterCreator/Empty/Empty.png";
var imgSrc_arm: string                  = "images/CharacterCreator/Empty/Empty.png";
var imgSrc_sleeves: string              = "images/CharacterCreator/Empty/Empty.png";
var imgSrc_sleevesDecoration: string    = "images/CharacterCreator/Empty/Empty.png";

var loadedCharParts: HTMLCollectionOf<HTMLDivElement> =
    document.getElementsByClassName("charPart") as HTMLCollectionOf<HTMLDivElement>;

var i = 0;
for (i = 0; i < loadedCharParts.length; i++)
{
    let loadedCharPart: HTMLDivElement = loadedCharParts[i];
    
    loadedCharPart.onclick = function()
    {
        let charPartImage = loadedCharPart.firstElementChild as HTMLImageElement;
        alert(charPartImage.src);
    }
}

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
            console.log("Successfully loaded: " + imagePath)
        });
        image.addEventListener("error", (err) => {
            reject(err);
            console.error("Successfully loaded: " + imagePath)
        });
        image.src = imagePath;
    });
    return promise;
}

/**
 * @description
 * Populates the html panels with elements from the json stored in the json folder.
 */
function PopulatePartButtonsFromJson()
{
    // var obj = JSON.parse(json_body);
    // alert(obj.images[0].key);
}

/**
 * @description
 * Draws the elements on the character creation canvas, in-order.
 */
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