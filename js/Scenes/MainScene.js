
import { TabletConfig } from '../DeviceConfig/Tablet.js';
import { DesktopConfig } from '../DeviceConfig/Desktop.js';

export default class MainScene extends Phaser.Scene {

    constructor() {
        super({ key: 'MainScene' })
    }
    preload() {

        this.load.image('btnReset', 'assets/reset.png');
        //this.load.image('cube', 'assets/cube.png');
        this.load.spritesheet('cube_template', 'assets/cube01.png', { frameWidth: 144, frameHeight: 121 });
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
    }
    create() {

        let gSetting = (isIPadDevice() == true) ? TabletConfig : DesktopConfig;
        var platforms;
        var cube01;
        var cube02;
        var cube03;
        var cube04;
        var weigh;
        var txtKG;
        var txtOpTips;
        var txtCubeInfo;
        var rect_water;
        var box_down_side;
        var isOnWeighName = "";
        var self = this;

        const ObjectWhere = Object.freeze({ "default": 1, "water": 2, "weight": 3 });
        var object_where = ObjectWhere.default;
        const RectangleToRectangle = Phaser.Geom.Intersects.RectangleToRectangle;
        const GetBounds = Phaser.Display.Bounds.GetBounds;
        const Rectangle = Phaser.Geom.Rectangle;        
        var rect1 = new Rectangle();
        var rect2 = new Rectangle();
        var overlap = new Rectangle();
        var btnReset;
        var animate_04;
        var catch_magnify = false;

        //重玩
        btnReset = this.add.image(gSetting.btnReset.x, gSetting.btnReset.y, 'btnReset').setInteractive();
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
        platforms.create(gSetting.platform.platform1.x, gSetting.platform.platform1.y, 'ground');
        platforms.create(gSetting.platform.platform2.x, gSetting.platform.platform2.y, 'ground');
        platforms.create(gSetting.platform.platform3.x, gSetting.platform.platform3.y, 'ground');

        //容器左邊
        platforms.create(gSetting.waterBox.left.x, gSetting.waterBox.left.y, 'y_line');

        //容器底部
        box_down_side = self.physics.add.sprite(gSetting.waterBox.bottom.x, gSetting.waterBox.bottom.y, 'x_line');
        box_down_side.setBounce(0.2);
        box_down_side.setCollideWorldBounds(true);
        self.physics.add.collider(box_down_side, platforms);

        //容器右邊
        platforms.create(gSetting.waterBox.right.x, gSetting.waterBox.right.y, 'y_line');

        //尺規
        platforms.create(gSetting.ruler.x, gSetting.ruler.y, 'ruler');//尺


        const pic = self.add.image(gSetting.rulerDetail.x, gSetting.rulerDetail.y, 'ruler_detail').setScale(gSetting.rulerDetail.scale);

        const lense = self.make.sprite({
            x: 400,
            y: 300,
            key: 'magnify-in',
            add: false
        });

        pic.mask = new Phaser.Display.Masks.BitmapMask(self, lense);

        const magnify = self.add.image(1200, 600, 'magnify-out').setInteractive();

        event_reg();


        function event_reg()
        {
            magnify.on('pointerdown', function () {
                catch_magnify = !catch_magnify;
    
            });
            
            self.input.on('pointermove', function (pointer) {
                if (catch_magnify == true) {
                    lense.x = pointer.x;
                    lense.y = pointer.y;
    
                    magnify.x = pointer.x;
                    magnify.y = pointer.y;
                }
    
    
            });
        }

        //秤重器
        weigh = self.physics.add.sprite(gSetting.weigh.x, gSetting.weigh.y, 'weigh');
        weigh.setBounce(0.2);
        weigh.setCollideWorldBounds(true);
        this.physics.add.collider(weigh, platforms);



        //txtKG
        txtKG = self.add.text(gSetting.txtKG.x, gSetting.txtKG.y, gSetting.txtKG.defaultText);
        txtKG.setFontSize(gSetting.txtKG.fontSize);
        txtKG.setPadding(5, 5, 5, 5);


        //txtOpTips
        txtOpTips = self.add.text(gSetting.txtOpTips.x, gSetting.txtOpTips.y, gSetting.txtOpTips.defaultText);
        txtOpTips.setFontSize(gSetting.txtOpTips.fontSize);
        txtOpTips.setPadding(5, 5, 5, 5);

        //txtCubeInfo
        txtCubeInfo = self.add.text(gSetting.txtCubeInfo.x, gSetting.txtCubeInfo.y, gSetting.txtCubeInfo.defaultText);
        txtCubeInfo.setFontSize(gSetting.txtCubeInfo.fontSize);
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
        cube01 = self.physics.add.sprite(gSetting.cubes.cube01.x, gSetting.cubes.cube01.y, 'cube_template');
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
        cube02 = self.physics.add.sprite(gSetting.cubes.cube02.x, gSetting.cubes.cube02.y, 'cube_template');
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
        cube03 = self.physics.add.sprite(gSetting.cubes.cube03.x, gSetting.cubes.cube03.y, 'cube_template');
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
        cube04 = self.physics.add.sprite(gSetting.cubes.cube04.x, gSetting.cubes.cube04.y, 'cube_template');
        cube04.setBounce(0);
        cube04.setDepth(-2);
        cube04.setCollideWorldBounds(true);
        cube04.name = "cube04";
        self.physics.add.collider(cube04, platforms);
        self.physics.add.collider(cube04, weigh, weight_event, null, self);
        self.physics.add.collider(cube04, box_down_side, boxDownSide_event, null, self);
        cube04.setInteractive();
        self.input.setDraggable(cube04);

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

        cube04.on('pointerover', function (pointer, locX, locY) {
            var self = this;
            display_cube_tips(true, self.name, pointer);
        });

        cube04.on('pointerout', function (pointer, locX, locY) {
            var self = this;
            display_cube_tips(false, self.name, pointer);
        });


        //water
        //rect_water = this.add.rectangle(700, 590, 367, 157, 0xd4f1f9);
        rect_water = this.add.rectangle(gSetting.water.x, gSetting.water.y, gSetting.water.width, gSetting.water.height, gSetting.water.color);
        rect_water.alpha = 0.5;
        rect_water.setDepth(-1);
        // this.tweens.add({

        //     targets: r5,
        //     alpha: 0.2,
        //     yoyo: true,
        //     repeat: -1,
        //     ease: 'Sine.easeInOut'

        // });






        //drag start event
        self.input.on('drag', function (pointer, gameObject, dragX, dragY) {


            this.systems.game.input.setCursor({ cursor: 'grabbing' });
            if (gameObject.name == isOnWeighName || isOnWeighName == "") {
                isOnWeighName = "";
                //console.log(dragX, dragY);
                gameObject.setAlpha(0.5);
                gameObject.body.setAllowGravity(false);
                gameObject.x = dragX;
                gameObject.y = dragY;
                txtCubeInfo.x = pointer.x;
                txtCubeInfo.y = pointer.y;
                txtKG.setText("0g");
                txtKG.x = gSetting.txtKG.x;
                display_tips(false);
            }
            else {
                display_tips(true);
            }

        });

        //drag end event
        self.input.on('dragend', function (pointer, gameObject) {
            console.log(gameObject.x)
            console.log(gameObject.y)

            //水缸起點、結束座標，碰撞邊修正
            if (gameObject.x > 515 && gameObject.x < 570) {
                gameObject.x = 700;
            }
            else if (gameObject.x > 840 && gameObject.x < 950) {
                gameObject.x = 700;
            }

            if (gameObject.name == 'cube04') {

                //實際水的起點、結束座標
                if (gameObject.x > 588 && gameObject.x < 813) {
                    cube04.body.stop();
                    cube04.body.setAllowGravity(false);
                    animate_04 = this.systems.game.scene.scenes[0].tweens.add({
                        targets: cube04,
                        y: 500,
                        duration: 2000,
                        ease: 'Back',
                        easeParams: [2.5],
                        delay: 10,

                    });
                    this.systems.game.scene.scenes[0].tweens.killAll();
                }
                else {
                    gameObject.body.setAllowGravity(true);
                }
            }
            else {
                gameObject.body.setAllowGravity(true);
            }
            this.systems.game.input.resetCursor({ cursor: 'true' });
            gameObject.clearAlpha();
            update_water_info(gameObject);
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
            cube01.x = gSetting.cubes.cube01.x; cube01.y = gSetting.cubes.cube01.y;
            cube02.x = gSetting.cubes.cube02.x; cube02.y = gSetting.cubes.cube02.y;
            cube03.x = gSetting.cubes.cube03.x; cube03.y = gSetting.cubes.cube03.y;
            cube04.x = gSetting.cubes.cube04.x; cube04.y = gSetting.cubes.cube04.y;
            isOnWeighName = '';
            txtKG.setText('0g');
            rect_water.y = gSetting.water.y;
            display_tips(false);
            //cube01 = this.physics.add.sprite(100, 250, 'cube01');
            //cube02 = this.physics.add.sprite(300, 250, 'cube02');
        }


        function display_tips(isShow = false) {
            if (isShow == true) {
                txtOpTips.setText("請先將物體移動回架上");
                btnReset.visible = true;
            }
            else {
                txtOpTips.setText("");
                btnReset.visible = false;
            }

        }
        function update_water_info(cube) {

            if (cube.name == 'cube01') {
                GetBounds(cube01, rect1);
                GetBounds(rect_water, rect2);

                if (RectangleToRectangle(rect1, rect2)) {

                    if (rect_water.y == gSetting.water.y) {
                        isOnWeighName = cube.name;
                        object_where = ObjectWhere.water;
                        rect_water.y = add_water_height(50);                       
                    }

                }
                else {
                    object_where = ObjectWhere.default;
                    rect_water.y = gSetting.water.y;                 
                }
            }
            else if (cube.name == 'cube02') {
                GetBounds(cube02, rect1);
                GetBounds(rect_water, rect2);
                if (RectangleToRectangle(rect1, rect2)) {

                    if (rect_water.y == gSetting.water.y) {
                        isOnWeighName = cube.name;
                        object_where = ObjectWhere.water;
                        rect_water.y = add_water_height(20);                        
                    }
                 
                }
                else {
                    object_where = ObjectWhere.default;
                    rect_water.y = gSetting.water.y;  
                }
            }

        }

        function add_water_height(add_h)
        {
            return gSetting.water.y - add_h;
        }

        function weight_event(cube, b) {

            //console.log(cube.y);
            let cube_touch_y = 204;
            if (cube === cube01) {
                if (parseInt(cube.y) == cube_touch_y) {
                    object_where = ObjectWhere.weight;
                    isOnWeighName = cube.name;
                    txtKG.setText("140g");
                    txtKG.x = gSetting.txtKG.x - 30;
                }
            }
            else if (cube === cube02) {
                if (parseInt(cube.y) == cube_touch_y) {
                    object_where = ObjectWhere.weight;
                    isOnWeighName = cube.name;
                    txtKG.setText("240g");
                    txtKG.x = gSetting.txtKG.x - 30;
                }
            }
            else if (cube === cube03) {
                if (parseInt(cube.y) == cube_touch_y) {
                    object_where = ObjectWhere.weight;
                    isOnWeighName = cube.name;
                    txtKG.setText("980g");
                    txtKG.x = gSetting.txtKG.x - 30;
                }
            }
            else if (cube === cube04) {
                if (parseInt(cube.y) == cube_touch_y) {
                    object_where = ObjectWhere.weight;
                    isOnWeighName = cube.name;
                    txtKG.setText("100g");
                    txtKG.x = gSetting.txtKG.x - 30;
                }
            }                        
            else {
                object_where = ObjectWhere.default;
                isOnWeighName = "";
                txtKG.x = gSetting.txtKG.x;
            }

        }

        function boxDownSide_event(cube, b) {
            update_water_info(cube);
        }


    }





}