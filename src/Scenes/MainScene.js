
import Phaser from 'phaser';
import { TabletConfig } from '../DeviceConfig/Tablet';
import { DesktopConfig } from '../DeviceConfig/Desktop';
import ImgReset from '../assets/reset-new.png';
import ImgCube01 from '../assets/cube1.png';
import ImgCube02 from '../assets/cube2.png';
import ImgCube03 from '../assets/cube3.png';
import ImgCube04 from '../assets/cube4.png';
import ImgPlatform from '../assets/platform.png';
import ImgXLine from '../assets/x_line-new.png';
import ImgYLine from '../assets/y_line-new.png';
import ImgWeigh from '../assets/weigh-new2.png';
import ImgRuler from '../assets/ruler-new.png';
import ImgRulerDetail from '../assets/ruler_detail-new.png';
import ImgRulerDetail2 from '../assets/ruler2.png';
import ImgRulerDetail3 from '../assets/ruler3.png';
import ImgRulerDetail4 from '../assets/ruler4.png';
import ImgOutside from '../assets/outside-new.png';
import ImgInside from '../assets/inside.png';
import ImgRestart from '../assets/restart-new.png';






export default class MainScene extends Phaser.Scene {

    cube04 = null;
    arrCubes = [];
    rect1 = null;
    rect2 = null;
    pic2 = null;
    pic3 = null;
    pic4 = null;
    isExpertCubeName = "";
    ObjectWhere = Object.freeze({ "default": 1, "water": 2, "weight": 3 });
    object_where = this.ObjectWhere.default;
    gSetting = null;

    RectangleToRectangle = null;
    GetBounds = null;
    Rectangle = null;
    rect_water = null;
    rect_water_ruler = null;
    onCompleteHandler = null;
    add_water_height = null;
    isDisplayTips = false;
    box_left_side;
    box_right_side;
    box_bottom_side;
    weigh;
    isDragging = false;
    txtSys = null;
    add_water_height = (self, add_h) => {
        return self.gSetting.water.y - add_h;
    }

    onCompleteHandler = (tween, targets, myImage) => {
        tween.parent.killTweensOf(self.rect_water);
        tween.parent.killTweensOf(self.rect_water_ruler);
    }

    constructor(key) {
        super(key)
    }

    preload() {

        this.load.image('btnReset', ImgReset);
        //this.load.image('cube', 'assets/cube.png');
        this.load.image('cube01', ImgCube01);
        this.load.image('cube02', ImgCube02);
        this.load.image('cube03', ImgCube03);
        this.load.image('cube04', ImgCube04);
        //this.load.spritesheet('cube01', 'assets/cube01.png', { frameWidth: 144, frameHeight: 121 });
        //this.load.spritesheet('cube02', 'assets/cube02.png', { frameWidth: 123, frameHeight: 141 });
        this.load.image('ground', ImgPlatform);
        this.load.image('x_line', ImgXLine);
        this.load.image('y_line', ImgYLine);
        this.load.image('weigh', ImgWeigh);
        this.load.image('ruler', ImgRuler);
        this.load.image('ruler_detail', ImgRulerDetail);
        this.load.image('ruler_detail2', ImgRulerDetail2);
        this.load.image('ruler_detail3', ImgRulerDetail3);
        this.load.image('ruler_detail4', ImgRulerDetail4);
        this.load.image('magnify-out', ImgOutside);
        this.load.image('magnify-in', ImgInside);
        this.load.image('restart', ImgRestart);




    }

