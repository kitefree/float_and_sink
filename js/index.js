import MainScene from './Scenes/MainScene.js';

function isIPadDevice() {
    if (/Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true;
    }
    else {
        return false;
    }
}

gWidth = 0;

if (isIPadDevice() == true)
{
    gWidth = 1200;
}
else {
    gWidth = 1500;
}

var config = {
    type: Phaser.WEBGL,
    width: gWidth,
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
