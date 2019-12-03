tizen.ppm.requestPermission("http://tizen.org/privilege/healthinfo", onsuccessPermission, onErrorPermission);

function onsuccessPermission() {
	console.log('permission granted');
	
	tizen.humanactivitymonitor.start('HRM', onchangedCB);
	console.log('test');
}

function onchangedCB(hrmInfo) {
	console.log('Heart Rate: ' + hrmInfo.heartRate);
	console.log('Peak-to-peak interval: ' + hrmInfo.rRInterval + ' milliseconds');
	document.getElementById("heartrate").innerText = 'Hartslag: ' + hrmInfo.heartRate;
	document.getElementById("interval").innerText = 'Slag interval: ' + hrmInfo.rRInterval + ' ms';
}

function onErrorPermission() {
	//console.log('permission denied');
}