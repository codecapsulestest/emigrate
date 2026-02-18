function navigate() {
  var user = localStorage.getItem("user");
  if (user) { showAccount(user); } else { showAuth(); }
}

function showAuth() {
  var app = document.getElementById("app");
  app.innerHTML =
    '<h1>Sign In / Register</h1>' +
    '<form autocomplete="on">' +
    '<input id="email" name="email" autocomplete="email" placeholder="Email" /><br>' +
    '<input id="password" name="password" type="password" autocomplete="current-password" placeholder="Password" /><br>' +
    '<button id="ok" type="button">OK</button>' +
    '</form>' +
    '<p id="msg"></p>';
  document.getElementById("ok").onclick = function() {
    var email = document.getElementById("email").value;
    var pw = document.getElementById("password").value;
    var msg = document.getElementById("msg");
    fetch(backendUrl + "/signin", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      credentials: "include",
      body: JSON.stringify({username: email, password: pw})
    }).then(function(r) {
      if (r.ok) return r.json().then(function(d) { localStorage.setItem("user", d.username); navigate(); });
      return fetch(backendUrl + "/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify({username: email, password: pw})
      }).then(function(r2) {
        if (r2.ok) return r2.json().then(function(d) { localStorage.setItem("user", d.username); navigate(); });
        return r2.json().then(function(d) { msg.textContent = d.error; });
      });
    });
  };
}

function showAccount(user) {
  document.getElementById("app").innerHTML = '<h1>Account</h1><p>' + user + '</p>';
}

navigate();
