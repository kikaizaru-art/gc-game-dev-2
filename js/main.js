'use strict';

/**
 * Phaser ゲーム起動設定
 */
document.addEventListener('DOMContentLoaded', () => {
  const config = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: 'game-container',
    backgroundColor: '#0a0a1a',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [TitleScene, PuzzleScene, ResultScene]
  };

  const game = new Phaser.Game(config);
});
