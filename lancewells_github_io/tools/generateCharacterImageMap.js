// This method generates a list of files relative to the public folder. When we're searching through this
// folder, we need to specify only the character_image folders as 'available' to avoid including all other
// .png files in public. With this, we need to re-add the images folder to get a fully-qualified path to our
// images.

let Glob = require("glob").GlobSync;
let fs = require('fs');

const characterImageFolder = '../public/images/Character_Image';
const charImageMapOutput = '../src/CharacterImage/Classes/CharImageStruct.json';
const imgDirectoryRegex = /([\s\w]+)\/([\s\w]+)\/([\s\w]+)/;

/*
 * First, get a list of all directories that we will be using. What we want is a list of objects that look
 * like:
 * [
 *      {
 *          "Size": "Size_Average",
 *          "BodyType": "Androgynous",
 *          "PartType": "Arm Armor",
 *          "Images": [
 *              "armor1.png",
 *              "armor2.png"
 *          ]
 *      },{
 *          "Size": "Size_Average",
 *          "BodyType": "Female",
 *          "PartType": "Hand Wear",
 *          "Images": [
 *              "armor3.png",
 *              "armor4.png"
 *          ]
 *      },{
 *          "Size": "Size_Average",
 *          "BodyType": "Male",
 *          "PartType": "Lower Armor",
 *          "Images": [
 *              "armor5.png",
 *              "armor6.png"
 *          ]
 *      },
 * ]
 * 
 * To get this, we need to first get a list of all directories that match the expected pattern:
 * Size/BodyType/PartType
 * 
 * To exclude parent directories.
 */

let allDirectories = new Glob('**/', {
    cwd: characterImageFolder,
    nodir: false
})

let imgDirectories = allDirectories.found.filter(d => d.match(imgDirectoryRegex));
let charImgStruct = [];

imgDirectories.forEach(d => {
    let images = new Glob('*.png', {
        cwd: `${characterImageFolder}/${d}`,
        nodir: true,
        matchBase: true
    });

    let qualifiedImages = images.found.map(i => `./images/Character_Image/${d}${i}`);

    let dMatch = d.match(imgDirectoryRegex);
    charImgStruct.push({
        Size: dMatch[1],
        PartType: dMatch[2],
        BodyType: dMatch[3],
        Images: qualifiedImages
    });
});

fs.writeFileSync(charImageMapOutput, JSON.stringify(charImgStruct));
