// المتغيرات الأساسية
let health = 100;
let gold = 100;
let xp = 0;
let inventory = { sword: false, bow: false, magic: false };

const startBtn = document.getElementById('startGame');
const nameInput = document.getElementById('playerName');
const ageInput = document.getElementById('playerAge');
const agreeCheckbox = document.getElementById('agreeRules');
const formSection = document.getElementById('form-section');
const gameSection = document.getElementById('game-section');
const playerDisplayName = document.getElementById('playerDisplayName');
const btn1 = document.getElementById('btn1');
const btn2 = document.getElementById('btn2');
const btn3 = document.getElementById('btn3');
const btn4 = document.getElementById('btn4');
const locationText = document.getElementById('location-description');

// تفعيل زر البداية بعد الموافقة
agreeCheckbox.addEventListener('change', () => {
  startBtn.disabled = !agreeCheckbox.checked;
});

// بدء اللعبة مع التحقق من صحة المدخلات
startBtn.addEventListener('click', () => {
  const name = nameInput.value.trim();
  const age = Number(ageInput.value.trim());

  if (!/^[a-zA-Z]+$/.test(name)) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid Name',
      text: 'Name must contain letters only.',
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/565/565547.png',
      imageWidth: 60,
      imageHeight: 60,
      imageAlt: 'Error icon',
    });
    return;
  }

  if (isNaN(age) || age <= 8) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid Age',
      text: 'Age must be a number greater than 8.',
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/565/565547.png',
      imageWidth: 60,
      imageHeight: 60,
      imageAlt: 'Error icon',
    });
    return;
  }

  if (!agreeCheckbox.checked) {
    Swal.fire({
      icon: 'warning',
      title: 'Agreement Required',
      text: 'You must agree to the rules to start the game.',
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/4327/4327318.png',
      imageWidth: 60,
      imageHeight: 60,
      imageAlt: 'Warning icon',
    });
    return;
  }

  Swal.fire({
    icon: 'success',
    title: `Welcome ${name}!`,
    text: "Let's start the game.",
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/190/190411.png',
    imageWidth: 60,
    imageHeight: 60,
    imageAlt: 'Welcome icon',
  }).then(() => {
    playerDisplayName.textContent = name;
    formSection.style.display = 'none';
    gameSection.classList.remove('hidden');
    updateStats();
    updateLocation('town');
  });
});

// تحديث عرض الحالة (صحة، ذهب، XP)
function updateStats() {
  document.getElementById('healthValue').textContent = health;
  document.getElementById('goldValue').textContent = gold;
  document.getElementById('xpValue').textContent = xp;
}

// المواقع والأزرار المرتبطة بها
const locations = {
  town: {
    text: "🏘️ You're in the Town. What do you want to do?",
    buttons: ["Go to Store 🛒", "Go Fight 👹", "Sell Items 💰", ""],
    functions: [goStore, goFight, goSell, null]
  },

  store: {
    text: "🛒 Welcome to the Weapon Store! Choose your weapon.",
    buttons: ["Buy Sword (30)", "Buy Bow (50)", "Buy Magic (80)", "⬅️ Go to Town"],
    functions: [buySword, buyBow, buyMagic, goTown]
  },

  fight: {
    text: "⚔️ Prepare to fight monsters! Choose your action.",
    buttons: ["Attack 🗡️", "Dodge 🛡️", "Run 🏃", "⬅️ Go to Town"],
    functions: [attack, dodge, runAway, goTown]
  },

  sell: {
    text: "💰 Sell your items here.",
    buttons: ["Sell Sword (15)", "Sell Bow (25)", "Sell Magic (40)", "⬅️ Go to Town"],
    functions: [sellSword, sellBow, sellMagic, goTown]
  }
};

let currentLocation = "town";

function updateLocation(name) {
  let location = locations[name];
  currentLocation = name;

  locationText.textContent = location.text;

  let allButtons = [btn1, btn2, btn3, btn4];

  for (let i = 0; i < allButtons.length; i++) {
    if (location.buttons[i] === "") {
      allButtons[i].style.display = "none";
    } else {
      allButtons[i].style.display = "inline-block";
      allButtons[i].textContent = location.buttons[i];
      allButtons[i].onclick = location.functions[i];
    }
  }
}

// التنقلات
function goStore() { updateLocation("store"); }
function goFight() { updateLocation("fight"); }
function goSell() { updateLocation("sell"); }
function goTown() { updateLocation("town"); }

// شراء الأسلحة
function buySword() {
  if (gold >= 30 && !inventory.sword) {
    gold -= 30;
    inventory.sword = true;
    Swal.fire({
      icon: 'success',
      title: 'Purchased!',
      text: '🗡️ You bought a sword!',
      timer: 1500,
      showConfirmButton: false
    });
  } else if (inventory.sword) {
    Swal.fire({
      icon: 'info',
      title: 'Already Owned',
      text: 'You already have a sword.',
      timer: 1500,
      showConfirmButton: false
    });
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Not Enough Gold',
      text: 'You do not have enough gold!',
      timer: 1500,
      showConfirmButton: false
    });
  }
  updateStats();
}


function buyBow() {
  if (gold >= 50 && !inventory.bow) {
    gold -= 50;
    inventory.bow = true;
    alert("🏹 You bought a bow!");
  } else if (inventory.bow) {
    alert("You already have a bow.");
  } else {
    alert("Not enough gold!");
  }
  updateStats();
}

function buyMagic() {
  if (gold >= 80 && !inventory.magic) {
    gold -= 80;
    inventory.magic = true;
    alert("✨ You bought magic!");
  } else if (inventory.magic) {
    alert("You already have magic.");
  } else {
    alert("Not enough gold!");
  }
  updateStats();
}

// بيع الأسلحة
function sellSword() {
  if (inventory.sword) {
    gold += 15;
    inventory.sword = false;
    alert("🗡️ You sold your sword!");
  } else {
    alert("You have no sword to sell.");
  }
  updateStats();
}

function sellBow() {
  if (inventory.bow) {
    gold += 25;
    inventory.bow = false;
    alert("🏹 You sold your bow!");
  } else {
    alert("You have no bow to sell.");
  }
  updateStats();
}

function sellMagic() {
  if (inventory.magic) {
    gold += 40;
    inventory.magic = false;
    alert("✨ You sold your magic!");
  } else {
    alert("You have no magic to sell.");
  }
  updateStats();
}

// القتال
function attack() {
  if (health <= 0) {
    alert("You are too weak to fight.");
    return;
  }
  let damage = 10;
  health -= damage;
  xp += 10;
  gold += 5;
  alert(`You attacked and lost ${damage} health, but gained 10 XP and 5 gold.`);
  checkGameOver();
  updateStats();
}

function dodge() {
  alert("You dodged the attack!");
}

function runAway() {
  alert("You ran away safely!");
  goTown();
}

function checkGameOver() {
  if (health <= 0) {
    alert("Game Over! You lost all your health.");
    resetGame();
  }
}

function resetGame() {
  health = 100;
  gold = 100;
  xp = 0;
  inventory = { sword: false, bow: false, magic: false };
  updateStats();
  goTown();
}