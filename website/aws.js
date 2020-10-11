const constApi_base = "https://t7t9jqje7k.execute-api.us-east-1.amazonaws.com/"
const constApi_deploy = "Version_1/"

const constApi_site =  constApi_base + constApi_deploy;

const constGetTrainig_endpoint = "get-plan"
const constTrackTrainig_endpoint = "track-plan"

AWS.config.region = "us-east-1";

const constCognitoUserPoolId = "us-east-1_tskd3SveX";
const constCognitoClientId = "4v8jff653h053ov22ng4778cd1";
const constIdentityPoolId = "us-east-1:5ec1af0e-bb14-49bb-bd47-f6f86bc6ba12";
var cognitoUser = "";
var userToken = "";
var poolData = {
    UserPoolId: constCognitoUserPoolId,
    ClientId: constCognitoClientId,
};
