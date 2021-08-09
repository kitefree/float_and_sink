
export default class MainScene extends Phaser.Scene {
    
    constructor() {
        super({ key: 'MainScene' })
    }
    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('btn_reset', 'assets/reset.png');

        //this.load.image('cube', 'assets/cube.png');
        this.load.spritesheet('cube_template', 'assets/cube01.png', { frameWidth: 144, frameHeight: 121 });
        //this.load.spritesheet('cube01', 'assets/cube01.png', { frameWidth: 144, frameHeight: 121 });
        //this.load.spritesheet('cube02', 'assets/cube02.png', { frameWidth: 123, frameHeight: 141 });
        this.load.image('ground', 'assets/platform.png');
        this.load.image('x_line', 'assets/x_line.png');
        this.load.image('y_line', 'assets/y_line.png');
        this.load.image('weigh', 'assets/weigh.png');
        this.load.image('container_w', 'assets/container_w.png');
        this.load.image('ruler', 'assets/ruler.png');
        this.load.image('ruler_detail', 'assets/ruler_detail.png');
        this.load.image('ccc', 'assets/hand2.png');

        this.load.image('magnify-out', 'assets/outside.png');
        this.load.image('magnify-in', 'assets/inside.png');
    }
    create() {
        var platforms;
        var cube01;
        var cube02;
        var cube03;
        var cube04;
        var weigh;
        var txt_kg;
        var txt_op_tips;
        var txt_watert_cm;
        var txt_cube_info;
        var rect_water;
        var box_down_side;
        var isOnWeighName = "";
    
        const ObjectWhere = Object.freeze({ "default": 1, "water": 2, "weight": 3 });
        var object_where = ObjectWhere.default;
        const RectangleToRectangle = Phaser.Geom.Intersects.RectangleToRectangle;
        const GetBounds = Phaser.Display.Bounds.GetBounds;
        const Rectangle = Phaser.Geom.Rectangle;
    
        // For recycling
        var rect1 = new Rectangle();
        var rect2 = new Rectangle();
        var overlap = new Rectangle();
    
        var btn_reset;
        var animate_04;

        var catch_magnify = false;
        btn_reset = this.add.image(700, 400, 'btn_reset').setInteractive();
        btn_reset.visible = false;

        btn_reset.on('pointerover', function () {
            this.systems.game.input.setCursor({ cursor: 'pointer' });
        });

        btn_reset.on('pointerout', function () {
            this.systems.game.input.resetCursor({ cursor: 'true' });
        });
        btn_reset.on('pointerdown', function () {
            reset_game();
            this.systems.game.input.resetCursor({ cursor: 'true' });
        });


         platforms = this.physics.add.staticGroup();
        platforms.create(210, 400, 'ground');//物體平台
        platforms.create(210, 650, 'ground');//物體平台
        platforms.create(1300, 400, 'ground');//秤重平台
        platforms.create(500, 650, 'y_line');//容器左邊
        //box_down_side = platforms.create(700, 690, 'x_line');
        box_down_side = this.physics.add.sprite(700, 690, 'x_line');//容器底部
        box_down_side.setBounce(0.2);
        box_down_side.setCollideWorldBounds(true);
        this.physics.add.collider(box_down_side, platforms);

        platforms.create(900, 650, 'y_line');//容器右邊

        //ruler
        platforms.create(955, 590, 'ruler');//尺

        const pic = this.add.image(955, 590, 'ruler_detail').setScale(1.1);

        const lense = this.make.sprite({
            x: 400,
            y: 300,
            key: 'magnify-in',
            add: false
        });

        pic.mask = new Phaser.Display.Masks.BitmapMask(this, lense);

        const magnify = this.add.image(1200, 600, 'magnify-out').setInteractive();


        magnify.on('pointerdown', function () {
            catch_magnify = !catch_magnify;

        });

        this.input.on('pointermove', function (pointer) {
            if (catch_magnify == true) {
                lense.x = pointer.x;
                lense.y = pointer.y;

                magnify.x = pointer.x;
                magnify.y = pointer.y;
            }


        });


        //weigh
        weigh = this.physics.add.sprite(1200, 245, 'weigh');//秤重器
        weigh.setBounce(0.2);
        weigh.setCollideWorldBounds(true);
        this.physics.add.collider(weigh, platforms);



        //txt_kg
        txt_kg = this.add.text(1170, 325, '0g');
        txt_kg.setFontSize("52px");
        txt_kg.setPadding(0, 0, 0, 0);


        //txt_op_tips
        txt_op_tips = this.add.text(500, 300, '');
        txt_op_tips.setFontSize("52px");
        txt_op_tips.setPadding(5, 5, 5, 5);

        //txt_cube_info
        txt_cube_info = this.add.text(0, 0, '');
        txt_cube_info.setFontSize("32px");
        txt_cube_info.setPadding(5, 5, 5, 5);
        txt_cube_info.setDepth(3);

        //txt_watert_cm
        txt_watert_cm = this.add.text(1050, 620, '');
        txt_watert_cm.setFontSize("52px");
        txt_watert_cm.setPadding(5, 5, 5, 5);

        //weigh.setInteractive();
        //this.input.setDraggable(weigh);

        //碰撞邊緣設定
        //weigh.body.checkCollision.up = false;
        //weigh.body.checkCollision.down = false;
        //weigh.body.checkCollision.left = false;
        //weigh.body.checkCollision.right = false;

        //cube01
        cube01 = this.physics.add.sprite(100, 250, 'cube_template');
        cube01.setBounce(0);
        cube01.setDepth(2);
        cube01.setCollideWorldBounds(true);
        cube01.name = "cube01";
        this.physics.add.collider(cube01, platforms);
        this.physics.add.collider(cube01, weigh, weight_event, null, this);
        this.physics.add.collider(cube01, box_down_side, boxDownSide_event, null, this);
        cube01.setInteractive();
        this.input.setDraggable(cube01);


        //cube02
        cube02 = this.physics.add.sprite(300, 250, 'cube_template');
        cube02.setBounce(0);
        cube02.setDepth(2);
        cube02.setCollideWorldBounds(true);
        cube02.name = "cube02";
        this.physics.add.collider(cube02, platforms);
        this.physics.add.collider(cube02, weigh, weight_event, null, this);
        this.physics.add.collider(cube02, box_down_side, boxDownSide_event, null, this);
        cube02.setInteractive();
        this.input.setDraggable(cube02);

        //cube03
        cube03 = this.physics.add.sprite(300, 520, 'cube_template');
        cube03.setBounce(0);
        cube03.setDepth(-2);
        cube03.setCollideWorldBounds(true);
        cube03.name = "cube03";
        this.physics.add.collider(cube03, platforms);
        this.physics.add.collider(cube03, weigh, weight_event, null, this);
        this.physics.add.collider(cube03, box_down_side, boxDownSide_event, null, this);
        cube03.setInteractive();
        this.input.setDraggable(cube03);

        //cube04
        cube04 = this.physics.add.sprite(100, 520, 'cube_template');
        cube04.setBounce(0);
        cube04.setDepth(-2);
        cube04.setCollideWorldBounds(true);
        cube04.name = "cube04";
        this.physics.add.collider(cube04, platforms);
        this.physics.add.collider(cube04, weigh, weight_event, null, this);
        this.physics.add.collider(cube04, box_down_side, boxDownSide_event, null, this);
        cube04.setInteractive();
        this.input.setDraggable(cube04);

        //water
        //rect_water = this.add.rectangle(700, 590, 367, 157, 0xd4f1f9);
        rect_water = this.add.rectangle(700, 600, 370, 150, 0xd4f1f9);
        rect_water.alpha = 0.5;
        rect_water.setDepth(-1);
        // this.tweens.add({

        //     targets: r5,
        //     alpha: 0.2,
        //     yoyo: true,
        //     repeat: -1,
        //     ease: 'Sine.easeInOut'

        // });


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



        //drag start event
        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            

            this.systems.game.input.setCursor({ cursor: 'grabbing' });
            if (gameObject.name == isOnWeighName || isOnWeighName == "") {
                isOnWeighName = "";
                //console.log(dragX, dragY);
                gameObject.setAlpha(0.5);
                gameObject.body.setAllowGravity(false);
                gameObject.x = dragX;
                gameObject.y = dragY;
                txt_cube_info.x = pointer.x;
                txt_cube_info.y = pointer.y;
                txt_kg.setText("0g");
                display_tips(false);
            }
            else {
                display_tips(true);
            }

        });

        //drag end event
        this.input.on('dragend', function (pointer, gameObject) {
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
                txt_cube_info.setText(text);
                txt_cube_info.x = pointer.x;
                txt_cube_info.y = pointer.y;
            }
            else {
                txt_cube_info.setText('');
                txt_cube_info.x = 0;
                txt_cube_info.y = 0;
            }
    
    
        };

        function reset_game() {
            cube01.x = 100; cube01.y = 250;
            cube02.x = 300; cube02.y = 250;
            cube03.x = 100; cube03.y = 520;
            cube04.x = 300; cube04.y = 520;
            isOnWeighName = '';
            txt_kg.setText('0g');
            txt_watert_cm.setText('');
            display_tips(false);
            //cube01 = this.physics.add.sprite(100, 250, 'cube01');
            //cube02 = this.physics.add.sprite(300, 250, 'cube02');
        }
    
    
        function display_tips(isShow = false) {
            if (isShow == true) {
                txt_op_tips.setText("請先移動回架上");
                btn_reset.visible = true;
            }
            else {
                txt_op_tips.setText("");
                btn_reset.visible = false;
            }
    
        }
        function update_water_info(cube) {
    
            if (cube.name == 'cube01') {
                GetBounds(cube01, rect1);
                GetBounds(rect_water, rect2);
    
    
                if (RectangleToRectangle(rect1, rect2)) {
    
                    if (rect_water.y != 400) {
                        isOnWeighName = 'cube01';
                        object_where = ObjectWhere.water;
                        txt_watert_cm.text = '';
                        rect_water.y = 550;
                        rect_water.height = 200;
                    }
    
                    //rect_water = this.add.rectangle(700, 570, 370, 220, 0xd4f1f9);
                }
                else {
                    object_where = ObjectWhere.default;
                    txt_watert_cm.text = '';
                    rect_water.y = 600;
                    rect_water.height = 150;
                }
            }
            else if (cube.name == 'cube02') {
                GetBounds(cube02, rect1);
                GetBounds(rect_water, rect2);
    
    
                if (RectangleToRectangle(rect1, rect2)) {
    
                    if (rect_water.y != 400) {
                        isOnWeighName = 'cube02';
                        object_where = ObjectWhere.water;
                        txt_watert_cm.text = '';
                        rect_water.y = 550;
                        rect_water.height = 200;
                    }
    
                    //rect_water = this.add.rectangle(700, 570, 370, 220, 0xd4f1f9);
                }
                else {
                    object_where = ObjectWhere.default;
                    txt_watert_cm.text = '';
                    rect_water.y = 600;
                    rect_water.height = 150;
                }
            }
    
        }
    
        function weight_event(cube, b) {

            //console.log(cube.y);
            if (cube === cube01) {
                if (parseInt(cube.y) == 204) {
                    object_where = ObjectWhere.weight;
                    isOnWeighName = "cube01";
                    txt_kg.setText("2g");
                }
    
            }
            else if (cube === cube02) {
                if (parseInt(cube.y) == 204) {
                    object_where = ObjectWhere.weight;
                    isOnWeighName = "cube02";
                    txt_kg.setText("1g");
                }
    
            }
            else {
                object_where = ObjectWhere.default;
                isOnWeighName = "";
            }
    
        }
    
        function boxDownSide_event(cube, b) {
            update_water_info(cube);
        }


    }





}