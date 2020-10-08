function getTrainig() {
  $("#answer").html("");
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
  var click = document.getElementById("click");
  click.replaceChild(button, click.childNodes[0]);
  if(userToken == ""){
     alert("Not logged users cant use this functinality");
  }

  function submitToAPI() {
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
        days : form.elements['days'].value,
        user: cognitoUser,
      };

      function printExe(json){
        var exe ="<br><b> Name: "+
        json.name+"</b> sets: "+json.sets+" reps: "+
        json.reps+" weight: "+json.weight+"</br>"+
        "<br>Description : "+json.description+"</br>";
        return exe;
      }
      function printDay(json, day){
        var head = "<br><b>"+day+"</b></br>";
        if (json[0]) {
          var arms = printExe(json[0].Arms);
          var legs = printExe(json[1].Legs);
          var abs = printExe(json[2].Abs);
          var chest = printExe(json[3].Chest);
          var back = printExe(json[4].Back);
          var shoulders = printExe(json[5].Shoulders);
          var calves = printExe(json[6].Calves);
          return head+arms+legs+abs+chest+back+shoulders+calves;
        } else {
          return head +"<br>REST DAY</br>";
        }
      }

      $.ajax({
        type: "POST",
        url: constApi_site+constGetTrainig_endpoint,
        headers: {"Authorization": userToken},
        crossDomain: "true",
        dataType: "text",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function(response) {
          var json = JSON.parse(response);
          var week = printDay(json[0].Monday, "Monday") + printDay(json[1].Tuesday, "Tuesday") +
          printDay(json[2].Wednesday, "Wednesday") +printDay(json[3].Thursday, "Thursday") +
          printDay(json[4].Friday, "Friday") + printDay(json[5].Saturday, "Saturday") +
          printDay(json[6].Sunday, "Sunday");

          $("#answer").html(week);
        },
        error: function(response) {
          console.log(response);
          $("#answer").html("Lambda connection fail");
        }
      });
    });
  }
}
