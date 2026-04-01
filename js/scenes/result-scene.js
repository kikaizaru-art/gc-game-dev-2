'use strict';

/**
 * リザルト画面シーン
 * クリア/ゲームオーバー後のスコア表示とリトライ
 */
class ResultScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ResultScene' });
  }

  init(data) {
    this.cleared = data.cleared || false;
    this.finalScore = data.score || 0;
    this.maxChain = data.maxChain || 0;
    this.stageId = data.stageId || 1;
  }

  create() {
    // 背景
    const bg = this.add.graphics();
    if (this.cleared) {
      bg.fillGradientStyle(0x1a0a2e, 0x2a1040, 0x0a0a1a, 0x1a0a2e, 1);
    } else {
      bg.fillGradientStyle(0x1a0a0a, 0x0a0a1a, 0x1a0a0a, 0x0a0a1a, 1);
    }
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // パーティクル（クリア時のみ）
    if (this.cleared) {
      this.createCelebration();
    }

    // 結果タイトル
    const titleText = this.cleared ? '✨ 救出成功！ ✨' : '💔 救出失敗…';
    const titleColor = this.cleared ? '#ffcc00' : '#ff4466';
    const titleStroke = this.cleared ? '#ff6600' : '#880022';

    this.add.text(
      GAME_WIDTH / 2, 120,
      titleText, {
        fontFamily: 'Zen Maru Gothic',
        fontSize: '44px',
        fontStyle: 'bold',
        color: titleColor,
        stroke: titleStroke,
        strokeThickness: 4
      }
    ).setOrigin(0.5);

    // スコア表示
    this.add.text(
      GAME_WIDTH / 2, 220,
      `SCORE`, {
        fontFamily: 'Zen Maru Gothic', fontSize: '18px', color: '#888'
      }
    ).setOrigin(0.5);

    this.add.text(
      GAME_WIDTH / 2, 260,
      `${this.finalScore}`, {
        fontFamily: 'Zen Maru Gothic', fontSize: '56px', fontStyle: 'bold', color: '#f59e0b'
      }
    ).setOrigin(0.5);

    // 最大連鎖
    this.add.text(
      GAME_WIDTH / 2, 320,
      `最大連鎖: ${this.maxChain}`, {
        fontFamily: 'Zen Maru Gothic', fontSize: '22px', color: '#bb88ee'
      }
    ).setOrigin(0.5);

    // ボタン群
    this.createButton(GAME_WIDTH / 2, 430, 'リトライ', 0xec4899, () => {
      this.scene.start('PuzzleScene', { stageId: this.stageId });
    });

    this.createButton(GAME_WIDTH / 2, 500, 'タイトルへ', 0x8b5cf6, () => {
      this.scene.start('TitleScene');
    });
  }

  /**
   * ボタンを作成
   * @param {number} x
   * @param {number} y
   * @param {string} label
   * @param {number} color
   * @param {Function} callback
   */
  createButton(x, y, label, color, callback) {
    const btnW = 220;
    const btnH = 50;
    const btnX = x - btnW / 2;
    const btnY = y - btnH / 2;

    const btnBg = this.add.graphics();
    btnBg.fillStyle(color, 1);
    btnBg.fillRoundedRect(btnX, btnY, btnW, btnH, 25);
    btnBg.lineStyle(2, 0xffffff, 0.2);
    btnBg.strokeRoundedRect(btnX, btnY, btnW, btnH, 25);

    this.add.text(x, y, label, {
      fontFamily: 'Zen Maru Gothic',
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#ffffff'
    }).setOrigin(0.5);

    const zone = this.add.zone(x, y, btnW, btnH).setInteractive({ useHandCursor: true });

    zone.on('pointerover', () => {
      btnBg.clear();
      btnBg.fillStyle(color, 0.8);
      btnBg.fillRoundedRect(btnX, btnY, btnW, btnH, 25);
      btnBg.lineStyle(2, 0xffffff, 0.4);
      btnBg.strokeRoundedRect(btnX, btnY, btnW, btnH, 25);
    });

    zone.on('pointerout', () => {
      btnBg.clear();
      btnBg.fillStyle(color, 1);
      btnBg.fillRoundedRect(btnX, btnY, btnW, btnH, 25);
      btnBg.lineStyle(2, 0xffffff, 0.2);
      btnBg.strokeRoundedRect(btnX, btnY, btnW, btnH, 25);
    });

    zone.on('pointerdown', callback);
  }

  /** クリア時のお祝いパーティクル */
  createCelebration() {
    const colors = [0xffcc00, 0xec4899, 0x8b5cf6, 0x4488ff, 0x44dd66];

    for (let i = 0; i < 40; i++) {
      const x = Phaser.Math.Between(50, GAME_WIDTH - 50);
      const startY = Phaser.Math.Between(-100, -20);
      const size = Phaser.Math.Between(2, 5);
      const color = Phaser.Math.RND.pick(colors);

      const particle = this.add.circle(x, startY, size, color, 0.8);

      this.tweens.add({
        targets: particle,
        y: GAME_HEIGHT + 20,
        x: x + Phaser.Math.Between(-60, 60),
        alpha: 0,
        duration: Phaser.Math.Between(2000, 4000),
        delay: Phaser.Math.Between(0, 1500),
        ease: 'Sine.easeIn',
        repeat: -1,
        onRepeat: () => {
          particle.x = Phaser.Math.Between(50, GAME_WIDTH - 50);
          particle.y = Phaser.Math.Between(-100, -20);
          particle.alpha = 0.8;
        }
      });
    }
  }
}
