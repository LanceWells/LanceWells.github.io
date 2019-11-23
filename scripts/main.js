const heading = document.querySelector('h1');
heading.textContent = 'Hello World';

document.querySelector('h1').onclick = function() {
    alert('MAH');
}

/*
 * Username display support. Happens at initialization.
 */
let myButton = document.querySelector('button');
let myHeading = document.querySelector('h1');

function setUserName() {
    let myName = prompt('Please enter your name.');
    localStorage.setItem('name', myName);
    myHeading.textContent = 'Mozilla is cool, ' + myName;
}

if (!localStorage.getItem('name')) {
    setUserName();
} else  {
    let storedName = localStorage.getItem('name');
    myHeading.textContent = 'Mozilla is cool, ' + storedName;
}

myButton.onclick = function () {
    setUserName();
}

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
