//Add event listners

$(document).ready(function() {
    // document.getElementById("taskName").value = "Task:";
    getTasks();
    getEventListeners();
});

//Sets up imgs for easier calling and assigning

var thumbsUp = "<img src ='../imgs/thumbsup.png' alt='Thumbs Up!' height='12' width='12'>";
var thumbsDown = "<img src ='../imgs/thumbsdown.png' alt='Thumbs Down.' height='12' width='12'>";
var fontsArray = ["Georgia", "Palatino", "Times", "Helvetica", "Gadget", "cursive", "Charcoal", "Lucida Grande", "Geneva", "Arial", "Verdana", "Courier", "Monaco"];

//I moved the event listeners for document.ready could look nice

function getEventListeners() {
    $("#task-input").on("click", "#submit-task", initialpostTask);
    $("#completed-task-home").on("click", ".status", putStatusUpdate);
    $("#completed-task-home").on("click", ".delete", deleteTask);
    $("#completed-task-home").on("click", ".update", checkStringLength);
    $("#incompleted-task-home").on("click", ".status", putStatusUpdate);
    $("#incompleted-task-home").on("click", ".delete", deleteTask);
    $("#incompleted-task-home").on("click", ".update", checkStringLength);
    animations();
}
function animations(){
  $("#incompleted-task-home").on('mouseover',".eachTask", 500, function() {
      $(this).stop().animate({
          marginLeft: 100,
          marginRight: -100
      });
  });
  $("#incompleted-task-home").on('mouseleave', ".eachTask", 500, function() {
      $(this).stop().animate({
          marginLeft: 0,
          marginRight: 0
      });
  });
  $("#completed-task-home").on('mouseover',".eachTask", 500, function() {
      $(this).stop().animate({
          marginLeft: -100,
          marginRight: 100
      });
  });
  $("#completed-task-home").on('mouseleave',".eachTask", 500, function() {
      $(this).stop().animate({
          marginLeft: 0,
          marginRight: 0
      });
  });
  $("#head").on("mouseover", 500, function(){
    var ranText = randomNumber(0, fontsArray.length);

    $(this).css("font-family", fontsArray[ranText]);
  });
}
  function randomNumber(min, max) {
    return Math.floor(Math.random() * (1 + max - min) + min);
}

//I needed something definitive to be able to set the status to NO at the git-go

function initialpostTask() {
    event.preventDefault();
    var task = {};
    $.each($('#task-input').serializeArray(), function(i, field) {
        task[field.name] = field.value;
    });
    //   $.each($('#registerPet').serializeArray(), function(i, field) {
    // pet[field.name] = field.value;});
    task.taskStatus = "NO";
    $.ajax({
        type: 'POST',
        url: '/tasks',
        data: task,
        success: function() {
            console.log("task was posted to db");
            document.getElementById("taskSummary").value = "Task Description";
            document.getElementById("taskName").value = "Task:";
            // document.getElementById("#summary").children().value = "Summary of Task..."
            getTasks();
        },
        error: function() {

            console.log('/POST didnt work');
        }

    });
}

//Grabs what tasksI have added and places them on the DOM

function getTasks() {
    $.ajax({
        type: 'GET',
        url: '/tasks',
        success: function(tasksList) {
            //Correct Here
            $('#completed-task-home').empty();
            $("#incompleted-task-home").empty();
            tasksList.forEach(function(task, i) {
                var taskArray = [];
                taskArray.push({
                    id: task.id,
                    name: task.task_name,
                    summary: task.task_description,
                    status: task.completion_status
                });
                var id = taskArray[0].id;
                var taskNameInput = '<input type="text" id="' + id + '" name="' + id + '" class="form-control" />';

                //The functions that do the appending

                appendTask(taskArray, id);
            });
        },
        error: function() {
            console.log("/GET SELECTED TASKS didnt Work");
        }
    });
}

//Made to specifically update the status of a given task

