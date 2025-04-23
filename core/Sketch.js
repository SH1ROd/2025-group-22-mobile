let gameState = "start";
let currentMap = null;
let currentLevel = "sample";
let playButton;
let pistol = 0;
let currentEnemy = null;
let player;
let playerName;

let startTime;
let elapsedTime = 0;
let timerRunning = false;
let pausedTime = 0;

let completed = {
  level1: false,
  level2: false
};

// let textBoxFlag  = false;
let textInput;
let saveScoreFlag = false;

let originalWidth = 800;
let originalHeight = 450;
let resolutionRatio = originalWidth / originalHeight;

let canvasWidth;
let canvasHeight;


let images = {};
let sounds = {};


let isMobile = false;
let joystick = null;
let joystickZone;
let jumpZone;
let togglePistolZone;
let teleportZone;
let pauseZone;
let jumpButton;
let togglePistolButton;
let teleportButton;
let pausetButton;
let keySize = 80; // 摇杆大小


function preload() {
  defineImagePaths(); // 提前调用
  for (let key in imagePaths) {
    images[key] = loadImage(imagePaths[key]);
  }
  defineSoundPathsAndVolume(); // 提前调用
  for (let key in soundPaths) {
    sounds[key] = loadSound(soundPaths[key]);
    sounds[key].setVolume(soundVolume[key]);
  }

  //gameFont = loadFont("assets/font/Gloomie Saturday.otf");
}

