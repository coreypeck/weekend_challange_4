//Add event listners

$(document).ready(function() {
    getTasks();
    $("#task-input").on("click", "button", initialpostTask);
    $("#task-home").on("click", ".status", putStatusUpdate);
});

//Sets up imgs for easier calling and assigning

var thumbsUp = "<img src ='../imgs/thumbsup.png' alt='Thumbs Up!' height='12' width='12'>";
var thumbsDown = "<img src ='../imgs/thumbsdown.png' alt='Thumbs Down.' height='12' width='12'>";

    //I needed something definitive to be able to set the status to NO at the git-go

function initialpostTask() {
    event.preventDefault();
    var task = {};
    $.each($('#task-input').serializeArray(), function(i, field) {
        task[field.name] = field.value;
    });
    task.taskStatus = "NO";
    console.log("task:", task);
    $.ajax({
        type: 'POST',
        url: '/tasks',
        data: task,
        success: function() {
            console.log("task was posted to db");
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
            console.log("taskslist", tasksList);
            $('#task-home').empty();
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
            console.log("/GET SELECTED TASKS didntWork");
        }
    });
}

//A function to abstract the appending of buttons, mainly here to clear up clutter in my GET call

function appendButtons($el, taskArray) {

    $el.append('<button id=' + taskArray[0].id + ' class="update">Update</button>');
    $el.append('<button id=' + taskArray[0].id + ' class="delete">Delete</button>');
    $el.append('<button id=' + taskArray[0].id + ' class="status">Compelete</button>');
}
//Idea for a Toggle Class function
// function toggleStatus(specificTask){
//   $(this).toggleClass("completed");}
//Made to specifically update the status of a given task

function putStatusUpdate() {

    //assigns Data to the parent div so that I can grab it later

    var taskId = $(this).parent().data('id')
    var task = {};
    task.id = taskId;
    if ($(this).parent().hasClass('eachTask completed')) {
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
    if (taskArray[0].status == "YES") {
        var $el = $('<div class="eachTask completed" id="' + id + '"></div>');
        $el.data("id", id);
        $el = appendDetails(taskArray, id, $el);
        $el.append(thumbsUp);
        $("#task-home").append($el);
    } else {
        var $el = $('<div class=eachTask id="' + id + '"></div>');
        $el.data("id", id);
        $el = appendDetails(taskArray, id, $el);
        $el.append(thumbsDown);
        $("#task-home").append($el);
    }
}

//Further Abstraction for my GET Call

function appendDetails(taskArray, id, $el) {
    $el.append('<div class = ' + id + '><strong>Task ' + id + ": </strong>" + taskArray[0].name + ' <p class=summary-text>' + taskArray[0].summary + "</p></div>")
    appendButtons($el, taskArray);
    return $el;
}
