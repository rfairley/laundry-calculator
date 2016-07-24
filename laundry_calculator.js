		var washCost, addedWashCost, dryCost, lowestTopUp, i, j, k, initialBalance, moneySpent, index, maxRemainingBalance, remainingBalance;
		var MAX_WASHES = 100;
		var MAX_TOP_UPS = 100;
		var results = [];
		var washCostTemp, addedWashCostTemp, dryCostTemp, lowestTopUpTemp, maxRemainingBalanceTemp;
		function Result(i, k, initialBalance, remainingBalance) {
			this.i = i;
			this.k = k;
			this.initialBalance = initialBalance;
			this.remainingBalance = remainingBalance;
		}
		function checkValues() {
			washCostTemp = document.getElementById("washCost").value;
			addedWashCostTemp = document.getElementById("addedWashCost").value;
			dryCostTemp = document.getElementById("dryCost").value;
			lowestTopUpTemp = document.getElementById("lowestTopUp").value;
			maxRemainingBalanceTemp = document.getElementById("maxRemainingBalance").value;
			if (!($.isNumeric( addedWashCostTemp ))) {
				addedWashCostTemp = 0;
			}
			if (!($.isNumeric( maxRemainingBalanceTemp ))) {
				maxRemainingBalanceTemp = 0;
			}
			if ($.isNumeric( washCostTemp ) && $.isNumeric( addedWashCostTemp ) && $.isNumeric( dryCostTemp ) && $.isNumeric( lowestTopUpTemp ) && $.isNumeric( maxRemainingBalanceTemp )) {
				if (washCostTemp >= 0 && addedWashCostTemp >= 0 && dryCostTemp >= 0 && lowestTopUpTemp >= 0 && maxRemainingBalanceTemp >= 0) {
					if (washCostTemp == 0 || dryCostTemp == 0 || lowestTopUpTemp == 0) {
						$("#errorOutput").empty();
						$("#errorOutput").append("<p>Please enter positive numbers for the per wash cost, per dry cost, and lowest top-up amount!</p>");
						return false;
					}
					else {
						return true;
					}
				}
				else {
					$("#errorOutput").empty();
					$("#errorOutput").append("<p>Please do not enter negative numbers!</p>");
					return false;
				}
			}
			else {
				$("#errorOutput").empty();
				$("#errorOutput").append("<p>Please enter numbers!</p>");
				return false;
			}
		}
		function setValues() {
			washCost = document.getElementById("washCost").value * 100;
			dryCost = document.getElementById("dryCost").value * 100;
			lowestTopUp = document.getElementById("lowestTopUp").value * 100;
			if (addedWashCostTemp !== 0) {
				addedWashCost = document.getElementById("addedWashCost").value * 100;
			}
			else {
				addedWashCost = 0;
			}
			if (addedWashCostTemp !== 0) {
				maxRemainingBalance = document.getElementById("maxRemainingBalance").value * 100;
			}
			else {
				maxRemainingBalance = 0;
			}
		}
		function printResults() {
			for (index = 0; index < results.length; index++) {
				$("#calculatorOutput").empty();
				$("#calculatorOutput").append("<tr class='table-header'><th><h4>Total number of times Washing and Drying</h4></th><th><h4>Number of times with Super Wash added on</h4></th><th><h4>Total Balance Spent on Card</h4></th><th><h4>Unused Balance Remaining on Card</h4></th></tr><tr id='calculatorOutputTemporary' onclick='printStatement(" + index + ")' class='table-row'><td><p>" + results[index].i + "</p></td><td><p>" + results[index].k + "</p></td><td><p>$" + (results[index].initialBalance * 0.01).toFixed(2) + "</p></td><td><p>$" + (results[index].remainingBalance * 0.01).toFixed(2) + "</p></td></tr>");
			}
		}
		function printStatement(index) {
			$("#statementOutput").empty();
			$("#statementOutput").append("<p>If washing and drying <strong>" + results[index].i + " times</strong> over 8 months with <strong>" + results[index].k + " super washes</strong>, add a total balance of <strong>$" + (results[index].initialBalance * 0.01).toFixed(2) + "</strong>, leaving an unused balance of <strong>$" + (results[index].remainingBalance * 0.01).toFixed(2) + "</strong>.</p>" );
		}
		function changeResultTitle() {
			$("#resultTitle").empty();
			$("#resultTitle").append("Result (click one of the rows above)");
		}
		/*function filterSuperWash() {
			for (index = 0; index < results.length; index++) {
				if (results[index].remainingBalance == 0) {
					$("#calculatorOutput").append("<p>hhhhhhhh</p>")
					var m;
					for (m = 1 + index; (results[m].i == results[index].i) && (m < (results.length)); m++) {
						$("#calculatorOutput").append("<p>>>>>>>ggggggg</p>")
						if (results[m].remainingBalance == 0) {
							$("#calculatorOutput").append("<p>>>>>>>>>>>>>>>aaaaaaaaaaaaaa</p>")
							delete results(index + m);
						}
					}
				}
			}
		}*/
		function calculate() {
			for (i = 0; i <= MAX_WASHES; i++) {
				for (j = 0; j <= MAX_TOP_UPS; j++) {
					initialBalance = lowestTopUp * j;
					k = 0;
					if (addedWashCost != 0) {
						for (; k <= i; k++) {
							moneySpent = (washCost + dryCost) * i + k * addedWashCost;
							remainingBalance = initialBalance - moneySpent;
							if (remainingBalance >= 0 && remainingBalance <= maxRemainingBalance) {
								results.push(new Result(i, k, initialBalance, remainingBalance));
							}
						}
					}
					else {
						moneySpent = (washCost + dryCost) * i;
						remainingBalance = initialBalance - moneySpent;
						if (remainingBalance >= 0 && remainingBalance <= maxRemainingBalance) {
								results.push(new Result(i, k, initialBalance, remainingBalance));
						}
					}
				}
			}
		}
		function laundryCalculator() {
			if (checkValues()) {
				$("#errorOutput").empty();
				setValues();
				calculate();
				printResults();
				changeResultTitle();
			}
			else {
				$("#errorOutput").append("<p>Please try again.</p>");
			}
			
		}