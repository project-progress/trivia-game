const CATEGORIES_COUNT = 5;
let categories = [];
let usersStore = [];
let activeUser = 0;
let gameMode = "choosing";
let disabledQuestions = [];

function insertUsers() {
    let usersDiv = document.getElementById("users");
    let users = window.localStorage.getItem("users");
    if(users && users.length >= 2){
        users = JSON.parse(users);
        usersStore = users;
        for(let i = 0; i < users.length; i++){
            let user = users[i];
            usersDiv.innerHTML += 
            `<div id="user${i}">
                <h3>${user.name}</h3>
                <h3>${user.scores}</h3>
            </div>`;
        }
    } else {
        window.location = "./index.html";
    }
}


function updateActiveUser(userIndex){
    usersStore.forEach(u => {
        if(u.scores >= 3000){
            window.location = `./finish.html?user=${u.name}`;
        }
    });
    if(userIndex == "next"){
        activeUser = activeUser == usersStore.length - 1 ? 0 : activeUser + 1;
    } else {
        activeUser = userIndex;
    }
    document.getElementById(`user${activeUser}`).className += " active";
}

function updateUsersUI() {
    let usersDiv = document.getElementById("users");
    usersDiv.innerHTML = "";
    for(let i = 0; i < usersStore.length; i++){
        let user = usersStore[i];
        usersDiv.innerHTML += 
        `<div id="user${i}">
            <h3>${user.name}</h3>
            <h3>${user.scores}</h3>
        </div>`;
    }
}

function makeUsersClickable(question, value){
    for(i in usersStore){
        let user = document.getElementById(`user${i}`);
        let userObj = usersStore[i];
        user.className += " clickable";
        let callback = () => {
            //open popup
            let popup = document.createElement("div");
            popup.id = "popup";
            popup.innerHTML = `
            <h3>
                Did ${userObj.name} answers correctly?
            </h3>
            <p>Answer: ${question.answer}</p>
            <button id="yes">Yes<br>+${value}</button>
            <button id="no">No<br>-${value}</button>
            `;
            let shirma = document.getElementById("shirma");

            shirma.appendChild(popup);
            let updater = () => {
                document.getElementById("shirma").remove();
                updateUsersUI();
                updateActiveUser("next");
                console.log(question);
                disabledQuestions.push([question.category_id, value]);
                drawTable(categories);

            }
            document.getElementById("yes").addEventListener("click", () => {
                userObj.scores += value;
                updater();
            });

            document.getElementById("no").addEventListener("click", () => {
                userObj.scores -= value;
                updater();
            });
        };
        user.addEventListener("click", callback);
    }
}

function getQuestion(id, value){
    fetch(`https://jservice.io/api/clues?category=${id}&value=${value}`)
    .then(resp => resp.json())
    .then(questions => {
        if(questions.length < 1){
            alert("There is problem on jservice. Please check another value.");
            return;
        }

        let question = questions[0];

        let shirma = document.createElement("div");
        shirma.id = "shirma";

        let questionDiv = document.createElement("div");
        questionDiv.innerHTML = `
        <p>
            ${question.question}
        </p>
        `;

        
        shirma.appendChild(questionDiv);
        document.getElementById("categories").appendChild(shirma);

        gameMode = "answering";
        makeUsersClickable(question, value);
    })
    .catch(err => console.log('Looks like there was a problem: ' + err) );
}

function drawTable(data) {
    let table = document.getElementById("categories");
    table.innerHTML = "";
    for(cat of data){
        table.innerHTML += `
        <tr>
            <td class="category">${cat.title}</td>
            ${Array(8).fill(0).map((_, i) => {
                let value = (i + 1) * 100;
                if(value == 800) value = 1000;
                if(value == 700) value = 800;

                let disabled = disabledQuestions.filter(q => q[0] == cat.id && q[1] == value);
                if(disabled.length){
                    return `
                    <td class="unactive">
                        ${value}
                    </td>
                `;
                }
                return `
                    <td onclick="getQuestion(${cat.id}, ${value})">
                        ${value}
                    </td>
                `;
            }).join("")}
        </tr>
        `;
    }
}

function fillCategories() {
    fetch("http://jservice.io/api/categories?count=200")
    .then(resp => resp.json())
    .then(data => {
        let cats = [];
        data = data.filter(cat => cat.clues_count == 10);
        while(cats.length < 5){
            let randomNum = Math.round(Math.random() * data.length);
            let el = data[randomNum];
            if(el) cats.push(el);
            data.splice(randomNum, 1);
        }
        // saving categories for draw table again later
        categories = cats;
       drawTable(categories);
    })
    .catch(err =>console.log('Looks like there was a problem: ' + err) );
}

insertUsers();
fillCategories();
updateActiveUser(0);