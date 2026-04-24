---
name: gc-game-dev-2
description: ブラウザゲーム「マジカル・ハート・レスキュー 〜呪われし学園と乙女の連鎖〜」の開発に関する議論で発動する。ぷよぷよ風の落ちモノパズル、Phaser 3、ギャルゲー、ヒロイン（ルナ）、連鎖演出、呪い鎖ブロック、6×13グリッド、GitHub Pages公開、Gemini APIでのコンセプトアート生成、キャラクター設計、ステージバランス、puzzle-scene、chain.js、heroine-manager、マジックハート、乙女ゲー要素、連鎖判定アルゴリズム、BFS flood fill、ぷよぷよライクなゲームロジック、Vanilla JSでのゲーム実装、落下ペア制御、パズルUI/UXなど、このプロジェクト固有の話題が出た時に自動発動する。
---

# マジカル・ハート・レスキュー 〜呪われし学園と乙女の連鎖〜

## プロジェクトの目的
ぷよぷよをベースとした落ちモノパズルに、ギャルゲー要素（ヒロイン救出・リアクション）を融合させたブラウザゲームを開発している。プレイヤーは呪いにかけられたヒロイン（ルナ）を連鎖の力で救出する。「呪われし学園」という世界観の中で、魔力石（5色のハート型ジェム）を4つ以上繋げて消し、連鎖で「呪い鎖ブロック」を破壊してステージクリアを目指すゲームシステム。

なぜ作るか：パズルゲームの「気持ちよさ」とギャルゲーの「感情的報酬」を組み合わせた、短時間で遊べる個人開発タイトルを実現するため。GitHub Pagesで配信することで、インストール不要で誰でも遊べる環境を提供する。

## 現在のフェーズ
- **MVP実装完了**：パズルコア（落下・回転・連鎖・呪い鎖破壊）＋ヒロインリアクション＋タイトル/パズル/リザルト画面の全フローは実装済み（コミット `48a235d`）。
- **初回プレイ調整済み**：ペア出現位置、呪い鎖ブロック数（10→4）のバランス調整完了（コミット `5cce4ae`）。
- **アセット準備フェーズ**：Gemini API (Imagen 3) 向けのコンセプトアート生成プロンプト集を整備（コミット `07e9ea3`）。実画像の生成・配置はまだ。
- **次のステップ候補**：コンセプトアートの実生成と取り込み、ヒロイン追加、ステージシステム拡充、BGM/SE、表情バリエーション拡大、スコアランキングなど。

## 技術スタック・使用ツール
- **Phaser 3.80.1**（CDNから読み込み、ビルドツールなし）
- **Vanilla JavaScript**（ES6 クラス構文、`'use strict'`、各ファイル先頭に宣言）
- **HTML / CSS**（ヒロインUIはDOM overlayで実装）
- **GitHub Pages + GitHub Actions**（`main`ブランチpushで自動デプロイ、`.github/workflows/deploy.yml`）
- **Gemini API (Imagen 3)**（コンセプトアート生成用、Python呼び出し例あり）
- **データ形式**：JSON（`assets/data/` 配置予定）、MVPはハードコード

## リポジトリ構成
- `/home/user/gc-game-dev-2/CLAUDE.md` — 開発ルール・コーディング規約・アーキテクチャ方針
- `/home/user/gc-game-dev-2/README.md` — 最小限のプロジェクト説明
- `/home/user/gc-game-dev-2/index.html` — エントリーポイント、Phaserとスクリプトの読み込み順を定義
- `/home/user/gc-game-dev-2/css/style.css` — UIオーバーレイ用スタイル
- `/home/user/gc-game-dev-2/js/constants.js` — 全定数（盤面サイズ、色、スコア倍率、状態定義）
- `/home/user/gc-game-dev-2/js/main.js` — Phaser Game設定・起動
- `/home/user/gc-game-dev-2/js/puzzle/stone.js` — `Stone` / `StoneFactory`（魔力石データクラス）
- `/home/user/gc-game-dev-2/js/puzzle/board.js` — `Board`（6×13グリッド、重力用ヘルパ、ゲームオーバー/ステージクリア判定）
- `/home/user/gc-game-dev-2/js/puzzle/pair.js` — 落下ペア制御（回転・移動・着地）
- `/home/user/gc-game-dev-2/js/puzzle/chain.js` — `ChainResolver`（マッチ判定・消去・重力のステートマシン、BFS flood fill）
- `/home/user/gc-game-dev-2/js/puzzle/curse-block.js` — 呪い鎖ブロックと隣接判定ヘルパ
- `/home/user/gc-game-dev-2/js/heroine/heroine-manager.js` — `HeroineManager`（ヒロインデータ・表情・セリフ）
- `/home/user/gc-game-dev-2/js/heroine/heroine-ui.js` — DOM overlayのUIレンダリング
- `/home/user/gc-game-dev-2/js/scenes/title-scene.js` — タイトル画面
- `/home/user/gc-game-dev-2/js/scenes/puzzle-scene.js` — メインパズル画面（全体制御の中核、16KB超）
- `/home/user/gc-game-dev-2/js/scenes/result-scene.js` — リザルト画面
- `/home/user/gc-game-dev-2/assets/prompts/concept-art.md` — Gemini API用プロンプト集（世界観/キャラ/UI/エフェクト）
- `/home/user/gc-game-dev-2/.github/workflows/deploy.yml` — GitHub Pages自動デプロイ
- `/home/user/gc-game-dev-2/.claude/launch.json` — Claude Code設定

