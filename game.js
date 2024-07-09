let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["Stick"];

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const text = document.querySelector("#text");
const monsterStats = document.querySelector("#monsterStats");
const monsterNameText = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

const monsters = [
    {
        name: "Slime!",
        level: 10,
        health: 30
    },
    {
        name:"Fanged Wolf!",
        level: 30,
        health: 80
    },
    {
        name:"DRAGON!",
        level: 50,
        health: 300
    }
]

const weapons = [
    {
        name: "STICK",
        power: 5
    },
    {
        name: " DAGGER",
        power: 30
    },
    {
        name: " STAFF",
        power: 50
    },
    {
        name: " ULTIMATE SWORD",
        power: 100
    }
];

const locations = [
    {
        name: "Town Square",
        "button text": ["Go to Store", "Go to Cave", "Fight Dragon"],
        "button function": [goStore, goCave, fightDragon],
        text: "You Are In The Town Square. You See a Sign That Says \"Store\"."
    },
    {
        name: "Store",
        "button text": ["Buy 10 Health(10 GOld)", "Buy Weapon(30 Gold)", "Go To Town Square"],
        "button function": [buyHealth, buyWeapon, goTown],
        text: "You Are In The Store."
    },
    {
        name: "Cave",
        "button text": ["Fight Slime", "Fight Fanged Wolf", "Go To Town Square"],
        "button function": [slime, wolf, goTown],
        text: "You Are In The Cave. You See Some Monster."
    },
    {
        name: "Fight",
        "button text": ["Attack", "Dodge", "RUN"],
        "button function": [attack, dodge, goTown],
    },
    {
        name: "Kill Monster",
        "button text": ["Go To Town Square", "Go To Town Square", "Go To Town Square"],
        "button function": [goTown, easterEgg, goTown] 
    },
    {
        name: "Lose",
        "button text": ["RETRY!!", "RETRY!!", "RETRY!!"],
        "button function": [restart, restart, restart],
        text: "You DIE!!.\nWant To TRY AGAIN!!."
    },
    {
        name: "Win",
        "button text": ["RETRY!!", "RETRY!!", "RETRY!!"],
        "button function": [restart, restart, restart],
        text: "You WIN!!. You Defeated The DRAGON!!\nWant To Play AGAIN!!."
    },
    {
        name: "Easter Egg",
        "button text": ["2", "6", "Go To Town Square?"],
        "button function": [pickTwo, pickSix, goTown],
        text: "You Find A Secret Game. Pick A Number Above. Ten Number Will Be Randomly Chosen Between 0 and 10. If The Number You Chose Matches One Of The Random NUmbers, You WIN!!."
    }
];

//initialize buttons

button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
    monsterStats.style.display = "none";
    button1.innerText = location["button text"][0];
    button2.innerText = location["button text"][1];
    button3.innerText = location["button text"][2];

    button1.onclick = location["button function"][0];
    button2.onclick = location["button function"][1];
    button3.onclick = location["button function"][2];
    text.innerText = location.text;
}

function goTown() {
    update(locations[0]);
}

function goStore() {
    update(locations[1]);
}

function goCave() {
    update(locations[2]);
}

function buyHealth() {
    if (gold >= 10) {
        gold -= 10;
        health += 10;
        goldText.innerText = gold;
        healthText.innerText = health;
        text.innerText = "You Bought 10 Health!";
    }
    else{
        text.innerText = "You DO NOT Have ENOUGH Gold To Buy Health!";
    }
}

function buyWeapon() {
    if (currentWeapon < weapons.length - 1) {
        if (gold >= 30) {
            gold -= 30;
            currentWeapon++;
            goldText.innerText = gold;
            let newWeapon = weapons[currentWeapon].name;
            text.innerText = "You Now Have A " + newWeapon + ".\n";
            inventory.push(newWeapon);
            text.innerText += "In Your Inventory You Now Have " + inventory;
        }
        else {
            text.innerText = "You DO NOT Have ENOUGH Gold To Buy A Weapon!.";
        }
    }
    else {
        text.innerText = "You Already Have The MOST POWERFUL Weapon!.\n";
        button2.innerText = "Sell You Weapon For 15 Gold";
        button2.onclick = sellWeapon;
    }
}

