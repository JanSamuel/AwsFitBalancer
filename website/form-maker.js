var br = document.createElement("br");

function makeRadioField(form, name, value, text) {
  var radio = document.createElement("input");
  radio.type = "radio";
  radio.name = name;
  radio.value = value;

  form.appendChild(document.createTextNode(text));
  form.appendChild(radio);
}

function makeNumberField(form, name, maxlength, text) {
  var number = document.createElement("input");
  number.type = "number";
  number.name = name;
  number.maxlength = maxlength;

  form.appendChild(document.createTextNode(text));
  form.appendChild(number);
}
