$(document).ready(function() {
    getTasks();
    $("#task-input").on("click", "button", initialpostTask);
    $("#task-home").on("click", ".status", toggleStatus);
});
var thumbsUp = "<img src ='../imgs/thumbsup.png' alt='Thumbs Up!' height='12' width='12'>"
var thumbsDown = "<img src ='../imgs/thumbsdown.png' alt='Thumbs Down.' height='12' width='12'>"

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

function getTasks() {
    $.ajax({
        type: 'GET',
        url: '/tasks',
        success: function(tasksList) {
            console.log("taskslist", tasksList);
            $('#task-home').empty();
            tasksList.forEach(function(task, i) {
                var taskArray = [];
                console.log(task);
                taskArray.push({
                    id: task.id,
                    name: task.task_name,
                    summary: task.task_description,
                    status: task.completion_status
                });
                var id = "#" + taskArray[0].id;
                var $el = $('<div class=eachTask id="' + taskArray[0].id + '"></div>');
                var taskNameInput = '<input type="text" id="' + id + '" name="'+ id + '" class="form-control" />'
                if (taskArray[0].status == "YES") {
                  $el.append('<div class = ' + id + '><strong>Task ' + id + ": </strong>" + taskArray[0].name + ' <p class=summary-text>' + taskArray[0].summary + "</p></div>");
                  appendButtons($el, taskArray);
                  $el.append(thumbsUp);
                  $("#task-home").append($el);
                } else {
                  $el.append('<div class = ' + id + '><strong>Task ' + id + ": </strong>" + taskArray[0].name + ' <p class=summary-text>' + taskArray[0].summary + "</p></div>")
                  appendButtons($el, taskArray);
                  $el.append(thumbsDown);
                  $("#task-home").append($el);
                }

                console.log(taskArray);
            });
        },
        error: function() {
            console.log("/GET SELECTED TASKS didntWork");
        }
    });
}

function appendButtons($el, taskArray) {

    $el.append('<button id=' + taskArray[0].id + ' class="update">Update</button>');
    $el.append('<button id=' + taskArray[0].id + ' class="delete">Delete</button>');
    $el.append('<button id=' + taskArray[0].id + ' class="status">Compelete</button>');
}
function toggleStatus(){
  $(this).parent().toggleClass("completed");
  console.log(this);
  console.log($(this).parent());
  postUpdate();
}
function postUpdate(){

}
