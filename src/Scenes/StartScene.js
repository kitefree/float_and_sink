
import Phaser from 'phaser';
import { TabletConfig } from '../DeviceConfig/Tablet';
import { DesktopConfig } from '../DeviceConfig/Desktop';
import ImgStart from '../assets/start_game-new.png';
export default class StartScene extends Phaser.Scene {

    constructor(key) {
        super(key)

    }


    preload() {
       
        this.load.image('btnStart', ImgStart);
       
    }

    create() {
        var self = this;
        var btnStart;
        self.gSetting = (isIPadDevice() == true) ? TabletConfig : DesktopConfig;
        //世界座標中心
        
        
        //btnStart = this.add.image(self.gSetting.btnReset.x, self.gSetting.btnReset.y, 'btnStart').setInteractive();
        btnStart = this.add.image(this.cameras.main.worldView.width/2, this.cameras.main.worldView.height/2, 'btnStart').setInteractive();
        btnStart.visible = true;

        btnStart.on('pointerover', function () {
            this.scene.sys.game.input.setCursor({ cursor: 'pointer' });      
        });

        btnStart.on('pointerout', function () {
            this.scene.sys.game.input.resetCursor({ cursor: 'true' });
        });
        btnStart.on('pointerdown', function () {                  
            self.scene.start('Main');
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