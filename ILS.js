
busArray = [{
    name: "bus1",
    noOfSeats: 300,
    route: "120",
    length: 20
},
{
    name: "bus2",
    noOfSeats: 40,
    route: "120",
    length: 18
},
{
    name: "bus3",
    noOfSeats: 50,
    route: "120",
    length: 20
},
{
    name: "bus4",
    noOfSeats: 35,
    route: "120",
    length: 20
},
{
    name: "bus5",
    noOfSeats: 40,
    route: "120",
    length: 20
},
{
    name: "bus6",
    noOfSeats: 30,
    route: "120",
    length: 20
},
{
    name: "bus7",
    noOfSeats: 30,
    route: "120",
    length: 20
},
{
    name: "bus8",
    noOfSeats: 30,
    route: "120",
    length: 20
},
{
    name: "bus9",
    noOfSeats: 30,
    route: "120",
    length: 20
},
{
    name: "bus10",
    noOfSeats: 30,
    route: "120",
    length: 20
}]

var globalBest = 0;
var currentBestSolution = [];

console.log(generateSchedule("8-9", 20, 5, [50, 20, 40], busArray, 10));

function generateSchedule(timeSlot, fixedInterval, noOfBusses, avgPassengerCount, busArray, maxItarationCount) {
    let allSolutions = [];
    let totalTime = (parseInt(timeSlot.split("-")[1]) - parseInt(timeSlot.split("-")[0]));
    totalTime = totalTime * 60;
    let isValidInitialSolution = true;
    let initialSolution = []
    let noOfSlots = totalTime / fixedInterval;
    let count = 0;
    if (noOfBusses < noOfSlots) {
        return "Number of busses are not enough to generate the schedule"
    }
    for (let r = 0; r < maxItarationCount; r++) {
        let previousGlobalSolution = JSON.parse(JSON.stringify(currentBestSolution));
        let validationCount = 0;
        do {
            initialSolution = generateInitialSolution(noOfSlots, noOfBusses);


            outerloop: for (let i = 0; i < allSolutions.length; i++) {
                validationCount = validationCount + 1
                if (allSolutions[i].toString() == initialSolution.toString()) {
                    isValidInitialSolution = false;
                    break outerloop;
                }

                //All the possible solutions are generated and evaluvated
                if (validationCount > allSolutions.length + 100) {
                    return currentBestSolution;
                }
                if (isValidInitialSolution == false) {
                    isValidInitialSolution = true;
                }

            }

        } while (!isValidInitialSolution);

        allSolutions.push(initialSolution);

        allSolutions.push(swapSolutionElements(initialSolution, avgPassengerCount, busArray));

        if (currentBestSolution.toString() == previousGlobalSolution.toString()) {
            count++;
        } else {
            count = 0;
        }

        if (count > (maxItarationCount / 2)) {
            return currentBestSolution;
        }
    }


    console.log(allSolutions);

    return currentBestSolution;


}


// console.log(generateInitialSolution(3, 5));


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
            isValidRandom = validateRandomValue((currentSum + randomValue), noOfBusses, )

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
            if (globalBest < fitnessValue) {
                globalBest = fitnessValue;
                currentBestSolution = JSON.parse(JSON.stringify(solution));
            }

            if (r != solution.length - 1) {
                let temp = solution[i];
                solution[i] = solution[r + 1];
                solution[r + 1] = temp;


            }

        }

    }

    return currentBestSolution;
}


function evaluvateSolution(solution, passengerAverage, busArray) {
    let spliceIndex = 0;
    let spliceAmount = 0;
    let finessValue = 0;
    // console.log(solution)

    for (let i = 0; i < solution.length; i++) {
        let sumOfSeats = 0;
        let numberOfBusses = solution[i]; //3
        let spliceArray = JSON.parse(JSON.stringify(busArray));

        let newBusArray = spliceArray.splice(spliceIndex, solution[i])
        spliceIndex = spliceIndex + solution[i];
        newBusArray = JSON.parse(JSON.stringify(newBusArray));
        // console.log(newBusArray[0].noOfSeats)


        for (let r = 0; r < newBusArray.length; r++) {
            sumOfSeats = sumOfSeats + newBusArray[r].noOfSeats;
        }
        if (sumOfSeats > passengerAverage[i] + 20) {
            finessValue = finessValue + 1
        } else if (sumOfSeats > passengerAverage[i]) {
            finessValue = finessValue + 2
        } else if (sumOfSeats < passengerAverage[i]) {
            finessValue = finessValue - 1
        }

        // if(solution.length)  Busses wala seat gana ganna mokak hari karanna one :3 
    }

    return finessValue;
}



