document.addEventListener('touchstart', function(e) {
    var target = e.target;

    // Check if the touched element is a textarea or any of the specified input types
    if (target.tagName === 'TEXTAREA' ||
        (target.tagName === 'INPUT' &&
         ['text', 'date', 'password', 'email', 'number'].includes(target.type))
    ) {
        var intv = 100;

        // Stop propagation to prevent triggering any parent event listeners
        e.stopPropagation();

        // Determine if the device is iOS
        if (getMobileOperatingSystem() === 'ios') {
            // Move the element off-screen and then focus on it
            target.style.transform = 'translateY(-10000px)';
            target.focus();

            // Reset the transform after a short delay
            setTimeout(function() {
                target.style.transform = 'none';
            }, intv);
        }
    }
});

function getMobileOperatingSystem() {
    // Function to detect the mobile operating system
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return 'ios';
    }

    return 'other';
}

class EmployeeStatistics {
    constructor() {
        this._oneHourOfRows = 52;

        // Responsible for updating the rows
        this._workingHoursInput = document.getElementById('shift_hours');

        // All buttons, used by methods to set eventlisteners and animations
        this._allButtons = document.querySelectorAll('.btn');
        this._addNewRowBtn = document.getElementById('add-row-button');
        this._deleteRowBtn = document.getElementById('remove-row-button');
        
        this._rowsSummaryDomText = document.querySelector('.container_rows_summary h2');
        this._rowsFinishedDomText = document.querySelector('.container_rows_done h2');
        this._rowsPerHourDomText = document.querySelector('.container_rows_per_hour h2');

        this._workingHours = this.checkInputFieldsForNan(this._workingHoursInput.value);
        this.calculateRowsForTheDay();

        // Responsible for updating for fetching the DOM elemenets and keeping track of the current round when a new row is added
        this._numOfCurrentRows = 1;
        this._addRows = document.querySelector('.user_rows');
        this._RowsContainer = document.querySelector('.add_rows_container');

        // EVENT LISTENERS
        // Eventlisterner that continually updates the row summary based on the input in working hours
        this._workingHoursInput.addEventListener('input', () => this.updateWorkingHours());

        // Event listener that adds new row when add button is clicked
        this._addNewRowBtn.addEventListener('click', () => this.addNewRow());
        this._deleteRowBtn.addEventListener('click', () => this.deleteLastRow());

        /* TEST FOR THE CALCULATE FINISHED ROWS METHOD */
        this._addNewRowBtn.addEventListener('click', () => this.calculateFinishedRows());
        this._addNewRowBtn.addEventListener('click', () => this.calculateRowsPerHour());

        // Button eventlistener
        this.buttonsEventListener();
        this.buttonsFinishedAnimationEventListener()

        // Calls a method for checking the last row element so that the program understands which element to remove
        this.updateLastRowElement();

        // Gets the finishes rows when the program loads
        this.calculateFinishedRows();

        // applies the eventlistener to all the row fields when the programme starts
        this.updateRowInputFields();
    }

    checkInputFieldsForNan(inputValue) {
        if (isNaN(inputValue) || inputValue === '') {
            return 0;
        }
        return inputValue;
    }

    updateRowInputFields() {
        this._allRowsInputFields = document.querySelectorAll('.row_quantity_input');
        this._allRowsInputFields.forEach(inputField => {
            inputField.addEventListener('input', () => {
                
                //checks for total amount of numbers, important before calling the following methods as not to cause a bug where the rows per hour is updated despite characters being above three.
                if (inputField.value.length > 3) {
                    inputField.value = inputField.value.slice(0, 3);
                }
                /* Uncomment to prevent empty fields else if (inputField.value == '') {
                    inputField.value = 0;
                } */
                this.calculateFinishedRows();
                this.calculateRowsPerHour();
            });
        });
    }

    buttonsEventListener() {
        this._allButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.buttonAnimation(button);
            });
        });
    }

    buttonsFinishedAnimationEventListener() {
        this._allButtons.forEach(button => {
            button.addEventListener('animationend', () => {
                this.removeButtonAnimation(button)
            }, { once: true });
        });
    }
    
    
    buttonAnimation(button) {
        button.classList.add('shadow-drop-center');
        this.buttonsFinishedAnimationEventListener(button);

    }

    removeButtonAnimation(button) {
        button.classList.remove('shadow-drop-center');
    }
    


    updateLastRowElement() {
        this._lastRowElement = this._RowsContainer.lastElementChild;
    }

    updateWorkingHours() {
            this._workingHours = this.checkInputFieldsForNan(this._workingHoursInput.value);
            this.calculateRowsForTheDay();
            this.calculateFinishedRows()
            this.calculateRowsPerHour()
    }

    calculateRowsForTheDay() {
        const rowsForTheDay = this._workingHours * this._oneHourOfRows;
        this._rowsSummaryDomText.innerText = this.checkInputFieldsForNan(rowsForTheDay);
    }

    calculateFinishedRows() {
        // initializes an empty array which later will store the rows from the input fields
        const arrOfFinishedRows = [];
        // Loops through existing rows, converts the input from string to num and adds it to the array above.
        const rowInputs = document.querySelectorAll(".user_rows");
        for (const rowInput of rowInputs) {
            const inputField = rowInput.querySelector(".row_quantity_input");
            arrOfFinishedRows.push(this.checkInputFieldsForNan(parseInt(inputField.value)));
        }

        // Adds all the array items together and stores in rowSum variable.
        const rowSum = arrOfFinishedRows.reduce((a, b) => a + b, 0);

        this._rowsFinishedDomText.innerText = this.checkInputFieldsForNan(rowSum);
        return rowSum;
    }

    calculateRowsPerHour() {
        const storedRowSum = this.calculateFinishedRows();
        // The if statements makes sure the program cannot throw an 'infinity' if the finished hours is divided by 0
        if (this._workingHours == 0) {
            return
        }
        let rowPerHourCalc = storedRowSum / this._workingHours;
        // Rounds up to at most two decimals
        this._rowsPerHourDomText.innerHTML = this.checkInputFieldsForNan(Math.round(rowPerHourCalc*100)/100);
    }

    addNewRow() {
        if (this._numOfCurrentRows < 20) {
            this._numOfCurrentRows += 1;
            let newRow = this._addRows.cloneNode(true);
            newRow.querySelector('h4').textContent = `Runda ${this._numOfCurrentRows}`;
            // Adds necessary class names to add animation via library
            newRow.classList.add("animate__animated", "animate__pulse", "animate__faster");
            let valueLocation = newRow.querySelector('.row_quantity_input');
            valueLocation.value = 0;
            this._RowsContainer.appendChild(newRow);
            this.updateLastRowElement();
            this.updateRowInputFields();
        }
    }

    deleteLastRow() {
        if (this._numOfCurrentRows > 1) {
            this._numOfCurrentRows -= 1;
            this._lastRowElement.remove();
            this.updateLastRowElement();
        }

        // updates the finished rows
        this.calculateFinishedRows();
        this.updateRowInputFields();
    }

}

const test1 = new EmployeeStatistics('PlaceholderName');