



import { TabletConfig } from '../DeviceConfig/Tablet.js';
import { DesktopConfig } from '../DeviceConfig/Desktop.js';

export default class StartScene extends Phaser.Scene {

   

    constructor() {
        super({ key: 'StartScene' })
    }

    preload() {
        this.load.image('btnStart', 'assets/start_game.png');
       
    }

    create() {
        var self = this;
        var btnStart;
        self.gSetting = (isIPadDevice() == true) ? TabletConfig : DesktopConfig;
        //世界座標中心
        btnStart = this.add.image(self.gSetting.btnReset.x, self.gSetting.btnReset.y, 'btnStart').setInteractive();
        btnStart.visible = true;

        btnStart.on('pointerover', function () {
            this.scene.sys.game.input.setCursor({ cursor: 'pointer' });      
        });

        btnStart.on('pointerout', function () {
            this.scene.sys.game.input.resetCursor({ cursor: 'true' });
        });
        btnStart.on('pointerdown', function () {            
            self.scene.start('MainScene');
        });

        function isIPadDevice() {
            if (/Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                return true;
            }
            else {
                return false;
            }
        }

    }



      

    update() {

    }




}