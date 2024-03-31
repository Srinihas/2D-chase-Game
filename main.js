var player, enemy, pathGroup, enemyGroup;
var playerhealth = 0,
  score = 0;
var play = false,
  result = false,
  isPressedEscape = false,
  menuVisible = false;
var sensitivityValue = 5, sensitivitySlider, backButton, creditsButton, lives = 3; // Default sensitivity value

function setup() {
  createCanvas(windowWidth, windowHeight);
  player = createSprite(width / 2, height / 2, 20, 20);
  player.shapeColor = color(255, 0, 0);
  enemy = createSprite(width / 2 - 130, height / 2 - 130, 10, 10);
  enemy.shapeColor = color(0, 0, 0);

  pathGroup = new Group();
  enemyGroup = new Group();
  window.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
    }
    if (event.key === 'Escape') {
      toggleMenu();
    }
  });
  document.body.style.overflow = 'hidden';
  
  result = createForm(false); // Create the input form

  // Create slider for sensitivity control
  sensitivitySlider = createSlider(1, 20, sensitivityValue, 1);
  sensitivitySlider.position(width / 2 - 50, height / 2 + 20);
  sensitivitySlider.hide();

  // Create back button
  backButton = createButton('Back');
  backButton.position(width / 2 - 20, height / 2 + 60);
  backButton.hide();
  backButton.mousePressed(toggleMenu);

  // Create credits button
  creditsButton = createButton('Credits');
  creditsButton.position(width / 2 - 20, height / 2 + 100);
  creditsButton.hide();
  creditsButton.mousePressed(goToCredits);

  updatesButton = createButton('Future Updates');
  updatesButton.position(width / 2 - 20, height / 2 + 130);
  updatesButton.hide();
  updatesButton.mousePressed(goToUpdates);
}

function draw() {
  background(255);

  if (play && playerhealth > 0 && !isPressedEscape && !menuVisible) {

    handleMovement();
    enemyMovement();
    displayText(20, 30);
    if ((keyIsDown(UP_ARROW) || keyIsDown(DOWN_ARROW) || keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW)) && result) {
      createPath();
    }
    createEnemyPath();

  } else if (!play && lives === 0) {

    fill("red");
    stroke(20);
    text("Restarting game", width / 2, height / 2);
    window.location.reload();

  } else if (play && playerhealth === 0 && lives >= 1 && !menuVisible ) {
    lives -= 1;
    player.x = width / 2;
    player.y = height / 2;

    enemy.x = width / 2 - 130;
    enemy.y = height / 2 - 130;

    result = createForm(true);

    handleMovement();
    enemyMovement();
    displayText(20, 30);
    if ((keyIsDown(UP_ARROW) || keyIsDown(DOWN_ARROW) || keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW)) && result) {
      createPath();
    }
    createEnemyPath();
  }

  drawSprites();

  if (menuVisible) {
    showMenu();
  }
}

function displayText(x, y) {
  fill("red");
  textSize(20);
  text("Player Health: " + playerhealth, x, y);
  fill(206, 206, 0);
  text("Score: " + score, x, y + 30);
  fill(206, 206, 0);
  text("Lives: " + lives, x, y + 60);
}

function handleMovement() {
  var speed = sensitivitySlider.value();
  if (keyIsDown(UP_ARROW)) {
    player.y -= speed;
  }
  if (keyIsDown(DOWN_ARROW)) {
    player.y += speed;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    player.x += speed;
  }
  if (keyIsDown(LEFT_ARROW)) {
    player.x -= speed;
  }

  checkIfOutsideScreen();
}

function checkIfOutsideScreen() {
  console.log("Player position:", player.position);

  if (player.x < 0) {
    player.x = width;
  } else if (player.x > width) {
    player.x = 0;
  } else if (player.y < 0) {
    player.y = height;
  } else if (player.y > height) {
    player.y = 0;
  }
}

function enemyMovement() {
  var speed = 5;
  if (enemy.x !== player.x) {
    enemy.x += (player.x - enemy.x > 0) ? speed : -speed;
  }
  if (enemy.y !== player.y) {
    enemy.y += (player.y - enemy.y > 0) ? speed : -speed;
  }
  checkColliding();
}

function checkColliding() {
  if (enemy.overlap(player) || enemy.overlap(pathGroup)) {
    enemy.x = width / 2 - 130;
    enemy.y = height / 2 - 130;
    playerhealth -= 10;
    enemyGroup.forEach((enemypath) => {
      enemypath.lifetime = 1;
    });
  }
  if (player.collide(enemy) || player.collide(enemyGroup)) {
    score += 1;
    enemy.x = width / 2 - 130;
    enemy.y = height / 2 - 130;
    enemyGroup.forEach((enemypath) => {
      enemypath.lifetime = 1;
    });
  }
}

function createPath() {
  if (result) {
    var path = createSprite(player.x, player.y, 3, 3);
    path.shapeColor = player.shapeColor;
    path.lifetime = 40;
    pathGroup.add(path);
  }
}

function createEnemyPath() {
  var enemypath = createSprite(enemy.x, enemy.y, 3, 3);
  enemypath.shapeColor = enemy.shapeColor;
  enemypath.lifetime = 40;
  enemyGroup.add(enemypath);
}

function createForm() {
  var input = createInput("Do you want to see a path?").attribute("placeholder", "yes").attribute("style", "width: 400px;");
  var playButton = createButton("Start!");
  input.position(width / 2 - 110, height / 2 - 80);
  playButton.position(width / 2 - 90, height / 2 - 20);

  playButton.mousePressed(() => {
    play = true;
    input.hide();
    playButton.hide();
    const inputText = input.value().toLowerCase().trim();
    var array = ["yes", "affirmative", "yea", "true", "fine", "heckyeah", "okaysure", "sure", "okay", "yep", "y", "ye", "ys", "s", "e", "s", "whynot"];
    for (let i = 0; i < array.length; i++) {
      const element = array[i];
      if (inputText === element) {
        playerhealth = 100;
        result = true;
        return true;
      }
    }
    playerhealth = 100;
    return false;
  });

  return result;
}

function toggleMenu() {
  menuVisible = !menuVisible;
  if (menuVisible) {
    sensitivitySlider.show();
    backButton.show();
    creditsButton.show();
    updatesButton.show();
  } else {
    sensitivitySlider.hide();
    backButton.hide();
    creditsButton.hide();
    updatesButton.hide();
  }
}

function showMenu() {
  fill(0);
  textSize(20);
  textAlign(CENTER, CENTER);
  text("Game Menu", width / 2, height / 2 - 100);
  text("Adjust Speed", width / 2, height / 2 - 20);
}

function goToCredits() {
  window.location.href = 'credits.html';
}

function goToUpdates() {
  window.location.href = "updates.html"
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mouseWheel(event) {
  event.preventDefault();
}
