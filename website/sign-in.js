function newUser() {
  var down = document.getElementById("answer");
  var form = document.createElement("form");
  form.id = "registry";
  form.appendChild(document.createTextNode("Login : "));
  makeTextField(form, "login", "LOGIN");
  form.appendChild(document.createTextNode("Email : "));
  makeTextField(form, "email", "EMAIL");
  form.appendChild(document.createTextNode("Password : "));
  makeTextField(form, "password1", "PASSWORD");
  form.appendChild(document.createTextNode("Confirm Password : "));
  makeTextField(form, "password2", "PASSWORD");
  form.appendChild(br.cloneNode());
  var body = document.getElementById("body");
  var button = document.createElement("BUTTON");
  button.innerHTML = "registry";
  button.onclick = function(){registryInCognito()};
  form.appendChild(button);
  body.replaceChild(form, body.childNodes[0]);

  function registryInCognito() {
    if(form.elements['password1'].value == form.elements['password2'].value) {
      var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

      var attributeList = [];

      var dataEmail = {
        Name: 'email',
        Value: form.elements['email'].value,
      };

      var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);

      attributeList.push(attributeEmail);
      event.preventDefault();
      userPool.signUp(form.elements['login'].value, form.elements['password1'].value,
      attributeList, null, function(
        err,
        result
      ) {
        if (err) {
          alert(JSON.stringify(err.message));
        } else {
          $("#answer").html("User "+ result.user.getUsername() +" registred! Please login now!");
        }
      });
    } else {
      alert("Passwords didnt match");
    }

  }
}

function loginUser() {
  var down = document.getElementById("answer");
  var form = document.createElement("form");
  form.id = "login";
  form.appendChild(document.createTextNode("Login : "));
  makeTextField(form, "login", "LOGIN");
  form.appendChild(document.createTextNode("Password : "));
  makeTextField(form, "password", "PASSWORD");
  form.appendChild(br.cloneNode());
  var body = document.getElementById("body");
  var button = document.createElement("BUTTON");
  button.innerHTML = "login";
  button.onclick = function(){loginInCognito()};
  form.appendChild(button);
  body.replaceChild(form, body.childNodes[0]);

  function loginInCognito() {
    var authenticationData = {
      Username: form.elements['login'].value,
      Password: form.elements['password'].value,
    };
    event.preventDefault();
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
      authenticationData
    );
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var userData = {
      Username: form.elements['login'].value,
      Pool: userPool,
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function(result) {
        var accessToken = result.getAccessToken().getJwtToken();

        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: constIdentityPoolId,
          Logins: {
            "cognito-idp.us-east-1.amazonaws.com/us-east-1_tskd3SveX": result
            .getIdToken().getJwtToken(),
          },
        });
        AWS.config.credentials.refresh(error => {
          if (error) {
            console.error(error);
          } else {
            // Instantiate aws sdk service objects now that the credentials have been updated.
            // example: var s3 = new AWS.S3();
              $("#answer").html('Successfully logged!');
              cognitoUser = form.elements['login'].value
              userToken = result.getIdToken().getJwtToken();
            console.log('Successfully logged!');
          }
        });
      },

      onFailure: function(err) {
        console.log(JSON.stringify(err.message));
      },
    });
  }
}