function setup() {
  

  playButton = createButton("Play Music");
  //playButton.position(canvas.x  - 140, canvas.y + 20);

  playButton.mousePressed(Music);

  updateButtonPosition();

  crosshair = new Crosshair([0, 5]);

  // 是否为移动设备
  isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (windowWidth/windowHeight > resolutionRatio) {
    canvasHeight = windowHeight;
    canvasWidth = canvasHeight * resolutionRatio;
  }else{
    canvasWidth = windowWidth;
    canvasHeight = canvasWidth / resolutionRatio;
  }
  

  if (isMobile) {
    createjoystickZone();
    createVirtualJoystick();
  }
  
}
function createjoystickZone(){
  if (joystickZone || jumpZone || togglePistolZone || teleportZone || pauseZone){
    joystickZone.remove();
    jumpZone.remove();
    togglePistolZone.remove();
    teleportZone.remove();
    pauseZone.remove();
  }
  
  // 根据横竖屏状态选按钮位置
  // -------------------------------------横屏---------------------------------------
    // 摇杆 屏幕左边
  if (windowWidth/windowHeight > resolutionRatio) { 
    // 创建一个新的 div 作为摇杆的触发区域
    joystickZone = document.createElement('div');
    joystickZone.id = 'joystick-zone';
    joystickZone.style.position = 'absolute';
    // joystickZone.style.left = ((windowWidth - canvasWidth) / 2) + canvasWidth * (0) - joystickSize / 1000 * 2 + 'px';
    joystickZone.style.left = ((windowWidth - canvasWidth) / 2) + canvasWidth * (0) - canvasWidth  * keySize / 1000 * 2  + 'px';
    joystickZone.style.bottom = ((windowHeight - canvasHeight) / 2) + canvasHeight * (0) + 'px';
    joystickZone.style.width = canvasWidth * keySize / 1000 * 2 + 'px'; // 设置触发区域的宽度
    joystickZone.style.height = canvasWidth * keySize / 1000 * 2  + 'px'; // 设置触发区域的高度
    joystickZone.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; // 仅用于调试，可以移除
    // joystickZone.style.touchAction = 'none';
    document.body.appendChild(joystickZone);

    //跳跃 屏幕右边
    // 创建一个新的 div 作为跳跃的触发区域
    jumpZone = document.createElement('div');
    jumpZone.id = 'jump-zone';
    jumpZone.style.position = 'absolute';
    jumpZone.style.left = ((windowWidth - canvasWidth) / 2) + canvasWidth * (1) + 'px';
    jumpZone.style.bottom = ((windowHeight - canvasHeight) / 2) + canvasHeight * (0) + 'px';
    jumpZone.style.width = canvasWidth * keySize / 1000 * 2 + 'px'; // 设置触发区域的宽度
    jumpZone.style.height = canvasWidth * keySize / 1000 * 2  + 'px'; // 设置触发区域的高度
    jumpZone.style.backgroundColor = 'rgba(230, 154, 13, 0.1)'; // 仅用于调试，可以移除
    document.body.appendChild(jumpZone);

    // 在 jumpZone 中添加跳跃按钮
    jumpButton = document.createElement('button');
    jumpButton.innerText = 'Jump';
    jumpButton.style.width = '100%';
    jumpButton.style.height = '100%';
    jumpButton.style.backgroundColor = 'rgba(179, 3, 3, 0.72)';
    jumpButton.style.color = 'white';
    jumpButton.style.border = 'none';
    jumpButton.style.borderRadius = '10px';
    jumpButton.style.fontSize = '20px';
    // jumpButton.style.touchAction = 'none';
    jumpButton.addEventListener('touchstart', (e) => {
      e.preventDefault(); // 防止多点冲突或页面滚动
      InputController.handleKeyPressed(" ");
    });
    jumpZone.appendChild(jumpButton);

    //切枪 屏幕左边
    // 创建一个新的 div 作为切枪 的触发区域
    togglePistolZone = document.createElement('div');
    togglePistolZone.id = 'togglePistol-zone';
    togglePistolZone.style.position = 'absolute';
    togglePistolZone.style.left = ((windowWidth - canvasWidth) / 2) + canvasWidth * (0) - canvasWidth * keySize / 1000 * 2  + 'px';
    togglePistolZone.style.bottom = ((windowHeight - canvasHeight) / 2) + canvasHeight * (1) - canvasWidth * keySize / 1000 * 2 + 'px';
    togglePistolZone.style.width = canvasWidth * keySize / 1000 * 2 + 'px'; // 设置触发区域的宽度
    togglePistolZone.style.height = canvasWidth * keySize / 1000 * 2  + 'px'; // 设置触发区域的高度
    togglePistolZone.style.backgroundColor = 'rgba(230, 154, 13, 0.1)'; // 仅用于调试，可以移除
    document.body.appendChild(togglePistolZone);

    // 在 togglePistolZone 中添加切枪 按钮
    togglePistolButton = document.createElement('button');
    togglePistolButton.innerText = 'Toggle\nPistol';
    togglePistolButton.style.width = '100%';
    togglePistolButton.style.height = '100%';
    togglePistolButton.style.backgroundColor = 'rgba(16, 206, 73, 0.72)';
    togglePistolButton.style.color = 'white';
    togglePistolButton.style.border = 'none';
    togglePistolButton.style.borderRadius = '10px';
    togglePistolButton.style.fontSize = '20px';
    togglePistolButton.addEventListener('touchstart', (e) => {
      e.preventDefault(); // 防止多点冲突或页面滚动
      InputController.handleKeyPressed("c");
    });
    togglePistolZone.appendChild(togglePistolButton);


    //传送 屏幕左边
    // 创建一个新的 div 作为传送 的触发区域
    teleportZone = document.createElement('div');
    teleportZone.id = 'teleport-zone';
    teleportZone.style.position = 'absolute';
    teleportZone.style.left = ((windowWidth - canvasWidth) / 2) + canvasWidth * (1) + 'px';
    teleportZone.style.bottom = ((windowHeight - canvasHeight) / 2) + canvasHeight * (0.5) - canvasWidth * keySize / 1000 * 2 * 0.5 + 'px';
    teleportZone.style.width = canvasWidth * keySize / 1000 * 2 + 'px'; // 设置触发区域的宽度
    teleportZone.style.height = canvasWidth * keySize / 1000 * 2  + 'px'; // 设置触发区域的高度
    teleportZone.style.backgroundColor = 'rgba(230, 154, 13, 0.1)'; // 仅用于调试，可以移除
    document.body.appendChild(teleportZone);

    // 在 teleportZone 中添加传送 按钮
    teleportButton = document.createElement('button');
    teleportButton.innerText = 'Teleport';
    teleportButton.style.width = '100%';
    teleportButton.style.height = '100%';
    teleportButton.style.backgroundColor = 'rgba(135, 24, 186, 0.74)';
    teleportButton.style.color = 'white';
    teleportButton.style.border = 'none';
    teleportButton.style.borderRadius = '10px';
    teleportButton.style.fontSize = '20px';
    teleportButton.addEventListener('touchstart', (e) => {
      e.preventDefault(); // 防止多点冲突或页面滚动
      InputController.handleKeyPressed("e");
    });
    teleportZone.appendChild(teleportButton);

    //暂停 屏幕左边
    // 创建一个新的 div 作为暂停 的触发区域
    pauseZone = document.createElement('div');
    pauseZone.id = 'pause-zone';
    pauseZone.style.position = 'absolute';
    pauseZone.style.left = ((windowWidth - canvasWidth) / 2) + canvasWidth * (1) + 'px';
    pauseZone.style.bottom = ((windowHeight - canvasHeight) / 2) + canvasHeight * (1) - canvasWidth * keySize / 1000 * 2 + 'px';
    pauseZone.style.width = canvasWidth * keySize / 1000 * 2 + 'px'; // 设置触发区域的宽度
    pauseZone.style.height = canvasWidth * keySize / 1000 * 2  + 'px'; // 设置触发区域的高度
    pauseZone.style.backgroundColor = 'rgba(230, 154, 13, 0.1)'; // 仅用于调试，可以移除
    document.body.appendChild(pauseZone);

    // 在 pauseZone 中添加暂停 按钮
    pauseButton = document.createElement('button');
    pauseButton.innerText = 'pause';
    pauseButton.style.width = '100%';
    pauseButton.style.height = '100%';
    pauseButton.style.backgroundColor = 'rgba(200, 197, 17, 0.74)';
    pauseButton.style.color = 'white';
    pauseButton.style.border = 'none';
    pauseButton.style.borderRadius = '10px';
    pauseButton.style.fontSize = '20px';
    pauseButton.addEventListener('touchstart', (e) => {
      e.preventDefault(); // 防止多点冲突或页面滚动
      InputController.handleKeyPressed("p");
    });
    pauseZone.appendChild(pauseButton);
  }
  else{ // -------------------------------------竖屏---------------------------------------
    // 摇杆 屏幕下左边
    // 创建一个新的 div 作为摇杆的触发区域
    joystickZone = document.createElement('div');
    joystickZone.id = 'joystick-zone';
    joystickZone.style.position = 'absolute';
    joystickZone.style.left = ((windowWidth - canvasWidth) / 2) + canvasWidth * (0.5) - canvasWidth * keySize / 1000 * 2 * 0.5+ 'px';
    joystickZone.style.bottom = ((windowHeight - canvasHeight) / 2) + canvasHeight * (0) - canvasWidth * keySize / 1000 * 2 + 'px';
    joystickZone.style.width = canvasWidth * keySize / 1000 * 2 + 'px'; // 设置触发区域的宽度
    joystickZone.style.height = canvasWidth * keySize / 1000 * 2  + 'px'; // 设置触发区域的高度
    joystickZone.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; // 仅用于调试，可以移除
    document.body.appendChild(joystickZone);

    //跳跃 屏幕下右边
    // 创建一个新的 div 作为跳跃的触发区域
    jumpZone = document.createElement('div');
    jumpZone.id = 'jump-zone';
    jumpZone.style.position = 'absolute';
    jumpZone.style.left = ((windowWidth - canvasWidth) / 2) + canvasWidth * (1) - canvasWidth * keySize / 1000 * 2 + 'px';
    jumpZone.style.bottom = ((windowHeight - canvasHeight) / 2) + canvasHeight * (0) - canvasWidth * keySize / 1000 * 2 + 'px';
    jumpZone.style.width = canvasWidth * keySize / 1000 * 2 + 'px'; // 设置触发区域的宽度
    jumpZone.style.height = canvasWidth * keySize / 1000 * 2  + 'px'; // 设置触发区域的高度
    jumpZone.style.backgroundColor = 'rgba(230, 154, 13, 0.1)'; // 仅用于调试，可以移除
    document.body.appendChild(jumpZone);

    // 在 jumpZone 中添加跳跃按钮
    jumpButton = document.createElement('button');
    jumpButton.innerText = 'Jump';
    jumpButton.style.width = '100%';
    jumpButton.style.height = '100%';
    jumpButton.style.backgroundColor = 'rgba(179, 3, 3, 0.72)';
    jumpButton.style.color = 'white';
    jumpButton.style.border = 'none';
    jumpButton.style.borderRadius = '10px';
    jumpButton.style.fontSize = '20px';
    
    jumpButton.addEventListener('touchstart', (e) => {
      e.preventDefault(); // 防止多点冲突或页面滚动
      InputController.handleKeyPressed(" ");
    });
    jumpZone.appendChild(jumpButton);

    //切枪 屏幕左边
    // 创建一个新的 div 作为切枪 的触发区域
    togglePistolZone = document.createElement('div');
    togglePistolZone.id = 'togglePistol-zone';
    togglePistolZone.style.position = 'absolute';
    togglePistolZone.style.left = ((windowWidth - canvasWidth) / 2) + canvasWidth * (0) + 'px';
    togglePistolZone.style.bottom = ((windowHeight - canvasHeight) / 2) + canvasHeight * (1) + 'px';
    togglePistolZone.style.width = canvasWidth * keySize / 1000 * 2 + 'px'; // 设置触发区域的宽度
    togglePistolZone.style.height = canvasWidth * keySize / 1000 * 2  + 'px'; // 设置触发区域的高度
    togglePistolZone.style.backgroundColor = 'rgba(230, 154, 13, 0.1)'; // 仅用于调试，可以移除
    document.body.appendChild(togglePistolZone);

    // 在 togglePistolZone 中添加切枪 按钮
    togglePistolButton = document.createElement('button');
    togglePistolButton.innerText = 'Toggle\nPistol';
    togglePistolButton.style.width = '100%';
    togglePistolButton.style.height = '100%';
    togglePistolButton.style.backgroundColor = 'rgba(16, 206, 73, 0.72)';
    togglePistolButton.style.color = 'white';
    togglePistolButton.style.border = 'none';
    togglePistolButton.style.borderRadius = '10px';
    togglePistolButton.style.fontSize = '20px';
    togglePistolButton.addEventListener('touchstart', (e) => {
      e.preventDefault(); // 防止多点冲突或页面滚动
      InputController.handleKeyPressed("c");
    });
    togglePistolZone.appendChild(togglePistolButton);


    //传送 屏幕左边
    // 创建一个新的 div 作为传送 的触发区域
    teleportZone = document.createElement('div');
    teleportZone.id = 'teleport-zone';
    teleportZone.style.position = 'absolute';
    teleportZone.style.left = ((windowWidth - canvasWidth) / 2) + 'px';
    teleportZone.style.bottom = ((windowHeight - canvasHeight) / 2) - canvasWidth * keySize / 1000 * 2 + 'px';
    teleportZone.style.width = canvasWidth * keySize / 1000 * 2 + 'px'; // 设置触发区域的宽度
    teleportZone.style.height = canvasWidth * keySize / 1000 * 2  + 'px'; // 设置触发区域的高度
    teleportZone.style.backgroundColor = 'rgba(230, 154, 13, 0.1)'; // 仅用于调试，可以移除
    document.body.appendChild(teleportZone);

    // 在 teleportZone 中添加传送 按钮
    teleportButton = document.createElement('button');
    teleportButton.innerText = 'Teleport';
    teleportButton.style.width = '100%';
    teleportButton.style.height = '100%';
    teleportButton.style.backgroundColor = 'rgba(135, 24, 186, 0.74)';
    teleportButton.style.color = 'white';
    teleportButton.style.border = 'none';
    teleportButton.style.borderRadius = '10px';
    teleportButton.style.fontSize = '20px';
    teleportButton.addEventListener('touchstart', (e) => {
      e.preventDefault(); // 防止多点冲突或页面滚动
      InputController.handleKeyPressed("e");
    });
    teleportZone.appendChild(teleportButton);

    //暂停 屏幕左边
    // 创建一个新的 div 作为暂停 的触发区域
    pauseZone = document.createElement('div');
    pauseZone.id = 'pause-zone';
    pauseZone.style.position = 'absolute';
    pauseZone.style.left = ((windowWidth - canvasWidth) / 2) + canvasWidth * (1) - canvasWidth * keySize / 1000 * 2 + 'px';
    pauseZone.style.bottom = ((windowHeight - canvasHeight) / 2) + canvasHeight * (1)  + 'px';
    pauseZone.style.width = canvasWidth * keySize / 1000 * 2 + 'px'; // 设置触发区域的宽度
    pauseZone.style.height = canvasWidth * keySize / 1000 * 2  + 'px'; // 设置触发区域的高度
    pauseZone.style.backgroundColor = 'rgba(230, 154, 13, 0.1)'; // 仅用于调试，可以移除
    document.body.appendChild(pauseZone);

    // 在 pauseZone 中添加暂停 按钮
    pauseButton = document.createElement('button');
    pauseButton.innerText = 'pause';
    pauseButton.style.width = '100%';
    pauseButton.style.height = '100%';
    pauseButton.style.backgroundColor = 'rgba(200, 197, 17, 0.74)';
    pauseButton.style.color = 'white';
    pauseButton.style.border = 'none';
    pauseButton.style.borderRadius = '10px';
    pauseButton.style.fontSize = '20px';
    pauseButton.addEventListener('touchstart', (e) => {
      e.preventDefault(); // 防止多点冲突或页面滚动
      InputController.handleKeyPressed("p");
    });
    pauseZone.appendChild(pauseButton);
  }
  
}

