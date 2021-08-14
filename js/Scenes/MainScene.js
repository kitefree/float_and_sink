
import { TabletConfig } from '../DeviceConfig/Tablet.js';
import { DesktopConfig } from '../DeviceConfig/Desktop.js';

export default class MainScene extends Phaser.Scene {

    cube04 = null;
    rect1 = null;
    rect2 = null;
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

    add_water_height = (self, add_h) => {
        return self.gSetting.water.y - add_h;
    }

    onCompleteHandler = (tween, targets, myImage) => {
        //console.log('onCompleteHandler');

        tween.parent.killTweensOf(self.rect_water);
        tween.parent.killTweensOf(self.rect_water_ruler);
    }

    constructor() {
        super({ key: 'MainScene' })
    }

    preload() {

        this.load.image('btnReset', 'assets/reset.png');
        //this.load.image('cube', 'assets/cube.png');
        this.load.image('cube_template', 'assets/cube01.png');
        //this.load.spritesheet('cube01', 'assets/cube01.png', { frameWidth: 144, frameHeight: 121 });
        //this.load.spritesheet('cube02', 'assets/cube02.png', { frameWidth: 123, frameHeight: 141 });
        this.load.image('ground', 'assets/platform.png');
        this.load.image('x_line', 'assets/x_line.png');
        this.load.image('y_line', 'assets/y_line.png');
        this.load.image('weigh', 'assets/weigh.png');
        this.load.image('ruler', 'assets/ruler.png');
        this.load.image('ruler_detail', 'assets/ruler_detail.png');
        this.load.image('magnify-out', 'assets/outside.png');
        this.load.image('magnify-in', 'assets/inside.png');
        this.load.image('restart', 'assets/restart.png');


        //this.load.spritesheet('www', 'assets/www.png', { frameWidth: 100, frameHeight: 20 });
    }

