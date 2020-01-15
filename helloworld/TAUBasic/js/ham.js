tizen.ppm.requestPermission("http://tizen.org/privilege/healthinfo", onsuccessPermission, onErrorPermission);
var heartRateEnabeled = 0;

function onsuccessPermission() {
	console.log('permission granted');
	
	tizen.humanactivitymonitor.start('HRM');
	stressUpdate();
	heartRateEnabeled = 1;
}

//permission error callback
function onErrorPermission() {
	console.log('permission denied');
}

//HAM API callback
var previousInterval;
var variationArray = [];
function onchangedCB(hrmInfo) {
	//ignore wrong values
	if(hrmInfo.heartRate < 10){console.log("skipped"); return}
	
	//calculate interval
	var currentInterval = Math.round(60000/hrmInfo.heartRate);
	
	if(previousInterval){
		var variation = Math.abs(previousInterval - currentInterval);
	    document.getElementById("secondContent").innerText = previousInterval;
	    document.getElementById("secondContent2").innerText = currentInterval;
	    document.getElementById("secondContent3").innerText = variation;
	    
	    //push variation to array
	    variationArray.push(variation);
	    
	    //if array is full, upload to firebase
	    if(variationArray.length >= 6){
	    	//calculate average variation
	    	var total = 0;
	    	for(var i = 0; i < variationArray.length; i++) {
	    	    total += variationArray[i];
	    	}
	    	//get average with 1 decimal place
	    	var avg = Math.round((total / variationArray.length)*10)/10;
	    	
	    	//upload that average and clear the array
	    	document.getElementById("secondContent4").innerText = avg;
	    	variationArray = [];
	    }
	}
	previousInterval = currentInterval;
}

//HAM error callback
function onerrorCB(error) {
    console.log('Error occurred. Name:' + error.name + ', message: ' + error.message);
    heartRateEnabeled = 0;
}

//stress calculation
function stressUpdate(){
	tizen.humanactivitymonitor.getHumanActivityData('HRM', onchangedCB, onerrorCB);
    setTimeout(stressUpdate, 1000);
}