class EmployeeStatistics {
    constructor(name) {
        this._name = name;
        this._oneHourOfRows = 52;
        this._workingHours = document.getElementById('shift_hours').value;
    }
}

const test1 = new EmployeeStatistics('Nicholas');

console.log(test1._workingHours);
