// === Game Variables ===
// Variables to keep track of player stats and game state
let health = 100;            // Player's health points
let gold = 100;              // Player's gold coins
let xp = 0;                  // Player's experience points
let inventory = {            // Player's weapons inventory, boolean flags if owned
  sword: false,
  bow: false,
  magic: false
};
let selectedWeapon = null;   // Currently equipped weapon for fighting
let currentLocation = "town"; // Current location of player in game world
let monsterHealth = 50;      // Current health of monster in fight

// === DOM Elements ===
// Elements selected from HTML to update or listen for user interaction
const startBtn = document.getElementById('startGame');               // Start button
const nameInput = document.getElementById('playerName');             // Input for player name
const ageInput = document.getElementById('playerAge');               // Input for player age
const agreeCheckbox = document.getElementById('agreeRules');         // Checkbox to agree on rules
const formSection = document.getElementById('form-section');         // Form section container
const gameSection = document.getElementById('game-section');         // Game UI container
const playerDisplayName = document.getElementById('playerDisplayName'); // Display player name in game
const btn1 = document.getElementById('btn1');                        // Action button 1
const btn2 = document.getElementById('btn2');                        // Action button 2
const btn3 = document.getElementById('btn3');                        // Action button 3
const btn4 = document.getElementById('btn4');                        // Action button 4
const locationText = document.getElementById('location-description'); // Text description of current location
const weaponSelectDiv = document.getElementById('weapon-choice');    // Div containing weapon selector dropdown
const weaponSelect = document.getElementById('selectedWeapon');      // Weapon selection dropdown
const monsterHealthContainer = document.getElementById('monsterHealthContainer'); // Container to show monster health
const monsterHealthValue = document.getElementById('monsterHealthValue');         // Text for monster health value
const selectedWeaponLabel = document.getElementById('selectedWeaponLabel');       // Label showing selected weapon

// === Enable Start Button ===
// Enable the start button only when the user agrees to the rules checkbox
agreeCheckbox.addEventListener('change', () => {
  startBtn.disabled = !agreeCheckbox.checked;  // Disable button if not checked
});

// === Save Game ===
// Saves the current game state to localStorage using player's name as key
function saveGame() {
  const key = 'jsSkillsArenaSave_' + playerDisplayName.textContent.toLowerCase();
  const saveData = {
    health,
    gold,
    xp,
    inventory,
    selectedWeapon,
    currentLocation,
    monsterHealth,
    playerName: playerDisplayName.textContent
  };
  localStorage.setItem(key, JSON.stringify(saveData));  // Store stringified JSON object
}

// === Load Game ===
// Loads saved game data from localStorage if it exists and updates variables/UI accordingly
function loadGame() {
  const key = 'jsSkillsArenaSave_' + playerDisplayName.textContent.toLowerCase();
  const data = localStorage.getItem(key);
  if (data) {
    const game = JSON.parse(data);
    // Restore game state variables from saved data
    ({
      health,
      gold,
      xp,
      inventory,
      selectedWeapon,
      currentLocation,
      monsterHealth
    } = game);
    playerDisplayName.textContent = game.playerName;
    updateStats();             // Update UI to reflect loaded stats
    updateLocation(currentLocation);  // Show saved location UI
    return true;               // Indicate successful load
  }
  return false;                // No saved data found
}

// === Start Game ===
// Triggered when user clicks start; validates inputs, loads or starts new game
startBtn.addEventListener('click', () => {
  const name = nameInput.value.trim();
  const age = Number(ageInput.value.trim());

  // Validate name: letters only
  if (!/^[a-zA-Z]+$/.test(name)) {
    Swal.fire('Invalid Name', 'Name must contain letters only.', 'error');
    return;
  }
  // Validate age: must be a number > 8
  if (isNaN(age) || age <= 8) {
    Swal.fire('Invalid Age', 'Age must be a number greater than 8.', 'error');
    return;
  }
  // Validate checkbox agreement
  if (!agreeCheckbox.checked) {
    Swal.fire('Agreement Required', 'You must agree to the rules.', 'warning');
    return;
  }

  playerDisplayName.textContent = name;

  // Try loading saved game or start fresh
  if (loadGame()) {
    Swal.fire('Welcome back!', 'Your saved game has been loaded.', 'success').then(() => {
      formSection.style.display = 'none';  // Hide start form
      gameSection.classList.remove('hidden');  // Show game UI
    });
  } else {
    Swal.fire('Welcome!', 'Let\'s start the game.', 'success').then(() => {
      formSection.style.display = 'none';
      gameSection.classList.remove('hidden');
      updateStats();           // Update stats display
      updateLocation('town');  // Start at town location
      saveGame();              // Save initial game state
    });
  }
});

