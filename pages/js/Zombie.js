import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import {gameobject} from './GameObject.js';


export const zombie = (() => {
    class Zombie extends gameobject.GameObject{
        #left;
        #right;
        #up;
        #down;
        #respawn;
        #width;
        #height;
        #speed;
        #isLeft;
        #isRight;
        #textures;
        #state;
        #RightOrLeft
        constructor(){
            super();
            const tex9 = new THREE.TextureLoader().load( './resources/zombie.png' );
            const tex10 = new THREE.TextureLoader().load( './resources/zombieWalk.png' );
            let floor = [-7, -0.3, 6.5, 13.2, -14];
            this.#textures = [tex9, tex10];
            this.setName("Zombie");
            this.setR(2);
            this.setY(floor[Math.floor(Math.random() * 5)])
            this.setLeft(Math.floor(Math.random() * 2));
            this.#RightOrLeft = Math.floor(Math.random() * 2);
            this.setSpeed(0.5);
            this.setRespawn(0);
            this.setX(Math.floor(Math.random() * 43)-21.5);
            this.setState(0);
            this.setTexture(this.#textures[Math.floor(Math.random() * 2)]);
        }
        getRightOrLeft(){
            return this.#RightOrLeft;
        }
        getState(){
            return this.#state;
        }
        getLeft(){
            return this.#left;
        }
        getRight(){
            return this.#right;
        }
        getUp(){
            return this.#up;
        }
        getDown(){
            return this.#down;
        }
        getRespawn(){
            return this.#respawn;
        }
        getWidth(){
            return this.#width;
        }
        getHeight(){
            return this.#height;
        }
        getSpeed(){
            return this.#speed;
        }
        setLeft(a){
            this.#left = a;
            this.#right = !a;
            this.#up = !a;
            this.#down = !a;
            this.#isLeft = a;
            this.#isRight = !a;

        }
        setRight(a){
            this.#left = !a;
            this.#right = a;
            this.#up = !a;
            this.#down = !a;
            this.#isLeft = !a;
            this.#isRight = a;

        }
        setUp(a){
            this.#left = !a;
            this.#right = !a;
            this.#up = a;
            this.#down = !a;

        }
        setDown(a){
            this.#left = !a;
            this.#right = !a;
            this.#up = !a;
            this.#down = a;

        }
        setLadderOff(){
            this.#up = false;
            this.#down = false;
        }
        setSpeed(a){
            this.#speed = a;
        }
        setRespawn(a){
            this.#respawn = a;
        }
        setState(a){
            this.#state = a;
        }
        setSpawnPoint(){
            let floor = [-7, -0.3, 6.5, 13.2, -14];
            let entry = [22, -22];
            this.setX(entry[Math.floor(Math.random() * 2)]);
            if(this.getX() == 22){
                this.setRight(1);
            }
            else{
                this.setLeft(1);
            }
            this.setY(floor[Math.floor(Math.random() * 5)]);
        }
        update(){
            if(this.getLeft()){
                if(this.getX() < 23){
                    this.translateX(this.getSpeed());
                }
                else{
                    this.setRespawn(1);
                }
            }
            else if(this.getRight()){
                if(this.getX() > -23){
                    this.translateX(-(this.getSpeed()));
                }
                else{
                    this.setRespawn(1);
                }
            }
            else if(this.getUp()){
                this.translateY(this.getSpeed());
            }
            else if(this.getDown()){
                this.translateY(-(this.getSpeed()));
            }
            if(this.getState() == 0){
                this.setTexture(this.#textures[0]);
            }
            else if (this.getState() == 1){
                this.setTexture(this.#textures[1]);
            }
        }
        updateDirection(){
            if(this.getLeft()){
                this.getTexture().center.set( 0.5, 0.5 );
                this.getTexture().repeat.set( 1, 1 );
            }
            else if(this.getRight()){
                this.getTexture().center.set( 0.5, 0.5 );
                this.getTexture().repeat.set( -1, 1 );
            }
        }

    };
    return {
        Zombie: Zombie,
    };
})();