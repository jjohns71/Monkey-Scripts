// ==UserScript==
// @name           Auto Check-In to Southwest Flights (https fix)
// @namespace      https://github.com/jjohns71/Monkey-Scripts
// @version        1.3.4
// @author         Original: Nicholas Buroojy (http://userscripts.org/users/83813) Rehosted: https://github.com/jjohns71/Monkey-Scripts
// @contributor    Ryan Izzo (http://www.ryanizzo.com)
// @contributor    jjohns71 (https://github.com/jjohns71)
// @description    Automatically check in to Southwest Airline flights at the appropriate time.
// @include	  	   https://southwest.com/
// @include        https://southwest.com/flight/retrieveCheckinDoc.html*
// @include        https://southwest.com/flight/selectPrintDocument*
// @include        https://southwest.com/flight/retrieveCheckinDoc.html?int=HOME-BOOKING-WIDGET-AIR-CHECKIN#js-booking-panel-check-in
// @include	  	   https://www.southwest.com/
// @include        https://www.southwest.com/flight/retrieveCheckinDoc.html*
// @include        https://www.southwest.com/flight/selectPrintDocument*
// @include        https://www.southwest.com/flight/retrieveCheckinDoc.html?int=HOME-BOOKING-WIDGET-AIR-CHECKIN#js-booking-panel-check-in
// @copyright      2009+, Nicholas Buroojy (http://userscripts.org/users/83813), 2017+, jjohns71
// @license        GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html

// ==/UserScript==
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//
// History
//
// 10/2012 v1.2	Ryan Izzo  (ryanizzo.com)
//   Updated to use new Southwest Check In page, added validation
//
// 7/2014 v1.3 Ryan Izzo  (ryanizzo.com)
//   Moved script to GitHub since UserScripts appears dead
//
// 01/2016 v1.3.1 (jjohns71)
//  Updated Southwest URLs from http to https
//
// 11/2016 v1.3.3 (jjohns71)
//  Added additional checkin URL's (homepage URL) to include
//
// 06/2017 v1.3.4 (jjohns71)
// Published to github, updated namespace
// TODO: Use Southwest's server's time instead of the client's clock.
// TODO: Test select passenger page.

/////////////  CHECK IN PAGE  ////////////////

var globalSubmitDate;

/**
 * @brief Submit the check in form on the Southwest Check In Online page.
 */
function submitNow()
{
	try{
		//alert(msRemaining + " " + globalSubmitDate);
		var form = document.getElementById("itineraryLookup");
		form.submit();
	}
	catch(e){
		 alert('An error has occurred: '+e.message);
	}
}


/**
 * @brief Display the countdown.
 *
 * TODO: Some formatting is wrong eg ("1:0:12" means 1 hour and 12 seconds remain). Make sure everything is represented with 2 digits.
 */
function displayCountdown()
{
	try{
		var area = document.getElementById("countdown");
		var timeRemain = globalSubmitDate - new Date();
		var days = Math.floor(timeRemain / (1000 * 60 * 60 * 24));
		var hours = Math.floor(timeRemain / (1000 * 60 * 60)) % 24;
		var minutes = Math.floor(timeRemain / (1000 * 60)) % 60;
		//round to the nearest second
		var seconds = Math.round(timeRemain / 1000) % 60;
		//Don't print negative time.
		if (hours < 0 || minutes < 0 || seconds < 0)
		{
			area.innerHTML = "Checking In...";
			return;
		}
		area.innerHTML = "Time Remaining: <strong>";
		//If 0 days remain, omit them.
		if (days != 0)
			area.innerHTML += days + "d ";
		//If 0 hours remain, omit them.
		if (hours != 0)
			area.innerHTML += hours + "h ";
		//Add padding to minute
		if (minutes !=0 )
			//area.innerHTML += "0";
			area.innerHTML += minutes + "m ";
		//Add padding to second
		//if (seconds < 10)
			//area.innerHTML += "0";
		area.innerHTML += seconds;
		area.innerHTML += "s</strong>";
	}
	catch(e){
		 alert('An error has occurred: '+e.message);
	}
}


/**
 * @brief Updates the countdown every second.
 */
function displayCountdownWrapper()
{
	try{
		window.setInterval(displayCountdown, 1000);
	}
	catch(e){
		 alert('An error has occurred: '+e.message);
	}
}


