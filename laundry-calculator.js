// Calculate possible combinations of the number of washing and drying cycles
// paid for, number of super washes used at an added cost per wash, and amount
// of money spent given a minimum top-up amount such that the remaining balance
// on the laundry card is below a specified value (or equal to zero).

var washCost, addedWashCost, dryCost, lowestTopUp, initialBalance, moneySpent, index, maxRemainingBalance, remainingBalance;
var i, j, k; // Declare counting variables representing, respectively: number of wash and drying cycles (i), number of top ups made (j), and the number of super washes used (k)
var MAX_WASHES = 100; // Maximum expected number of washes in an 8 month period
var MAX_TOP_UPS = 100; // Maximum expected number of top-ups to the laundry card in an 8 month period
var results = []; // Calculated results to be stored in an array of "type" Result, which is specified below
var washCost, addedWashCost, dryCost, lowestTopUp, maxRemainingBalance; // Variables input by the user to specify needed parameters for calculation
var initialBalance, remainingBalance, moneySpent, index; // Variables used within the calculate function
var washCostTemp, addedWashCostTemp, dryCostTemp, lowestTopUpTemp, maxRemainingBalanceTemp; // Temporary variables used to validate the user's input

function Result(i, k, initialBalance, remainingBalance) { // Function to initialize the Result object
	this.i = i;
	this.k = k;
	this.initialBalance = initialBalance;
	this.remainingBalance = remainingBalance;
}

function checkValues() { // Function to validate the user's input before calculation of results
	// Get the values from the HTML form and assign them to the temporary variables
	washCostTemp = document.getElementById("washCost").value;
	addedWashCostTemp = document.getElementById("addedWashCost").value;
	dryCostTemp = document.getElementById("dryCost").value;
	lowestTopUpTemp = document.getElementById("lowestTopUp").value;
	maxRemainingBalanceTemp = document.getElementById("maxRemainingBalance").value;
	
	if (!($.isNumeric( addedWashCostTemp ))) { // If no valid input received for the added cost of a super wash, assume that this value is zero
		addedWashCostTemp = 0;
	}
	
	if (!($.isNumeric( maxRemainingBalanceTemp ))) { // If no valid input received for the maximum acceptable remaining balance on the card, assume that this value is zero
		maxRemainingBalanceTemp = 0;
	}
	
	if ($.isNumeric( washCostTemp ) && $.isNumeric( addedWashCostTemp ) && $.isNumeric( dryCostTemp ) && $.isNumeric( lowestTopUpTemp ) && $.isNumeric( maxRemainingBalanceTemp )) { // If all of the user inputs are valid, make the temporary variables to be instances of the Number class, and begin checking numbers for logical errors
		washCostTemp = new Number(washCostTemp);
		addedWashCostTemp = new Number(addedWashCostTemp);
		dryCostTemp = new Number(dryCostTemp);
		lowestTopUpTemp = new Number(lowestTopUpTemp);
		maxRemainingBalanceTemp = new Number(maxRemainingBalanceTemp);
		
		if (washCostTemp >= 0 && addedWashCostTemp >= 0 && dryCostTemp >= 0 && lowestTopUpTemp >= 0 && maxRemainingBalanceTemp >= 0) { // Check that all of the input values are positive, otherwise return an error
		
			if ((washCostTemp == 0 && dryCostTemp == 0) || lowestTopUpTemp == 0) { // Check if the cost of a wash, a dry, and lowest top-amount are equal to zero, and return an error if yes
				$("#errorOutput").empty();
				$("#errorOutput").append("<p class='text-mar form-error'>Please enter positive numbers for the per wash cost, per dry cost, and lowest top-up amount!</p>");
				return false;
			}
			else if (maxRemainingBalanceTemp >= (washCostTemp + dryCostTemp)) { // Check that the maximum allowable balance remaining is less than the wash and dry cycle cost (it is assumed that the user will not waste money that is available for more washes)
				$("#errorOutput").empty();
				$("#errorOutput").append("<p class='text-mar form-error'>Maximum allowable should be less than the wash cost and dry cost combined.</p>");
				return false;
			}
			else { // If none of the above errors were caught, return true to indicate the values entered are valid
				return true;
			}
		}
		else {
			$("#errorOutput").empty();
			$("#errorOutput").append("<p class='text-mar form-error'>Please enter positive numbers only!</p>");
			return false;
		}
	}
	else {
		$("#errorOutput").empty();
		$("#errorOutput").append("<p class='text-mar form-error'>Please enter numbers!</p>");
		return false;
	}
}

