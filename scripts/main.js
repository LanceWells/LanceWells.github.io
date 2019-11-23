const heading = document.querySelector('h1');
heading.textContent = 'Hello World';

/*
 * Testing use of a canvas for image overlay.
 */


/*
 * Firefox logo image selection. Adds a button to invert the colors on the firefox logo.
 */
let myImage = document.querySelector('img');
myImage.onclick = function() {
    let imgSrc = myImage.getAttribute('src');
    if (imgSrc == 'images/firefox-icon.png')
    {
        myImage.setAttribute('src', 'images/firefox-icon2.png');
    }
    else
    {
        myImage.setAttribute('src', 'images/firefox-icon.png');
    }
}
