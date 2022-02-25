const prompts = require('prompts');

class Character {
  constructor(name, hitPoints, damagePoints, hitChance, weapon) {
      this.name = name;
      this.hitPoints = hitPoints;
      this.damagePoints = damagePoints;
      this.hitChance = hitChance;
      this.weapon = weapon;
  }

  takeDamage(damage) {
    this.hitPoints -= damage;
    if (this.hitPoints <= 0) {
      console.log(this.name + ' is hit and is destroyed!');
      currentRoom.enemies.splice((currentRoom.enemies.indexOf(this)),1);
    } else {
      console.log(this.name + ' is hit and has ' + this.hitPoints + ' hitpoints remaining');
    }
  }
}

class EnemyCharacter extends Character {
  constructor(location, name, hitPoints, damagePoints, hitChance, weapon) {
    super(name, hitPoints, damagePoints, hitChance, weapon)
    location = location;
    rooms[location].enemies.push(this);
  }

  attack() {
    let dieRoll = Math.floor(Math.random() * 100) + 1;
    console.log(this.name + ' attacks Player with its ' + this.weapon);
    //console.log('\t(Hit chance: ' + this.hitChance + '%, die roll: ' + dieRoll + ')'); //POISTA
    if (dieRoll <= this.hitChance) {
      console.log(this.name + ' hits Player with ' + this.damagePoints + ' points!');
      player.takeDamage(this.damagePoints);
    } else {
      console.log(this.name + ' attack misses!');
    }
  }
}

class PlayerCharacter extends Character {
  constructor(name, hitPoints, damagePoints, hitChance, weapon) {
    super(name, hitPoints, damagePoints, hitChance, weapon)
    this.alive = true;
  }

  takeDamage(damage) {
    this.hitPoints -= damage;
    if (this.hitPoints <= 0) {
      if (this.alive == true) {
        console.log(this.name + ' is hit and killed!');
        this.alive = false;
      } else {
        console.log(this.name + ' is now even more dead than before...');   //Multiple enemies are allowed to attack the player before the game ends due to player dead.
      }
    } else {
      console.log(this.name + ' is hit and has ' + this.hitPoints + ' hitpoints remaining');
    }
  }

  attack(target) {
    //console.log('The target is: '+ target);   //POISTA
    //console.log(target);                      //POISTA
    let dieRoll = Math.floor(Math.random() * 100) + 1;
    console.log('You bravely attack the ' + target.name + ' with your ' + this.weapon);
    //console.log('\t(Hit chance: ' + this.hitChance + '%, die roll: ' + dieRoll + ')');   //POISTA
    if (dieRoll <= this.hitChance) {
      console.log(this.name + ' hits ' + target.name + ' with ' + this.damagePoints + ' points!')
      target.takeDamage(this.damagePoints);
    } else {
      console.log('The attack missed!');
    }
  }
}

class Room {
  constructor(name, doorways, lookAroundText) {
    this.name = name;
    this.doorways = doorways;
    this.enemies = [];
    this.lookAroundText = lookAroundText;
  }
  
  enemyLister() {
    class EnemyXXX {
      constructor(title, value) {
        this.title = title;
        this.value = value;
      }
    };
    let enemyChoices = [];
    for (let i = 0; i < this.enemies.length; i++) {
      let pusher = new EnemyXXX(this.enemies[i].name, this.enemies[i]);
      enemyChoices.push(pusher);
    };
    //console.log(enemyChoices); //POISTA ---------------------------
    return enemyChoices;
  };

  doorwayLister() {
    class doorwayXXX {
      constructor(title, value) {
        this.title = title;
        this.value = value;
      }
    };
    let moveChoices = [];
    for (let i = 0; i < this.doorways.length; i++) {
      let pusher = new doorwayXXX(rooms[this.doorways[i]].name, this.doorways[i]);
      moveChoices.push(pusher);
    };
    //console.log(moveChoices); //POISTA ---------------------------
    return moveChoices;
  };

