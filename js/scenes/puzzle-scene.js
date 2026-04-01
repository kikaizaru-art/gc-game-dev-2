'use strict';

/**
 * メインパズルゲームプレイシーン
 * 盤面描画・入力処理・ゲームフロー管理
 */
class PuzzleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PuzzleScene' });
  }

  init(data) {
    this.stageId = data ? data.stageId : 1;
  }

  create() {
    // ロジッククラス初期化
    this.board = new Board();
    this.chainResolver = new ChainResolver();
    this.pair = new Pair();

    // ステージ読み込み（MVPは直接定義）
    this.stageData = this.getStageData(this.stageId);
    this.board.loadStage(this.stageData.curseBlocks);

    // ゲーム状態
    this.gameState = GAME_STATE.SPAWNING;
    this.score = 0;
    this.maxChain = 0;
    this.dropTimer = 0;
    this.dropInterval = DROP_INTERVAL_INITIAL;
    this.resolveTimer = 0;
    this.lockTimer = 0;
    this.isLocking = false;

    // 入力制御
    this.keyRepeatTimers = { left: 0, right: 0 };
    this.cursors = this.input.keyboard.createCursorKeys();
    this.rotatePressed = false;

    // ヒロインシステム
    this.heroineManager = new HeroineManager();
    this.heroineManager.loadDefaultData();
    this.heroineUI = new HeroineUI();
    const heroine = this.heroineManager.selectHeroine(this.stageData.heroine);
    this.heroineUI.show(heroine);

    // 描画オブジェクト作成
    this.createVisuals();

    // タッチ入力
    this.setupTouch();

    // UI要素の初期描画
    this.drawBoard();
    this.updateInfoDisplay();
  }

  /** ステージデータ取得（MVP用ハードコード） */
  getStageData(stageId) {
    return {
      id: 1,
      name: 'はじめての救出',
      heroine: 'luna',
      dropSpeed: DROP_INTERVAL_INITIAL,
      curseBlocks: [
        { row: 10, col: 2 }, { row: 10, col: 3 },
        { row: 11, col: 1 }, { row: 11, col: 2 },
        { row: 11, col: 3 }, { row: 11, col: 4 },
        { row: 12, col: 1 }, { row: 12, col: 2 },
        { row: 12, col: 3 }, { row: 12, col: 4 }
      ]
    };
  }

  /** 描画オブジェクト群を作成 */
  createVisuals() {
    // 盤面背景
    this.boardBg = this.add.graphics();
    this.boardBg.fillStyle(0x111122, 0.8);
    this.boardBg.fillRoundedRect(
      BOARD_OFFSET_X - 4, BOARD_OFFSET_Y - 4,
      BOARD_COLS * CELL_SIZE + 8, BOARD_ROWS * CELL_SIZE + 8,
      8
    );
    this.boardBg.lineStyle(2, 0x8b5cf6, 0.4);
    this.boardBg.strokeRoundedRect(
      BOARD_OFFSET_X - 4, BOARD_OFFSET_Y - 4,
      BOARD_COLS * CELL_SIZE + 8, BOARD_ROWS * CELL_SIZE + 8,
      8
    );

    // グリッド線
    const gridLines = this.add.graphics();
    gridLines.lineStyle(1, 0x333355, 0.3);
    for (let row = 0; row <= BOARD_ROWS; row++) {
      const y = BOARD_OFFSET_Y + row * CELL_SIZE;
      gridLines.lineBetween(BOARD_OFFSET_X, y, BOARD_OFFSET_X + BOARD_COLS * CELL_SIZE, y);
    }
    for (let col = 0; col <= BOARD_COLS; col++) {
      const x = BOARD_OFFSET_X + col * CELL_SIZE;
      gridLines.lineBetween(x, BOARD_OFFSET_Y, x, BOARD_OFFSET_Y + BOARD_ROWS * CELL_SIZE);
    }

    // 石描画用Graphics
    this.stonesGraphics = this.add.graphics();

    // ペア描画用Graphics
    this.pairGraphics = this.add.graphics();

    // 次のペア表示用
    this.nextPair = null;
    this.nextPairGraphics = this.add.graphics();

    // 連鎖テキスト
    this.chainText = this.add.text(
      BOARD_OFFSET_X + (BOARD_COLS * CELL_SIZE) / 2,
      BOARD_OFFSET_Y + (BOARD_ROWS * CELL_SIZE) / 2,
      '', {
        fontFamily: 'Zen Maru Gothic',
        fontSize: '64px',
        fontStyle: 'bold',
        color: '#ffcc00',
        stroke: '#ff6600',
        strokeThickness: 6
      }
    ).setOrigin(0.5).setDepth(10).setAlpha(0);

    // 情報テキスト
    this.scoreText = this.add.text(
      BOARD_OFFSET_X, BOARD_OFFSET_Y - 24,
      'SCORE: 0', {
        fontFamily: 'Zen Maru Gothic', fontSize: '16px', color: '#f59e0b'
      }
    );

    this.curseText = this.add.text(
      BOARD_OFFSET_X + BOARD_COLS * CELL_SIZE, BOARD_OFFSET_Y - 24,
      '', {
        fontFamily: 'Zen Maru Gothic', fontSize: '16px', color: '#ff4466'
      }
    ).setOrigin(1, 0);

    // ステージ名
    this.add.text(
      GAME_WIDTH / 2, 16,
      this.stageData.name, {
        fontFamily: 'Zen Maru Gothic', fontSize: '20px', fontStyle: 'bold', color: '#bb88ee'
      }
    ).setOrigin(0.5, 0);
  }

  /** タッチ入力設定 */
  setupTouch() {
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchStartTime = 0;

    this.input.on('pointerdown', (pointer) => {
      this.touchStartX = pointer.x;
      this.touchStartY = pointer.y;
      this.touchStartTime = this.time.now;
    });

    this.input.on('pointerup', (pointer) => {
      if (this.gameState !== GAME_STATE.FALLING) return;

      const dx = pointer.x - this.touchStartX;
      const dy = pointer.y - this.touchStartY;
      const dt = this.time.now - this.touchStartTime;

      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (absDx < 15 && absDy < 15 && dt < 300) {
        // タップ → 回転
        this.pair.rotate(this.board);
      } else if (absDx > absDy && absDx > 30) {
        // 横スワイプ
        if (dx > 0) this.pair.moveRight(this.board);
        else this.pair.moveLeft(this.board);
      } else if (dy > 40) {
        // 下スワイプ → ハードドロップ
        this.hardDrop();
      }
    });
  }

  /** ハードドロップ（一番下まで落とす） */
  hardDrop() {
    while (this.pair.moveDown(this.board)) {}
    this.lockPair();
  }

  update(time, delta) {
    switch (this.gameState) {
      case GAME_STATE.SPAWNING:
        this.handleSpawning();
        break;
      case GAME_STATE.FALLING:
        this.handleFalling(time, delta);
        break;
      case GAME_STATE.LOCKING:
        this.handleLocking(delta);
        break;
      case GAME_STATE.RESOLVING:
        this.handleResolving(delta);
        break;
    }

    this.drawBoard();
    this.drawPair();
  }

  /** 新ペア生成 */
  handleSpawning() {
    this.pair.spawn();
    this.dropTimer = 0;
    this.dropInterval = this.stageData.dropSpeed || DROP_INTERVAL_INITIAL;
    this.isLocking = false;

    // 生成位置が既に埋まっている→ゲームオーバー
    const satPos = this.pair.getSatellitePosition();
    if (!this.board.isEmpty(this.pair.pivotRow, this.pair.pivotCol) ||
        !this.board.isEmpty(satPos.row, satPos.col)) {
      this.gameState = GAME_STATE.GAME_OVER;
      this.showGameOver();
      return;
    }

    this.gameState = GAME_STATE.FALLING;
  }

  /** 落下中の入力・自動落下処理 */
  handleFalling(time, delta) {
    // キー入力
    this.handleInput(delta);

    // 自動落下
    this.dropTimer += delta;
    const currentInterval = this.cursors.down.isDown ? DROP_INTERVAL_SOFT : this.dropInterval;

    if (this.dropTimer >= currentInterval) {
      this.dropTimer = 0;
      if (!this.pair.moveDown(this.board)) {
        // 着地 → ロック待ち
        this.gameState = GAME_STATE.LOCKING;
        this.lockTimer = 0;
      }
    }
  }

  /** ロック待ち（少しだけ猶予） */
  handleLocking(delta) {
    this.handleInput(delta);
    this.lockTimer += delta;

    // まだ下に移動できるなら落下に戻す
    if (this.pair.canMove(this.board, 1, 0)) {
      this.gameState = GAME_STATE.FALLING;
      return;
    }

    if (this.lockTimer >= LOCK_DELAY) {
      this.lockPair();
    }
  }

  /** ペアを固定して連鎖解決開始 */
  lockPair() {
    this.pair.lock(this.board);
    this.chainResolver.startResolve();
    this.resolveTimer = 0;
    this.gameState = GAME_STATE.RESOLVING;
  }

  /** 連鎖解決処理 */
  handleResolving(delta) {
    this.resolveTimer += delta;

    const delay = this.chainResolver.state === 'gravity' ? GRAVITY_DELAY : CHAIN_DELAY;

    if (this.resolveTimer >= delay) {
      this.resolveTimer = 0;
      const result = this.chainResolver.step(this.board);

      switch (result.type) {
        case 'match':
          this.showChainEffect(result.chainCount);
          if (result.chainCount > this.maxChain) {
            this.maxChain = result.chainCount;
          }
          // ヒロインリアクション
          const expression = this.heroineManager.getExpression(result.chainCount);
          const exprData = this.heroineManager.getExpressionData(expression);
          this.heroineUI.updateExpression(exprData);
          break;

        case 'clear':
          // エフェクト（アニメーション追加予定）
          break;

        case 'done':
          this.score += result.score;
          this.updateInfoDisplay();

          // ステージクリア判定
          if (this.board.isStageClear()) {
            this.gameState = GAME_STATE.STAGE_CLEAR;
            this.showStageClear();
            return;
          }

          // ゲームオーバー判定
          if (this.board.isGameOver()) {
            this.gameState = GAME_STATE.GAME_OVER;
            this.showGameOver();
            return;
          }

          // 次のペア
          this.gameState = GAME_STATE.SPAWNING;
          break;
      }
    }
  }

  /** キー入力処理 */
  handleInput(delta) {
    // 左移動（リピート付き）
    if (this.cursors.left.isDown) {
      this.keyRepeatTimers.left += delta;
      if (Phaser.Input.Keyboard.JustDown(this.cursors.left) ||
          this.keyRepeatTimers.left >= KEY_REPEAT_DELAY) {
        this.pair.moveLeft(this.board);
        if (this.keyRepeatTimers.left >= KEY_REPEAT_DELAY) {
          this.keyRepeatTimers.left = 0;
        }
      }
    } else {
      this.keyRepeatTimers.left = KEY_REPEAT_DELAY;
    }

    // 右移動（リピート付き）
    if (this.cursors.right.isDown) {
      this.keyRepeatTimers.right += delta;
      if (Phaser.Input.Keyboard.JustDown(this.cursors.right) ||
          this.keyRepeatTimers.right >= KEY_REPEAT_DELAY) {
        this.pair.moveRight(this.board);
        if (this.keyRepeatTimers.right >= KEY_REPEAT_DELAY) {
          this.keyRepeatTimers.right = 0;
        }
      }
    } else {
      this.keyRepeatTimers.right = KEY_REPEAT_DELAY;
    }

    // 回転（1回だけ）
    if (this.cursors.up.isDown) {
      if (!this.rotatePressed) {
        this.pair.rotate(this.board);
        this.rotatePressed = true;
      }
    } else {
      this.rotatePressed = false;
    }
  }

  /** 盤面全体を描画 */
  drawBoard() {
    this.stonesGraphics.clear();

    for (let row = BOARD_HIDDEN_ROWS; row < BOARD_TOTAL_ROWS; row++) {
      for (let col = 0; col < BOARD_COLS; col++) {
        const stone = this.board.getStone(row, col);
        if (stone) {
          this.drawStone(
            this.stonesGraphics,
            row - BOARD_HIDDEN_ROWS, col,
            stone.color, stone.isCurse
          );
        }
      }
    }
  }

  /** ペアを描画 */
  drawPair() {
    this.pairGraphics.clear();

    if (this.gameState !== GAME_STATE.FALLING &&
        this.gameState !== GAME_STATE.LOCKING) return;

    const pivotDisplayRow = this.pair.pivotRow - BOARD_HIDDEN_ROWS;
    const satPos = this.pair.getSatellitePosition();
    const satDisplayRow = satPos.row - BOARD_HIDDEN_ROWS;

    // ゴースト（着地予測位置）
    this.drawGhost();

    // ピボット石
    if (pivotDisplayRow >= 0) {
      this.drawStone(this.pairGraphics, pivotDisplayRow, this.pair.pivotCol, this.pair.pivotStone.color);
    }

    // 衛星石
    if (satDisplayRow >= 0) {
      this.drawStone(this.pairGraphics, satDisplayRow, satPos.col, this.pair.satelliteStone.color);
    }
  }

  /** ゴースト（着地予測）表示 */
  drawGhost() {
    // ピボット列の着地位置
    let ghostRow = this.pair.pivotRow;
    const satPos = this.pair.getSatellitePosition();

    // 簡易ゴースト: ピボット列の最下行
    const pivotBottom = this.board.getLowestEmptyRow(this.pair.pivotCol);
    const satBottom = this.board.getLowestEmptyRow(satPos.col);

    if (pivotBottom >= 0) {
      const displayRow = pivotBottom - BOARD_HIDDEN_ROWS;
      if (displayRow >= 0) {
        this.drawStoneGhost(this.pairGraphics, displayRow, this.pair.pivotCol, this.pair.pivotStone.color);
      }
    }
    if (satBottom >= 0) {
      const displayRow = satBottom - BOARD_HIDDEN_ROWS;
      if (displayRow >= 0) {
        this.drawStoneGhost(this.pairGraphics, displayRow, satPos.col, this.pair.satelliteStone.color);
      }
    }
  }

  /**
   * 石を1つ描画
   * @param {Phaser.GameObjects.Graphics} graphics
   * @param {number} displayRow - 表示行（0始まり、隠し行除外済み）
   * @param {number} col
   * @param {string} color
   * @param {boolean} isCurse
   */
  drawStone(graphics, displayRow, col, color, isCurse = false) {
    const x = BOARD_OFFSET_X + col * CELL_SIZE + CELL_SIZE / 2;
    const y = BOARD_OFFSET_Y + displayRow * CELL_SIZE + CELL_SIZE / 2;
    const radius = CELL_SIZE / 2 - 3;

    if (isCurse) {
      // 呪い鎖ブロック: 灰色の四角+鎖模様
      graphics.fillStyle(0x444455, 1);
      graphics.fillRoundedRect(x - radius, y - radius, radius * 2, radius * 2, 4);
      graphics.lineStyle(2, 0x666688, 0.8);
      graphics.strokeRoundedRect(x - radius, y - radius, radius * 2, radius * 2, 4);
      // 鎖マーク
      graphics.lineStyle(2, 0x888899, 0.6);
      graphics.strokeCircle(x - 4, y, 5);
      graphics.strokeCircle(x + 4, y, 5);
    } else {
      // 魔力石: 色付きの円+光沢
      const hexColor = STONE_COLOR_HEX[color] || 0xffffff;
      graphics.fillStyle(hexColor, 1);
      graphics.fillCircle(x, y, radius);

      // 光沢ハイライト
      graphics.fillStyle(0xffffff, 0.3);
      graphics.fillCircle(x - radius * 0.25, y - radius * 0.25, radius * 0.4);

      // 縁取り
      graphics.lineStyle(1.5, 0xffffff, 0.2);
      graphics.strokeCircle(x, y, radius);
    }
  }

  /** ゴースト石（薄い表示） */
  drawStoneGhost(graphics, displayRow, col, color) {
    const x = BOARD_OFFSET_X + col * CELL_SIZE + CELL_SIZE / 2;
    const y = BOARD_OFFSET_Y + displayRow * CELL_SIZE + CELL_SIZE / 2;
    const radius = CELL_SIZE / 2 - 3;
    const hexColor = STONE_COLOR_HEX[color] || 0xffffff;

    graphics.lineStyle(1.5, hexColor, 0.3);
    graphics.strokeCircle(x, y, radius);
  }

  /** 連鎖エフェクト表示 */
  showChainEffect(chainCount) {
    this.chainText.setText(`${chainCount} 連鎖！`);
    this.chainText.setAlpha(1).setScale(0.3);

    this.tweens.add({
      targets: this.chainText,
      scaleX: 1.2,
      scaleY: 1.2,
      alpha: 0,
      duration: 800,
      ease: 'Power2'
    });

    // 画面シェイク（3連鎖以上）
    if (chainCount >= 3) {
      this.cameras.main.shake(150, 0.005 * chainCount);
    }
  }

  /** 情報表示更新 */
  updateInfoDisplay() {
    this.scoreText.setText(`SCORE: ${this.score}`);
    const curseCount = this.board.getCurseBlockCount();
    this.curseText.setText(`呪い鎖: ${curseCount}`);
  }

  /** ステージクリア演出 */
  showStageClear() {
    // ヒロイン勝利リアクション
    this.heroineUI.playVictory(this.heroineManager.getVictoryData());

    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.5);
    overlay.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    this.add.text(
      GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40,
      '✨ STAGE CLEAR! ✨', {
        fontFamily: 'Zen Maru Gothic', fontSize: '48px', fontStyle: 'bold',
        color: '#ffcc00',
        stroke: '#ff6600', strokeThickness: 4
      }
    ).setOrigin(0.5);

    this.add.text(
      GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20,
      `SCORE: ${this.score}  |  最大連鎖: ${this.maxChain}`, {
        fontFamily: 'Zen Maru Gothic', fontSize: '20px', color: '#ffffff'
      }
    ).setOrigin(0.5);

    // リザルトへ遷移
    this.time.delayedCall(2000, () => {
      this.heroineUI.hide();
      this.scene.start('ResultScene', {
        cleared: true,
        score: this.score,
        maxChain: this.maxChain,
        stageId: this.stageId
      });
    });
  }

  /** ゲームオーバー演出 */
  showGameOver() {
    // ヒロイン敗北リアクション
    this.heroineUI.playDefeat(this.heroineManager.getDefeatData());

    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.7);
    overlay.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    this.add.text(
      GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20,
      'GAME OVER', {
        fontFamily: 'Zen Maru Gothic', fontSize: '48px', fontStyle: 'bold',
        color: '#ff4466',
        stroke: '#880022', strokeThickness: 4
      }
    ).setOrigin(0.5);

    this.time.delayedCall(2000, () => {
      this.heroineUI.hide();
      this.scene.start('ResultScene', {
        cleared: false,
        score: this.score,
        maxChain: this.maxChain,
        stageId: this.stageId
      });
    });
  }
}
