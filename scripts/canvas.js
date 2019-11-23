function draw() {
    var canvas = document.getElementById('tutorial');
    if (canvas.getContext('2d')) {
        var ctx = canvas.getContext('2d');

        var baseImage = new Image();
        baseImage.src = "images/CharacterCreator/BaseBody/Purple.png";
        baseImage.onload = function()
        {
            ctx.drawImage(baseImage, 0, 0);
        }

        var accImage = new Image();
        accImage.src = "images/CharacterCreator/Accessories/WorldsWorstHat.png";
        accImage.onload = function () {
            ctx.drawImage(accImage, 0, 0);
        }
    }
}