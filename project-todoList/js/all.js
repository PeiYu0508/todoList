$(document).ready(function () {

  let taskList = [];
  let inProgressList = [];
  let completedList = [];
  let num = 0;

  class Task {
    constructor(title, date, time, comment, priority, completed) {
      this.title = title;
      this.date = date;
      this.time = time;
      this.comment = comment;
      this.priority = priority;
      this.completed = completed;
      this.id = num++;
    }
  }

  function clearInfo() {
    $("#add-block input, textarea").val("");
    $("#add-block .check-box").prop('checked', false);
    $("#priority").removeClass("fas fa-star priority").addClass("far fa-star");
    $("#task-title").removeClass("top-priority");
    $("#title").removeClass("top-priority");
  }

  function showList(list) {
    $("#task-list").find("div").remove();
    if (list.length != 0) {
      $("#task-list").show();
    }
    list.forEach(element => {
      let id = element.id;
      let uuid = "#" + id;
      let isChecked = element.completed? "checked" : "";
      let date = element.date;
      let time = element.time != ""? element.time: "23:59";
      let comment = element.comment;
      $("#task-list").append('<div class="item" id="' + id + '">'
                                + '<div class="item-title">'
                                    + '<input type="checkbox" class="check-box"' + isChecked + '>'
                                    + '<p>' + element.title + '</p>'
                                    + '<i class="item-priority"></i>'
                                    + '<i class="fas fa-trash-alt del"></i>'
                                + '</div>'
                                + '<div id="item-infos">'
                                + '</div>'
                                + '<div class="edit-block">'
                                + '</div>'
                                + '<p class="item-id">' + element.id + '</p>'
                              + '</div>');
      if (element.priority) {
        $(uuid).find(".item-priority").addClass("fas fa-star priority");
        $(uuid).addClass("top-priority");
      } else {
        $(uuid).find(".item-priority").addClass("far fa-star");
      }
      if (date != "") { 
        $(uuid).find("#item-infos").append('<p class="item-info"><i class="far fa-calendar-alt icon"></i>' + date + " " + time+'</p>');
      }
      if (comment != "") {
        $(uuid).find("#item-infos").append('<p class="item-info"><i class="far fa-comment-dots icon"></i>' + comment + '</p>');
      }
      if (isChecked == "checked") {
        $(uuid).find("p").addClass("completed");
      }

    });


    $(".item .check-box").click(function(e) {
      let item = $(this).parent().parent();
      let itemTitle = item.find("p");
      itemTitle.toggleClass("completed");
      let task = list.find(element => element.id == item.attr('id'));
      let completedIndex = completedList.indexOf(task);
      let inProgressIndex = inProgressList.indexOf(task);
      console.log(completedIndex + " " + inProgressIndex);
      if (itemTitle.hasClass("completed")) {
        task.completed = true;
        completedList.push(task);  
        inProgressList.splice(inProgressIndex, 1);
        console.log("completedList:", completedList);
        console.log("inProgressList:", inProgressList);
      } else {
        task.completed = false;
        completedList.splice(completedIndex, 1);
        inProgressList.push(task);
        console.log("completedList:", completedList);
        console.log("inProgressList:", inProgressList);
      }
    });

    $(".item-priority").click(function(e) {
      let item = $(this).parent().parent();
      item.toggleClass("top-priority");
      $(this).toggleClass("far fa-star").toggleClass("fas fa-star priority");
      let task = list.find(element => element.id == item.attr('id'));
      if ($(this).hasClass("fas fa-star priority")) {
        task.priority = true;
      } else {
        task.priority = false;
      }
    });

    $(".item .fa-pen").click(function(e) {
      if ($(this).attr("id") == "not-editing") {
        $(this).removeAttr("id");
      } else {
        $(this).attr("id", "not-editing");
      }
    });

    $(".del").click(function(e) {
      let yes = confirm("是否要刪除此項目?");
      let item = $(this).parent().parent();
      let task = list.find(element => element.id == item.attr('id'));
      let completedIndex = completedList.indexOf(task);
      let inProgressIndex = inProgressList.indexOf(task);
      let taskIndex = taskList.indexOf(task);
      if (yes) {
        if (completedIndex != -1) {
          completedList.splice(completedIndex, 1);
        } else if (inProgressIndex != -1) {
          inProgressList.splice(inProgressIndex, 1);
        }
        taskList.splice(taskIndex, 1);
        showList(list);
      } else {
        return;
      }
    });
  }
  


  $("#menu-bar a").click(function (e) { 
    e.preventDefault();
    $(this).addClass("focus").siblings().removeClass("focus");
  });

  $("#my-task").click(function(e) {
    e.preventDefault();
    showList(taskList);
    console.log("my-task:" + taskList);
  });

  $("#in-progress").click(function(e) {
    e.preventDefault();
    showList(inProgressList);
    console.log("in-progress:", inProgressList);
  });

  $("#completed-page").click(function(e) {
    e.preventDefault();
    showList(completedList);
    console.log("completed:", completedList);
  });

  $(".fa-star").click(function(e) {
    $(this).toggleClass("far fa-star").toggleClass("fas fa-star priority");
    $(this).parent().toggleClass("top-priority");
    $(this).parent().find("#title").toggleClass("top-priority");
  });

  $("#add").click(function (e) { 
    e.preventDefault();
    $(this).hide();
    $("#add-block").show();
  });

  $("#cancel-btn").click(function (e) { 
    e.preventDefault();
    clearInfo();
    $("#add-block").hide();
    $("#add").show();
  });

  $("#add-btn").click(function (e) { 
    e.preventDefault();
    let title = $("#title").val();
    if (title =="") {
      alert("尚未輸入標題!");
      return;
    }
    let date = $("#date").val();
    let time = $("#time").val();
    let comment = $("#comment").val();
    let priority = $("#priority").hasClass("priority")
    let completed = $("#add-block .check-box").prop("checked");
    let task = new Task(title, date, time, comment, priority, completed);
    taskList.push(task);
    if (completed) {
      completedList.push(task);
    } else {
      inProgressList.push(task);
    }
    clearInfo();
    $("#add-block").hide();
    $("#add").show();
    if ($(".focus").attr("id") == "my-task") {
      showList(taskList);
    } else if($(".focus").attr("id") == "in-progress") {
      showList(inProgressList);
    } else {
      showList(completedList);
    }
    
  });

  

  
});
