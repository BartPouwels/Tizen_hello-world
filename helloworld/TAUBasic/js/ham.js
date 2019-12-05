tizen.ppm.requestPermission("http://tizen.org/privilege/healthinfo", onsuccessPermission, onErrorPermission);

function onsuccessPermission() {
	console.log('permission granted');
	
	tizen.humanactivitymonitor.start('HRM', onchangedCB);
}

function onErrorPermission() {
	console.log('permission denied');
}

function onchangedCB(hrmInfo) {
	console.log('Hartslag: ' + hrmInfo.heartRate);
	console.log('Slaginterval: ' + hrmInfo.rRInterval + ' milliseconds');
	document.getElementById("secondContent2").innerText = 'Hartslag: ' + hrmInfo.heartRate + ' bpm';
	document.getElementById("secondContent3").innerText = 'Slag interval: ' + hrmInfo.rRInterval + ' ms';
}