/**
 * @brief Begins the delay at the next even second.
 */
function beginDelay()
{
	try{
		var confNumber = document.getElementById("confirmationNumber").value;
		var firstName = document.getElementById("firstName").value;
		var lastName = document.getElementById("lastName").value;
		
		var month = document.getElementById("month-input").value;
		var day = document.getElementById("day-input").value;
		var year = document.getElementById("year-input").value;
	
		var hour = document.getElementById("hour-input").value;
		var minute = document.getElementById("minute-input").value;
		var second = document.getElementById("second-input").value;
	
		if(confNumber == "" || firstName == "" || lastName == "" ){
			alert("Must fill out Confirmation Number and Name.");
		}
		else if(month == "" || month == "mm" || day == "" || day == "dd" || year == "" || year == "yyyy" 
			|| hour == "" || hour == "hh" || minute == "" || minute == "mm" || second == "" ){
			alert("Must fill out Date and Time.");
		}
		else if(year.length < 4 ){
			alert("Year must be 4 characters.");
		}
		else{
			//Build a date 
			var submitDate = new Date();
			//submitDate.setMonth(month - 1);
			//submitDate.setDate(day);
			submitDate.setFullYear(year, month - 1, day);
			submitDate.setHours(hour);
			submitDate.setMinutes(minute);
			submitDate.setSeconds(second);
			submitDate.setMilliseconds(0);
		
			var now = new Date();
			var msRemaining = submitDate - now;
			//alert(submitDate + " - " + now + " = " + msRemaining);
			
			var maxDays = 14;
			if(msRemaining < 0)
				alert("Date/Time must be in the future.");
			else if(msRemaining > maxDays * 1000 * 60 * 60 * 24)
				alert("Date/Time cannot be more than " + maxDays + " days in the future." + msRemaining);
			else{
				//Install the timeout to submit the form.
				window.setTimeout(submitNow, msRemaining);
		
				globalSubmitDate = submitDate;
				
				//Install a short term timeout to call the countdown wrapper at the beginning of the next second.
				window.setTimeout(displayCountdownWrapper, msRemaining % 1000);
			}
		}
	}
	catch(e){
		 alert('An error has occurred: '+e.message);
	}
}

/**
 * @brief Edits the check in page; Adds Date, time, and Auto Check In button
 *
 * TODO Error handling. (Auto notify the developer when southwest page changes)
 */
