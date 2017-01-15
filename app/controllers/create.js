$(document).ready(function(){
 var n =2;
 $("#info").hide();
 $("#display").hide();
 $("#location").hide();
 $("#thanks").hide();
 $("#new1").on('click',function(){
   n++;
   $("#more").append("<input id='op"+n+"'class='op'type='text' name ='op' placeholder='#"+n+"' ><br/><br/>" );
  });
 $("#make").on('click',function(){
       $("#newpoll").hide();
       $("#thanks").show();
     });

});