## Claudeに期待する役割
- **ゲームデザインの議論相手**：パズルの連鎖バランス、ヒロインとの感情的フック、難易度曲線、ステージ構成の相談相手。
- **コードレビューとリファクタリング提案**：Phaser依存部分と純パズルロジックの分離、1ファイル300行制限の維持、`constants.js`への定数集約。
- **ぷよぷよ風ゲームロジックの実装補助**：連鎖判定（BFS flood fill）、重力処理、ロックディレイ、キー入力リピート、スコア計算（`CHAIN_MULTIPLIER` 配列）など。
- **アセットパイプラインの構築**：Gemini API呼び出し、プロンプト改善、生成画像の取り込み自動化。
- **新機能の設計**：新ヒロイン追加、ステージデータのJSON化、表情拡張、BGM/SE統合など。
- **コミット規約に沿った提案**：`[feat]` `[fix]` `[refactor]` `[asset]` `[docs]` プレフィックスを意識した作業分割。

## 注意事項・前提
- **ビルドツール不使用**：TypeScript、webpack、Vite等は導入しない方針。script tag直読みのシンプル構成を維持する。
- **コーディング規約は厳格**：camelCase / UPPER_SNAKE_CASE / kebab-case / PascalCase を守る。2スペースインデント。コメントは日本語。1ファイル最大300行（超えたら分割）。マジックナンバー禁止。
- **アーキテクチャ境界**：`js/puzzle/` 内のパズルロジックは **Phaserに依存しない純JSクラス**。描画はSceneクラス、ヒロインUIはDOM overlayで担当する分離を維持する。
- **盤面サイズ**：表示は6列×12行だが、隠し1行を含めて `BOARD_TOTAL_ROWS = 13`。`MATCH_MIN = 4`（ぷよぷよと同じ4連結で消去）。
- **すでに調整済み**：呪い鎖ブロックは4個（10個は難しすぎた）、ペア出現行は衛星石が見えるよう修正済み。これらは再度いじる前に意図を確認すること。
- **カラーパレット**：ピンク `#ec4899`、紫 `#8b5cf6`、琥珀 `#f59e0b`、背景ダークブルー `#0a0a1a` を基調とする。石の色は `STONE_COLOR_HEX` に定義済み。
- **ヒロインはルナのみ（MVP）**：`HeroineManager.loadDefaultData()` にハードコード。複数ヒロイン対応は未着手。
- **画像アセット未生成**：`assets/prompts/concept-art.md` にプロンプトは用意済みだが、実画像はまだ無い。現状は絵文字とベクター描画で代用している。
- **`main`ブランチへのpushが即デプロイ**：GitHub Pagesが自動で公開するため、壊れた状態のmergeに注意。

## 調査手順
1. `/home/user/gc-game-dev-2/README.md`、`/home/user/gc-game-dev-2/CLAUDE.md` を読む（プロジェクト概要と規約）。`docs/` は現時点では未作成。
2. `/home/user/gc-game-dev-2/assets/prompts/concept-art.md` を読む（ビジュアルの方向性と世界観の詳細）。`scripts/` は現時点では未作成。
3. `git log --oneline -20` で直近のコミット履歴を俯瞰し、何に取り組んでいるか把握する。
4. 不明な点は推測せず「現時点では未定」と明記する。特にBGM/SE、追加ヒロイン、ステージデータ形式、スコアランキングなどは未定事項。
