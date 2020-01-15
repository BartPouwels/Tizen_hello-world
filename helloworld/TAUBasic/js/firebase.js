var firebaseConfig = {
	apiKey: "AIzaSyA_J3JarYMzjr3h1i1gvbzTsSdTLt0miNQ",
	authDomain: "androidsm7.firebaseapp.com",
	databaseURL: "https://androidsm7.firebaseio.com",
	projectId: "androidsm7",
	storageBucket: "androidsm7.appspot.com",
	messagingSenderId: "638937556827",
	appId: "1:638937556827:web:6e0f614367604740b59c7e",
	measurementId: "G-N803D9LNK6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
		
// Get a reference to the database service
var database = firebase.database();
var array = [];

function createLesson(lessonId, name, image, description) {
    database.ref('Lesson/' + lessonId).set({
        Name: name,
        Image: image,
        Description: description
    });
    console.log("Lesson " + lessonId + " written to firebase");
}

function renderListItem(list, item, position){
	var container = document.getElementById(list),
    listv = tau.widget.Listview(container);
	listv.addItem(item, position);
}

function deleteListItem(list, position){
	var container = document.getElementById(list),
    listv = tau.widget.Listview(container);
	listv.addItem(position);
}

function getAllLessons() {
    database
        .ref()
        .child('lesson')
        .once('value').then(function (inspectorsSnapshot) {

            inspectorsSnapshot
                .forEach(function (openTicketSnapshot) {
                    
                    var object = {}
                    object.id = openTicketSnapshot.key;
                    openTicketSnapshot
                        .forEach(function (detailSnapshot) {
                            detailSnapshot
                            object[detailSnapshot.key] = detailSnapshot.val();
                        });
                    array.push(object);
                });
            	renderLessonBlocks(array)
        });
}


function renderLessonBlocks(lessons) {

    var listLength = lessons.length;

    var container = document.getElementById("lesson-list"),
    listv = tau.widget.Listview(container);

    if (listLength > 0) {
        for (var i = 0; i < listLength; i++) {
            var listItem =
                '<div class="lesson-block" id="Serveren" onClick="toNextPage(\'' + "lesson-block" + '\', \'' + "#second" + '\')" style="background-color:' +
                lessons[i].color +
                ';"><div class="center" style="width:30%;height:100%;"><img class="lesson-icon" src="' +
                lessons[i].image +
                '" /></div><div class="center" style="width:70%;height:100%;"><div class="lesson-text"><h4 class="lesson-title">' +
                lessons[i].name +
                '</h5><p class="lesson-subtitle">' +
                lessons[i].description +
                '</p></div></div></div>';
            
            
            listv.addItem(listItem, 1);
        }
    } 
    else {
        var message = document.createTextNode("Geen lessen");
        container.appendChild(message);
    }
}

getAllLessons();