// 创建虚拟摇杆
function createVirtualJoystick() {
  // const gameContainer = document.getElementById("game-container");
  
  if (joystick){
    joystick.destroy();
  }
  if (windowWidth/windowHeight > resolutionRatio) {
    canvasHeight = windowHeight;
    canvasWidth = canvasHeight * resolutionRatio;
  }else{
    canvasWidth = windowWidth;
    canvasHeight = canvasWidth / resolutionRatio;
  }

  // 屏幕左下角
  joystick = nipplejs.create({
    // zone: document.body, // 限制区域
    zone: joystickZone, // 将摇杆的触发区域限制在 joystickZone 内
    mode: 'static',
    lockX: true,
    // mode: 'dynamic',
    size: keySize / originalWidth * canvasWidth,
    position: { // 摇杆位置
      left: canvasWidth * 0  + canvasWidth * keySize / 1000 +'px',
      bottom: canvasHeight * 0  + canvasWidth * keySize / 1000 +'px' 
    },
    color: 'blue'
  });
  
  joystick.on('move', (evt, data) => {
    const angle = data.angle.degree;
    if (angle < 45 || angle > 315) {
      InputController.setJoystickDirection("right");
    } else if (angle > 135 && angle < 225) {
      InputController.setJoystickDirection("left");
    } else {
      InputController.setJoystickDirection(null);
    }
  });

  joystick.on('end', () => {
    InputController.setJoystickDirection(null);
  });
}

