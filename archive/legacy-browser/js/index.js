$(document).ready(() => {
  // Getting references to our form and input
  const signUpForm = $("form.signup");
  const emailInput = $("input#signEmail");
  const passwordInput = $("input#signPass");
  const usernameInput = $("input#signName");
  const loginForm = $("form.login");
  const loginNameInput = $("input#loginName");
  const loginPasswordInput = $("input#loginPass");
  
  // When the signup button is clicked, we validate the email and password are not blank
  signUpForm.on("submit", event => {
    event.preventDefault();

    const userData = {    
        // removed the trim because there was a error 
      email: emailInput.val(),
      password: passwordInput.val(),
      username: usernameInput.val()
    };
    if (!userData.email || !userData.password) {
      return;
    }
    console.log(userData),
    // If we have an email and password, run the signUpUser function
    signUpUser(userData.email, userData.password, userData.username);
    emailInput.val("");
    passwordInput.val("");
    usernameInput.val("");
  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function signUpUser(email, password, username) {

    $.post("/rpg-api/signup", {
      username: username,
      email: email,
      password: password
    }).then(function(){
      loginUser(username, password);
    })
    .catch(err => {
      console.log(err);
      alert(err.responseJSON.errors[0]['message']);
    });

  }

  function handleLoginErr(err) {
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }

  // Getting references to our form and inputs
  
  // When the form is submitted, we validate there's an email and password entered
  loginForm.on("submit", event => {

    event.preventDefault();
    const userData = {
      username: loginNameInput.val().trim(),
      password: loginPasswordInput.val().trim()
    };

    if (!userData.username || !userData.password) {
      return;
    }

    // If we have an email and password we run the loginUser function and clear the form
    loginUser(userData.username, userData.password);
    loginNameInput.val("");
    loginPasswordInput.val("");
  });

  // loginUser does a post to our "rpg-api/login" route and if successful, redirects us the the welcome page
  function loginUser(username, password) {
    $.post("/rpg-api/login", {
      username: username,
      password: password
    }).then(function(){

      //saving username to local storage
      localStorage.setItem("username", username);
      window.location = "/welcome";

    })
      .catch(err => {
        console.log(err);
        if(err.responseText == 'Unauthorized') {
          alert("Invalid Username or Password!");
        }
      });
  }
});