import MainScene from './Scenes/MainScene.js';
import StartScene from './Scenes/StartScene.js';

function isIPadDevice() {
    if (/Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true;
    }
    else {
        return false;
    }
}

window.gWidth = 1500;

// if (isIPadDevice() == true)
// {
//     window.gWidth = 1500;
// }
// else {
//     window.gWidth = 1500;
// }

var config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        //parent: 'phaser-example',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.gWidth,
        height: 700
    },    
    width: window.gWidth,
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
