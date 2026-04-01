# マジカル・ハート・レスキュー 開発ルール

## プロジェクト概要
ぷよぷよベースの落ちモノパズル × ギャルゲー。Phaser 3で描画、GitHub Pagesで公開。

## 技術スタック
- Phaser 3 (CDN: https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.min.js)
- Vanilla JS (ES6 クラス構文)
- HTML/CSS (ヒロインUI用オーバーレイ)
- ビルドツールなし

## コーディング規約
- 変数・関数: camelCase (`chainCount`)
- 定数: UPPER_SNAKE_CASE (`MAX_CHAIN`)
- ファイル名: kebab-case (`puzzle-scene.js`)
- クラス名: PascalCase (`ChainResolver`)
- インデント: 2スペース
- コメント: 日本語、関数ごとに説明
- 1ファイル最大300行（超えたら分割）
- マジックナンバー禁止（constants.jsに定義）
- 各ファイル先頭に `'use strict';`

## アーキテクチャ
- パズルロジック (js/puzzle/) はPhaserに依存しない純JSクラス
- 描画はPhaserのSceneクラスが担当
- ヒロインUIはDOM overlay (HTML/CSS)
- データはJSON (assets/data/)

## Git コミット規約
- `[feat]` 新機能
- `[fix]` バグ修正
- `[refactor]` リファクタリング
- `[asset]` アセット変更
- `[docs]` ドキュメント

## ファイル構成
```
js/
├── constants.js        # 全定数
├── main.js             # Phaser起動
├── puzzle/
│   ├── stone.js        # Stone + StoneFactory
│   ├── board.js        # 6×13グリッド管理
│   ├── pair.js         # 落下ペア制御
│   ├── chain.js        # 連鎖判定・解決
│   └── curse-block.js  # 呪い鎖ブロック
├── heroine/
│   ├── heroine-manager.js
│   └── heroine-ui.js
└── scenes/
    ├── title-scene.js
    ├── puzzle-scene.js
    └── result-scene.js
```
