import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import {gameobject} from './GameObject.js';


export const zombie = (() => {
    class Zombie extends gameobject.GameObject{
        #left;
        #right;
        #respawn;
        #width;
        #height;
        #speed;
        #isLeft;
        #isRight;
        #textures;
        #state;
        constructor(){
            super();
            const tex9 = new THREE.TextureLoader().load( './resources/zombie.png' );
            const tex10 = new THREE.TextureLoader().load( './resources/zombieWalk.png' );
            let floor = [-7, -0.3, 6.5, 13.2, -14];
            this.#textures = [tex9, tex10];
            this.setName("Zombie");
            this.setR(15);
            this.setY(floor[Math.floor(Math.random() * 5)])
            this.setLeft(Math.floor(Math.random() * 2));
            this.setSpeed(0.5);
            this.setRespawn(0);
            this.setX(Math.floor(Math.random() * 43)-21.5);
            this.setState(0);
            this.setTexture(this.#textures[Math.floor(Math.random() * 2)]);
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
            this.#isLeft = a;
            this.#isRight = !a;

        }
        setRight(a){
            this.#left = !a;
            this.#right = a;
            this.#isLeft = !a;
            this.#isRight = a;

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
        update(){
            if(this.getLeft()){
                if(this.getX() < 22){
                    this.translateX(this.getSpeed());
                }
                else{
                    this.setRespawn(1);
                }
            }
            else if(this.getRight()){
                if(this.getX() > -22){
                    this.translateX(-(this.getSpeed()));
                }
                else{
                    this.setRespawn(1);
                }
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
            console.log(this.getLeft());
        }

    };
    return {
        Zombie: Zombie,
    };
})();