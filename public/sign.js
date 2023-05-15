import { auth,database,app } from "../firebase.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, set, ref, update } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

$('.message a').click(function(){
    $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
});

let signup = document.getElementById("signup");

signup.addEventListener("click",(e) =>{

    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var name = document.getElementById('name').value;

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
    // Signed in 
        const user = userCredential.user;

        set(ref(database, 'users/' + user.uid),{
            name: name,
            email: email,
            password: password,
            cart: {},
        })

        alert('user created!');
        $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        alert(errorMessage);
    });
});

let login = document.getElementById("login");
login.addEventListener('click',(e)=>{
    var email = document.getElementById('emaillogin').value;
    var password = document.getElementById('passwordlogin').value;

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;

        const dt = new Date();
        update(ref(database, 'users/' + user.uid),{
        last_login: dt,
        })

        alert('User loged in!');
        window.location.href = "shop.html";
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        console.log(errorCode);
        const errorMessage = error.message;

        alert(errorMessage);
    });

});

const user = auth.currentUser;
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    //bla bla bla
    // ...
  } else {
    // User is signed out
    // ...
    //bla bla bla
  }
});

