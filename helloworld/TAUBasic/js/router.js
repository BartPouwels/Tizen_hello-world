
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
				window.history.back();
			}
		}
	});
}());

function toNextLessonBlock(currentLesson) {
	
}


//swipe hitbox elements
var elements = document.getElementsByClassName("lesson-block");

for (var i = 0; i < elements.length; i++) {
//enable gesture reacognition
tau.event.enableGesture(elements[i], new tau.event.gesture.Drag(), new tau.event.gesture.Swipe());

//bind swipe eventlistener to box
elements[i].addEventListener("swipe", function(event)
{
	//switch based on swipe direction
	switch (event.detail.direction) {
	case 'left' :
		tau.changePage("understand");
	case 'right' :
		window.history.back();
	}
})
};