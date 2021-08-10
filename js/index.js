import MainScene from './Scenes/MainScene.js';




var config = {
    type: Phaser.WEBGL,
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
    },
    scene: [MainScene]
};
var game = new Phaser.Game(config);
