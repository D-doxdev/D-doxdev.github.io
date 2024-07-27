class RowsStatistics {
    constructor() {
        this._oneHourOfRows = 52;

        // Responsible for updating the rows
        this._workingHoursInput = document.getElementById('shift_hours');
        this._plus30MinutesCheckbox = document.getElementById('plus30min');

        // All buttons, used by methods to set eventlisteners and animations
        this._allButtons = document.querySelectorAll('.btn');
        this._informationBtn = document.getElementById('information-button');
        this._addNewRowBtn = document.getElementById('add-row-button');
        this._deleteRowBtn = document.getElementById('remove-row-button');
        
        this._rowsSummaryDomText = document.querySelector('.container_rows_summary h2');
        this._rowsFinishedDomText = document.querySelector('.container_rows_done h2');
        this._rowsPerHourDomText = document.querySelector('.container_rows_per_hour h2');

        this._workingHours = parseFloat(this.checkInputFieldsForNan(this._workingHoursInput.value));
        this.calculateRowsForTheDay();

        // Responsible for updating for fetching the DOM elemenets and keeping track of the current round when a new row is added
        this._numOfCurrentRows = 1;
        this._addRows = document.querySelector('.user_rows');
        this._RowsContainer = document.querySelector('.add_rows_container');

        // Information modal
        this._information_modal = document.querySelector(".information-modal-overlay");

        // remove row modal and modal buttons
        this._modal = document.querySelector(".modal-overlay");
        this._closeBtn = document.querySelector(".close-modal-btn");
        this._acceptBtn = document.querySelector(".accept-modal-btn");

        // EVENT LISTENERS
        // Eventlisterner that updates the row summary based on the input in working hours
        this._workingHoursInput.addEventListener('input', () => this.updateWorkingHours());
        this._plus30MinutesCheckbox.addEventListener('click', () => {
            this.updateWorkingHoursWithCheckbox();
            this.calculateRowsForTheDay();
            this.calculateRowsPerHour();
        });

        // Event listener that adds new row when add button is clicked
        this._addNewRowBtn.addEventListener('click', () => this.addNewRow());

        // Event listener to trigger the method for deleting the last row when pressed
        //this._deleteRowBtn.addEventListener('click', () => this.deleteLastRow());

        /* TEST FOR THE CALCULATE FINISHED ROWS METHOD */
        this._addNewRowBtn.addEventListener('click', () => this.calculateFinishedRows());
        this._addNewRowBtn.addEventListener('click', () => this.calculateRowsPerHour());

        // Button eventlistener
        this.buttonsEventListener();
        this.buttonsFinishedAnimationEventListener()

        // Calls a method for checking the last row element so that the program understands which element to remove
        this.updateLastRowElement();

        // Calculates sum of the finishes rows when the program loads
        this.calculateFinishedRows();

        // applies the eventlistener to all the row fields when the programme starts
        this.updateRowInputFields();

        // Modal event listener
        this._deleteRowBtn.addEventListener("click", (e) => {
            if (this._numOfCurrentRows > 1) {
                this.openModal(this._modal);
            }
        });
        this._modal.addEventListener("click", (e) => this.closeModal(e, true));
        this._closeBtn.addEventListener("click", () => this.closeModal(this._modal, false));
        this._acceptBtn.addEventListener('click', () => {
            this.deleteLastRow();
            this.closeModal(this._modal, false);
        });

        //Information modal eventlistener
        this._information_modal.addEventListener("click", (e) => this.closeModal(e, true));
        this._informationBtn.addEventListener("click", () => this.openModal(this._information_modal));
    }

    updateWorkingHoursWithCheckbox() {
        this._workingHours = parseFloat(this.checkInputFieldsForNan(this._workingHoursInput.value));
        if (this._plus30MinutesCheckbox.checked == true) {
            this._workingHours += 0.5;
        // Stops the subtraction if value equals zero as to stop users from setting the value to negative numbers 
        } else if (this._plus30MinutesCheckbox.checked == false && this._workingHours !== 0 && Number.isInteger(this._workingHours) == false) {
            this._workingHours -= 0.5;
        }
        this._workingHoursInput.value = this._workingHours;
    }

    checkInputFieldsForNan(inputValue) {
        if (isNaN(inputValue) || inputValue === '') {
            return 0;
        }
        return parseFloat(inputValue); // Ensures input is a float
    }

    updateRowInputFields() {
        this._allRowsInputFields = document.querySelectorAll('.row_quantity_input');
        this._allRowsInputFields.forEach(inputField => {
            inputField.addEventListener('input', () => {
                //checks for total amount of numbers, important before calling the following methods as not to cause a bug where the rows per hour is updated despite characters being above three.
                if (inputField.value.length > 3) {
                    inputField.value = inputField.value.slice(0, 3);
                }
                this.calculateFinishedRows();
                this.calculateRowsPerHour();
            });
        });

        /* Sets inputfield to Zero if it is empty */
        this._allRowsInputFields = document.querySelectorAll('.row_quantity_input');
        this._allRowsInputFields.forEach(inputField => {
            inputField.addEventListener('focusout', () => {
                if (inputField.value == '') {
                    inputField.value = 0;
                }
                // Resets the view to the top of the page after exiting a inputfield to fix bug in IOS where the viewport is without the body after exiting row inputfields
                this.scrollToTop();
            });
        });
    }

    // Add/remove button animation
    
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
    

    // Updates the last row element
    updateLastRowElement() {
        this._lastRowElement = this._RowsContainer.lastElementChild;
    }

    // Updates working hours and calls methods for updating rows per hours
    updateWorkingHours() {
        let inputValue = this._workingHoursInput.value;
        if (inputValue.length > 2) {
            inputValue = inputValue.slice(0, 2);
            this._workingHoursInput.value = inputValue;
        }
        this._workingHours = parseFloat(this.checkInputFieldsForNan(inputValue));
        this.calculateRowsForTheDay();
        this.calculateFinishedRows();
        this.calculateRowsPerHour();
    }

    calculateRowsForTheDay() {
        let rowsForTheDay = this._workingHours * this._oneHourOfRows;
        /* Call method to check if checkbox is active*/
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
        let rowPerHourCalc = storedRowSum / this._workingHours;
        // Avoids infinity by dividing by 0 and updates rows per hour when hours input field is set to 0 or empty
        if (this._workingHours == 0 || '') {
            this._rowsPerHourDomText.innerHTML = 0;
        } else
        // Rounds up to at most two decimals
        this._rowsPerHourDomText.innerHTML = this.checkInputFieldsForNan(Math.round(rowPerHourCalc * 100) / 100);
    }

    addNewRow() {
        if (this._numOfCurrentRows < 20) {
            this._numOfCurrentRows += 1;
            let newRow = this._addRows.cloneNode(true);
            newRow.querySelector('h4').textContent = `Runda ${this._numOfCurrentRows}`;
            // Adds necessary classes to add animation via CSS animations library
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
        this.calculateRowsPerHour();
    }

    openModal(modalElement) {
        modalElement.classList.remove("hide");
    }

    closeModal(e, clickedOutside) {
        if (clickedOutside) {
            if (e.target.classList.contains("modal-overlay")) {
                this._modal.classList.add("hide");
            } else if (e.target.classList.contains("information-modal-overlay")) {
                this._information_modal.classList.add("hide");
            }
        } else {
            this._modal.classList.add("hide");
            this._information_modal.classList.add("hide");
        } 
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        });
    }
}

const rowStatistic_1 = new RowsStatistics();