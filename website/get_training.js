function getTrainig() {
var down = document.getElementById("answer");
var form = document.createElement("form");
form.id = "getProgramForm";
form.appendChild(document.createTextNode("Your fitness goal : "));
makeRadioField(form, "goal", "cutting", "   cutting");
makeRadioField(form, "goal", "maintain", "   maintain");
makeRadioField(form, "goal", "bulking", "   bulking");
form.appendChild(br.cloneNode());
form.appendChild(document.createTextNode("Strength result now : "));
form.appendChild(br.cloneNode());
makeNumberField(form, "bench_now", 3, "   bench press: ");
makeNumberField(form, "sqaut_now", 3, " sqaut: ");
makeNumberField(form, "deadlift_now", 3, " deadlift: ");
form.appendChild(br.cloneNode());
form.appendChild(document.createTextNode("Strength result wanted : "));
form.appendChild(br.cloneNode());
makeNumberField(form, "bench_after", 3, "   bench press: ");
makeNumberField(form, "sqaut_after", 3, " sqaut: ");
makeNumberField(form, "deadlift_after", 3, " deadlift: ");
form.appendChild(br.cloneNode());
form.appendChild(document.createTextNode("Level of fitness : "));
form.appendChild(br.cloneNode());
makeRadioField(form, "fitness_level", "1", "   1");
makeRadioField(form, "fitness_level", "2", "   2");
makeRadioField(form, "fitness_level", "3", "   3");
makeRadioField(form, "fitness_level", "4", "   4");
form.appendChild(br.cloneNode());
var body = document.getElementById("body");
body.replaceChild(form, body.childNodes[0]);
var button = document.createElement("BUTTON");
button.innerHTML = "Get trening";
button.onclick = function(){submitToAPI()};
body.appendChild(button);


function submitToAPI() {
 var br = document.createElement("br");
$(document).ready(function () {
 var form = document.getElementById("getProgramForm");
 var data = {
   goal : form.elements['goal'].value,
   bench_now : form.elements['bench_now'].value,
   sqaut_now : form.elements['fitness_level'].value,
   deadlift_now : form.elements['sqaut_now'].value,
   bench_after : form.elements['bench_after'].value,
   sqaut_after : form.elements['sqaut_after'].value,
   deadlift_after : form.elements['deadlift_after'].value,
   fitness_level : form.elements['fitness_level'].value,
 };
$.ajax({
 type: "POST",
 url: api_base+api_deploy+getTrainig_endpoint,
//  url: "https://jhdi0t7l63.execute-api.eu-west-1.amazonaws.com/dev",
 crossDomain: "true",
 dataType: "json",
 contentType: "application/json",
 data: JSON.stringify(data),
 success: function(response) {
   console.log(response);
   $("#answer").html(response);
 },
 error: function(response) {
   console.log("fall");
   $("#answer").html("formul.elements['fitness_level'].value");
 }
});
});
}
}
