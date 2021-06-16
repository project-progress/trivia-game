const MAX_USERS = 4;

function preload(){
    //add inputs in html
    let usersDiv = document.getElementById("users");
    for(let i = 0; i < MAX_USERS; i++){
        usersDiv.innerHTML += `<input id="user${i}" spellcheck="false" placeholder="Write ${i + 1} user's name">`;
    }

    //If Users are in the local storage - load them.
    let lsUsers = window.localStorage.getItem("users");
    if(lsUsers && lsUsers.length){
        lsUsers = JSON.parse(lsUsers);
        lsUsers.forEach((user, i) => {
            document.getElementById(`user${i}`).value = user.name;
        });
    }

    //on click the start button rewrite users in localstorage
    let startButton = document.getElementById("startButton");
    startButton.addEventListener('click', () => {
        let users = Array(MAX_USERS).fill(0).map((_, i) => new User(document.getElementById(`user${i}`).value, 0)).filter(u => u.name != "");
        if(users.length >= 2){
            window.localStorage.setItem("users", JSON.stringify(users));
            window.location = "./game.html";
        } else {
            alert("The number of players is not enough. It must be minimum 2.");
        }

    });
}

preload();