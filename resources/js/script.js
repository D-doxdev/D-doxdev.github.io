class EmployeeStatistics {
    constructor(name) {
        this._name = name;
        this._oneHourOfRows = 52;
        this._workingHoursInput = document.getElementById('shift_hours');
        this._addNewRowBtn = document.getElementById('add-row-button');
        this._rowsSummary = document.querySelector('.container_rows_summary h2');
        this._workingHours = this._workingHoursInput.value;
        this.calculateRowsForTheDay();


        this._numOfCurrentRows = 1;
        this._addRows = document.querySelector('.user_rows');
        this._addRowsContainer = document.querySelector('.add_rows_container');
        // Eventlisterner that continually updates the row summary based on the input in working hours
        this._workingHoursInput.addEventListener('input', () => this.updateWorkingHours());
        // Event listener that adds new row when add button is clicked
        this._addNewRowBtn.addEventListener('click', () => this.addNewRow());
    }

    updateWorkingHours() {
        this._workingHours = this._workingHoursInput.value;
        this.calculateRowsForTheDay();
    }

    calculateRowsForTheDay() {
        const rowsForTheDay = this._workingHours * this._oneHourOfRows;
        this._rowsSummary.innerText = rowsForTheDay;
    }

    addNewRow() {
        this._numOfCurrentRows += 1;
        const newRow = this._addRows.cloneNode(true);
        newRow.querySelector('h4').textContent = `Runda ${this._numOfCurrentRows}`;
        this._addRowsContainer.appendChild(newRow);
    }
}

const test1 = new EmployeeStatistics('PlaceholderName');