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
					console.log("try exit")
					tizen.application.getCurrentApplication().exit();
				} catch (ignore) {}
			} else {
				console.log("page back")
				window.history.back();
			}
		}
	});
}());