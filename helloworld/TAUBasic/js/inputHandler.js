function answerClick(questionId, elementId) {
	//if an answer is already selected, ignore input and open popup
	if (currentBlock.selectedAnswer) {
		document.getElementById("toastContent").innerText = "Je hebt deze vraag al beantwoord";
		tau.changePage("toast");
		return;
	};

	//else, select the clicked answer and save it locally
	var answer = currentBlock.answer[questionId];
	var allElements = document.getElementsByClassName("answer");
	var element = document.getElementById(elementId);

	console.log(allElements)
	for (var i = 0; i < allElements.length; i++) {
		allElements[i].style.backgroundColor = "rgba(255, 255, 255, 0.2)";
		allElements[i].style.opacity = 0.5;
	}
	element.style.backgroundColor = "gray";

	pushAnswerToFirebase(currentLesson, currentBlock, questionId);
}