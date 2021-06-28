import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

export const gameobject = (() => {
    
    class GameObject{
        #x;
        #y;
        #R;
        #life;
        #engage;
        #name;
        #sprite;
        constructor(){
            this.#R = null;
            this.#life = 1;
            this.#engage = false;
            this.#name = null;
            this.#sprite = new THREE.Sprite();
            this.#x = null;
            this.#y = null;
        }

        getX(){
            this.#x = this.getSprite().position.z;
            return this.#x;
        }
        getY(){
            this.#y = this.getSprite().position.y;
            return this.#y;
        }
        getR(){
            return this.#R;
        }
        getLife(){
            return this.#life;
        }
        getSprite(){
            return this.#sprite;
        }
        getName(){
            return this.#name;
        }
        getTexture(){
            return this.#sprite.material.map;
        }
        translateX(a){
            this.getSprite().translateZ(a);
        }
        translateY(a){
            this.getSprite().translateY(a);
        }
        setX(a){
            this.getSprite().position.setZ(a);
        }
        setY(a){
            this.getSprite().position.setY(a);
        }
        setR(a){
            this.#R = a;
        }
        setLife(a){
            this.#life = a;
        }
        setName(a){
            this.#name = a;
        }
        setTexture(t){
            this.getSprite().material.map = t;
        }
        update(){}
        updateDirection(){}

    };
    return {
        GameObject: GameObject,
      };
})();