import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import {gameobject} from './GameObject.js';

export const bullet = (() => {
    class Bullet extends gameobject.GameObject{
        #left;
        #right;
        #bulletDirection;
        constructor(a,b){
            super();
            this.setName("bullet");
            this.setX(a);
            this.setY(b);
            this.setR(0.2);
        }

        getLeft(){
            return this.#left;
        }
        getRight(){
            return this.#right;
        }
        getBulletDirection(){
            return this.#bulletDirection;
        }
        setLeft(a){
            this.#left = a;
            this.#right = !a;
        }
        setRight(a){
            this.#right = a;
            this.#left = !a;
        }
        setBulletDirection(a){
            this.#bulletDirection = a;
        }
        update(){
            if (this.getRight()){
                this.setBulletDirection(-1);
            }
            else if(this.getLeft()){
                this.setBulletDirection(1);
            }
            this.translateX(this.#bulletDirection)
        }


    };

    return {
        Bullet: Bullet,
    };
})();