class EmployeeStatistics {
    constructor() {
        this._oneHourOfRows = 52;

        // Responsible for updating the rows
        this._workingHoursInput = document.getElementById('shift_hours');
        this._addNewRowBtn = document.getElementById('add-row-button');
        
        this._rowsSummaryDomText = document.querySelector('.container_rows_summary h2');
        this._rowsFinishedDomText = document.querySelector('.container_rows_done h2');
        this._rowsPerHourDomText = document.querySelector('.container_rows_per_hour h2');

        this._workingHours = this._workingHoursInput.value;
        this.calculateRowsForTheDay();

        // Responsible for updating for fetching the DOM elemenets and keeping track of the current round when a new row is added
        this._numOfCurrentRows = 1;
        this._addRows = document.querySelector('.user_rows');
        this._RowsContainer = document.querySelector('.add_rows_container');

        // Responsible for deleting last row when the delete button is pressed
        this._deleteRowBtn = document.getElementById('remove-row-button');

        // EVENT LISTENERS
        // Eventlisterner that continually updates the row summary based on the input in working hours
        this._workingHoursInput.addEventListener('input', () => this.updateWorkingHours());

        // Event listener that adds new row when add button is clicked
        this._addNewRowBtn.addEventListener('click', () => this.addNewRow());
        this._deleteRowBtn.addEventListener('click', () => this.deleteLastRow());

        /* TEST FOR THE CALCULATE FINISHED ROWS METHOD */
        this._addNewRowBtn.addEventListener('click', () => this.calculateFinishedRows());
        this._addNewRowBtn.addEventListener('click', () => this.calculateRowsPerHour());

        // Calls a method for checking the last row element so that the program understands which element to remove
        this.updateLastRowElement();

        // Gets the finishes rows when the program loads
        this.calculateFinishedRows();

        // applies the eventlistener to all the row fields when the programme starts
        this.updateRowInputFields();
    }

    updateRowInputFields() {
        this._allRowsInputFields = document.querySelectorAll('.row_quantity_input');
        this._allRowsInputFields.forEach(inputField => {
            inputField.addEventListener('input', () => this.calculateFinishedRows());
            inputField.addEventListener('input', () => this.calculateRowsPerHour());
        });
    }

    updateLastRowElement() {
        this._lastRowElement = this._RowsContainer.lastElementChild;
    }

    updateWorkingHours() {
        this._workingHours = this._workingHoursInput.value;
        this.calculateRowsForTheDay();
        this.calculateFinishedRows()
        this.calculateRowsPerHour()
    }

    calculateRowsForTheDay() {
        const rowsForTheDay = this._workingHours * this._oneHourOfRows;
        this._rowsSummaryDomText.innerText = rowsForTheDay;
    }

    calculateFinishedRows() {
        // initializes an empty array which later will store the rows from the input fields
        const arrOfFinishedRows = [];

        // Loops through existing rows, converts the input from string to num and adds it to the array above.
        const rowInputs = document.querySelectorAll(".user_rows");
        for (const rowInput of rowInputs) {
            const inputField = rowInput.querySelector(".row_quantity_input");
            arrOfFinishedRows.push(parseInt(inputField.value));
        }

        // Adds all the array items together and stores in rowSum variable.
        console.log(arrOfFinishedRows);
        const rowSum = arrOfFinishedRows.reduce((a, b) => a + b, 0);

        this._rowsFinishedDomText.innerText = rowSum;
        return rowSum;
    }

    calculateRowsPerHour() {
        const storedRowSum = this.calculateFinishedRows();
        let rowPerHourCalc = storedRowSum / this._workingHours;
        // Rounds up to at most two decimals
        this._rowsPerHourDomText.innerHTML = Math.round(rowPerHourCalc*100)/100;
    }

    addNewRow() {
        if (this._numOfCurrentRows < 20) {
            this._numOfCurrentRows += 1;
            let newRow = this._addRows.cloneNode(true);
            newRow.querySelector('h4').textContent = `Runda ${this._numOfCurrentRows}`;
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