  describe() { 
    console.log(this.lookAroundText);
    console.log("\nThere are doorways leading to:");
    for (let i = 0; i < this.doorways.length; i++) {
      console.log(rooms[this.doorways[i]].name);
    }
    if (this.enemies.length > 0) {
      console.log();
      for (let i = 0; i < this.enemies.length; i++) {
        console.log('You see a ' + this.enemies[i].name);
      }
    }
    console.log();
  }
}



let rooms = [
  new Room("Dungeon Entrance", [1], "You are in the dungeon and it is a big and damp room with broken statues all around."),
  new Room("Hallway", [0,2], "You are in Hallway and it is a long and dark hallway with dark pools of water on the floor and some fungus growing on the walls."),
  new Room("Chamber", [1,3], "You are in Chamber and it is a small chamber, which is illuminated by a glowing portal of somekind."),
  new Room("Glowing Portal", [], "THE END")
  //new Room("Secret Tunnel", [0,5], "You are in a narrow tunnel."),
  //new Room("Secret Room", [4], "You have found a well hidden room with nothing in it.")
];

new EnemyCharacter(1, "Small sewer rat", 2, 1, 50, "sharp teeths")
new EnemyCharacter(2, "Giant Dragon", 4, 8, 90, "sharp claws and fire breath")
new EnemyCharacter(0, "Ugly Troll", 4, 2, 50, "huge club")
new EnemyCharacter(0, "Evil Wizard", 3, 1, 50, "magic blast")
new EnemyCharacter(0, "Servant of Chaos", 3, 1, 80, "machinegun of death")

let player = new PlayerCharacter("Player", 10, 2, 75, "sharp sword");

/*
//Enable to check the rooms.
console.log('\n');   
for (let i = 0; i < rooms.length; i++) {
  console.log('\n----Room_' + [i] + '----');
  console.log(rooms[i]);
}
console.log('\n');
*/


function enemiesAttack() {
  for (let i = 0; i < currentRoom.enemies.length; i++) {
    currentRoom.enemies[i].attack();
    console.log();
  }
};








async function gameLoop() {
    let continueGame = true;

    const initialActionChoices = [
        { title: 'Look around', value: 'look' },
        { title: 'Go to Room', value: 'move' },
        { title: 'Attack', value: 'attack' },
        { title: 'Exit game', value: 'exit' }
    ];

    // Show the list of options for the user.
    // The execution does not proceed from here until the user selects an option.
    const response = await prompts({
      type: 'select',
      name: 'value',
      message: 'Choose your action',
      choices: initialActionChoices
    });

    // Deal with the selected value
    switch(response.value) {

        case 'look':
          currentRoom.describe();
          enemiesAttack();
          break;

        case 'move':
          const response2 = await prompts({
            type: 'select',
            name: 'value',
            message: 'Which room do you want to go to?',
            choices: currentRoom.doorwayLister()
          });
          currentRoom = rooms[response2.value];
          console.log("You move to the " + currentRoom.name);
          if (currentRoom.lookAroundText == "THE END") {
            continueGame = false;
            console.log('Congratulations, you made it through the dungeons!\n')
          } else {
            currentRoom.describe();
            enemiesAttack();
          }
          break;

      case 'attack':
        if (currentRoom.enemies.length < 1) {
          console.log('You swing your ' + player.weapon + ' in the empty air. There\'s no enemies in sight.')
        } else {
          const response3 = await prompts({
            type: 'select',
            name: 'value',
            message: 'Which enemy you want to attack?',
            choices: currentRoom.enemyLister()
        });
          //console.log(response3.value);     // POISTA
          player.attack(response3.value);   // response3.value on koko enemy-objekti, mutta voisi olla myös currentroom.enemies.indexOf(response3.value)
        }
        break;
      
      case 'exit':
        continueGame = false;
        break;
    }

    if (player.hitPoints <= 0) {
      continueGame = false;
      console.log('You have lost the game.\n');
    };

    if(continueGame) {
      console.log('---------------');
      gameLoop();
    }    
}

process.stdout.write('\033c'); // clear screen on windows
console.log('WELCOME TO THE DUNGEONS OF LORD OBJECT ORIENTUS!')
console.log('================================================')
console.log('You walk down the stairs to the dungeons')
let currentRoom = rooms[0];
gameLoop();





