'use strict';

// ゲーム画面サイズ
const GAME_WIDTH = 960;
const GAME_HEIGHT = 640;

// 盤面設定
const BOARD_COLS = 6;
const BOARD_ROWS = 12;
const BOARD_HIDDEN_ROWS = 1;
const BOARD_TOTAL_ROWS = BOARD_ROWS + BOARD_HIDDEN_ROWS;
const CELL_SIZE = 40;

// 盤面の描画オフセット（左上基準）
const BOARD_OFFSET_X = 80;
const BOARD_OFFSET_Y = 40;

// 魔力石の色
const STONE_COLORS = ['red', 'blue', 'green', 'yellow', 'purple'];
const STONE_COLOR_HEX = {
  red: 0xff4466,
  blue: 0x4488ff,
  green: 0x44dd66,
  yellow: 0xffcc00,
  purple: 0xbb44ff,
  curse: 0x555555
};

// 落下速度（ミリ秒）
const DROP_INTERVAL_INITIAL = 800;
const DROP_INTERVAL_SOFT = 50;

// マッチ・連鎖
const MATCH_MIN = 4;
const CHAIN_DELAY = 400;
const GRAVITY_DELAY = 250;

// 操作
const LOCK_DELAY = 500;
const KEY_REPEAT_DELAY = 120;

// スコア
const BASE_SCORE = 10;
const CHAIN_MULTIPLIER = [0, 1, 2, 4, 8, 16, 32, 64, 128, 256];

// ゲーム状態
const GAME_STATE = {
  SPAWNING: 'spawning',
  FALLING: 'falling',
  LOCKING: 'locking',
  RESOLVING: 'resolving',
  GAME_OVER: 'gameOver',
  STAGE_CLEAR: 'stageClear'
};

// ペア初期位置
const PAIR_SPAWN_COL = 2;
const PAIR_SPAWN_ROW = 1;
