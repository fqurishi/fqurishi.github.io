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
        constructor(){
            super();
            this.#left = true;
            this.#right = false;
            this.#up = false;
            this.#down = false;
            this.#width = null;
            this.#height = null;
            this.#ammo = 9;
            this.#health = 15;
            this.setX(1);
            this.setY(0);
            this.setName("Player");
            this.setR(10);
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
        damaged(a){
            this.#health = this.#health - a;
        }
        shotGun(){
            this.#ammo = this.getAmmo() - 1;
        }
        update(){
            if(this.getRight()){
                if(this.getX() > -21){
                    this.translateX(-1);
                }
            }
            else if(this.getLeft()){
                if(this.getX() < 21){
                    this.translateX(+1);
                }
            }
            else if(this.getUp()){
                this.translateY(+1);
            }
            else if(this.getDown()){
                this.translateY(-1);
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