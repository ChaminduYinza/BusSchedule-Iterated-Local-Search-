
busArray = [{
    busID: "bus1",
    noOfSeats: 40,
    route: "120",
    length: 20,
    totalRevenue: 0,
    numberOfTurns: 0,
    revenueForTheIteration: 0
},
{
    busID: "bus2",
    noOfSeats: 47,
    route: "120",
    length: 18,
    totalRevenue: 0,
    numberOfTurns: 0,
    revenueForTheIteration: 0
},
{
    busID: "bus3",
    noOfSeats: 40,
    route: "120",
    length: 20,
    totalRevenue: 0,
    numberOfTurns: 0,
    revenueForTheIteration: 0
},
{
    busID: "bus4",
    noOfSeats: 50,
    route: "120",
    length: 20,
    totalRevenue: 0,
    numberOfTurns: 0,
    revenueForTheIteration: 0
},
{
    busID: "bus5",
    noOfSeats: 45,
    route: "120",
    length: 20,
    totalRevenue: 0,
    numberOfTurns: 0,
    revenueForTheIteration: 0
},
{
    busID: "bus6",
    noOfSeats: 30,
    route: "120",
    length: 20,
    totalRevenue: 0,
    numberOfTurns: 0,
    revenueForTheIteration: 0
},
{
    busID: "bus7",
    noOfSeats: 30,
    route: "120",
    length: 20,
    totalRevenue: 0,
    numberOfTurns: 0,
    revenueForTheIteration: 0
},
{
    busID: "bus8",
    noOfSeats: 30,
    route: "120",
    length: 20,
    totalRevenue: 0,
    numberOfTurns: 0,
    revenueForTheIteration: 0
},
{
    busID: "bus9",
    noOfSeats: 30,
    route: "120",
    length: 20,
    totalRevenue: 0,
    numberOfTurns: 0,
    revenueForTheIteration: 0
},
{
    busID: "bus10",
    noOfSeats: 30,
    route: "120",
    length: 20,
    totalRevenue: 0,
    numberOfTurns: 0,
    revenueForTheIteration: 0

}]

var globalBest = -100;
var returnJSON = {
    allocation: {
        busAllocation: [],
        busIDs: []
    },
    message: ""
};



console.log(generateSchedule(new Date("October 13, 2014 08:11:00"), new Date("October 13, 2014 09:20:00"), 20, 5, [30, 30, 10], busArray, 10));