// === Update Stats ===
// Updates the stats display UI elements with current values
function updateStats() {
  document.getElementById('healthValue').textContent = health;
  document.getElementById('goldValue').textContent = gold;
  document.getElementById('xpValue').textContent = xp;
  monsterHealthValue.textContent = monsterHealth;
  selectedWeaponLabel.textContent = selectedWeapon
    ? selectedWeapon.charAt(0).toUpperCase() + selectedWeapon.slice(1)
    : 'None';
}

// === Locations ===
// Defines text, button labels, their handlers, and backgrounds for each location
const locations = {
  town: {
    text: "🏨 You're in the Town. What do you want to do?",
    buttons: ["Go to Store 🛒", "Go Fight 👹", "Sell Items 💰", ""],
    functions: [goStore, goFight, goSell, null],
    bg: "assets/town.jpg"
  },
  store: {
    text: "🛒 Buy a weapon.",
    buttons: ["Buy Sword (30)", "Buy Bow (50)", "Buy Magic (80)", "⬅️ Go to Town"],
    functions: [buySword, buyBow, buyMagic, goTown],
    bg: "assets/store.jpg"
  },
  fight: {
    text: "⚔️ Choose your weapon and fight!",
    buttons: ["Attack 🗡️", "Dodge 🛡️", "Run 🏃", "⬅️ Go to Town"],
    functions: [attack, dodge, runAway, goTown],
    bg: "assets/fight.jpg"
  },
  sell: {
    text: "💰 Sell your items.",
    buttons: ["Sell Sword (15)", "Sell Bow (25)", "Sell Magic (40)", "⬅️ Go to Town"],
    functions: [sellSword, sellBow, sellMagic, goTown],
    bg: "assets/sell.jpg"
  }
};

// === updateLocation ===
// Changes the current location in the game and updates UI accordingly
function updateLocation(name) {
  const loc = locations[name];
  currentLocation = name;

  // Update description text
  locationText.textContent = loc.text;

  // Set background image based on location
  document.body.style.backgroundImage = `url('${loc.bg}')`;

  // Update buttons: text, visibility, and click handlers
  [btn1, btn2, btn3, btn4].forEach((btn, i) => {
    if (loc.buttons[i]) {
      btn.style.display = 'inline-block';
      btn.textContent = loc.buttons[i];
      btn.onclick = loc.functions[i];
    } else {
      btn.style.display = 'none';
    }
  });

  // If in fight location, show monster health and weapon selector
  if (name === 'fight') {
    monsterHealthContainer.style.display = 'inline-block';
    weaponSelectDiv.style.display = 'block';

    // Clear previous weapon options
    weaponSelect.innerHTML = '<option value="">-- Select Weapon --</option>';

    // Add all owned weapons as options
    let firstOwned = null;
    for (let key in inventory) {
      if (inventory[key]) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = key.charAt(0).toUpperCase() + key.slice(1);
        weaponSelect.appendChild(option);
        if (!firstOwned) firstOwned = key;
      }
    }

    // Auto-select the first owned weapon if available
    if (firstOwned) {
      selectedWeapon = firstOwned;
      weaponSelect.value = firstOwned;
    } else {
      selectedWeapon = null;
      weaponSelect.value = "";
    }
  } else {
    // Hide fight-specific UI elements elsewhere
    monsterHealthContainer.style.display = 'none';
    weaponSelectDiv.style.display = 'none';
  }

  updateStats();
  saveGame();  // Save game after location change
}

// === Navigation functions ===
function goStore() { updateLocation("store"); }
function goFight() { updateLocation("fight"); }
function goSell() { updateLocation("sell"); }
function goTown() { updateLocation("town"); }

