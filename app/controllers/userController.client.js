'use strict';

(function () {

   var profileId = document.querySelector('#profile-id') || null;
   var profileUsername = document.querySelector('#profile-username') || null;
   var profileRepos = document.querySelector('#profile-repos') || null;
   var displayName = document.querySelector('#display-name');
   var apiUrl = appUrl + '/api/:id';

   function updateHtmlElement (data, element, userProperty) {
      element.innerHTML = data[userProperty];
   }

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function (data) {
     var info = JSON.parse(data)
     document.getElementById("dname").innerHTML="<a id='display-name' class='pull-right' href='/profile/"+info.id+"'>"+info.displayName+"&nbsp;</a>";
     document.getElementById("ava").innerHTML= "<img class='ava' src='"+info.ava+"' height='35' width='35'>";
     document.getElementById("info").innerHTML="<img class='pro' src='"+info.ava+"' height='130' width='130'>";
     document.getElementById("display").innerHTML=info.displayName;
     document.getElementById("location").innerHTML= info.location;
   }));
})();
