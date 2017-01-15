$(document).ready(function(){
  var a = $(location).attr("href");
  var arr = a.split('/');
  var num = arr[arr.length-1];
  var api= window.location.origin+'/polls/'+num;
  $.getJSON(api,function(data){
    $("#polls").append("<h2 class='polls'>Your Poll : "+data.length+"</h2>");
    for(var i=0; i<data.length;i++){
     $("#pollUser").append("<a class='choice' href='/poll/"+data[i].polls.pollId+"'><li class='userPoll' id='"+i+"pu'>"+data[i].polls.title+" </li></a><br/>");
     $("#del").append("<a href='/polls/delete/"+data[i].polls.pollId+"'><i class='fa fa-2x fa-times' aria-hidden='true'></i></a><br/><br/><br/>");
    }
  });


});