function Music() {
  if (sounds["openingBGM"].isPlaying()) {
    sounds["openingBGM"].pause();
    playButton.html("Play Music");
  } else {
    sounds["openingBGM"].loop();
    playButton.html("Pause Music");
  }
}

function draw() {
  if (windowWidth/windowHeight > resolutionRatio) {
    canvasHeight = windowHeight;
    canvasWidth = canvasHeight * resolutionRatio;
  }else{
    canvasWidth = windowWidth;
    canvasHeight = canvasWidth / resolutionRatio;
  }
  
  canvas = createCanvas(canvasWidth, canvasHeight);
  centerCanvas();
  updateButtonPosition();

  
  InputController.handleHeldKeys();
  if (GameController.is("playing")) {
    background(getBackground());
  }


  if (GameController.is("playing")) {

    if (!currentMap || !player) GameController.start(currentLevel);
    currentMap.draw();
    crosshair.draw();
    player.draw();
    player.update();
    handleBullet();
    noCursor();
    drawLives();
    handleTimer();
  } else {
    cursor();
  }

  UIManager.drawCurrentUI();
}

function centerCanvas() {
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  canvas.position(x, y);
}

let buttonXRatio = 0.85;
let buttonYRatio = 0.05;

function updateButtonPosition() {
  // 先确保 canvas 已被创建并定位
  if (canvas && playButton) {
    const x = canvas.x + canvasWidth * buttonXRatio;
    const y = canvas.y + canvasHeight * buttonYRatio;
    playButton.position(x, y);

    const buttonWidth = canvasWidth * 0.08;
    const buttonHeight = canvasHeight * 0.03;
    playButton.size(buttonWidth, buttonHeight);

    
    playButton.style("font-size", canvasWidth * 0.01 + "px");
    

    //playButton.style("font-size", canvasWidth * 0.01 + "px");
    playButton.style("border-radius", canvasWidth * 0.008+"px");
    playButton.style("border", "none");
    playButton.style("white-space", "nowrap");

    //playButton.style("border", canvasHeight*0.5/800+"px solid black");
  }
}

