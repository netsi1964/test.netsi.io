/*global $, localStorage, angular, alert, document, console, confirm, require */
/*jshint unused:false */
/*jshint plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */

// https://www.npmjs.com/package/suncalc
// https://www.npmjs.com/package/geolib
var SunCalc = require('suncalc');

module.exports = function (options) {
	var now = new Date();
	var oneDay = 1000*60*60*24;
	options = options || {
		"latitude": 56.2807040,
		"longitude": 10.3202970
	};

	var location = options;
	var months = ["januar", "februar", "marts", "april", "maj", "juni", "juli", "august", "september", "oktober", "november", "december"];

	var shortestDay = SunCalc.getTimes(new Date(now.getFullYear() - 1, 11, 21), location.latitude, location.longitude);

	function getSecondsInADay(times) {
		var up = times.sunrise.getHours() * 60 * 60 + times.sunrise.getMinutes() * 60 + times.sunrise.getSeconds();
		var down = times.sunset.getHours() * 60 * 60 + times.sunset.getMinutes() * 60 + times.sunset.getSeconds();
		return down - up;
	}

	function hms(sec) {
		var hms = {};
		var hours = Math.floor(sec / 3600);
		sec -= hours * 3600;
		var minutes = Math.floor(sec / 60);
		sec -= minutes * 60;
		hms.hours = hours;
		hms.minutes = minutes;
		hms.seconds = sec;
		return hms;
	}

	function hmsFriendly(hms) {
		var s = "";
		var hours = (hms.hours > 0) ? hms.hours + " hour" + ((hms.hours > 1) ? "s" : "") : "";
		var minutes = (hms.minutes > 0) ? ((s !== "") ? " and " : "") + hms.minutes + " minute" + ((hms.minutes > 1) ? "s" : "") : "";
		var seconds = (hms.seconds > 0) ? ((s !== "") ? " and " : "") + hms.seconds + " second" + ((hms.seconds > 1) ? "s" : "") : "";
		s = hours;
		s += (minutes !== "") ? ((s !== "") ? ((seconds !== "") ? ", " : " and ") : "") + minutes : "";
		s += ((seconds !== "") ? ((s!=="") ? " and " : "") + seconds : "");
		return s;
	}

	shortestDay.duration = getSecondsInADay(shortestDay);
	
	now = new Date();
	var daysOfYear = 10 ; //(now-new Date(0, 0, 1))/(1000*60*60*24)+1;
	var sun = [];
	var step = 1;
	var fb = "<!DOCTYPE html><html lang=\"en\"><head><script type=\"text/javascript\" src=\"https://www.google.com/jsapi\"></script></head><body><h1>Length of the daylight time</h1><div id=\"chart_div\"><div>"
	fb += "<script>google.load('visualization', '1', {packages: ['corechart', 'line']});";
	fb += "google.setOnLoadCallback(drawBasic);";
	fb += "function drawBasic() {";
	fb += "var data = new google.visualization.DataTable();";
	fb += "data.addColumn('date', 'X');";
	fb += "data.addColumn('number', 'Daylight');";
	fb += "data.addColumn({type:'string', role:'tooltip'});";
   	fb += "data.addRows([%DATA%]);";

	fb += "var options = {";
	fb += "hAxis: {";
	fb += "title: 'Date'";
	fb += "},";
	fb += "vAxis: {";
	fb += "title: 'Daylight'";
	fb += "}";
	fb += "};";
	fb += "var chart = new google.visualization.LineChart(document.getElementById('chart_div'));";
	fb += "chart.draw(data, options);";
	fb += "}</script>";
	fb+="</body></html>"
	var DATA = "";
	var counter = 0;
	var hour = 60*60;
	for (var d = 0; d < 366; d += step) {
		var today = SunCalc.getTimes(now, location.latitude, location.longitude);
		today.duration = getSecondsInADay(today);
		var diff = today.duration - shortestDay.duration;
		var day = {
			"day": now.getDate() + ". " + months[now.getMonth()],
			"diff": diff,
			"friendly": hmsFriendly(hms(Math.abs(diff)))
		};
		DATA += (DATA!=="" ? "," : "")+"[new Date("+now.getFullYear()+","+now.getMonth()+","+now.getDate()+"),"+(diff/hour)+",'"+day.day+":\\n "+hmsFriendly(hms(Math.abs(diff)))+"']";
		now.setDate(now.getDate() + step);
	}
	return fb.replace("%DATA%", DATA);
}