// config.js phaser 基本設定
import 'phaser'
export default {


    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1500,
        height: 700
    },
    width: 1500,
    height: 700,
    backgroundColor: '#2d2d2d',
    //transparent: true, // 背景透明
    // fps: {
    //     target: 5,
    // },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            // debug: true
        }
    }

}