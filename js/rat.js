function question1(i){
	var i = 0

		while (i <= 10){
			document.write(i + " ")
			i = i + 1
		}	

	document.write("loop stopped!!")

}



function question2(i){

		var i = prompt("What time is it? ", " 6");

	// checks if time is betweenn 6 and 9, 11 and 13, 17 and 20
		if (i >= 6 && i <= 9){
			window.prompt("Breakfast is served!")
		}

		else if (i>= 11 && i <= 13){
			window.prompt("Time for lunch!")
		}

		else if (i>= 17 && i <= 20){
			window.prompt("Its Dinner Time!")
		}

		else window.prompt("No snacks!")

	}

	
	

