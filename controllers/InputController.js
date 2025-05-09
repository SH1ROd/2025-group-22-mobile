// 📁 controllers/InputController.js
class InputController {
  static handleKeyPressed(key) {
    if (gameState === "namePrompt" && key === "Enter") {
      const currentUI = UIManager.getCurrentUI();
      if (currentUI instanceof NameUI) {
        currentUI.buttons[0].action();
        return; // 防止继续执行下面的逻辑
      }
    }
    if (gameState === "playing" && !timerRunning && player.isAlive()) {
      startTime = millis() - pausedTime;
      timerRunning = true;
    }
    else if (gameState === "guide") {
      GameController.start("sample");
    }

    // 添加动画打断逻辑
    if (gameState === "playing" && currentMap.currentAnimation && currentMap.currentAnimation !== "finished") {
      cancelAnimationFrame(currentMap.currentAnimation.animationId);
      currentMap.currentAnimation = "finished";
      // 重置画面
      currentMap.xOffset = 0;
      currentMap.yOffset = 0;
      drawRatio = 0.5
      return; // 打断后直接返回，不处理其他输入
    }

    if (!player || !player.isAlive()) return;

    const keyLower = key.toLowerCase();

    if (key === " ") {
      player.jump();
    } else if (keyLower === "p") {
      GameController.isPaused() ? GameController.resume() : GameController.pause();
    } else if (keyLower === "c") {
      player.togglePistol();
    } else if (keyLower === "e") {
      player.teleport();
    }else if (keyLower === "m") {
      GameController.isGuided() ? GameController.guidOff() : GameController.guideOn();
    }
  }

  static handleMousePressed(mouseBtn) {
    if (gameState === "playing" && player && player.isAlive()) {
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
