$(document).ready(function(){
  var n=0;
  var appUrl = window.location.origin;
  $("#createnew").on('click',function(){
    window.location.href= appUrl+'/create';

  });
  $("#load").fadeOut(2000);
  $(window).load(function() {
   // Animate loader off screen
   $(".se-pre-con").fadeOut("slow");;
 });
  var api = "http://localhost:8080/allpoll";
  $.getJSON(api, function(data){
    n=1;
   for(n=1;n<=data.length;n++){
    $("#poll").prepend("<a id="+n+" href ='/poll/"+data[n-1].polls.pollId.toString()+"' class = 'block'><li>&nbsp;"+data[n-1].polls.title+"</li></a><br/>") ;
   }


 });

 });
