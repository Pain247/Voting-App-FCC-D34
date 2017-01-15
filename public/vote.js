$(document).ready(function(){
 var data1=[];
 var a = $(location).attr("href");
 var arr = a.split('/');
 var num = arr[arr.length-1];
 var api= window.location.origin+'/poll/api/'+num;
 $("#load").fadeOut(2000);
 $.getJSON(api, function(data){
   var title = data[0].polls.title;
   $("#loadpoll").html(title);
   $("#choice").append("<div class='radio'><label><input type='radio' name='options' id='options0' value='0' checked><h class='options'>"+data[0].polls.choice[0][0]+"</h><h class='vote'>&nbsp;("+data[0].polls.choice[0][1]+" vote) </h></label></div>");
   for(var i=1;i<data[0].polls.choice.length;i++){
    $("#choice").append("<div class='radio'><label><input type='radio' name='options' id='options"+i+"' value='"+i+"'><h class='options'>"+data[0].polls.choice[i][0]+"</h><h class='vote'>&nbsp;("+data[0].polls.choice[i][1]+" vote)</h></label></div>");
   }
 for(var j=0;j<data[0].polls.choice.length;j++){
    data1.push(
                {choice: data[0].polls.choice[j][0],
                 vote : data[0].polls.choice[j][1]
              }
            );

 }

 new Morris.Bar({
   element: 'myfirstchart',
   data: data1,
   xkey: 'choice',
   ykeys: ['vote'],
   labels: ['Value']
 });
 });
 });
