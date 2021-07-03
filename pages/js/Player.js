import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import {gameobject} from './GameObject.js';

export const player = (() => {
    class Player extends gameobject.GameObject{
        #left;
        #right;
        #up;
        #down;
        #width;
        #height;
        #ammo;
        #health;
        #isLeft;
        #isRight;
        #pain;
        #pressedKeys;
        constructor(){
            super();
            this.#left = true;
            this.#right = false;
            this.#up = false;
            this.#down = false;
            this.#width = null;
            this.#height = null;
            this.#ammo = 9;
            this.#health = 30;
            this.#pressedKeys = {left: false, right: false, up: false, down: false, space: false};
            this.setX(1);
            this.setY(0);
            this.setName("Player");
            this.setR(0.4);
            this.setPain(0);
        }
        getPain(){
            return this.#pain;
        }
        getKeyPressRight(){
            return this.#pressedKeys['right'];
        }
        getKeyPressUp(){
            return this.#pressedKeys['up'];
        }
        getKeyPressDown(){
            return this.#pressedKeys['down'];
        }
        getKeyPressLeft(){
            return this.#pressedKeys['left'];
        }
        getKeyPressSpace(){
            return this.#pressedKeys['space'];
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
        getWidth(){
            return this.#width;
        }
        getHeight(){
            return this.#height;
        }
        getAmmo(){
            return this.#ammo;
        }
        getHealth(){
            return this.#health;
        }
        setLeft(a){
            this.#left = a;
            this.#right = !a;
            this.#up = !a;
            this.#down = !a;
            this.#isRight = !a;
            this.#isLeft= a;
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
        setPain(a){
            this.#pain = a;
        }
        shootGun(){
            this.#pressedKeys['space'] = true;
            this.#ammo = this.getAmmo() - 1;

        }
        damaged(a){
            if(this.getPain() <= 0){
                this.setPain(2);
            }
            this.#health = this.#health - a;
        }
        shotGun(){
            this.#pressedKeys['space'] = false;
        }
        setKeysOff(){
            this.#pressedKeys['right'] = false;
            this.#pressedKeys['left'] = false;
            this.#pressedKeys['down'] = false;
            this.#pressedKeys['up'] = false;
        }
        update(){
            if(this.getRight()){
                if(this.getX() > -21){
                    this.#pressedKeys['right'] = true;
                    this.#pressedKeys['left'] = false;
                    this.#pressedKeys['down'] = false;
                    this.#pressedKeys['up'] = false;
                }
            }
            else if(this.getLeft()){
                if(this.getX() < 21){
                    this.#pressedKeys['right'] = false;
                    this.#pressedKeys['left'] = true;
                    this.#pressedKeys['down'] = false;
                    this.#pressedKeys['up'] = false;
                }
            }
            else if(this.getUp()){
                this.#pressedKeys['right'] = false;
                this.#pressedKeys['left'] = false;
                this.#pressedKeys['down'] = false;
                this.#pressedKeys['up'] = true;
            }
            else if(this.getDown()){
                this.#pressedKeys['right'] = false;
                this.#pressedKeys['left'] = false;
                this.#pressedKeys['down'] = true;
                this.#pressedKeys['up'] = false;
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
        Player: Player,
    };
})();