class EmployeeStatistics {
    constructor(name) {
        this._name = name;
        this._oneHourOfRows = 52;
        this._workingHoursInput = document.getElementById('shift_hours');
        this._rowsSummary = document.querySelector('.container_rows_summary h2');
        this._workingHours = this._workingHoursInput.value;
        this.calculateRowsForTheDay();

        // Eventlisterner that continually updates the row summary based on the input in working hours
        this._workingHoursInput.addEventListener('input', () => this.updateWorkingHours());
    }

    updateWorkingHours() {
        this._workingHours = this._workingHoursInput.value;
        this.calculateRowsForTheDay();
    }

    calculateRowsForTheDay() {
        const rowsForTheDay = this._workingHours * this._oneHourOfRows;
        this._rowsSummary.innerText = rowsForTheDay;
    }
}

const test1 = new EmployeeStatistics('PlaceholderName');

console.log(test1._workingHours);
console.log(test1.calculateRowsForTheDay());