function generateSchedule(startTime, endTime, fixedInterval, noOfBusses, avgPassengerCount, busArray, maxIterationCount) {
    let allSolutions = [];
    let totalTime = getHourDifference(startTime, endTime)
    let isValidInitialSolution = true;
    let initialSolution = []
    let noOfSlots = Math.round(totalTime / fixedInterval);
    let count = 0;
    if (noOfBusses < noOfSlots) {
        returnJSON.message = "Number of busses are not enough to generate the schedule atleast " + noOfSlots + " busses are needed";
        return returnJSON;
    } else if (noOfSlots > avgPassengerCount.length) {
        returnJSON.message = "Passenger average array is not enough to cover an optimal output\nNo of Slots : " + noOfSlots + "\nPassenger Average Array : " + avgPassengerCount.length;
        return returnJSON;
    }
    //Generate solutions and evaluvate untill maxiteration count exceed
    for (let r = 0; r < maxIterationCount; r++) {
        let previousGlobalSolution = JSON.parse(JSON.stringify(returnJSON.allocation.busAllocation));
        let validationCount = 0;
        do {
            //Intialize a new soluion
            initialSolution = generateInitialSolution(noOfSlots, noOfBusses);
            //Validating whether the generated solutions is arleady evaluvated or not
            outerloop: for (let i = 0; i < allSolutions.length; i++) {
                validationCount = validationCount + 1

                //Statement becomes true if all the possible solutions are already generated
                if (validationCount > allSolutions.length + 100) {
                    if (globalBest <= 0) {
                        // Generated solution is optimal for the given output But the number of busses are more than enough
                        returnJSON.message = "Dummy Message"
                        return returnJSON
                    } else {
                        return returnJSON
                    }
                }

                //Break from the loop and generate another solutions if the current solutions is already beign generated 
                if (allSolutions[i].toString() == initialSolution.toString()) {
                    isValidInitialSolution = false;
                    break outerloop;
                }
                //Change isValidInitialSolution true in order to break from the loop
                if (isValidInitialSolution == false) {
                    isValidInitialSolution = true;
                }
            }
        } while (!isValidInitialSolution);

        //Adding the current solutions to the all solution array(pool)
        allSolutions.push(initialSolution);
        //Swap elements and evaluvate
        allSolutions.push(swapSolutionElements(initialSolution, avgPassengerCount, busArray));
        if (returnJSON.allocation.busAllocation.toString() == previousGlobalSolution.toString()) {
            count++;
        } else {
            count = 0;
        }
        if (count > (maxIterationCount / 2)) {
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
            let returnEvaluvateSolution = evaluvateSolution(solution, passengerAverage, busArray);
            console.log(returnEvaluvateSolution);
            console.log(solution);
            console.log("\n")
            fitnessValue = returnEvaluvateSolution.fitnessValue;
            if (globalBest == fitnessValue) {
                returnJSON.allocation.busAllocation = JSON.parse(JSON.stringify(solution));
                returnJSON.allocation.busIDs = returnEvaluvateSolution.busIDs
            }
            if (globalBest < fitnessValue) {
                globalBest = fitnessValue;
                returnJSON.allocation.busAllocation = JSON.parse(JSON.stringify(solution));
                returnJSON.allocation.busIDs = returnEvaluvateSolution.busIDs
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
    let returnEvaluvateJSON = {
        busIDs: [],
        fitnessValue: 0
    }

    for (let i = 0; i < solution.length; i++) {
        let sumOfSeats = 0;
        let spliceArray = JSON.parse(JSON.stringify(busArray));


        let newBusArray = spliceArray.splice(spliceIndex, solution[i])
        spliceIndex = spliceIndex + solution[i];
        newBusArray = JSON.parse(JSON.stringify(newBusArray));


        for (let r = 0; r < newBusArray.length; r++) {
            sumOfSeats = sumOfSeats + newBusArray[r].noOfSeats;
            if (r == 0) {
                returnEvaluvateJSON.busIDs[i] = newBusArray[r].busID;
            } else {
                returnEvaluvateJSON.busIDs[i] += "," + newBusArray[r].busID;
            }

        }

        let slack = sumOfSeats - passengerAverage[i];

        if (slack < -10) {
            returnEvaluvateJSON.fitnessValue = returnEvaluvateJSON.fitnessValue - 2;
        } else if (slack < 0) {
            returnEvaluvateJSON.fitnessValue = returnEvaluvateJSON.fitnessValue - 1;
        } else if (slack > 100) {
            returnEvaluvateJSON.fitnessValue = returnEvaluvateJSON.fitnessValue - 50;
        } else if (slack > 90) {
            returnEvaluvateJSON.fitnessValue = returnEvaluvateJSON.fitnessValue - 40;
        } else if (slack > 80) {
            returnEvaluvateJSON.fitnessValue = returnEvaluvateJSON.fitnessValue - 30;
        } else if (slack > 70) {
            returnEvaluvateJSON.fitnessValue = returnEvaluvateJSON.fitnessValue - 20;
        } else if (slack > 60) {
            returnEvaluvateJSON.fitnessValue = returnEvaluvateJSON.fitnessValue - 10;
        } else if (slack > 50) {
            returnEvaluvateJSON.fitnessValue = returnEvaluvateJSON.fitnessValue - 5;
        } else if (slack > 40) {
            returnEvaluvateJSON.fitnessValue = returnEvaluvateJSON.fitnessValue - 4;
        } else if (slack > 30) {
            returnEvaluvateJSON.fitnessValue = returnEvaluvateJSON.fitnessValue - 3;
        } else if (slack > 20) {
            returnEvaluvateJSON.fitnessValue = returnEvaluvateJSON.fitnessValue - 1;
        } else if (slack > 5) {
            returnEvaluvateJSON.fitnessValue = returnEvaluvateJSON.fitnessValue + 2;
        } else if (slack > 0) {
            returnEvaluvateJSON.fitnessValue = returnEvaluvateJSON.fitnessValue + 1;
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

    return returnEvaluvateJSON;
}