function windowResized() {
  // 重新计算画布尺寸
  if (windowWidth / windowHeight > resolutionRatio) {
    canvasHeight = windowHeight;
    canvasWidth = canvasHeight * resolutionRatio;
  } else {
    canvasWidth = windowWidth;
    canvasHeight = canvasWidth / resolutionRatio;
  }
  centerCanvas(); // 視窗改變時重新居中
  // console.log("windowWidth: " + windowWidth);
  // console.log("windowHeight: " + windowHeight);
  // console.log("canvasHeight: " + canvasHeight);
  // console.log("canvasWidth: " + canvasWidth);
  updateButtonPosition(); // 重新计算按钮位置
  createjoystickZone();
  createVirtualJoystick();// 重新创建新位置摇杆
}

function getBackground() {
  switch (currentLevel) {
    case "sample": return images["background_sample"];
    case "level1": return images["background_level1"];
    case "level2": return images["background_level2"];
    case "level3": return images["background_level3"];
  }
}

function drawLives() {
  const iconSize = canvasWidth * 0.03; // 根据画布宽度动态缩放图标大小
  const spacing = iconSize * 1.2;      // 图标之间的间距
  const marginX = canvasWidth * 0.01;  // 左边边距
  const marginY = canvasHeight * 0.01; // 上边边距

  for (var i = 0; i < player.lives; i++) {
    image(images["image_tiles"], marginX + i * spacing,
        marginY, iconSize, iconSize, 2*64, 4*64, 64, 64);
  }
}

