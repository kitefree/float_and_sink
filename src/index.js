import Phaser from 'phaser';
import config from './config';
import MainScene from './Scenes/MainScene';
import StartScene from './Scenes/StartScene';


class Game extends Phaser.Game 
{
    constructor ()
    {
        super(config)
        
        this.scene.add('Main', MainScene);
        this.scene.add('Start', StartScene);
        this.scene.start('Main');
    }

    preload ()
    {
        
    }
      
    create ()
    {
       
    }
}



window.game = new Game();
