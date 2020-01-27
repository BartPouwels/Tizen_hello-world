var currentLesson;
var currentBlock;
var swipeInterval = new Date().getTime();

function toNextPage(elementId, view) {
	console.log("Element " + elementId + " routed to " + view);
	tau.changePage(view);
}

(function () {
	window.addEventListener("tizenhwkey", function (ev) {
		var activePopup = null,
			page = null,
			pageId = "";

		if (ev.keyName === "back") {
			activePopup = document.querySelector(".ui-popup-active");
			page = document.getElementsByClassName("ui-page-active")[0];
			pageId = page ? page.id : "";

			if (pageId === "main") {
				try {
					console.log("try exit");
					tizen.application.getCurrentApplication().exit();
				} catch (ignore) {}
			} else {
				console.log("page back");
				currentLesson = 0;
				currentBlock = 0;
				tau.changePage("main");
			}
		}
	});
}());

function toFirstBlock(lessonId) {
	//get clicked lesson
	for (var i = 0; i < lessons.length; i++) {
		if (lessons[i].id == lessonId) {
			currentLesson = lessons[i];
		}
	}
	//only start rendering if lesson contains blocks
	if (currentLesson.block) {
		currentBlock = currentLesson.block[0];
		renderBlock(currentBlock);
	}
}

function toNextBlock() {
	//if the rendered block is a mix block, and the mix treshold is not met, do not go to next block and display message
	if (currentBlock.type == "mix" && (currentBlock.treshold > currentBlock.counter)) {
		document.getElementById("mixContent").innerText = "Mix beter to continue";
		return;
	}
	if (currentLesson.block.length > currentBlock.id) {
		currentBlock = currentLesson.block[currentBlock.id];
		renderBlock(currentBlock);
	}
}

function toPreviousBlock() {
	if (currentBlock.id > 1) {
		currentBlock = currentLesson.block[currentBlock.id - 2];
		renderBlock(currentBlock);
	} else {
		currentLesson = 0;
		currentBlock = 0;
		tau.changePage("main");
	}
}

//do initial block setup before rendering
function renderBlock(block) {
	console.log(currentLesson)
	console.log(currentBlock)
	switch (block.type) {
		case "step":
			block.title && (document.getElementById("stepTitle").innerText = block.title);
			currentLesson.color && (document.getElementById("stepTitle").style.color = currentLesson.color);
			block.content && (document.getElementById("stepContent").innerText = block.content);
			block.image && (document.getElementById("stepAttachment").innerHTML = '<img id="stepImage" src="' + block.image + '" />');
			tau.changePage("step");
			break;
		case "understand":
			block.title && (document.getElementById("understandTitle").innerText = block.title);
			currentLesson.color && (document.getElementById("understandTitle").style.color = currentLesson.color);
			block.content && (document.getElementById("understandContent").innerText = block.content);
			block.image && (document.getElementById("understandAttachment").innerHTML = '<img id="understandImage" src="' + block.image + '" />');
			tau.changePage("understand");
			break;
		case "mix":
			block.title && (document.getElementById("mixTitle").innerText = block.title);
			currentLesson.color && (document.getElementById("mixTitle").style.color = currentLesson.color);
			block.content && (document.getElementById("mixContent").innerText = block.content);
			block.treshold && (document.getElementById("mixTip").innerText = block.counter + "/" + block.treshold + " voltooid");
			block.counter && (mixCounter = block.counter);
			tau.changePage("mix");
			break;
		case "question":
			block.title && (document.getElementById("questionTitle").innerText = block.title);
			block.question && (document.getElementById("questionContent").innerText = block.question);
			var allElements = document.getElementsByClassName("answer");
			for (var i = 0; i < allElements.length; i++) {
				allElements[i].style.backgroundColor = "rgba(255, 255, 255, 0.2)";
				block.selectedAnswer && (allElements[i].style.opacity = 0.5);
			}
			block.selectedAnswer && (document.getElementById("answer" + (block.selectedAnswer - 1)).style.backgroundColor = "gray");
			tau.changePage("question");
			break;
		default:
			break;
	}
}

function updateMixCount(counter, highSpeed) {
	if (!highSpeed) {
		document.getElementById('mixTip').innerText = counter + "/" + currentBlock.treshold + " voltooid";
	} else {
		document.getElementById('mixTip').innerHTML = "&#x1F525 " + counter + "/" + currentBlock.treshold + " voltooid &#x1F525";
	}
}


//swipe hitbox elements
var elements = document.getElementsByClassName("lesson-block");

for (var i = 0; i < elements.length; i++) {
	//enable gesture reacognition
	tau.event.enableGesture(elements[i], new tau.event.gesture.Drag(), new tau.event.gesture.Swipe());

	//bind swipe eventlistener to box
	window.addEventListener('rotarydetent', function (event) {
		if (document.getElementsByClassName("ui-page-active")[0].id == "main") {
			return
		}
		var time = new Date().getTime();
		if (time - swipeInterval > 500) {
			if (event.detail.direction == 'CW') {
				console.log("swipe left")
				toNextBlock();
			} else {
				console.log("swipe right")
				toPreviousBlock();
			}
		}
		swipeInterval = time;
	})
}