function handleTimer() {
  if (GameController.is("playing") && timerRunning) {
    elapsedTime = millis() - startTime;
  }
  if (GameController.isOver() || GameController.isPaused()) {
    timerRunning = false;
    pausedTime = elapsedTime;
  }
  if (GameController.is("playing")) {
    fill(255);

    const baseX = canvasWidth * 0.012;  // 左边距
    let baseY = canvasHeight * 0.07;    // 第一行文字的起始 Y
    const lineHeight = canvasHeight * 0.035; // 每行高度

    textFont("Lucida Console");
    textStyle(BOLD);
    textSize(canvasWidth * 0.015);
    textAlign(LEFT, TOP);
    text("Time: " + nf(elapsedTime / 1000, 0, 2) + "s",  baseX, baseY);

    baseY += lineHeight;
    const keyText = player.keys ? "Key: 1/1" : "Key: 0/1";
    textFont("Lucida Console");
    textStyle(BOLD);
    text(keyText, baseX, baseY);


    baseY += lineHeight;
    const pistolText =  "Current Pistol:";
    textFont("Lucida Console");
    textStyle(BOLD);
    text(pistolText, baseX, baseY);

    const iconSize = canvasWidth * 0.03; // 根据画布宽度动态缩放图标大小
    //const spacing = iconSize * 0.6;      // 图标之间的间距
    const marginX = canvasWidth * 0.152;  // 左边边距
    //const marginY = canvasHeight * 0.08;

    if(!pistol){
      image(images["image_tiles"], marginX,
          baseY-canvasHeight*0.01, iconSize, iconSize, 2*64, 5*64, 64, 64);
    }
    else{
      image(images["image_tiles"], marginX,
          baseY-canvasHeight*0.01, iconSize, iconSize, 1*64, 5*64, 64, 64);
    }

  }
}

function handleBullet() {
  if (player?.bullet != 0) {
    player.bullet.draw(currentMap.xOffset, currentMap.yOffset);
    const result = player.bullet.update();
    if (result === "undefined") {
      player.bullet = 0;
    }
    else if(result === "inStandard") {
      player.bullet.velocity = 0;
    }
  }
}

