// Wait till the browser is ready to render the game (avoids glitches)
animationDelay = 100;
//minSearchTime = 100;

window.requestAnimationFrame(function () {
  new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);
});
