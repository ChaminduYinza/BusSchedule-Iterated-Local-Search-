
busArray = [{
    name: "bus1",
    noOfSeats: 40,
    route: "120",
    length: 20,
    totalRevenue: 0,
    numberOfTurns: 0
},
{
    name: "bus2",
    noOfSeats: 47,
    route: "120",
    length: 18,
    totalRevenue: 0,
    numberOfTurns: 0
},
{
    name: "bus3",
    noOfSeats: 40,
    route: "120",
    length: 20,
    totalRevenue: 0,
    numberOfTurns: 0
},
{
    name: "bus4",
    noOfSeats: 50,
    route: "120",
    length: 20,
    totalRevenue: 0,
    numberOfTurns: 0
},
{
    name: "bus5",
    noOfSeats: 45,
    route: "120",
    length: 20,
    totalRevenue: 0,
    numberOfTurns: 0
},
{
    name: "bus6",
    noOfSeats: 30,
    route: "120",
    length: 20,
    totalRevenue: 0,
    numberOfTurns: 0
},
{
    name: "bus7",
    noOfSeats: 30,
    route: "120",
    length: 20,
    totalRevenue: 0,
    numberOfTurns: 0
},
{
    name: "bus8",
    noOfSeats: 30,
    route: "120",
    length: 20,
    totalRevenue: 0,
    numberOfTurns: 0
},
{
    name: "bus9",
    noOfSeats: 30,
    route: "120",
    length: 20,
    totalRevenue: 0,
    numberOfTurns: 0
},
{
    name: "bus10",
    noOfSeats: 30,
    route: "120",
    length: 20,
    totalRevenue: 0,
    numberOfTurns: 0
}]

var globalBest = -100;
var returnJSON = {
    allocation: {
        busAllocation: [],
        busIDs: []
    },
    message: ""
};



console.log(generateSchedule(new Date("October 13, 2014 08:11:00"), new Date("October 13, 2014 09:20:00"), 20, 5, [30, 100, 40], busArray, 10));

function generateSchedule(startTime, endTime, fixedInterval, noOfBusses, avgPassengerCount, busArray, maxItarationCount) {
    let allSolutions = [];
    let totalTime = getHourDifference(startTime, endTime)
    let isValidInitialSolution = true;
    let initialSolution = []
    let noOfSlots = Math.round(totalTime / fixedInterval);
    let count = 0;
    if (noOfBusses < noOfSlots) {
        return [{ message: "Number of busses are not enough to generate the schedule atleast " + noOfSlots + " busses are needed" }];
    } else if (noOfSlots > avgPassengerCount.length) {
        return [{ message: "Passenger average array is not enough to cover an optimal output\nNo of Slots : " + noOfSlots + "\nPassenger Average Array : " + avgPassengerCount.length }];
    }
    for (let r = 0; r < maxItarationCount; r++) {
        let previousGlobalSolution = JSON.parse(JSON.stringify(returnJSON.allocation.busAllocation));
        let validationCount = 0;
        do {
            initialSolution = generateInitialSolution(noOfSlots, noOfBusses);


            outerloop: for (let i = 0; i < allSolutions.length; i++) {
                validationCount = validationCount + 1
                //All the possible solutions are generated and evaluvated
                if (validationCount > allSolutions.length + 100) {
                    if (globalBest <= 0) {
                        // Generated solution is optimal for the given output But the number of busses are more than enough
                        returnJSON.message = "Dummy Message"
                        return returnJSON
                    } else {
                        return returnJSON
                    }
                }
                if (allSolutions[i].toString() == initialSolution.toString()) {
                    isValidInitialSolution = false;
                    break outerloop;
                }
                if (isValidInitialSolution == false) {
                    isValidInitialSolution = true;
                }

            }

        } while (!isValidInitialSolution);

        allSolutions.push(initialSolution);

        allSolutions.push(swapSolutionElements(initialSolution, avgPassengerCount, busArray));

        if (returnJSON.allocation.busAllocation.toString() == previousGlobalSolution.toString()) {
            count++;
        } else {
            count = 0;
        }

        if (count > (maxItarationCount / 2)) {

            if (globalBest <= 0) {
                returnJSON.message = "Dummy Message"
                return returnJSON


            } else {
                return returnJSON
            }
        }
    }

    if (globalBest <= 0) {
        returnJSON.message = "Dummy Message"
        return returnJSON


    } else {
        return returnJSON
    }


}

function setReturnJSON(solution, passengerAverage) {
    for (let i = 0; i < solution.length; i++) {

    }

}

function getHourDifference(dt1, dt2) {
    let diff = dt2 - dt1;
    return Math.floor((diff / 1000) / 60);
}