function keyPressed() {
  InputController.handleKeyPressed(key);
}

function mousePressed() {
  if (!isMobile) {
    if (gameState === "playing" && player) {
      InputController.handleMousePressed(mouseButton);
    }
  }
  else { // mobile
    // const isHovered =
    //   mouseX >= ((windowWidth - canvasWidth) / 2) && mouseX <= ((windowWidth - canvasWidth) / 2) + canvasWidth * (1) &&
    //   mouseY >= ((windowHeight - canvasHeight) / 2) && mouseY <= ((windowHeight - canvasHeight) / 2) + canvasHeight *  (1);
    const isHovered =
      mouseX >= 0 && mouseX <= canvasWidth * (1) &&
      mouseY >= 0 && mouseY <= canvasHeight *  (1);
    // console.log("isHovered: " + isHovered);
    // console.log("mouseX " + mouseX);
    // console.log("mouseY: " + mouseY);
    // console.log("((windowWidth - canvasWidth) / 2): " + ((windowWidth - canvasWidth) / 2));
    // console.log("canvasWidth: " + canvasWidth);
    if (gameState === "playing" && player && isHovered) {
      InputController.handleMousePressed(mouseButton);
    }
  }
  
}

function mouseReleased() {
  const ui = UIManager.getCurrentUI();
  if (ui) {
    ui.handleMouseClick();
  }
}

