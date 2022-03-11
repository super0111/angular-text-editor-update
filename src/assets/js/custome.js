

$(document).ready(function(){
    

      $('.dropdown-menu').on('click', function(event){ 
        event.stopPropagation();
    }); 
    $("#closeDropDown").on('click', function(){
      $(".dropdown-menu").removeClass('show');
      $(".dropdown .btn").removeClass('show');
    });
});

$(document).ready(function(){ 
  $("body").on("click",".modalBtn",function(){  
     $(".imageContentBox").addClass("after_modal_appended"); 
     //appending modal background inside the blue div
     $('.modal-backdrop').appendTo('.imageContentBox');      
 });

});



$(document).ready(function () {
  $("#closeTabContent").on('click', function () {  
    $(".tab-pane.fade").removeClass('active show');
    $("#v-pills-tabContent ").removeClass('opened');
  });  
  if ($("#v-pills-tabContent  .tab-pane.fade").hasClass("active")) {
    $("#v-pills-tabContent ").addClass('opened');
  } 
});
 

var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
}) 

$(document).ready(function () {
  $("#openNoteBoxJS").on('click', function () {  
    $("#jsOpenedNoteBox").toggleClass('show');  
  });   



  $(".panelControlBtn").on('click', function () {  
    $(this).toggleClass('active');
    $("#rightActionPanel").toggleClass('expand__bottom__panel');  
  });   







});
 