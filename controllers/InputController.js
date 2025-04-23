// 📁 controllers/InputController.js
class InputController {
  static handleKeyPressed(key) {
    if (gameState === "playing" && !timerRunning) {
      startTime = millis() - pausedTime;
      timerRunning = true;
    }
    else if (gameState === "guide") {
      GameController.start("sample");
    }

    if (!player) return;

    const keyLower = key.toLowerCase();

    if (key === " ") {
      player.jump();
    } else if (keyLower === "p") {
      GameController.isPaused() ? GameController.resume() : GameController.pause();
    } else if (keyLower === "c") {
      player.togglePistol();
    } else if (keyLower === "e") {
      player.teleport();
    }
  }

  static handleMousePressed(mouseBtn) {
    if (gameState === "playing" && player) {
      const pistolType = pistol === 0 ? "blue" : "red";
      player.shoot(pistolType);
      // console.log("Mouse clicked -> try shoot", gameState, player);
    }
  }

  static handleHeldKeys() {
    if (gameState === "playing" && player) {
      if (!isMobile) { // 电脑
        if (keyIsDown(65)) {
          player.moveLeft(); // A
        } else{
          player.stopLeft(); // A
        }
        if (keyIsDown(68)) {
          player.moveRight(); // D
        } else{
          player.stopRight(); // D
        }
      } else { // 移动设备
        if (this.joystickDirection === "left") {
          player.moveLeft();
        } else if (this.joystickDirection === "right") {
          player.moveRight();
        } else {
          player.stopLeft();
          player.stopRight();
        }
      }
      
    }
  }

  // 虚拟摇杆
  static joystickDirection = null;

  static setJoystickDirection(direction) {
    this.joystickDirection = direction;
  }
}
