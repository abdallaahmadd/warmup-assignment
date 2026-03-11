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
function metQuota(date, activeTime) {
  let activeSec = timeToSeconds(activeTime);
    let quota = 8 * 3600 + 24 * 60; // 8h 24m
    let d = new Date(date);
    let eidStart = new Date("2025-04-10");
    let eidEnd = new Date("2025-04-30");
    if (d >= eidStart && d <= eidEnd) quota = 6 * 3600;
    return activeSec >= quota;
}
}

// ============================================================
// Function 5: addShiftRecord(textFile, shiftObj)
function addShiftRecord(textFile, shiftObj) {
        let data = fs.readFileSync(textFile, "utf-8").trim().split("\n");
    for (let row of data) {
        let cols = row.split(",");
        if (cols[0] === shiftObj.driverID && cols[2] === shiftObj.date) return {};
    }
    let shiftDuration = getShiftDuration(shiftObj.startTime, shiftObj.endTime);
    let idleTime = getIdleTime(shiftObj.startTime, shiftObj.endTime);
    let activeTime = getActiveTime(shiftDuration, idleTime);
    let met = metQuota(shiftObj.date, activeTime);
     let newEntry = {
        driverID: shiftObj.driverID,
        driverName: shiftObj.driverName,
        date: shiftObj.date,
        startTime: shiftObj.startTime,
        endTime: shiftObj.endTime,
        shiftDuration,
        idleTime,
        activeTime,
        metQuota: met,
        hasBonus: false
    };

    data.push(Object.values(newEntry).join(","));
    fs.writeFileSync(textFile, data.join("\n"));
    return newEntry;
}
    
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