    create() {

        var self = this;

        self.gSetting = (isIPadDevice() == true) ? TabletConfig : DesktopConfig;
        var platforms;
        var cube01;
        var cube02;
        var cube03;
        var txtKG;
        var txtOpTips;
        var txtCubeInfo;

        self.RectangleToRectangle = Phaser.Geom.Intersects.RectangleToRectangle;
        self.GetBounds = Phaser.Display.Bounds.GetBounds;
        self.Rectangle = Phaser.Geom.Rectangle;
        self.rect1 = new self.Rectangle();
        self.rect2 = new self.Rectangle();

        var btnReset;

        var btnRestart;
        
        btnRestart = this.physics.add.staticSprite(1450, 50, 'restart').setScale(.4, .4).setInteractive();
        btnRestart.on('pointerdown', function () {
            reset_game();

            this.scene.sys.game.input.resetCursor({ cursor: 'true' });
        });

        //重玩
        btnReset = this.add.image(self.gSetting.btnReset.x, self.gSetting.btnReset.y, 'btnReset').setInteractive();
        btnReset.visible = false;

        btnReset.on('pointerover', function () {
            this.scene.sys.game.input.setCursor({ cursor: 'pointer' });
            //this.input.setCursor({ cursor: 'pointer' });

        });

        btnReset.on('pointerout', function () {
            this.scene.sys.game.input.resetCursor({ cursor: 'true' });
        });
        btnReset.on('pointerdown', function () {

            reset_game();
            this.scene.sys.game.input.resetCursor({ cursor: 'true' });
        });


        platforms = self.physics.add.staticGroup();

        //物體平台
        platforms.create(self.gSetting.platform.platform1.x, self.gSetting.platform.platform1.y, 'ground');
        platforms.create(self.gSetting.platform.platform2.x, self.gSetting.platform.platform2.y, 'ground');
        platforms.create(self.gSetting.platform.platform3.x, self.gSetting.platform.platform3.y, 'ground');

        //容器左邊
        self.box_left_side = platforms.create(self.gSetting.waterBox.left.x, self.gSetting.waterBox.left.y, 'y_line');

        //容器右邊
        self.box_right_side = platforms.create(self.gSetting.waterBox.right.x, self.gSetting.waterBox.right.y, 'y_line');

        //容器底部
        self.box_down_side = self.physics.add.sprite(self.gSetting.waterBox.bottom.x, self.gSetting.waterBox.bottom.y, 'x_line');
        self.box_down_side.setBounce(0.2);
        self.box_down_side.setCollideWorldBounds(true);
        self.physics.add.collider(self.box_down_side, platforms);

        //尺規
        platforms.create(self.gSetting.ruler.x, self.gSetting.ruler.y, 'ruler');//尺


        self.pic = self.add.image(self.gSetting.rulerDetail.x, self.gSetting.rulerDetail.y, 'ruler_detail').setScale(self.gSetting.rulerDetail.scale);
        self.pic2 = self.add.image(self.gSetting.rulerDetail.x, self.gSetting.rulerDetail.y, 'ruler_detail2').setScale(2);
        self.pic3 = self.add.image(self.gSetting.rulerDetail.x, self.gSetting.rulerDetail.y, 'ruler_detail3').setScale(2);
        self.pic4 = self.add.image(self.gSetting.rulerDetail.x, self.gSetting.rulerDetail.y, 'ruler_detail4').setScale(2);
        const lense = self.make.sprite({
            x: 400,
            y: 300,
            key: 'magnify-in',
            add: false
        });
        lense.name = 'lense';

        //pic.setDepth(90)
        self.pic2.setDepth(90)
        //pic.mask = new Phaser.Display.Masks.BitmapMask(self, lense);
        self.pic2.mask = new Phaser.Display.Masks.BitmapMask(self, lense);
        
        //pic.setDepth(90)
        self.pic3.setDepth(90)
        //pic.mask = new Phaser.Display.Masks.BitmapMask(self, lense);
        self.pic3.mask = new Phaser.Display.Masks.BitmapMask(self, lense);

        //pic.setDepth(90)
        self.pic4.setDepth(90)
        //pic.mask = new Phaser.Display.Masks.BitmapMask(self, lense);
        self.pic4.mask = new Phaser.Display.Masks.BitmapMask(self, lense);

        const magnify = self.add.image(1200, 600, 'magnify-out').setInteractive();
        magnify.name = 'magnify';
        self.input.setDraggable(magnify);
        magnify.setDepth(99);


        //秤重器
        self.weigh = self.physics.add.sprite(self.gSetting.weigh.x, self.gSetting.weigh.y, 'weigh');
        self.weigh.setBounce(0.2);
        self.weigh.setCollideWorldBounds(true);
        this.physics.add.collider(self.weigh, platforms);

        //self.txtSys = this.add.text(10, 10, `${window.screen.width} x ${window.screen.height}`);
        //self.txtSys.setFontSize('24px');
        //self.txtSys.setPadding(5, 5, 5, 5);

        //txtKG
        txtKG = self.add.text(self.gSetting.txtKG.x, self.gSetting.txtKG.y, self.gSetting.txtKG.defaultText);
        txtKG.setFontSize(self.gSetting.txtKG.fontSize);
        txtKG.setPadding(5, 5, 5, 5);


        //txtOpTips
        txtOpTips = self.add.text(self.gSetting.txtOpTips.x, self.gSetting.txtOpTips.y, self.gSetting.txtOpTips.defaultText);
        txtOpTips.setFontSize(self.gSetting.txtOpTips.fontSize);
        txtOpTips.setPadding(5, 5, 5, 5);

        //txtCubeInfo
        txtCubeInfo = self.add.text(self.gSetting.txtCubeInfo.x, self.gSetting.txtCubeInfo.y, self.gSetting.txtCubeInfo.defaultText);
        txtCubeInfo.setFontSize(self.gSetting.txtCubeInfo.fontSize);
        txtCubeInfo.setPadding(5, 5, 5, 5);
        txtCubeInfo.setDepth(3);

        //cube01
        cube01 = self.physics.add.sprite(self.gSetting.cubes.cube01.x, self.gSetting.cubes.cube01.y, 'cube01');
        cube01.name = "cube01";


        //cube02
        cube02 = self.physics.add.sprite(self.gSetting.cubes.cube02.x, self.gSetting.cubes.cube02.y, 'cube02');
        cube02.name = "cube02";


        //cube03
        cube03 = self.physics.add.sprite(self.gSetting.cubes.cube03.x, self.gSetting.cubes.cube03.y, 'cube03');
        cube03.name = "cube03";


        //cube04
        self.cube04 = self.physics.add.sprite(self.gSetting.cubes.cube04.x, self.gSetting.cubes.cube04.y, 'cube04');
        self.cube04.name = "cube04";


        self.arrCubes.push(cube01);
        self.arrCubes.push(cube02);
        self.arrCubes.push(cube03);
        self.arrCubes.push(self.cube04);
        self.arrCubes.forEach(function (cube) {

            cube.setBounce(0);
            cube.setDepth(-2);
            cube.setCollideWorldBounds(true);

            self.physics.add.collider(cube, platforms);
            self.physics.add.collider(cube, self.weigh, weight_event, null, self);
            self.physics.add.collider(cube, self.box_down_side, boxDownSide_event, null, self);
            cube.setInteractive();
            self.input.setDraggable(cube);


            cube.on('pointerover', function (pointer, locX, locY) {
                display_cube_tips(true, cube.name, pointer);
                display_warning_dialog(cube);
            });

            cube.on('pointerout', function (pointer, locX, locY) {
                display_cube_tips(false, cube.name, pointer);
            });
        });


        //水
        //self.rect_water = this.add.rectangle(700, 590, 367, 157, 0xd4f1f9);
        self.rect_water = this.add.rectangle(self.gSetting.water.x, self.gSetting.water.y, self.gSetting.water.width, self.gSetting.water.height, self.gSetting.water.color);
        self.rect_water.alpha = 0.8;
        self.rect_water.setDepth(-1);

        //尺規水
        self.rect_water_ruler = this.add.rectangle(self.gSetting.water_ruler.x, self.gSetting.water_ruler.y, self.gSetting.water_ruler.width, self.gSetting.water_ruler.height, self.gSetting.water_ruler.color);
        self.rect_water_ruler.alpha = 0.8;
        


        //drag start event
        self.input.on('drag', function (pointer, gameObject, dragX, dragY) {

            self.isDragging = true;
            
            update_ruler_detail_pic();

            this.systems.game.input.setCursor({ cursor: 'grabbing' });
            if (gameObject.name == 'magnify') {
                
               
                
                lense.x = dragX;
                lense.y = dragY;

                magnify.x = dragX;
                magnify.y = dragY;
            }
            else {
                magnify.setX(1200)
                magnify.setY(600)
                lense.setX(1200)
                lense.setY(600)
                if (gameObject.name == self.isExpertCubeName || self.isExpertCubeName == "") {
                    self.isExpertCubeName = "";
                    self.object_where = self.ObjectWhere.default;
                    //console.log(dragX, dragY);
                    gameObject.setAlpha(0.6);
                    gameObject.body.setAllowGravity(false);
                    gameObject.x = dragX;
                    gameObject.y = dragY;
                    txtCubeInfo.x = pointer.x;
                    txtCubeInfo.y = pointer.y;
                    txtKG.setText("0g");
                    txtKG.x = self.gSetting.txtKG.x;

                }
            }


        });

        //drag end event
        self.input.on('dragend', function (pointer, gameObject) {
            console.log(gameObject.x,gameObject.y)
            self.isDragging = false;            
            if (gameObject.name == 'magnify') {
                lense.x = gameObject.x;
                lense.y = gameObject.y;
                magnify.x = gameObject.x;
                magnify.y = gameObject.y;
                this.systems.game.input.resetCursor({ cursor: 'true' });
            }
            else {

                self.GetBounds(gameObject, self.rect1);
                self.GetBounds(self.weigh, self.rect2);

                //秤子重疊 提升用戶體驗移動座標
                if (self.RectangleToRectangle(self.rect1, self.rect2)) {
                    gameObject.x = 1200;
                    gameObject.y = 150;
                }


                //左邊水缸重疊 提升用戶體驗移動座標
                self.GetBounds(self.box_left_side, self.rect2);

                if (self.RectangleToRectangle(self.rect1, self.rect2)) {
                    gameObject.x = 700;
                    gameObject.y = 300;
                }

                //右邊水缸重疊 提升用戶體驗移動座標
                self.GetBounds(self.box_right_side, self.rect2);

                if (self.RectangleToRectangle(self.rect1, self.rect2)) {
                    gameObject.x = 700;
                    gameObject.y = 300;
                }


                //底部水缸重疊 提升用戶體驗移動座標
                self.GetBounds(self.box_down_side, self.rect2);

                if (self.RectangleToRectangle(self.rect1, self.rect2)) {
                    gameObject.x = 700;
                    gameObject.y = 590;
                }

                //超過這個座標，就判定有物件在右邊                
                if (gameObject.x > 554) {
                    self.isExpertCubeName = gameObject.name;

                    self.arrCubes.forEach(function (cube) {
                        (cube.name == gameObject.name) ? cube.input.draggable = true : cube.input.draggable = false;
                        (cube.name == gameObject.name) ? cube.alpha = 1 : cube.alpha = 0.2;
                    });

                }
                else {
                    self.isExpertCubeName = '';

                    self.arrCubes.forEach(function (cube) {
                        cube.input.draggable = true;
                        cube.alpha = 1;
                    });
                }

                if (gameObject.name == 'cube04') {


                    //因為有做動畫所以要特別判斷是否在水的區段
                    if (gameObject.x > 588 && gameObject.x < 813) {

                        if(gameObject.y >=290 && gameObject.y <= 500)
                        {
                            gameObject.x = 700;
                            gameObject.y = 200;
                        }
                        
                        self.object_where = self.ObjectWhere.water;

                        self.cube04.body.setAllowGravity(false);
                        self.cube04.body.stop();//這行一定要加，不然cube會一直偷偷往上漂
                        self.cube04.input.draggable = false;
                        self.sys.tweens.add({
                            //this.systems.game.scene.scenes[0].tweens.add({
                            targets: self.cube04,
                            y: 485,
                            duration: 1500,
                            ease: 'Back',
                            easeParams: [2],
                            delay: 100,
                            onComplete: function () {
                                self.cube04.input.draggable = true;
                                self.sys.tweens.killTweensOf(self.cube04);
                                self.sys.tweens.killAll();
                            }


                        });

                        //this.systems.game.scene.scenes[0].tweens.killAll();

                    }
                    else {
                        self.object_where = self.ObjectWhere.default;
                        gameObject.body.setAllowGravity(true);
                    }
                }
                else {
                    gameObject.body.setAllowGravity(true);
                }

                this.systems.game.input.resetCursor({ cursor: 'true' });
                gameObject.clearAlpha();

                if (self.isDisplayTips == false) {
                    update_water_info(gameObject);
                }


            }

            update_ruler_detail_pic();

        });

        function isIPadDevice() {
            if (/Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                return true;
            }
            else {
                return false;
            }
        }

        function display_cube_tips(isShow = false, cube_name, pointer) {
            var text = "";
            switch (cube_name) {
                case "cube01":
                    text = '木塊';
                    break;
                case "cube02":
                    text = '磚塊';
                    break;
                case "cube03":
                    text = '鐵塊';
                    break;
                case "cube04":
                    text = '塑膠塊';
                    break;
            }


            if (isShow == true) {
                txtCubeInfo.setText(text);
                txtCubeInfo.x = pointer.x;
                txtCubeInfo.y = pointer.y;




            }
            else {
                txtCubeInfo.setText('');
                txtCubeInfo.x = 0;
                txtCubeInfo.y = 0;
            }


        };

        function reset_game() {

            self.registry.destroy(); // destroy registry
            self.events.off(); // disable all active events
            self.scene.restart(); // restart current scene

            self.arrCubes.forEach(function (cube) {
                cube.x = self.gSetting["cubes"][cube.name].x;
                cube.y = self.gSetting["cubes"][cube.name].y;
                cube.body.setAllowGravity(true);
            });
            self.arrCubes = [];
            self.isExpertCubeName = '';
            self.object_where = self.ObjectWhere.default;
            txtKG.setText('0g');
            txtKG.x = self.gSetting.txtKG.x;
            self.rect_water.y = self.gSetting.water.y;
            self.rect_water_ruler.y = self.gSetting.water_ruler.y;

        }


        function display_warning_dialog(cube) {

            if (self.isExpertCubeName != cube.name && self.isExpertCubeName != '') {
                self.isDisplayTips = true;
                txtOpTips.setText("請先將物體移動回架上");
                btnReset.visible = true;

            }
            else {
                self.isDisplayTips = false;
                txtOpTips.setText("");
                btnReset.visible = false;
            }

        }

        function update_ruler_detail_pic(){
            if(self.object_where == self.ObjectWhere.water)
            {                    
                console.log('in water')
                if(self.isExpertCubeName == '')
                {
                    self.pic2.visible = true;
                    self.pic3.visible = false;
                    self.pic4.visible = false;
                }                
                else if(self.isExpertCubeName == 'cube01' || self.isExpertCubeName == 'cube02' || self.isExpertCubeName == 'cube03') {
                    self.pic2.visible = false;
                    self.pic3.visible = true;                    
                    self.pic4.visible = false;                    
                }
                else if(self.isExpertCubeName == 'cube04') {
                    self.pic2.visible = false;
                    self.pic3.visible = false;                    
                    self.pic4.visible = true;         
                }
            }
            else {
                console.log('not in water')
                self.pic2.visible = true;
                self.pic3.visible = false;
                self.pic4.visible = false;
            }
        }


        function update_water_info(cube) {

            if (self.object_where == self.ObjectWhere.water) {
                return;
            }

            self.GetBounds(self.rect_water, self.rect1);
            self.GetBounds(cube, self.rect2);


            if (cube.name == 'cube04') {

                if ((cube.x < 588 || cube.x > 813) && self.isDisplayTips == false) {

                    self.object_where = self.ObjectWhere.default;



                    self.tweens.add({

                        targets: [self.rect_water, self.rect_water_ruler],
                        y: self.gSetting.water.y,
                        ease: 'Power2',
                        duration: 500,
                        onComplete: self.onCompleteHandler,
                    });

                }
            }
            else if (self.RectangleToRectangle(self.rect1, self.rect2)) {

                self.object_where = self.ObjectWhere.water;


                if (self.rect_water.y == self.gSetting.water.y) {

                    self.tweens.add({
                        targets: [self.rect_water, self.rect_water_ruler],
                        y: self.add_water_height(self, self.gSetting["cubes"][cube.name].water_height),
                        ease: 'Power2',
                        duration: 500,
                        onComplete: self.onCompleteHandler,
                    });

                }

            }
            else {
                self.object_where = self.ObjectWhere.default;


                self.tweens.add({

                    targets: [self.rect_water, self.rect_water_ruler],
                    y: self.gSetting.water.y,
                    ease: 'Power2',
                    duration: 500,
                    onComplete: self.onCompleteHandler,
                });

            }

        }



        function weight_event(cube, b) {

            //console.log(cube.y);
            let cube_touch_y = 187;

            if (parseInt(cube.y) == cube_touch_y) {
                self.object_where = self.ObjectWhere.weight;
                self.isExpertCubeName = cube.name;
                txtKG.setText(self.gSetting["cubes"][cube.name].weight);
                txtKG.x = self.gSetting.txtKG.x - 30;
            }
            else {
                self.object_where = self.ObjectWhere.default;
                self.isExpertCubeName = "";
                txtKG.x = self.gSetting.txtKG.x;
            }

        }

        function boxDownSide_event(cube, b) {
            if (self.isDragging == false) {
                update_water_info(cube);
            }

        }


    }

    update() {

        //this.txtSys.setText(`${window.screen.width} x ${window.screen.height}`);
        //this.txtSys.setText(this.isExpertCubeName);

        //console.log('update isExpertCubeName:', this.isExpertCubeName)
        if (this.isExpertCubeName == 'cube04') {

            this.GetBounds(this.rect_water, this.rect1);
            this.GetBounds(this.cube04, this.rect2);

            if (this.RectangleToRectangle(this.rect1, this.rect2)) {

                if (this.rect_water.y == this.gSetting.water.y) {

                    this.object_where = this.ObjectWhere.water;

                    this.isExpertCubeName = this.cube04.name;

                    this.tweens.add({

                        targets: [this.rect_water, this.rect_water_ruler],
                        y: this.add_water_height(this, this.gSetting["cubes"]['cube04'].water_height),
                        ease: 'Power2',
                        duration: 500,
                        onComplete: this.onCompleteHandler,
                    });


                    //console.log('update RectangleToRectangle');
                }

            }
        }

    }




}