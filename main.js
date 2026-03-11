const fs = require("fs");

// helper functions 
function timeToSeconds(timeStr) {
    let [h, m, s] = timeStr.split(":").map(Number);
    return h * 3600 + m * 60 + s;
}
function secondsToTime(totalSeconds) {
    let h = Math.floor(totalSeconds / 3600);
    let m = Math.floor((totalSeconds % 3600) / 60);
    let s = totalSeconds % 60;
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
function parseTime(timeStr) {
    let [time, period] = timeStr.trim().split(" ");
    let [h, m, s] = time.split(":").map(Number);
    if (period.toLowerCase() === "pm" && h !== 12) h += 12;
    if (period.toLowerCase() === "am" && h === 12) h = 0;
    return new Date(2000, 0, 1, h, m, s);
}
// Function 1: getShiftDuration(startTime, endTime)
function getShiftDuration(startTime, endTime) {
    let start = parseTime(startTime);
    let end = parseTime(endTime);
    let diff = (end - start) / 1000;
    return secondsToTime(diff);
}

}
// Function 2: getIdleTime(startTime, endTime)
function getIdleTime(startTime, endTime) {
let start = parseTime(startTime);
    let end = parseTime(endTime);
    let deliveryStart = new Date(2000, 0, 1, 8, 0, 0);
    let deliveryEnd = new Date(2000, 0, 1, 22, 0, 0);

    let idle = 0;
    if (start < deliveryStart) idle += (Math.min(end, deliveryStart) - start) / 1000;
    if (end > deliveryEnd) idle += (end - Math.max(start, deliveryEnd)) / 1000;
    return secondsToTime(idle);
}

}


// Function 3: getActiveTime(shiftDuration, idleTime)
function getActiveTime(shiftDuration, idleTime) {
    let shiftSec = timeToSeconds(shiftDuration);
    let idleSec = timeToSeconds(idleTime);
    return secondsToTime(shiftSec - idleSec);
}
}

// ============================================================
// Function 4: metQuota(date, activeTime)
// date: (typeof string) formatted as yyyy-mm-dd
// activeTime: (typeof string) formatted as h:mm:ss
// Returns: boolean
// ============================================================
function metQuota(date, activeTime) {
    // TODO: Implement this function
}

// ============================================================
// Function 5: addShiftRecord(textFile, shiftObj)
// textFile: (typeof string) path to shifts text file
// shiftObj: (typeof object) has driverID, driverName, date, startTime, endTime
// Returns: object with 10 properties or empty object {}
// ============================================================
function addShiftRecord(textFile, shiftObj) {
    // TODO: Implement this function
}

// ============================================================
// Function 6: setBonus(textFile, driverID, date, newValue)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// date: (typeof string) formatted as yyyy-mm-dd
// newValue: (typeof boolean)
// Returns: nothing (void)
// ============================================================
function setBonus(textFile, driverID, date, newValue) {
    // TODO: Implement this function
}

// ============================================================
// Function 7: countBonusPerMonth(textFile, driverID, month)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// month: (typeof string) formatted as mm or m
// Returns: number (-1 if driverID not found)
// ============================================================
function countBonusPerMonth(textFile, driverID, month) {
    // TODO: Implement this function
}

// ============================================================
// Function 8: getTotalActiveHoursPerMonth(textFile, driverID, month)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// month: (typeof number)
// Returns: string formatted as hhh:mm:ss
// ============================================================
function getTotalActiveHoursPerMonth(textFile, driverID, month) {
    // TODO: Implement this function
}

// ============================================================
// Function 9: getRequiredHoursPerMonth(textFile, rateFile, bonusCount, driverID, month)
// textFile: (typeof string) path to shifts text file
// rateFile: (typeof string) path to driver rates text file
// bonusCount: (typeof number) total bonuses for given driver per month
// driverID: (typeof string)
// month: (typeof number)
// Returns: string formatted as hhh:mm:ss
// ============================================================
function getRequiredHoursPerMonth(textFile, rateFile, bonusCount, driverID, month) {
    // TODO: Implement this function
}

// ============================================================
// Function 10: getNetPay(driverID, actualHours, requiredHours, rateFile)
// driverID: (typeof string)
// actualHours: (typeof string) formatted as hhh:mm:ss
// requiredHours: (typeof string) formatted as hhh:mm:ss
// rateFile: (typeof string) path to driver rates text file
// Returns: integer (net pay)
// ============================================================
function getNetPay(driverID, actualHours, requiredHours, rateFile) {
    // TODO: Implement this function
}

module.exports = {
    getShiftDuration,
    getIdleTime,
    getActiveTime,
    metQuota,
    addShiftRecord,
    setBonus,
    countBonusPerMonth,
    getTotalActiveHoursPerMonth,
    getRequiredHoursPerMonth,
    getNetPay
};
