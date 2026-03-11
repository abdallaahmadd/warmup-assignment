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




// Function 3: getActiveTime(shiftDuration, idleTime)
function getActiveTime(shiftDuration, idleTime) {
    let shiftSec = timeToSeconds(shiftDuration);
    let idleSec = timeToSeconds(idleTime);
    return secondsToTime(shiftSec - idleSec);
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
    


// ============================================================
// Function 6: setBonus(textFile, driverID, date, newValue)
function setBonus(textFile, driverID, date, newValue) {
    let data = fs.readFileSync(textFile, "utf-8").trim().split("\n");
    for (let i = 0; i < data.length; i++) {
        let cols = data[i].split(",");
        if (cols[0] === driverID && cols[2] === date) {
            cols[9] = newValue;
            data[i] = cols.join(",");
            break;
        }
    }
    fs.writeFileSync(textFile, data.join("\n"));
}
// Function 7: countBonusPerMonth(textFile, driverID, month)

function countBonusPerMonth(textFile, driverID, month) {
    let data = fs.readFileSync(textFile, "utf-8").trim().split("\n");
    let found = false, count = 0;
    for (let row of data) {
        let cols = row.split(",");
        if (cols[0] === driverID) {
            found = true;
            let m = cols[2].split("-")[1];
            if (parseInt(m) === parseInt(month) && cols[9] === "true") count++;
        }
    }
    return found ? count : -1;
}
// Function 8: getTotalActiveHoursPerMonth(textFile, driverID, month)
function getTotalActiveHoursPerMonth(textFile, driverID, month) {
    let data = fs.readFileSync(textFile, "utf-8").trim().split("\n");
    let total = 0;
    for (let row of data) {
        let cols = row.split(",");
        if (cols[0] === driverID) {
            let m = cols[2].split("-")[1];
            if (parseInt(m) === month) total += timeToSeconds(cols[7]);
        }
    }
    return secondsToTime(total);
}
// Function 9: getRequiredHoursPerMonth(textFile, rateFile, bonusCount, driverID, month)
function getRequiredHoursPerMonth(textFile, rateFile, bonusCount, driverID, month)  {
    let shifts = fs.readFileSync(textFile, "utf-8").trim().split("\n");
    let rates = fs.readFileSync(rateFile, "utf-8").trim().split("\n");
    let dayOff;
    for (let r of rates) {
        let cols = r.split(",");
        if (cols[0] === driverID) dayOff = cols[1];
    }
    let total = 0;
    for (let row of shifts) {
        let cols = row.split(",");
        if (cols[0] === driverID) {
            let d = new Date(cols[2]);
            let m = d.getMonth() + 1;
            if (m === month) {
                let weekday = d.toLocaleDateString("en-US", { weekday: "long" });
                if (weekday === dayOff) continue;
                let quota = 8 * 3600 + 24 * 60;
                let eidStart = new Date("2025-04-10");
                let eidEnd = new Date("2025-04-30");
                if (d >= eidStart && d <= eidEnd) quota = 6 * 3600;
                total += quota;
            }
        }
    }
    total -= bonusCount * 2 * 3600;
    return secondsToTime(total);
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
