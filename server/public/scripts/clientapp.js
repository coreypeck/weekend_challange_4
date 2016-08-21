//Add event listners

$(document).ready(function() {
    // document.getElementById("taskName").value = "Task:";
    getTasks();
    $("#task-input").on("click", "#submit-task", initialpostTask);
    $("#task-home").on("click", ".status", putStatusUpdate);
    $("#task-home").on("click", ".delete", deleteTask);
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
            $('#task-home').empty();
            tasksList.forEach(function(task, i) {
                // var taskArray = [];
                // taskArray.push({
                //     id: task.id,
                //     name: task.task_name,
                //     summary: task.task_description,
                //     status: task.completion_status
                // });
                var id = task.id;
                var summary = task.task_description;
                var name = task.task_name;
                var status = task.completion_status;
                var taskNameInput = '<input type="text" id="' + id + '" name="' + id + '" class="form-control" />';

                //The functions that do the appending

                appendTask(id, summary, status, name);
            });
        },
        error: function() {
            console.log("/GET SELECTED TASKS didntWork");
        }
    });
}

//A function to abstract the appending of buttons, mainly here to clear up clutter in my GET call

function appendButtons($el, id) {

    $el.append('<button id=' + id + ' class="update">Update</button>');
    $el.append('<button id=' + id + ' class="delete">Delete</button>');
    $el.append('<button id=' + id + ' class="status">Complete</button>');
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

function appendTask(id, summary, status, name) {
    if (status == "YES") {
        var $el = $('<div class="eachTask completed" id="' + id + '"></div>');
        $el.data("id", id);
        $el = appendDetails(id, $el, summary, status, name);
        $el.append(thumbsUp);
        $("#task-home").append($el);
    } else {
        var $el = $('<div class=eachTask id="' + id + '"></div>');
        $el.data("id", id);
        $el = appendDetails(id, $el, summary, status, name);
        $el.append(thumbsDown);
        $("#task-home").append($el);
    }
}

//Further Abstraction for my GET Call

function appendDetails(id, $el, summary, status, name) {

    // <input type="text" id="taskName" name="taskName" class="form-control" value="Task:" onClick="this.select()"/>
    //This creates the Task name as a from field so that it might get updated

    var inputTaskName = "<input type='text' id='" + id + "'name='" + id + "'class='form-control' value='" + name + "'onClick='this.select()'</input>";

    // <p class=summary-text>" + taskArray[0].summary + "</p></div>"
    // This creates the Task Summary as a from field so that it might get updated
// <input type="text" id="taskSummary" name="taskSummary" class="form-control" value="Task Description:" onClick="this.select()" />
    var inputTaskSummary = "<input type='text' id='taskSummary' name='taskSummary' class='form-control' value='" + summary + "' onClick='this.select()' />";
    $el.append("<div class ='" + id + "'><span class='task-title'<strong>Task " + id + ": </strong></span>" + inputTaskName + inputTaskSummary + "</div>");
    appendButtons($el, id);
    summary="";
    return $el;
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
                // $('#dataTable').empty();
                // $('#ownerName').empty();
                // getData();
                // getOwners();
            },
            error: function() {
                console.log("error in delete");
            }
        });
    }

}
