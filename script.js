const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols ='~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

//initial values
let password ="";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// setting strength circle to grey initially
setIndicator("#ccc")

function handleSlider() {
    //USE:- (SET passwordLength in UI)

    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color) {
    //USE:- (SET color according to input parameter in strength indicator)
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;//shadow 
}

function getRanInteger(min, max) {
    //USE:-(give random no between min-max)
    return Math.floor(Math.random() * (max - min)) + min;
    //this gives a random integer from 0 to (min to max)
}

function generateRandomNumber() {
    // USE:- this gives a random integer from 0 to 9
    return getRanInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRanInteger(97,123));
    //USE:- this gives a random ASCII VALUE from (97,123)
}

function generateUpperCase(){
       return String.fromCharCode(getRanInteger(65,91));
        ////USE:- this gives a random ASCII VALUE from (65,91)
}

function generateSymbol(){
    const randNum = getRanInteger(0,symbols.length);
    return symbols.charAt(randNum);
    //USE:-gives a random SYMBOL which is on the place of randNum in the STRING OF SYMBOLS
}

function calcStrength(){
    //USE:- check the status of checkboxes and 
    // then set the color in the indicator according to the conditions
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8){
        setIndicator("#0f0");
    }
    else if (
        (hasLower || hasUpper)&&
        (hasNum || hasSym)&&
        passwordLength >=6
        ) {
            setIndicator("#ff0");
        }else {
            setIndicator("#f00");
        }
}

async function copyContent(){
    try{
        //used to copy text present in passwordDisplay and paste it to clipboard 
        // using writetext function of clipboard which retruns a promise 
        // if promise is resolved then it will copy the "copied" in copymsg
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);

}

function shufflePassword(array) {
    //Fisher Yates Method
    for(let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;

}
function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
    });

    //Special Condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
         //this call will reflect the same change in our UI to set slider according to checkcount
    }
}


//USE:-check ticked/unticked checkboxes repeatedly acc to input
// to calculate the change in ticked or unticked checkbox, handlecheckboxchange is called
allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
    //e represent this slider element
    // -> e.target.value gives value of slider 
    // then update the passwordLength and reflect it in UI by calling handleslider()
})

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)  //if pass is visble in passworddisplay then copy it
        copyContent();
        // logic 2:- if(passwordLength > 0) then copy the value by copycontent() 
    
})

generateBtn.addEventListener('click', () => {
    //none of the checkbox are selected
    if(checkCount == 0)
    return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    //let's start the journey to find password
    console.log("Starting The Journey");
    //remove old password
    password="";

    //let's put the stuff mentioned by checkboxes
    // if(uppercaseCheck.checked) {
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked) {
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked) {
    //     password += generateRandomNumber();
    // }
 
    // if(symbolsCheck.checked) {
    //     password += generateSymbol();
    // }

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    // Compulsary Addition
    for(let i = 0; i<funcArr.length;i++) {
        password+=funcArr[i]();
    }

    console.log("Compulsary addition done");

    //Remaining Addition
    for(let i=0; i<passwordLength-funcArr.length; i++) {
        let randIndex = getRanInteger(0 , funcArr.length);
        console.log("randIndex" + randIndex)
        password += funcArr[randIndex]();
    }

    console.log("Remaining addition done");

    //Shuffle The Password
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");
    //Show In UI
    passwordDisplay.value = password;
    console.log("UI addition done");
    //calculate strength
    calcStrength();




});