// === Buying Functions ===
// Attempt to buy sword if player has enough gold and doesn't already own it
function buySword() {
  if (gold >= 30 && !inventory.sword) {
    gold -= 30;
    inventory.sword = true;
    Swal.fire('Purchased', '🗡️ You bought a sword!', 'success');
  } else {
    Swal.fire('Failed', 'You already own it or don\'t have enough gold.', 'info');
  }
  updateStats();
  saveGame();
}

// Attempt to buy bow
function buyBow() {
  if (gold >= 50 && !inventory.bow) {
    gold -= 50;
    inventory.bow = true;
    Swal.fire('Purchased', '🏹 You bought a bow!', 'success');
  } else {
    Swal.fire('Failed', 'You already own it or don\'t have enough gold.', 'info');
  }
  updateStats();
  saveGame();
}

// Attempt to buy magic
function buyMagic() {
  if (gold >= 80 && !inventory.magic) {
    gold -= 80;
    inventory.magic = true;
    Swal.fire('Purchased', '✨ You bought magic!', 'success');
  } else {
    Swal.fire('Failed', 'You already own it or don\'t have enough gold.', 'info');
  }
  updateStats();
  saveGame();
}

// === Selling Functions ===
// Sell sword if owned
function sellSword() {
  if (inventory.sword) {
    inventory.sword = false;
    gold += 15;
    Swal.fire('Sold', '🗡️ Sword sold.', 'success');
  } else {
    Swal.fire('No Item', 'You don\'t own this.', 'info');
  }
  updateStats();
  saveGame();
}

// Sell bow if owned
function sellBow() {
  if (inventory.bow) {
    inventory.bow = false;
    gold += 25;
    Swal.fire('Sold', '🏹 Bow sold.', 'success');
  } else {
    Swal.fire('No Item', 'You don\'t own this.', 'info');
  }
  updateStats();
  saveGame();
}

// Sell magic if owned
function sellMagic() {
  if (inventory.magic) {
    inventory.magic = false;
    gold += 40;
    Swal.fire('Sold', '✨ Magic sold.', 'success');
  } else {
    Swal.fire('No Item', 'You don\'t own this.', 'info');
  }
  updateStats();
  saveGame();
}

// === Combat Functions ===

// Calculate player's damage based on equipped weapon
function getPlayerDamage() {
  if (!selectedWeapon || !inventory[selectedWeapon]) return 0;
  const base = selectedWeapon === 'sword' ? 5 : selectedWeapon === 'bow' ? 7 : 20;
  // Random damage between base/2 and base
  return Math.floor(Math.random() * (base / 2)) + Math.floor(base / 2);
}

// Player attacks monster
function attack() {
  if (!selectedWeapon || !inventory[selectedWeapon]) {
    Swal.fire('No Weapon Selected', 'Please choose a valid weapon before fighting.', 'warning');
    return;
  }

  const damage = getPlayerDamage();
  monsterHealth -= damage;

  if (monsterHealth <= 0) {
    // Monster defeated: gain XP and gold, reset monster health
    xp += 20;
    gold += 20;
    monsterHealth = 50;
    Swal.fire('Victory!', 'You defeated the monster!', 'success');
  } else {
    // Monster hits back
    const monsterHit = Math.floor(Math.random() * 10) + 5;
    health -= monsterHit;
    Swal.fire('Battle', `You dealt ${damage}, Monster dealt ${monsterHit}.`, 'info');
    if (health <= 0) {
      Swal.fire('Game Over', 'You died!', 'error');
      resetGame();
      return;
    }
  }

  updateStats();
  saveGame();
}

// Player dodges monster attack
function dodge() {
  Swal.fire('Dodged', 'You dodged the attack.', 'info');
}

// Player runs away from fight and returns to town
function runAway() {
  Swal.fire('Escaped', 'You ran away.', 'info');
  goTown();
  saveGame();
}

// === Reset Game ===
// Reset game to starting state after death or new game
function resetGame() {
  health = 100;
  gold = 100;
  xp = 0;
  inventory = { sword: false, bow: false, magic: false };
  selectedWeapon = null;
  currentLocation = 'town';
  monsterHealth = 50;
  updateStats();
  updateLocation('town');
  saveGame();
}

// === Weapon selection listener ===
// Update the selected weapon when player chooses from dropdown
if (weaponSelect) {
  weaponSelect.addEventListener('change', () => {
    selectedWeapon = weaponSelect.value;
    updateStats();
  });
}