function sellWeapon() {
    if (inventory.length > 1) {
        gold += 15;
        goldText.innerText = gold;
        let currentWeapon = inventory.shift();
        text.innerText = "You Sold A" + currentWeapon + ".\n";
        text.innerText += "In Your Inventory You Now Have" + inventory + ".";
    }
    else {
        text.innerText = "Don't SELL You ONLY Weapon!!!.";
    }
}

function goFight() {
    update(locations[3]);
    monsterHealth = monsters[fighting].health;
    monsterStats.style.display = "block";
    monsterNameText.innerText = monsters[fighting].name;
    monsterHealthText.innerText = monsterHealth;
    text.innerText = "You Are Fighting A " + monsters[fighting].name + ".";
}

function slime() {
    fighting = 0;
    goFight();
}

function wolf() {
    fighting = 1;
    goFight();
}

function fightDragon() {
    fighting = 2;
    goFight();
}

function attack() {
    text.innerText = "The " + monsters[fighting].name + " ATTACKS!!!.\n";
    text.innerText += "You Attack it with your " + weapons[currentWeapon].name + ".";
    if(isMonsterHit()) {
        health -= (getMonsterAttackValue(monsters[fighting].level));
    }
    else{
        text.innerText = "You Miss!!";
    }   
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 10;
    healthText.innerText = health;
    monsterHealthText.innerText = monsterHealth;

    if(health <= 0) {
        lose();
    }
    else if (monsterHealth <= 0) {
        if(fighting === 2){
            winGame();
        }
        else {
            defeatMonster();
        }
    }

    if(Math.random() <= .1 && inventory.length !== 1) {
        text.innerText = "Your " + inventory.pop() + " Breaks.";
        currentWeapon--;
    }
}

function dodge() {
    text.innerText = "You Dodged The Attack From The" + monsters[fighting].name + ".";
    health -= 5;
    healthText.innerText = health;
}

function lose() {
    update(locations[5]);
}

function defeatMonster() {
    gold += Math.floor(monsters[fighting].level * 1.5);
    goldText.innerText = gold;
    xp += (monsters[fighting].level) - ((monsters[fighting].level)/2);
    xpText.innerText = xp;
    update(locations[4]);
    text.innerText = "You Defeated The" + monsters[fighting].name + ".";
    text.innerText += ' It Says "URG!" as it dies! You Gain Expericence And Lots Of Gold!. '
}

function restart() {
    xp = 0;
    health = 100;
    gold = 50;
    currentWeapon = 0;
    inventory = ["Stick"];
    goldText.innerText = gold;
    healthText.innerText = health;
    xpText.innerText = xp;
    goTown();
}

function winGame() {
    update(locations[6]);
}

function getMonsterAttackValue(level) {
    let hit = ((level*2) - (Math.floor(Math.random() * xp)));
    return hit;
}

function isMonsterHit() {
    return Math.random() > .2 || health < 20;
}

function easterEgg() {
    update(locations[7]);
}

function pickTwo() {
    pick(2);
}

function pickSix() {
    pick(6);
}

function pick(guess) {
    let numbers = [];
    while (numbers.length < 10) {
        numbers.push(Math.floor(Math.random() * 11));        
    }
    text.innerText = "You Picked " + guess + ". Here Are The Random Numbers:\n";

    for (let i = 0; i < numbers.length; i++) {
        text.innerText += numbers[i] + "\n";
    }
    if (numbers.indexOf(guess) !== -1) {
        text.innerText += "Right! You Win 20 Gold";
        gold += 20;
        goldText.innerText = gold;        
    }
    else {
        text.innerText += "Wrong! You Lose 10 Health!";
        health -= 10;
        healthText.innerText = health;
        if (health <= 0) {
            lose();
        }
    }
}
