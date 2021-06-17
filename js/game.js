const CATEGORIES_COUNT = 5;
let categories = [];
let usersStore = [];
let activeUser = 0;
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


function countAnswer(question, value){
    let successUsers = [];
    for(let i in usersStore){
        let user = document.getElementById(`user${i}-input`);
        if(user.value.toLowerCase() == question.answer.toLowerCase()){
            usersStore[i].scores += value;
            successUsers.push(usersStore[i].name);
        }
    }
    if(successUsers.length){
        alert(`${successUsers.join(", ")} ${successUsers.length > 1 ? "are" : "is"} right! The answer is ${question.answer}`);
    } else {
        alert(`No one answered correctly :c The Correct answer is ${question.answer}`);
    }
    document.getElementById("shirma").remove();
    updateUsersUI();
    updateActiveUser("next");
    disabledQuestions.push([question.category_id, value]);
    drawTable(categories);
}

function addUserFields(question, value){
    console.log(question);
    let button = document.createElement("button");
    button.innerHTML = "View Answer!";
    button.addEventListener("click", () => {
        countAnswer(question, value);
    });
    document.getElementById("shirma").appendChild(button);
    for(let i in usersStore){
        let user = document.getElementById(`user${i}`);
        user.className += " active";
        user.innerHTML += `
        <input id="user${i}-input" placeholder="answer" />
        `;
    }
}

function getQuestion(question, value){
    let shirma = document.createElement("div");
    shirma.id = "shirma";

    let questionDiv = document.createElement("div");
    let p = document.createElement("p");
    p.innerText = question.question;
    questionDiv.appendChild(p);
    
    shirma.appendChild(questionDiv);
    document.getElementById("categories").appendChild(shirma);
    
    addUserFields(question, value);
}

function drawTable(data) {
    let table = document.getElementById("categories");
    table.innerHTML = "";
    for(let items of data){
        let tr = document.createElement("tr");

        //Category cell
        let tdCat = document.createElement("td");
        tdCat.className =  "category";
        tdCat.innerText = items[0].category.title;
        tr.appendChild(tdCat);

        //Value cells
        for(let i = 0; i < 5; i++){
            let value = (i + 1) * 200;
            let isDisabled = disabledQuestions.filter(q => q[0] == items[0].category.id && q[1] == value).length > 0;
            if(isDisabled){
                let tdVal = document.createElement("td");
                tdVal.className = "disabled";
                tdVal.innerText = value;
                tr.appendChild(tdVal);
            } else {
                let tdVal = document.createElement("td");
                tdVal.innerText = value;
                tdVal.addEventListener("click", () => getQuestion(items[i], value));
                tr.appendChild(tdVal);
            }
        }

        table.appendChild(tr);
    }
}

async function fillCategories() {
    let data = await fetch("https://jservice.io/api/categories?count=100")
    data = await data.json();
    let cats = [];
    while(cats.length < 5){
        let randomNum = Math.round(Math.random() * data.length);
        let el = data[randomNum];
        if(el) cats.push(el);
        data.splice(randomNum, 1);
    }
    // saving categories for draw table again later
    categories = await Promise.all(cats.map(async cat => {
        let res  = await fetch(`https://jservice.io/api/clues?category=${cat.id}`);
        res = await res.json();
        return res;
    }));

    drawTable(categories);
}

insertUsers();
fillCategories()
.catch(err =>console.error('Looks like there was a problem: ' + err) );
updateActiveUser(0);