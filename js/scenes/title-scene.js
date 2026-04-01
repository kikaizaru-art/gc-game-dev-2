'use strict';

/**
 * タイトル画面シーン
 * ゲームタイトル表示とスタートボタン
 */
class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  create() {
    // 背景グラデーション
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1a0a2e, 0x1a0a2e, 0x0a0a1a, 0x0a0a1a, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // パーティクル（浮遊する光の粒）
    this.createParticles();

    // タイトルテキスト
    const titleStyle = {
      fontFamily: 'Zen Maru Gothic',
      fontSize: '42px',
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#8b5cf6',
      strokeThickness: 4,
      shadow: { offsetX: 0, offsetY: 0, color: '#ec4899', blur: 20, fill: true }
    };
    const title = this.add.text(
      GAME_WIDTH / 2, GAME_HEIGHT * 0.3,
      'マジカル・ハート・レスキュー',
      titleStyle
    ).setOrigin(0.5);

    // サブタイトル
    const subtitle = this.add.text(
      GAME_WIDTH / 2, GAME_HEIGHT * 0.3 + 56,
      '〜呪われし学園と乙女の連鎖〜',
      { fontFamily: 'Zen Maru Gothic', fontSize: '18px', color: '#bb88ee' }
    ).setOrigin(0.5);

    // タイトルアニメーション
    this.tweens.add({
      targets: title,
      y: title.y - 6,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // スタートボタン
    const btnBg = this.add.graphics();
    const btnX = GAME_WIDTH / 2 - 120;
    const btnY = GAME_HEIGHT * 0.6;
    const btnW = 240;
    const btnH = 56;

    btnBg.fillStyle(0xec4899, 1);
    btnBg.fillRoundedRect(btnX, btnY, btnW, btnH, 28);
    btnBg.lineStyle(2, 0xffffff, 0.3);
    btnBg.strokeRoundedRect(btnX, btnY, btnW, btnH, 28);

    const btnText = this.add.text(
      GAME_WIDTH / 2, btnY + btnH / 2,
      '▶  ス タ ー ト',
      { fontFamily: 'Zen Maru Gothic', fontSize: '22px', fontStyle: 'bold', color: '#ffffff' }
    ).setOrigin(0.5);

    // ボタンインタラクション
    const btnZone = this.add.zone(GAME_WIDTH / 2, btnY + btnH / 2, btnW, btnH)
      .setInteractive({ useHandCursor: true });

    btnZone.on('pointerover', () => {
      btnBg.clear();
      btnBg.fillStyle(0xf472b6, 1);
      btnBg.fillRoundedRect(btnX, btnY, btnW, btnH, 28);
      btnBg.lineStyle(2, 0xffffff, 0.5);
      btnBg.strokeRoundedRect(btnX, btnY, btnW, btnH, 28);
    });

    btnZone.on('pointerout', () => {
      btnBg.clear();
      btnBg.fillStyle(0xec4899, 1);
      btnBg.fillRoundedRect(btnX, btnY, btnW, btnH, 28);
      btnBg.lineStyle(2, 0xffffff, 0.3);
      btnBg.strokeRoundedRect(btnX, btnY, btnW, btnH, 28);
    });

    btnZone.on('pointerdown', () => {
      this.scene.start('PuzzleScene', { stageId: 1 });
    });

    // ボタンの光るアニメーション
    this.tweens.add({
      targets: [btnBg],
      alpha: { from: 1, to: 0.85 },
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // フッター
    this.add.text(
      GAME_WIDTH / 2, GAME_HEIGHT - 30,
      '© 2026 Magical Heart Rescue',
      { fontFamily: 'Zen Maru Gothic', fontSize: '12px', color: '#666' }
    ).setOrigin(0.5);
  }

  /** 浮遊パーティクルを生成 */
  createParticles() {
    for (let i = 0; i < 30; i++) {
      const x = Phaser.Math.Between(0, GAME_WIDTH);
      const y = Phaser.Math.Between(0, GAME_HEIGHT);
      const size = Phaser.Math.Between(1, 3);
      const alpha = Phaser.Math.FloatBetween(0.1, 0.5);
      const color = Phaser.Math.RND.pick([0xec4899, 0x8b5cf6, 0xf59e0b, 0x4488ff]);

      const particle = this.add.circle(x, y, size, color, alpha);

      this.tweens.add({
        targets: particle,
        y: y - Phaser.Math.Between(80, 200),
        alpha: 0,
        duration: Phaser.Math.Between(3000, 6000),
        delay: Phaser.Math.Between(0, 3000),
        repeat: -1,
        onRepeat: () => {
          particle.x = Phaser.Math.Between(0, GAME_WIDTH);
          particle.y = GAME_HEIGHT + 10;
          particle.alpha = alpha;
        }
      });
    }
  }
}
