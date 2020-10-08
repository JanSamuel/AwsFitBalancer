function trackTrening() {
  var now = new Date();
  var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var day = days[ now.getDay() ];

  var data = {
    day : day,
    user: cognitoUser,
  };
  function makeTabel(tablearea, response, id) {
    var form = document.createElement("form");
    form.id = id;
    tablearea.appendChild(document.createTextNode(response.name + " : "));
    tablearea.appendChild(br.cloneNode());
    var sets = response.sets;
    var reps = response.reps;
    var weigth = response.weigth;
    form.setAttribute('data-sets', sets);
    for (var i = 0; i < parseInt(sets,10); i++) {
      makeNumberField(form, id+"reps"+i.toString(), 3, reps+" / ")
      makeNumberField(form, id+"weigth"+i.toString(), 3, weigth+" / ")
      form.appendChild(br.cloneNode());
    }
    tablearea.appendChild(form);
  }
  function handelResponse(tablearea, response) {
    makeTabel(tablearea, response.Arms, "Arms");
    makeTabel(tablearea, response.Legs, "Legs");
    makeTabel(tablearea, response.Chest, "Chest");
    makeTabel(tablearea, response.Back, "Back");
    makeTabel(tablearea, response.Shoulders, "Shoulders");
    makeTabel(tablearea, response.Calves, "Calves");
    makeTabel(tablearea, response.Abs, "Abs");
  }
    $.ajax({
      type: "POST",
      url: constApi_site+constTrackTrainig_endpoint,
      headers: {"Authorization": userToken},
      crossDomain: "true",
      dataType: "text",
      contentType: "application/json",
      data: JSON.stringify(data),
      success: function(response) {
        var tablearea = document.getElementById('body');
        tablearea.appendChild(document.createTextNode(day));
        tablearea.appendChild(br.cloneNode());
        if(!response.rest){
        handelResponse(tablearea, response);
        var button = document.createElement("button");
        button.innerHTML = "Get trening";
        button.onclick = function(){submitTreiningToAPI()};
        var click = document.getElementById("click");
        click.replaceChild(button, click.childNodes[0]);
      } else {
        tablearea.appendChild(document.createTextNode("IT IS REST DAY!"));
      }
      },
      error: function(response) {
        console.log(response);
        $("#answer").html("Lambda connection fail");
      }
    });
function submitTreiningToAPI(){
function getTreningData(id) {
  var arrayRep = [];
    var arrayWeigth = [];
  var form = document.getElementById(id);
  var sets = form.getAttribute('data-sets');
  for (var i = 0; i < parseInt(sets,10); i++) {
    arrayRep.push(form.elements[id+"reps"+i.toString()].value);
    arrayWeigth.push(form.elements[id+"weigth"+i.toString()].value);
  }
  var resp = {reps : arrayRep, weigths: arrayWeigth};
  return resp;
}

  var dataResults = {
    date : day,
    Arms : getTreningData("Arms"),
    Legs : getTreningData("Legs"),
    Chest : getTreningData("Chest"),
    Back : getTreningData("Back"),
    Shoulders : getTreningData("Shoulders"),
    Calves : getTreningData("Calves"),
    Abs : getTreningData("Abs"),
  };
  $.ajax({
    type: "POST",
    url: constApi_site+constSendTrainig_endpoint,
    headers: {"Authorization": userToken},
    crossDomain: "true",
    dataType: "text",
    contentType: "application/json",
    data: JSON.stringify(data),
    success: function(response) {
      var tablearea = document.getElementById('body');
      tablearea.replaceChild(document.createTextNode("Treining added! Have a nice rest"), tablearea.childNodes[0]);
    },
    error: function(response) {
      console.log(response);
      $("#answer").html("Lambda connection fail");
    }
  });
  }

  }