function generateInitialSolution(noOfSlots, noOfBusses) {

    let solution = []
    let maxValue = (noOfBusses - noOfSlots) + 1;
    let minValue = 1;
    let currentSum = 0;
    let randomValue = 0;
    let isValidRandom;


    for (let i = noOfSlots; i > 0; i--) {


        let sumOfCurrentSolution = solution.reduce((a, b) => a + b, 0);
        let maxRandomForCurrrentIteration = noOfBusses - sumOfCurrentSolution - i + 1;

        if (i == 1) {
            randomValue = maxRandomForCurrrentIteration;
        } else {

            do {
                randomValue = Math.floor((Math.random() * maxValue) + minValue)
                isValidRandom = (maxRandomForCurrrentIteration >= randomValue)

            } while (!isValidRandom);

        }
        do {
            isValidRandom = validateRandomValue((currentSum + randomValue), noOfBusses)

        }
        while (!isValidRandom);
        currentSum = currentSum + randomValue;

        solution.push(randomValue);

    }

    return solution;

}


function validateRandomValue(currentSum, noOfBusses) {
    return currentSum <= noOfBusses;
}


function swapSolutionElements(originalSolution, passengerAverage, busArray) {


    for (let i = 0; i < originalSolution.length; i++) {
        let solution = JSON.parse(JSON.stringify(originalSolution));

        for (let r = i; r < originalSolution.length; r++) {
            let fitnessValue = evaluvateSolution(solution, passengerAverage, busArray);
            if (globalBest == fitnessValue) {
                returnJSON.allocation.busAllocation = JSON.parse(JSON.stringify(solution));
            }
            if (globalBest < fitnessValue) {
                globalBest = fitnessValue;
                returnJSON.allocation.busAllocation = JSON.parse(JSON.stringify(solution));
            }
            if (r != solution.length - 1) {
                let temp = solution[i];
                solution[i] = solution[r + 1];
                solution[r + 1] = temp;
            }

        }

    }
    return returnJSON.allocation.busAllocation;
}


function evaluvateSolution(solution, passengerAverage, busArray) {
    let spliceIndex = 0;
    let finessValue = 0;

    for (let i = 0; i < solution.length; i++) {
        let sumOfSeats = 0;
        let spliceArray = JSON.parse(JSON.stringify(busArray));

        let newBusArray = spliceArray.splice(spliceIndex, solution[i])
        spliceIndex = spliceIndex + solution[i];
        newBusArray = JSON.parse(JSON.stringify(newBusArray));


        for (let r = 0; r < newBusArray.length; r++) {
            sumOfSeats = sumOfSeats + newBusArray[r].noOfSeats;
        }

        let slack = sumOfSeats - passengerAverage[i];

        if (slack < -10) {
            finessValue = finessValue - 2;
        } else if (slack < 0) {
            finessValue = finessValue - 1;
        } else if (slack > 100) {
            finessValue = finessValue - 50;
        } else if (slack > 90) {
            finessValue = finessValue - 40;
        } else if (slack > 80) {
            finessValue = finessValue - 30;
        } else if (slack > 70) {
            finessValue = finessValue - 20;
        } else if (slack > 60) {
            finessValue = finessValue - 10;
        } else if (slack > 50) {
            finessValue = finessValue - 5;
        } else if (slack > 40) {
            finessValue = finessValue - 4;
        } else if (slack > 30) {
            finessValue = finessValue - 3;
        } else if (slack > 20) {
            finessValue = finessValue - 1;
        } else if (slack > 5) {
            finessValue = finessValue + 2;
        } else if (slack > 0) {
            finessValue = finessValue + 1;
        }

        //take the difference instead
        // if (sumOfSeats >= passengerAverage[i] + 17) {
        //     finessValue = finessValue - 1
        // } else if (sumOfSeats >= passengerAverage[i] + 16) {
        //     finessValue = finessValue
        // } else if (sumOfSeats >= passengerAverage[i] + 10 && sumOfSeats < passengerAverage[i] + 15) {
        //     finessValue = finessValue + 2
        // } else if (sumOfSeats > passengerAverage[i]) {
        //     finessValue = finessValue + 1
        // } else if (sumOfSeats < passengerAverage[i]) {
        //     finessValue = finessValue - 2
        // }



        // if (sumOfSeats >= passengerAverage[i] + 50) {
        //     finessValue = finessValue - 3
        // } else if (sumOfSeats >= passengerAverage[i] + 17) {
        //     finessValue = finessValue - 2
        // } else if (sumOfSeats >= passengerAverage[i] + 16) {
        //     finessValue = finessValue
        // } else if (sumOfSeats >= passengerAverage[i] + 10 && sumOfSeats < passengerAverage[i] + 15) {
        //     finessValue = finessValue + 2
        // } else if (sumOfSeats > passengerAverage[i]) {
        //     finessValue = finessValue + 1
        // } else if (sumOfSeats < passengerAverage[i]) {
        //     finessValue = finessValue - 2
        // }

        // if(solution.length)  Busses wala seat gana ganna mokak hari karanna one :3 
    }

    return finessValue;
}



