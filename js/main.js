/***
File Decsription: JS File for Online Calculator
***/

window.onload = function() {
    // Global variables
    var maxDigit = 12;
    var maxDisplay = 18;
    var equalFlag = 0;
    var waitForOperand = 0;
    var operatorCnt = 0;
    var zeroCnt = 0;
    
    // Main Screen
    var display = document.getElementById("display");
    
    // Lower Screen
    var output = document.getElementById("output");
    
    // Return all buttons
    var btn = document.querySelectorAll(".btn");
    var len = btn.length;
    
    // Add event listener to each button
    for(var i=0; i<len; i++) {
        btn[i].addEventListener("click", checkBtn);
    }
    
    /**
     * Checks which button is clicked
     */ 
    function checkBtn() {
                
        if(this.classList.contains("digit")) {
            inputDigit(this.value);
            return;
        }
        
        if(this.classList.contains("equal")) {
            inputEqual(this.value);
            return;
        }
        
        if(this.classList.contains("operator")) {
            inputOperator(this.value);
            return;
        }
        
        if(this.classList.contains("decimal")) {
            inputDecimal();
            return;
        }
        
        if(this.classList.contains("clear")) {
            inputClear();
            return;
        }
        
        if(this.classList.contains("backspace")) {
            inputBackspace();
            return;
        }
    }

    /**
     * When digit is clicked
     */
    function inputDigit(digit) {
        
        // If previous input is not result
        if(equalFlag == 0) {
            var displayVal = display.innerHTML;
            var length = 0;
            var last = "";
            
            // If main display is not empty
            if(displayVal != '') {
                last = getLastToken(displayVal);
                length = last.length;
            }
            
            // If less than max length
            if(length < maxDigit) {
                // If needs to calculate output
                if(waitForOperand == 1 &&  operatorCnt > 0) {
                     
                    // If there is zero in front of operand
                    if(zeroCnt > 0) {
                        
                        // If there is a decimal before new digit, append as usual
                        if(last.indexOf('.') != -1) {
                            display.innerHTML += digit;
                            output.innerHTML = eval(display.innerHTML);
                        }
                        // If next digit is not zero, replace zero with the digit
                        else if(digit !== '0') {
                            
                            
                            display.innerHTML = displayVal.slice(0, -1) + digit;
                            output.innerHTML = eval(display.innerHTML);
                            zeroCnt = 0;
                        }
                    } 
                    else {
                        // If the first character in operand is zero
                        if(last.length === 1 && last === '0'){ 
                            zeroCnt++;
                            
                            // If next digit is zero, ignore 
                            if(digit === "0"){
                                return;
                            } 
                            // Else, replace zero with the new digit
                            else {
                                display.innerHTML = displayVal.slice(0, -1) + digit;
                                output.innerHTML = eval(display.innerHTML);
                            }
                            return;
                        }
                        //If no zero in front, append digit as usual
                        display.innerHTML += digit;
                        output.innerHTML = eval(display.innerHTML);
                    }
                } else {
                    
                    if(zeroCnt > 0) {
                        //Ignore if next digit after zero is still zero
                        if(digit !== '0') {
                            display.innerHTML = displayVal.slice(0, -1) + digit;
                            zeroCnt = 0;
                        }
                    } else {
                        // Append digit to the end
                        display.innerHTML += digit;
                        
                        // Remove leading zero if operand has no decimal point
                        if(displayVal.indexOf('.') == -1) {
                            display.innerHTML = removeLeadingZero(display.innerHTML);
                        }
                    }
                }
            }
        } else { //Reset display
            display.innerHTML = digit;
            if(digit === '0') zeroCnt++;
            equalFlag = 0;
        }
    }
    
    /**
     * When equal sign is clicked
     */
    function inputEqual() {
        
        // If lower screen is not empty, move its value to the main screen
        if(output.innerHTML != '') {
            var outputVal = output.innerHTML;
            
            // Shorten value when it gets too long to display in the screen
            if(outputVal.length > maxDisplay) {
                outputVal = parseFloat(outputVal).toExponential(2);
            }
            
            // Copy value in lower screen value to main screen
            display.innerHTML = outputVal;
            
            // Delete value in lower screen
            output.innerHTML = '';
            
            // Set equal flag to 1
            equalFlag = 1;
            
            // Reset operand and operator count to zero
            waitForOperand = 0;
            operatorCnt = 0;
        }
    }
    
    /**
     * When operator is clicked
     */
    function inputOperator(operator) {
        // Prevent operation when there is no operand
        if(display.innerHTML == '') return;
        
        // Reset equal flag to 0
        equalFlag = 0;
        
        var last = getLastChar(display.innerHTML);
        
        // If last character is an operator, replace with new operator
        if(checkIfOperator(last) == true) {
            var displayVal = display.innerHTML;
            display.innerHTML = displayVal.slice(0, -1) + operator;
        } 
        // Else, append operator as usual
        else {
            display.innerHTML += operator;
            
            //Increase operator count
            operatorCnt++;
        }
        
        // Delete temporary answer and wait for next operand
        output.innerHTML = '';
        waitForOperand = 1;
        zeroCnt = 0;
    }
    
    /**
     * When decimal point is clicked
     */
    function inputDecimal() {
        
        // Main screen value
        displayVal = display.innerHTML;
        
        //If main screen is empty, display "0."
        if(displayVal == '') {
            display.innerHTML = "0.";
            
        } else {
            
            if(equalFlag == 0) {
                var last = getLastToken(displayVal);
                
                // If last token is an operator, append "0."
                if(checkIfOperator(last)) {
                    display.innerHTML = displayVal.concat("0.");
                    output.innerHTML = eval(display.innerHTML);
                } 
                // Else, last token is an operand
                else { 
                    // If no decimal point yet, add a decimal point
                    if(last.indexOf('.') == -1) {
                        display.innerHTML = displayVal.concat(".");
                        zeroCnt = 0;
                    }
                }
            }
            else {
                display.innerHTML = "0."; 
                equalFlag = 0;
            }
        }
    }  
    
    /**
     * When backspace is clicked
     */
    function inputBackspace() {
        
        // Main screen value
        var displayVal = display.innerHTML;
        
        // If display is not empty, remove 1 character
        if(displayVal != '') {
            var last = getLastToken(displayVal);
            
            // Do not allow if value is Infinity, NaN or exponent
            if(last.indexOf('Infinity') > -1 || 
               last.indexOf('NaN') > -1 ||
               last.indexOf('e') > -1) {
                return;
            }
            
            // Reset equal flag to 0
            equalFlag = 0;
            
            // Get last character
            var last = displayVal[displayVal.length - 1];
            
            // If character to delete is operator, update operator count
            if(checkIfOperator(last)){
                operatorCnt--;
            }
            
            // Remove rightmost character
            displayVal = display.innerHTML = displayVal.substr(0, displayVal.length - 1);
            
            // Get the new last character
            last = displayVal[displayVal.length - 1];
            
            // If last character is an operator, remove value in lower display
            if(checkIfOperator(last)) {
                displayVal = displayVal.substr(0, displayVal.length - 1); 
                output.innerHTML = '';
                return;
            }
            
            // Check if there are still remaining inputs after delete
            if(operatorCnt > 0) {
                output.innerHTML = eval(displayVal);
            }
        }
        
        if(displayVal == '') {
            waitForOperand = 0;
        }
    }
    
    /**
     * When clear is clicked
     */
    function inputClear() {
        display.innerHTML = '';
        output.innerHTML = '';
        
        // Reset all flags and counters to 0
        equalFlag = 0;
        waitForOperand = 0;
        operatorCnt = 0;
        zeroCnt = 0;
    }
    
    /**
     * Get last character of a given string
     */
    function getLastChar(string) {
        if(string != '') {
            return string[string.length - 1];
        }
        return false;
    }
    
    /**
     * Check if character is an operator
     */
    function checkIfOperator(val) {
        if(val == '+' || val == '-' || val == '*' || val == '/' || val == '%') {
            return true;
        }
        return false;
    }

    /**
     * Remove leading zero
     */
    function removeLeadingZero(string) {
        var newString = string
        if(string[0] === '0' && string.length > 1) {
            newString = string.slice(1);
        }
        return newString;
    }
    
    /**
     * Split the given expression then get last token
     */
    function getLastToken(expr) {
        var split = expr.match(/[^\d()]+|[\d.]+/g);
        return split[split.length - 1];
    }
}