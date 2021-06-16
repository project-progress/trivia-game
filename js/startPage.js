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
        let users = [];
        for(let i = 0; i < MAX_USERS; i++){
            //trim() removes all unnecessery spaces 
            let userName = document.getElementById(`user${i}`).value.trim();
            if(userName.length > 2 ){
                users.push(new User(userName, 0));
            }
        }
        if(users.length >= 2){
            window.localStorage.setItem("users", JSON.stringify(users));
            window.location = "./game.html";
        } else {
            alert("The number of players is not enough. It must be minimum 2 (Also all names must be minimum 3 symbols length)");
        }

    });
}

preload();