function putStatusUpdate() {

    //assigns Data to the parent div so that I can grab it later

    var taskId = $(this).parent().data('id')
    var task = {};
    task.id = taskId;

    //This is how I attached my toggle logic without toggle

    if ($(this).parent().hasClass('eachTask completed')) {

        //Assigns NO is the background color was 'completed' giving the option to redo a task or fix a misclick

        task.status = "NO";
    } else if ($(this).parent().hasClass('eachTask')) {
        task.status = "YES";
    } else {
        console.log("Couldn't read task Class");
    }
    $.ajax({
        type: 'PUT',
        url: '/tasks/status/' + taskId,
        data: task,
        success: function() {
            console.log("updated status was posted to db");
            getTasks();
        },
        error: function() {

            console.log('/POST update status didnt work');
        }
    });
}

//I used this to help clean up my Get Call

function appendTask(taskArray, id) {

    //two slightly different functions based on the status of completion.
    //I couldn't quite abstract the $els because they needed to run in these ifs.
    //This is because the final append is reliant on information from appendDetails

    if (taskArray[0].status == "YES") {
        var $el = $('<div class="eachTask completed" id="' + id + '"></div>');
        $el.data("id", id);
        $el = appendDetails(taskArray, id, $el);
        $el.append(thumbsUp);
        $("#completed-task-home").append($el);
    } else {
        var $el = $('<div class=eachTask id="' + id + '"></div>');
        $el.data("id", id);
        $el = appendDetails(taskArray, id, $el);
        $el.append(thumbsDown);
        $("#incompleted-task-home").append($el);
    }
}

//Further Abstraction for my GET Call

function appendDetails(taskArray, id, $el) {

    //I put the the code into different variables to help trim down the inevitably long concatenation

    var inputTaskName = "<p class='pastTaskName' contenteditable='true'>" + taskArray[0].name + "</p>";
    var inputTaskSummary = "<p class='pastTaskSummary' contenteditable='true'>" + taskArray[0].summary + "</p>";
    $el.append("<div class ='" + id + "'><span class='task-title'><strong>Task " + id + ": </strong></span>" + inputTaskName + inputTaskSummary + "</div>");
    appendButtons($el, id);
    return $el;
}

//A function to abstract the appending of buttons, mainly here to clear up clutter in my GET call

function appendButtons($el, id) {
    $el.append('<button id=' + id + ' class="update">Update</button>');
    $el.append('<button id=' + id + ' class="delete">Delete</button>');
    $el.append('<button id=' + id + ' class="status">Complete</button>');
}

//Function to delete with a confirm, just in case

function deleteTask() {
    var ans = confirm("Are you sure you want to delete this Task?");
    if (ans == false) {
        return;
    } else {
        var taskToDelete = $(this).parent().data("id");
        $.ajax({
            type: 'DELETE',
            url: '/tasks/' + taskToDelete,
            success: function() {
                console.log('DELETED bookID:', taskToDelete);
                getTasks();
            },
            error: function() {
                console.log("error in delete");
            }
        });
    }

}

//Checks the input vs. Max string length so the user can't try to put something SQL wouldn't like

function checkStringLength() {
    var stringName = $(this).prev().children(".pastTaskName").text();
    var stringDescription = $(this).prev().children(".pastTaskSummary").text();
    var stringDescriptionLength = stringDescription.length;
    var stringNameLength = stringName.length;
    var id = $(this).parent().data("id");
    var taskText = {};
    if (stringDescriptionLength > 250 || stringNameLength > 60) {
        alert("Please enter a shorter Information. Descriptions can be 250 characters, Task names can be 60");
    } else {
        taskText.name = stringName;
        taskText.summary = stringDescription;
        $.ajax({
            type: "PUT",
            url: "/tasks/update/" + id,
            data: taskText,
            success: function() {
                console.log("Put Update Succeeded");
                getTasks();
            },
            error: function() {
                console.log("Put Update Failed");
            }
        });
    }
}