function setValues() { // Assign values from HTML form to variables, multiplying costs by 100 to work with while calculating
	washCost = new Number(document.getElementById("washCost").value) * 100;
	dryCost = new Number(document.getElementById("dryCost").value) * 100;
	lowestTopUp = new Number(document.getElementById("lowestTopUp").value) * 100;
	
	if (addedWashCostTemp !== 0) {
		addedWashCost = new Number(document.getElementById("addedWashCost").value) * 100;
	}
	else {
		addedWashCost = 0;
	}
	if (addedWashCostTemp !== 0) {
		maxRemainingBalance = new Number(document.getElementById("maxRemainingBalance").value) * 100;
	}
	else {
		maxRemainingBalance = 0;
	}
}

function printResults() { // Print contents of the results array in a table format on the HTML page
	$("#calculatorOutput").empty();
	$("#calculatorOutput").append("<tr class='table-header'><th><p class='text-mar darkgrey-text'># Wash & Dry</p></th><th><p class='text-mar darkgrey-text'># Super Wash</p></th><th><p class='text-mar darkgrey-text'>$ Spent on Card</p></th><th><p class='text-mar darkgrey-text'>Unused $ on Card</p></th></tr>");
	for (index = 0; index < results.length; index++) {
		$("#calculatorOutput").append("<tr class='cursor-link' id='calculatorOutputTemporary' onclick='printStatement(" + index + ")' class='table-row'><td><p class='text-mar darkgrey-text'>" + results[index].i + "</p></td><td><p class='text-mar darkgrey-text'>" + results[index].k + "</p></td><td><p class='text-mar darkgrey-text'>$" + (results[index].initialBalance * 0.01).toFixed(2) + "</p></td><td><p class='text-mar darkgrey-text'>$" + (results[index].remainingBalance * 0.01).toFixed(2) + "</p></td></tr>");
	}
}

function printStatement(index) { // Print summarizing statement corresponding to a given row in the printed table of results
	$("#statementOutput").empty();
	$("#statementOutput").append("<p class='text-mar darkgrey-text'>If washing and drying <strong>" + results[index].i + " times</strong> over 8 months with <strong>" + results[index].k + " super washes</strong>, add a total balance of <strong>$" + (results[index].initialBalance * 0.01).toFixed(2) + "</strong>, leaving an unused balance of <strong>$" + (results[index].remainingBalance * 0.01).toFixed(2) + "</strong>.</p>" );
}

function changeResultTitle() { // Allow this instruction to appear only when specified: i.e. after the table with the rows has been printed
	$("#resultTitle").empty();
	$("#resultTitle").append("Result (click one of the rows above)");
}

function calculate() { // Calculate function to determine the number of top-ups needed to pay for all number of of wash and dry cycles from zero to MAX_WASHES, and the number of super washes to bring the remaining balance on the card to below the acceptable value specified by the user
	for (i = 0; i <= MAX_WASHES; i++) {
		for (j = 0; j <= MAX_TOP_UPS; j++) {
			initialBalance = lowestTopUp * j;
			k = 0;
			if (addedWashCost != 0) { // The case that the remaining balance can be further lowered by paying for more super washes
				for (; k <= i; k++) {
					moneySpent = (washCost + dryCost) * i + k * addedWashCost;
					remainingBalance = initialBalance - moneySpent;
					if (remainingBalance >= 0 && remainingBalance <= maxRemainingBalance) {
						results.push(new Result(i, k, initialBalance, remainingBalance));
					}
				}
			}
			else { // The case that super washes do not cost anything more than a normal wash (the added cost is zero)
				moneySpent = (washCost + dryCost) * i;
				remainingBalance = initialBalance - moneySpent;
				if (remainingBalance >= 0 && remainingBalance <= maxRemainingBalance) {
						results.push(new Result(i, k, initialBalance, remainingBalance));
				}
			}
		}
	}
}

function laundryCalculator() { // Top-level function for the application
	if (checkValues()) {
		$("#errorOutput").empty();
		setValues();
		calculate();
		printResults();
		changeResultTitle();
	}
	else {
		$("#errorOutput").append("<p class='text-mar form-error'>Please try again.</p>");
	}
	
}