    create() {

        var self = this;

        self.gSetting = (isIPadDevice() == true) ? TabletConfig : DesktopConfig;
        var platforms;
        var cube01;
        var cube02;
        var cube03;

        var weigh;
        var txtKG;
        var txtOpTips;
        var txtCubeInfo;
        var box_down_side;


        self.RectangleToRectangle = Phaser.Geom.Intersects.RectangleToRectangle;
        self.GetBounds = Phaser.Display.Bounds.GetBounds;
        self.Rectangle = Phaser.Geom.Rectangle;
        self.rect1 = new self.Rectangle();
        self.rect2 = new self.Rectangle();
        var btnReset;
        window.txtSys;
        var btnRestart;

        btnRestart = this.physics.add.staticSprite(1450, 50, 'restart').setScale(.4,.4).setInteractive();
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
        platforms.create(self.gSetting.waterBox.left.x, self.gSetting.waterBox.left.y, 'y_line');

        //容器底部
        box_down_side = self.physics.add.sprite(self.gSetting.waterBox.bottom.x, self.gSetting.waterBox.bottom.y, 'x_line');
        box_down_side.setBounce(0.2);
        box_down_side.setCollideWorldBounds(true);
        self.physics.add.collider(box_down_side, platforms);

        //容器右邊
        platforms.create(self.gSetting.waterBox.right.x, self.gSetting.waterBox.right.y, 'y_line');

        //尺規
        platforms.create(self.gSetting.ruler.x, self.gSetting.ruler.y, 'ruler');//尺


        const pic = self.add.image(self.gSetting.rulerDetail.x, self.gSetting.rulerDetail.y, 'ruler_detail').setScale(self.gSetting.rulerDetail.scale);

        const lense = self.make.sprite({
            x: 400,
            y: 300,
            key: 'magnify-in',
            add: false
        });
        lense.name = 'lense';
        pic.mask = new Phaser.Display.Masks.BitmapMask(self, lense);

        const magnify = self.add.image(1200, 600, 'magnify-out').setInteractive();
        magnify.name = 'magnify';
        self.input.setDraggable(magnify);



        //秤重器
        weigh = self.physics.add.sprite(self.gSetting.weigh.x, self.gSetting.weigh.y, 'weigh');
        weigh.setBounce(0.2);
        weigh.setCollideWorldBounds(true);
        this.physics.add.collider(weigh, platforms);

        window.txtSys = this.add.text(10, 10, `${window.screen.width} x ${window.screen.height}`);
        window.txtSys.setFontSize('24px');
        window.txtSys.setPadding(5, 5, 5, 5);

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


        //weigh.setInteractive();
        //this.input.setDraggable(weigh);

        //碰撞邊緣設定
        //weigh.body.checkCollision.up = false;
        //weigh.body.checkCollision.down = false;
        //weigh.body.checkCollision.left = false;
        //weigh.body.checkCollision.right = false;

        //cube01
        cube01 = self.physics.add.sprite(self.gSetting.cubes.cube01.x, self.gSetting.cubes.cube01.y, 'cube_template');
        cube01.setBounce(0);
        cube01.setDepth(-2);
        cube01.setCollideWorldBounds(true);
        cube01.name = "cube01";
        self.physics.add.collider(cube01, platforms);
        self.physics.add.collider(cube01, weigh, weight_event, null, self);
        self.physics.add.collider(cube01, box_down_side, boxDownSide_event, null, self);
        cube01.setInteractive();
        self.input.setDraggable(cube01);


        //cube02
        cube02 = self.physics.add.sprite(self.gSetting.cubes.cube02.x, self.gSetting.cubes.cube02.y, 'cube_template');
        cube02.setBounce(0);
        cube02.setDepth(-2);
        cube02.setCollideWorldBounds(true);
        cube02.name = "cube02";
        self.physics.add.collider(cube02, platforms);
        self.physics.add.collider(cube02, weigh, weight_event, null, self);
        self.physics.add.collider(cube02, box_down_side, boxDownSide_event, null, self);
        cube02.setInteractive();
        self.input.setDraggable(cube02);

        //cube03
        cube03 = self.physics.add.sprite(self.gSetting.cubes.cube03.x, self.gSetting.cubes.cube03.y, 'cube_template');
        cube03.setBounce(0);
        cube03.setDepth(-2);
        cube03.setCollideWorldBounds(true);
        cube03.name = "cube03";
        self.physics.add.collider(cube03, platforms);
        self.physics.add.collider(cube03, weigh, weight_event, null, self);
        self.physics.add.collider(cube03, box_down_side, boxDownSide_event, null, self);
        cube03.setInteractive();
        self.input.setDraggable(cube03);

        //cube04
        self.cube04 = self.physics.add.sprite(self.gSetting.cubes.cube04.x, self.gSetting.cubes.cube04.y, 'cube_template');
        self.cube04.setBounce(0);
        self.cube04.setDepth(-2);
        self.cube04.setCollideWorldBounds(true);
        self.cube04.name = "cube04";
        self.physics.add.collider(self.cube04, platforms);
        self.physics.add.collider(self.cube04, weigh, weight_event, null, self);
        self.physics.add.collider(self.cube04, box_down_side, boxDownSide_event, null, self);
        self.cube04.setInteractive();
        self.input.setDraggable(self.cube04);

        cube01.on('pointerover', function (pointer, locX, locY) {
            var self = this;
            display_cube_tips(true, self.name, pointer);

        });

        cube01.on('pointerout', function (pointer, locX, locY) {
            var self = this;
            display_cube_tips(false, self.name, pointer);
        });

        cube02.on('pointerover', function (pointer, locX, locY) {
            var self = this;
            display_cube_tips(true, self.name, pointer);
        });

        cube02.on('pointerout', function (pointer, locX, locY) {
            var self = this;
            display_cube_tips(false, self.name, pointer);
        });

        cube03.on('pointerover', function (pointer, locX, locY) {
            var self = this;
            display_cube_tips(true, self.name, pointer);
        });

        cube03.on('pointerout', function (pointer, locX, locY) {
            var self = this;
            display_cube_tips(false, self.name, pointer);
        });

        self.cube04.on('pointerover', function (pointer, locX, locY) {
            var self = this;
            display_cube_tips(true, self.name, pointer);
        });

        self.cube04.on('pointerout', function (pointer, locX, locY) {
            var self = this;
            display_cube_tips(false, self.name, pointer);
        });


        //water
        //self.rect_water = this.add.rectangle(700, 590, 367, 157, 0xd4f1f9);
        self.rect_water = this.add.rectangle(self.gSetting.water.x, self.gSetting.water.y, self.gSetting.water.width, self.gSetting.water.height, self.gSetting.water.color);
        self.rect_water.alpha = 0.5;
        self.rect_water.setDepth(-1);


        self.rect_water_ruler = this.add.rectangle(self.gSetting.water_ruler.x, self.gSetting.water_ruler.y, self.gSetting.water_ruler.width, self.gSetting.water_ruler.height, self.gSetting.water_ruler.color);
        self.rect_water_ruler.alpha = 0.5;
        self.rect_water_ruler.setDepth(2);

        // cube.scene.game.scene.scenes[0].tweens.add({
        //     targets: self.rect_water,                            
        //     ease: 'Quintic.easeInOut',
        //     duration: 1500,

        //     repeat: -1,
        //     onUpdate: function ()
        //     {
        //         self.rect_water.y = 550;
        //     }
        // });



        //drag start event
        self.input.on('drag', function (pointer, gameObject, dragX, dragY) {


            this.systems.game.input.setCursor({ cursor: 'grabbing' });
            if (gameObject.name == 'magnify') {
                lense.x = dragX;
                lense.y = dragY;

                magnify.x = dragX;
                magnify.y = dragY;
            }
            else {

                if (gameObject.name == self.isExpertCubeName || self.isExpertCubeName == "") {
                    self.isExpertCubeName = "";
                    self.object_where = self.ObjectWhere.default;
                    //console.log(dragX, dragY);
                    gameObject.setAlpha(0.5);
                    gameObject.body.setAllowGravity(false);
                    gameObject.x = dragX;
                    gameObject.y = dragY;
                    txtCubeInfo.x = pointer.x;
                    txtCubeInfo.y = pointer.y;
                    txtKG.setText("0g");
                    txtKG.x = self.gSetting.txtKG.x;
                    display_tips(false);
                }
                else { 
                    display_tips(true);
                }
            }


        });

        //drag end event
        self.input.on('dragend', function (pointer, gameObject, dragX, dragY) {
            console.log(gameObject.x)
            console.log(gameObject.y)

            if (gameObject.name == 'magnify') {
                lense.x = pointer.x;
                lense.y = pointer.y;
                magnify.x = pointer.x;
                magnify.y = pointer.y;
                this.systems.game.input.resetCursor({ cursor: 'true' });
            }
            else {

                //提升體驗 秤重左、右邊邊框座標
                if (gameObject.x > 1120 && gameObject.x < 1270 && gameObject.y > 217 && gameObject.y < 317) {
                    gameObject.x = 1200;
                    gameObject.y = 150;
                }


                //提升體驗 水缸左、右邊邊框座標
                if (gameObject.x > 515 && gameObject.x < 570) {
                    gameObject.x = 700;
                }
                else if (gameObject.x > 840 && gameObject.x < 950) {
                    gameObject.x = 700;
                }

                if (gameObject.name == 'cube04') {

                    //在水缸有效範圍內
                    //實際水缸的起點、結束座標
                    if (gameObject.x > 588 && gameObject.x < 813) {

                        self.isExpertCubeName = gameObject.name;
                        self.object_where = self.ObjectWhere.water;
                        
                        self.cube04.body.setAllowGravity(false);
                        self.cube04.input.draggable = false;
                        self.sys.tweens.add({
                            //this.systems.game.scene.scenes[0].tweens.add({
                            targets: self.cube04,
                            y: 530,
                            duration: 1500,
                            ease: 'Back',
                            easeParams: [2.5],
                            delay: 8,
                            onComplete:function(){self.cube04.input.draggable = true;}
                        });
                        self.sys.tweens.killAll();
                        //this.systems.game.scene.scenes[0].tweens.killAll();
              
                    }
                    else {
                        console.log('cub04 clear isExpertCubeName');
                        self.isExpertCubeName = '';
                        self.object_where = self.ObjectWhere.default;
                        gameObject.body.setAllowGravity(true);
                    }
                }
                else {
                    gameObject.body.setAllowGravity(true);
                }


                if(self.isExpertCubeName == '')
                {
                    cube01.input.draggable = true;
                    cube02.input.draggable = true;
                    cube03.input.draggable = true;
                    self.cube04.input.draggable = true;
                }
                else if(gameObject.name == 'cube04')
                {
                    cube01.input.draggable = true;
                    cube02.input.draggable = true;
                    cube03.input.draggable = true;
                }

                this.systems.game.input.resetCursor({ cursor: 'true' });
                gameObject.clearAlpha();
                
                if(self.isDisplayTips == false)
                {
                    update_water_info(gameObject);
                }
                

            }

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
                    text = 'cube01木塊';
                    break;
                case "cube02":
                    text = 'cube02磚塊';
                    break;
                case "cube03":
                    text = 'cube03鐵塊';
                    break;
                case "cube04":
                    text = 'cube04塑膠塊';
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

            cube01.x = self.gSetting.cubes.cube01.x; cube01.y = self.gSetting.cubes.cube01.y;
            cube02.x = self.gSetting.cubes.cube02.x; cube02.y = self.gSetting.cubes.cube02.y;
            cube03.x = self.gSetting.cubes.cube03.x; cube03.y = self.gSetting.cubes.cube03.y;
            self.cube04.x = self.gSetting.cubes.cube04.x; self.cube04.y = self.gSetting.cubes.cube04.y;
            cube01.body.setAllowGravity(true);
            cube02.body.setAllowGravity(true);
            cube03.body.setAllowGravity(true);
            self.cube04.body.setAllowGravity(true);
            self.isExpertCubeName = '';
            self.object_where = self.ObjectWhere.default;
            txtKG.setText('0g');
            txtKG.x = self.gSetting.txtKG.x;
            self.rect_water.y = self.gSetting.water.y;
            self.rect_water_ruler.y = self.gSetting.water_ruler.y;
            display_tips(false);
            //cube01 = this.physics.add.sprite(100, 250, 'cube01');
            //cube02 = this.physics.add.sprite(300, 250, 'cube02');
        }


        function display_tips(isShow = false) {
            self.isDisplayTips = isShow;
            if (isShow == true) {
                if(cube01.name != self.isExpertCubeName)
                {
                    cube01.input.draggable = false;
                }
                else {
                    cube01.input.draggable = true;
                }

                if(cube02.name != self.isExpertCubeName)
                {
                    cube02.input.draggable = false;
                }
                else {
                    cube02.input.draggable = true;
                }

                if(cube03.name != self.isExpertCubeName)
                {
                    cube03.input.draggable = false;
                }
                else {
                    cube03.input.draggable = true;
                }

                if(self.cube04.name != self.isExpertCubeName)
                {
                    self.cube04.input.draggable = false;
                }
                else {
                    self.cube04.input.draggable = true;
                }


                txtOpTips.setText("請先將物體移動回架上");
                btnReset.visible = true;

            }
            else {
                txtOpTips.setText("");
                btnReset.visible = false;
            }

        }



        function update_water_info(cube) {
            console.log('update_water_info be:',self.object_where);
            if (self.object_where == self.ObjectWhere.water) {
                console.log(' update_water_info isExpertCubeName :',cube.name);
                self.isExpertCubeName = cube.name;
                return;
            }
            console.log('update_water_info af 1:',self.object_where);
            if (cube.name == 'cube01') {
                self.GetBounds(cube01, self.rect1);
                self.GetBounds(self.rect_water, self.rect2);

                if (self.RectangleToRectangle(self.rect1, self.rect2)) {

                    self.object_where = self.ObjectWhere.water;
                    self.isExpertCubeName = cube.name;

                    if (self.rect_water.y == self.gSetting.water.y) {

                        self.tweens.add({

                            targets: [self.rect_water, self.rect_water_ruler],
                            y: self.add_water_height(self, 50),
                            ease: 'Power2',
                            duration: 500,
                            onComplete: self.onCompleteHandler,
                        });

                    }

                }
                else {
                    
                    self.object_where = self.ObjectWhere.default;
                    self.isExpertCubeName = '';
                    console.log('cube01 clear isExpertCubeName');

                    self.tweens.add({

                        targets: [self.rect_water, self.rect_water_ruler],
                        y: self.gSetting.water.y,
                        ease: 'Power2',
                        duration: 500,
                        onComplete: self.onCompleteHandler,
                    });

                }
            }
            else if (cube.name == 'cube02') {
                self.GetBounds(cube02, self.rect1);
                self.GetBounds(self.rect_water, self.rect2);

                if (self.RectangleToRectangle(self.rect1, self.rect2)) {

                    self.object_where = self.ObjectWhere.water;
                    self.isExpertCubeName = cube.name;

                    if (self.rect_water.y == self.gSetting.water.y) {

                        self.tweens.add({

                            targets: [self.rect_water, self.rect_water_ruler],
                            y: self.add_water_height(self, 50),
                            ease: 'Power2',
                            duration: 500,
                            onComplete: self.onCompleteHandler,
                        });

                    }

                }
                else {

                    self.object_where = self.ObjectWhere.default;
                    self.isExpertCubeName = '';

                    self.tweens.add({

                        targets: [self.rect_water, self.rect_water_ruler],
                        y: self.gSetting.water.y,
                        ease: 'Power2',
                        duration: 500,
                        onComplete: self.onCompleteHandler,
                    });

                }
            }
            else if (cube.name == 'cube03') {
                self.GetBounds(cube03, self.rect1);
                self.GetBounds(self.rect_water, self.rect2);

                if (self.RectangleToRectangle(self.rect1, self.rect2)) {

                    self.object_where = self.ObjectWhere.water;
                    self.isExpertCubeName = cube.name;

                    if (self.rect_water.y == self.gSetting.water.y) {


                        self.tweens.add({

                            targets: [self.rect_water, self.rect_water_ruler],
                            y: self.add_water_height(self, 50),
                            ease: 'Power2',
                            duration: 500,
                            onComplete: self.onCompleteHandler,
                        });

                    }

                }
                else {

                    self.object_where = self.ObjectWhere.default;
                    self.isExpertCubeName = '';

                    self.tweens.add({

                        targets: [self.rect_water, self.rect_water_ruler],
                        y: self.gSetting.water.y,
                        ease: 'Power2',
                        duration: 500,
                        onComplete: self.onCompleteHandler,
                    });

                }
            }
            else if (cube.name == 'cube04') {

                if ((cube.x < 588 || cube.x > 813) && self.isDisplayTips == false) {

                    self.object_where = self.ObjectWhere.default;
                    self.isExpertCubeName = '';
                    console.log('cube04 clear 2 isExpertCubeName');

                    self.tweens.add({

                        targets: [self.rect_water, self.rect_water_ruler],
                        y: self.gSetting.water.y,
                        ease: 'Power2',
                        duration: 500,
                        onComplete: self.onCompleteHandler,
                    });

                }
            }



        }



        function weight_event(cube, b) {

            //console.log(cube.y);
            let cube_touch_y = 204;
            if (cube === cube01) {
                if (parseInt(cube.y) == cube_touch_y) {
                    self.object_where = self.ObjectWhere.weight;
                    self.isExpertCubeName = cube.name;
                    txtKG.setText("140g");
                    txtKG.x = self.gSetting.txtKG.x - 30;
                }
            }
            else if (cube === cube02) {
                if (parseInt(cube.y) == cube_touch_y) {
                    self.object_where = self.ObjectWhere.weight;
                    self.isExpertCubeName = cube.name;
                    txtKG.setText("240g");
                    txtKG.x = self.gSetting.txtKG.x - 30;
                }
            }
            else if (cube === cube03) {
                if (parseInt(cube.y) == cube_touch_y) {
                    self.object_where = self.ObjectWhere.weight;
                    self.isExpertCubeName = cube.name;
                    txtKG.setText("980g");
                    txtKG.x = self.gSetting.txtKG.x - 30;
                }
            }
            else if (cube === self.cube04) {
                if (parseInt(cube.y) == cube_touch_y) {
                    self.object_where = self.ObjectWhere.weight;
                    self.isExpertCubeName = cube.name;
                    txtKG.setText("100g");
                    txtKG.x = self.gSetting.txtKG.x - 30;
                }
            }
            else {
                self.object_where = self.ObjectWhere.default;
                self.isExpertCubeName = "";
                txtKG.x = self.gSetting.txtKG.x;
            }

        }

        function boxDownSide_event(cube, b) {

            update_water_info(cube);
        }


    }

    update() {

        window.txtSys.setText(`${window.screen.width} x ${window.screen.height}`);
        window.txtSys.setText(this.isExpertCubeName);
        
        //console.log('update isExpertCubeName:', this.isExpertCubeName)
        if (this.isExpertCubeName == 'cube04') {


            //this.object_where == this.ObjectWhere.water

            this.GetBounds(this.cube04, this.rect1);
            this.GetBounds(this.rect_water, this.rect2);

            if (this.RectangleToRectangle(this.rect1, this.rect2)) {

                if (this.rect_water.y == this.gSetting.water.y) {

                    this.object_where = this.ObjectWhere.water;

                    this.isExpertCubeName = this.cube04.name;

                    this.tweens.add({

                        targets: [this.rect_water, this.rect_water_ruler],
                        y: this.add_water_height(this, 10),
                        ease: 'Power2',
                        duration: 500,
                        onComplete: this.onCompleteHandler,
                    });

                    
                    //console.log('update RectangleToRectangle');
                }

            }
            // else {

            //     this.object_where = this.ObjectWhere.default;


            //     this.tweens.add({

            //         targets: [this.rect_water,this.rect_water_ruler],
            //         y: this.gSetting.water.y,
            //         ease: 'Power2',
            //         duration: 500,
            //         onComplete: this.onCompleteHandler,
            //     });

            // }
        }

    }




}