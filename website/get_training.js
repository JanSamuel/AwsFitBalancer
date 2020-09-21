function getTrainig() {
var down = document.getElementById("answer");
var form = document.createElement("form");
form.id = "getProgramForm";
form.appendChild(document.createTextNode("Your fitness goal : "));
makeRadioField(form, "goal", "endurance", "endurance");
makeRadioField(form, "goal", "strenght", "strenght");
makeRadioField(form, "goal", "cutting", "cutting");
makeRadioField(form, "goal", "bulking", "bulking");
makeRadioField(form, "goal", "maintain", "maintain");
form.appendChild(br.cloneNode());
form.appendChild(br.cloneNode());
form.appendChild(document.createTextNode("strenght result now : "));
form.appendChild(br.cloneNode());
makeNumberField(form, "bench_now", 3, "bench press: ");
makeNumberField(form, "squat_now", 3, "sqaut: ");
makeNumberField(form, "deadlift_now", 3, "deadlift: ");
form.appendChild(br.cloneNode());
form.appendChild(br.cloneNode());
form.appendChild(document.createTextNode("strenght result wanted : "));
form.appendChild(br.cloneNode());
makeNumberField(form, "bench_after", 3, "bench press: ");
makeNumberField(form, "squat_after", 3, "sqaut: ");
makeNumberField(form, "deadlift_after", 3, "deadlift: ");
form.appendChild(br.cloneNode());
form.appendChild(br.cloneNode());
form.appendChild(document.createTextNode("Level of fitness : "));
makeRadioField(form, "fitness_level", "1", "1");
makeRadioField(form, "fitness_level", "2", "2");
makeRadioField(form, "fitness_level", "3", "3");
makeRadioField(form, "fitness_level", "4", "4");
makeRadioField(form, "fitness_level", "5", "5");
form.appendChild(br.cloneNode());
form.appendChild(br.cloneNode());
form.appendChild(document.createTextNode("Workouts per week : "));
makeRadioField(form, "days", "2", "2");
makeRadioField(form, "days", "3", "3");
makeRadioField(form, "days", "4", "4");
makeRadioField(form, "days", "5", "5");
makeRadioField(form, "days", "6", "6");
form.appendChild(br.cloneNode());
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
   squat_now : form.elements['fitness_level'].value,
   deadlift_now : form.elements['squat_now'].value,
   bench_after : form.elements['bench_after'].value,
   squat_after : form.elements['squat_after'].value,
   deadlift_after : form.elements['deadlift_after'].value,
   fitness_level : form.elements['fitness_level'].value,
   days : form.elements['days'].value
 };
$.ajax({
 type: "POST",
 url: api_base+api_deploy+getTrainig_endpoint,
 //url: "https://jhdi0t7l63.execute-api.eu-west-1.amazonaws.com/dev",
 //url: "https://t7t9jqje7k.execute-api.us-east-1.amazonaws.com/Version_1/get-plan",
 crossDomain: "true",
 dataType: "json",
 contentType: "application/json",
 data: JSON.stringify(data),
 success: function(response) {
   $("#answer").html(response);
 },
 error: function(response) {
   console.log(response);
   $("#answer").html("Lambda connection fail");
 }
});
});
}
}