function checkInPageFormEdit() 
{ 
	try{
		var leftPanel = document.getElementsByClassName("checkIn_form_leftPanel")[0];
	
		//All of our stuff will go in this div.
		
		var delayDiv = document.createElement("div");
		delayDiv.setAttribute('id','checkInDelay');
		var dateSelect = document.createElement("span");
		dateSelect.setAttribute('id','date-select');
	
		//The big label at the top of the menu
		
		var mainLabel = document.createElement("h4");
		mainLabel.setAttribute('class','swa_feature_checkInOnline_form_header');
		mainLabel.innerHTML = "Set Check In Date and Time";
		dateSelect.innerHTML += "<br/>";
		dateSelect.appendChild(mainLabel);
	
		//The date portion.
		
        var today = new Date();
        
        
		var dateLabel = document.createElement("label");
		dateLabel.innerHTML = "<span class=\"required\">*</span> Date:";
	
		var monthInput = document.createElement("input");
		monthInput.setAttribute('id','month-input');
		monthInput.setAttribute('type','text');
		monthInput.setAttribute('maxlength','2');
		monthInput.setAttribute('size','2');
		monthInput.setAttribute('value',today.getMonth()+1);
		monthInput.setAttribute('onfocus','if(this.value==\'mm\') this.value=\'\';');
		monthInput.setAttribute('style','margin-left:7em');
		monthInput.setAttribute('tabindex','5');
	
		var dayInput = document.createElement("input");
		dayInput.setAttribute('id','day-input');
		dayInput.setAttribute('type','text');
		dayInput.setAttribute('maxlength','2');
		dayInput.setAttribute('size','2');
		dayInput.setAttribute('value',today.getDate());
		dayInput.setAttribute('onfocus','if(this.value==\'dd\') this.value=\'\';');
		dayInput.setAttribute('tabindex','6');
	
		var yearInput = document.createElement("input");
		yearInput.setAttribute('id','year-input');
		yearInput.setAttribute('type','text');
		yearInput.setAttribute('maxlength','4');
		yearInput.setAttribute('size','4');
		yearInput.setAttribute('value',today.getFullYear());
		yearInput.setAttribute('onfocus','if(this.value==\'yyyy\') this.value=\'\';');
		yearInput.setAttribute('tabindex','7');
	
		dateSelect.appendChild(dateLabel);
		dateSelect.appendChild(monthInput);
		dateSelect.innerHTML += "/";
		dateSelect.appendChild(dayInput);
		dateSelect.innerHTML += "/";
		dateSelect.appendChild(yearInput);
		
		// The time portion.
	
		var timeLabel = document.createElement("label");
		timeLabel.innerHTML = "<span class=\"required\">*</span> Time: (24-hour format) ";	
	
		var hourInput = document.createElement("input");
		hourInput.setAttribute('id','hour-input');
		hourInput.setAttribute('type','text');
		hourInput.setAttribute('maxlength','2');
		//hourInput.setAttribute('style','margin-left:10px');
		hourInput.setAttribute('size','2');
		hourInput.setAttribute('value',today.getHours());
		hourInput.setAttribute('onfocus','if(this.value==\'hh\') this.value=\'\';');
		hourInput.setAttribute('tabindex','8');
	
		var minuteInput = document.createElement("input");
		minuteInput.setAttribute('id','minute-input');
		minuteInput.setAttribute('type','text');
		minuteInput.setAttribute('maxlength','2');
		minuteInput.setAttribute('size','2');
		minuteInput.setAttribute('value',today.getMinutes());
		minuteInput.setAttribute('onfocus','if(this.value==\'mm\') this.value=\'\';');
		minuteInput.setAttribute('tabindex','9');
	
		var secondInput = document.createElement("input");
		secondInput.setAttribute('id','second-input');
		secondInput.setAttribute('type','text');
		secondInput.setAttribute('maxlength','2');
		secondInput.setAttribute('size','2');
		secondInput.setAttribute('value','02');
		secondInput.setAttribute('tabindex','10');
	
		dateSelect.innerHTML += "<br/><br/>";
	
		dateSelect.appendChild(timeLabel);
		dateSelect.appendChild(hourInput);
		dateSelect.innerHTML += ":";
		dateSelect.appendChild(minuteInput);
		dateSelect.innerHTML += ":";
		dateSelect.appendChild(secondInput);
	
		delayDiv.appendChild(dateSelect);
	
		delayDiv.innerHTML += "<br/><br />";
	
		// The area that displays how much time remains before the form is submitted.
		
		var countdownArea = document.createElement("div");
		countdownArea.setAttribute('id','countdown');
		countdownArea.innerHTML = "Click to start countdown";
	
		delayDiv.appendChild(countdownArea);
		
		// Auto Check In button
		
		var delayButton = document.createElement("input"); 
		delayButton.setAttribute('id','delay-button'); 
		delayButton.setAttribute('type','button'); 
		delayButton.setAttribute('style','float: right; background-color: #FF3300; color: white'); 
		delayButton.setAttribute('value','Auto Check In'); 
		delayButton.addEventListener("click", beginDelay, true); 
		delayButton.setAttribute('tabindex','11');
	
		delayDiv.appendChild(delayButton);
	
		leftPanel.appendChild(delayDiv);
	}
	catch(e){
		 alert('An error has occurred: '+e.message);
	}
}

/////////////  SELECT PASSENGER PAGE  ////////////////

//automatically select all passengers and submit the form
function autoPassengerPage()
{
	try{
		//find error notification
		if(document.title == "Error")
			return;
	
		// Check all the check boxes.
		var node_list = document.getElementsByTagName('input');
		for (var i = 0; i < node_list.length; i++) {
			var node = node_list[i];
			if (node.getAttribute('type') == 'checkbox') {
				node.checked = true;
			}
		} 
	
		//Click the print button
		var button = document.getElementById("printDocumentsButton");
		button.click();
	}
	catch(e){
		 alert('An error has occurred: '+e.message);
	}

}

//case of the select boarding pass page (regex match the url)
if(/selectPrintDocument/.test(document.location.href))
{
	autoPassengerPage();
}
//case of the check in page
else if(/retrieveCheckinDoc/.test(document.location.href))
{
	checkInPageFormEdit();
}
