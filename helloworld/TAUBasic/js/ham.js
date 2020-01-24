tizen.ppm.requestPermission("http://tizen.org/privilege/healthinfo", onsuccessPermission, onErrorPermission);

//bind onScreenStateChanged to the screen state change event
tizen.power.setScreenStateChangeListener(onScreenStateChanged);
var heartRateEnabeled = 0;
var mixCounter = 0;

var x;
var y;
var z;
var accelerometerCapability = tizen.systeminfo.getCapability('http://tizen.org/feature/sensor.accelerometer');

if (accelerometerCapability === true) {
	//supports the accelerometer sensor
	var accelerationSensor = tizen.sensorservice.getDefaultSensor("ACCELERATION");
	accelerationSensor.start(getShakeInfo);
}

function onGetSuccessCB(sensorData) {
	//only count mixes when a lessonblock of type mix is rendered
	if (!currentBlock) {
		return
	}
	if (currentBlock.type != 'mix') {
		return
	}
	console.log("x: " + (Math.abs(x - sensorData.x)));
	console.log("y: " + (Math.abs(y - sensorData.y)));
	console.log("z: " + (Math.abs(z - sensorData.z)));
	//is the user mixing?
	if ((Math.abs(x - sensorData.x)) > 2 && (Math.abs(y - sensorData.y)) > 2 && (Math.abs(z - sensorData.z)) > 2) {
		mixCounter++;
		//is the user mixing very fast?
		if ((Math.abs(x - sensorData.x)) > 4 && (Math.abs(y - sensorData.y)) > 4 && (Math.abs(z - sensorData.z)) > 4) {
			updateMixCount(mixCounter, true);
		}
		else {
			updateMixCount(mixCounter, false);
		}
		//push mix progression to firebase
		console.log(currentLesson, currentBlock, mixCounter)
		pushMixCountToFirebase(currentLesson, currentBlock, mixCounter);
	}
	x = sensorData.x;
	y = sensorData.y;
	z = sensorData.z;
}


function getShakeInfo() {
	accelerationSensor.getAccelerationSensorData(onGetSuccessCB);
	setTimeout(getShakeInfo, 1000);
}




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

//prevent screen OFF, by setting screen to DIM instead
function onScreenStateChanged(previousState, changedState) {
	console.log('Screen state changed from ' + previousState + ' to ' + changedState);
	if (changedState == 'SCREEN_OFF') {
		tizen.power.request('SCREEN', 'SCREEN_NORMAL')
	}
}

//HAM API callback
var previousInterval;
var variationArray = [];

function onchangedCB(hrmInfo) {
	//ignore wrong values
	if (hrmInfo.heartRate < 10) {
		console.log("skipped");
		return
	}

	//calculate interval
	var currentInterval = Math.round(60000 / hrmInfo.heartRate);

	if (previousInterval) {
		var variation = Math.abs(previousInterval - currentInterval);

		//push variation to array
		variationArray.push(variation);

		//if array is full, upload to firebase
		if (variationArray.length >= 60) {
			//calculate average variation
			var total = 0;
			for (var i = 0; i < variationArray.length; i++) {
				total += variationArray[i];
			}
			//get average with 1 decimal place
			var avg = Math.round((total / variationArray.length) * 10) / 10;

			//upload that average and clear the array
			console.log(avg)
			pushStressToFirebase(currentLesson, currentBlock, avg, new Date().getTime());
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
function stressUpdate() {
	tizen.humanactivitymonitor.getHumanActivityData('HRM', onchangedCB, onerrorCB);
	setTimeout(stressUpdate, 100);
}