function defineImagePaths() {
  imagePaths = {
    //sprite
    image_player: "assets/images/sprite/player.png",
    image_tiles: "assets/images/sprite/tiles.png",
    image_enemies: "assets/images/sprite/enemies.png",

    //background
    background_sample: "assets/images/background/background_sample.png",
    background_level1: "assets/images/background/background_level1.png",
    background_level2: "assets/images/background/background_level2.png",
    background_level3: "assets/images/background/background_level3.png",

    //buttons
    button_exit: "assets/images/buttons/button_exit.png",
    button_exit_hover: "assets/images/buttons/button_exit_hover.png",
    button_menu: "assets/images/buttons/button_menu.png",
    button_menu_hover: "assets/images/buttons/button_menu_hover.png",
    button_resume: "assets/images/buttons/button_resume.png",
    button_resume_hover: "assets/images/buttons/button_resume_hover.png",
    button_restart: "assets/images/buttons/button_restart.png",
    button_restart_hover: "assets/images/buttons/button_restart_hover.png",
    button_start: "assets/images/buttons/button_start.png",
    button_start_hover: "assets/images/buttons/button_start_hover.png",
    button_sample: "assets/images/buttons/button_sample.png",
    button_sample_hover: "assets/images/buttons/button_sample_hover.png",
    button_level: "assets/images/buttons/button_level.png",
    button_level_hover: "assets/images/buttons/button_level_hover.png",
    button_level1: "assets/images/buttons/button_level1.png",
    button_level1_hover: "assets/images/buttons/button_level1_hover.png",
    button_level2: "assets/images/buttons/button_level2.png",
    button_level2_hover: "assets/images/buttons/button_level2_hover.png",
    button_level3: "assets/images/buttons/button_level3.png",
    button_level3_hover: "assets/images/buttons/button_level3_hover.png",

    //startUI
    icon_bloodmoon: "assets/images/startUI/icon_bloodmoon.png",
    icon_bloodmoon_hover: "assets/images/startUI/icon_bloodmoon_hover.png",
    icon_tower: "assets/images/startUI/icon_tower.png",
    icon_tower_hover: "assets/images/startUI/icon_tower_hover.png",
    icon_main_character: "assets/images/startUI/icon_main_character.png",
    icon_main_character_hover: "assets/images/startUI/icon_main_character_hover.png",
    text_twilight_seeker: "assets/images/startUI/text_twilight_seeker.png",
    background_start: "assets/images/startUI/background_start.png",

    //guideUI
    background_guide: "assets/images/guideUI/background_guide.png",
    bar_key_hint: "assets/images/guideUI/bar_key_hint.png",
    key_a: "assets/images/guideUI/key_a.png",
    key_d: "assets/images/guideUI/key_d.png",
    key_e: "assets/images/guideUI/key_e.png",
    key_p: "assets/images/guideUI/key_p.png",
    key_c: "assets/images/guideUI/key_c.png",
    key_space: "assets/images/guideUI/key_space.png",
    mouse: "assets/images/guideUI/mouse.png",
    text_jump: "assets/images/guideUI/text_jump.png",
    text_move: "assets/images/guideUI/text_move.png",
    text_pause_guideUI: "assets/images/guideUI/text_pause_guideUI.png",
    text_shoot: "assets/images/guideUI/text_shoot.png",
    text_teleport: "assets/images/guideUI/text_teleport.png",
    text_toggle_portal: "assets/images/guideUI/text_toggle_portal.png",
    text_press_any_key_to_start: "assets/images/guideUI/text_press_any_key_to_start.png",

    //levelUI
    //icon_tower_levelUI: "assets/images/levelUI/icon_tower_levelUI.png",
    background_level: "assets/images/levelUI/background_level.png",

    //otherUI
    background_default: "assets/images/otherUI/background_default.png",
    background_scoreboard: "assets/images/otherUI/background_scoreboard.png",
    text_gameover: "assets/images/otherUI/text_gameover.png",
    text_leaderboard: "assets/images/otherUI/text_leaderboard.png",
    text_name: "assets/images/otherUI/text_name.png",
    text_pause: "assets/images/otherUI/text_pause.png",
    text_please_enter_a_nick_name: "assets/images/otherUI/text_please_enter_a_nick_name.png",
    text_youwin: "assets/images/otherUI/text_youwin.png",
    text_privacy: "assets/images/otherUI/text_privacy.png",


  };
}
function defineSoundPathsAndVolume() {
  soundPaths = {
    openingBGM: "assets/soundtrack/opening.mp3",

    pistolFireSoundEffect: "assets/soundeffect/pistol_fire_2.mp3",
    teleportSoundEffect: "assets/soundeffect/teleport_1.mp3",
    bulletBounceSoundEffect: "assets/soundeffect/bullet_bounce_1.mp3",
    jumpSoundEffect: "assets/soundeffect/jump_2.mp3",

    keyPickupSoundEffect : "assets/soundeffect/key_pickup_1.mp3",
    healthPickupSoundEffect : "assets/soundeffect/health_pickup.mp3",
    doorOpenSoundEffect : "assets/soundeffect/door_open.mp3",

    playerHitSoundEffect: "assets/soundeffect/player_hit_1.mp3",
    playerInjuredOrDeadSoundEffect: "assets/soundeffect/player_injuredordead_1.mp3"
  }
  soundVolume = {
    openingBGM: 0.5,

    pistolFireSoundEffect: 0.5,
    teleportSoundEffect: 0.2,
    bulletBounceSoundEffect: 1,

    keyPickupSoundEffect : 1,
    healthPickupSoundEffect : 1,
    doorOpenSoundEffect : 1,

    playerHitSoundEffect: 1,
    playerInjuredOrDeadSoundEffect: 1
  }
}

function iconEffect(img, x, y, width, height, {
  highlightOnlyHover = false, // 只有 hover 才高光
  alpha = 255,
  float = false,
  floatSpeed = 0.03,
  floatAmplitude = 3,
  floatOffset = 0,
  buttonX,
  buttonY,
  buttonWidth,
  buttonHeight
} = {}, tile = [0, 0], spriteSize = 64) {

  let drawY = y;

  // ✅ 浮動效果
  if (float) {
    drawY = y + Math.sin(frameCount * floatSpeed + floatOffset) * floatAmplitude;
  }

  // ✅ 判斷是否 hover
  const isHovered =
      mouseX >= buttonX - buttonWidth / 2 && mouseX <= buttonX + buttonWidth / 2 &&
      mouseY >= buttonY - buttonHeight / 2 && mouseY <= buttonY + buttonHeight / 2;

  // ✅ 計算裁圖座標
  const sx = tile[0] * spriteSize;
  const sy = tile[1] * spriteSize;

  push();
  imageMode(CORNER);

  if (!highlightOnlyHover || (highlightOnlyHover && isHovered)) {
    tint(255, alpha);
  } else {
    noTint();
  }

  image(img, x, drawY, width, height, sx, sy, spriteSize, spriteSize);
  pop();
}

