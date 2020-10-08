var br = document.createElement("br");

function makeRadioField(form, name, value, text) {
  var radio = document.createElement("input");
  radio.type = "radio";
  radio.name = name;
  radio.value = value;
  radio.style.marginRight = "20px";
  form.appendChild(document.createTextNode(text));
  form.appendChild(radio);
}

function makeNumberField(form, name, maxlength, text) {
  var number = document.createElement("input");
  number.type = "number";
  number.name = name;
  number.maxlength = maxlength;
  number.style.marginRight = "20px";

  form.appendChild(document.createTextNode(text));
  form.appendChild(number);
}
function makeTextField(form, name, text) {
  var textNode = document.createElement("input");
  textNode.style.marginRight = "20px";
  textNode.type = "text";
  textNode.name = name;
  textNode.placeholder = text;
  form.appendChild(textNode);
}

function makePasswordField(form, name, text) {
  var textNode = document.createElement("input");
  textNode.style.marginRight = "20px";
  textNode.type = "password";
  textNode.name = name;
  textNode.placeholder = "password";
  form.appendChild(textNode);
}
