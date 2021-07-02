import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import {player} from './Player.js'
import {bullet} from './Bullet.js'
import {zombie} from './Zombie.js'
import {gamefunctions} from './Functions.js'

            let scene, camera, renderer;
            const startButton = document.getElementById('startButton');
            startButton.addEventListener('click', init);
            let player1 = new player.Player();
            let bullet1;
            let zombie1;
            let bulletObjects = new Array();
            let zombieObjects = new Array();
            let lastRender = 0;
            let p = 0;
            let z = 0;
            //spawn points for zombies later on in game when zombies appear from off screen
            let spawnPoint = [-21, 21];
            //controller inputs
            let spaceUp = true;
            
            function init() {
                const overlay = document.getElementById( 'overlay' );
				overlay.remove();

                //camera and scene init
			    scene = new THREE.Scene();
                scene.background = new THREE.Color( 0x0000 );
			    camera = new THREE.PerspectiveCamera( 100, 960 / 720, 1, 1000 );
                camera.position.set( 15, 0, 0 );
			    camera.lookAt( scene.position );

                //audio
                // create an AudioListener and add it to the camera
                const listener = new THREE.AudioListener();
                camera.add( listener );

                // create a global audio source
                const bgm = new THREE.Audio( listener );
                // create more sound sources
                const s1 = new THREE.Audio( listener );
                const s2 = new THREE.Audio( listener );
                const s3 = new THREE.Audio( listener );
                const s4 = new THREE.Audio( listener );

                // load a sound and set it as the Audio object's buffer
                const audioLoader = new THREE.AudioLoader();
                audioLoader.load( './resources/Song.mp3', function( buffer ) {
	                bgm.setBuffer( buffer );
	                bgm.setLoop( true );
	                bgm.setVolume( 0.5 );
	                bgm.play();
                }
                );
                audioLoader.load( './resources/Walking1.wav', function( buffer ) {
	                s1.setBuffer( buffer );
	                s1.setLoop( false );
	                s1.setVolume( 0.5 );
                }
                );
                audioLoader.load( './resources/Walking2.wav', function( buffer ) {
	                s2.setBuffer( buffer );
	                s2.setLoop( false );
	                s2.setVolume( 0.5 );
                }
                );
                audioLoader.load( './resources/GunShot.wav', function( buffer ) {
	                s3.setBuffer( buffer );
	                s3.setLoop( false );
	                s3.setVolume( 0.5 );
                }
                );
                audioLoader.load( './resources/Ladder.wav', function( buffer ) {
	                s4.setBuffer( buffer );
	                s4.setLoop( false );
	                s4.setVolume( 0.5 );
                }
                );

                //render
			    renderer = new THREE.WebGLRenderer();
			    renderer.setSize( 960, 720 );
			    document.body.appendChild( renderer.domElement );

                //texture loading
                const tex1 = new THREE.TextureLoader().load( './resources/OBbackground.png' );
                const tex2 = new THREE.TextureLoader().load( './resources/bullet.png' );
                const tex3 = new THREE.TextureLoader().load( './resources/pC.png' );
                const tex4 = new THREE.TextureLoader().load( './resources/pCGun.png' );
                const tex5 = new THREE.TextureLoader().load( './resources/pCGun2.png' );
                const tex6 = new THREE.TextureLoader().load( './resources/pCJump.png' );
                const tex7 = new THREE.TextureLoader().load( './resources/pCJump2.png' );
                const tex8 = new THREE.TextureLoader().load( './resources/pCWalk.png' );

                //sprite loading
                const mBackground = new THREE.SpriteMaterial( {map: tex1} );
                const bgSprite = new THREE.Sprite(mBackground);
                bgSprite.scale.set(48,36,1);

                //load player
                player1.setLeft(1);
                player1.getSprite().position.set( 1, 0, 0);
                player1.getSprite().scale.set(5,4,1);
                player1.setTexture(tex3);
                scene.add(bgSprite);
                scene.add(player1.getSprite());

                //load zombies
                //create zombies and set them up
                for(let i=0;i<10;i++){
                    zombie1 = new zombie.Zombie();
		            //give zombies their texture
                    zombie1.getSprite().position.setX(1);
                    zombie1.getSprite().scale.set(5,4,1);
		            //make sure zombies dont spawn on players position
                    if(zombie1.getX() == player1.getX() && zombie1.getY() == player1.getY()){
                        zombie1.setX(Math.floor(Math.random() * 43)-21.5);
                    }
		            //put the zombies into the zombie list
                    zombieObjects.push(zombie1);
                    scene.add(zombie1.getSprite());
                }


                window.addEventListener( 'keydown', function ( event ) {
                    switch ( event.key) {
                        case 'w': // w
                        case 'ArrowUp': //up
                            if(gamefunctions.ladderUpCollision(player1.getSprite().position.z,player1.getSprite().position.y) == true){
                                player1.setUp(1);
                                player1.update();
                            }
                            break;
                        case 'a': // a
                        case 'ArrowLeft': //left
                            if(gamefunctions.usingLadder(player1.getSprite().position.y) == false){
                                player1.setLeft(1);
                                player1.update();
                            }
                            break;
                        case 's': // s
                        case 'ArrowDown': //down
                            if(gamefunctions.ladderDownCollision(player1.getSprite().position.z,player1.getSprite().position.y) == true){
                                player1.setDown(1);
                                player1.update();
                            }
                            break;
                        case 'd': // d
                        case 'ArrowRight': //right
                            if(gamefunctions.usingLadder(player1.getSprite().position.y) == false){
                                player1.setRight(1);
                                player1.update()
                            }
                            break;
                        case ' ': //space
                            if(player1.getAmmo() != 0 && spaceUp == true && s3.isPlaying != true){
                                spaceUp = false;
                                player1.shootGun();
                            }


                    }
                }
                );
                window.addEventListener( 'keyup', function ( event ) {
                    switch ( event.key) {
                        case ' ': // space
                            spaceUp = true;
                            break;
                    }
                }
                );

            //game tick
            const tick = function(progress){
                p += progress;
                z += progress;
                if(z > 200){
                    for(let object of zombieObjects){
                        if(gamefunctions.ladderUpCollision(object.getSprite().position.z,object.getSprite().position.y) == true
                            && player1.getY() > object.getY() ){
                            object.setUp(1);
                            object.update();
                        }
                        else if(gamefunctions.ladderDownCollision(object.getSprite().position.z,object.getSprite().position.y) == true 
                            && player1.getY() < object.getY() ){
                            object.setDown(1);
                            object.update();
                        }
                        else{
                            if(gamefunctions.isSpriteOnFloor(object.getY())){
                                object.setLadderOff();
                                if (gamefunctions.sameFloor(object,player1) && object.getX() > player1.getX()){
                                    object.setRight(1);
           
                                }
                                else if (gamefunctions.sameFloor(object,player1) && object.getX() < player1.getX()){
                                    object.setLeft(1);
        
                                }
                                else{
                                    object.setLeft(object.getRightOrLeft());
                                }
                            }
                            object.update();
                            object.updateDirection();
                            object.setState(!object.getState());
                            if(object.getRespawn() == 1){
                                object.setSpawnPoint();
                                object.setRespawn(0);
                            }
                        }
                    }
                    z = 0;
                }
                if(p > 120){
                    if(player1.getKeyPressRight()){
                        if (player1.getTexture() == tex3 || player1.getTexture() == tex4){
                            player1.setTexture(tex8);
                            s1.play();
                        }else{
                            player1.setTexture(tex3);
                            s2.play();
                        }
                        player1.translateX(-1);
                        player1.setKeysOff();
                    }
                    else if(player1.getKeyPressLeft()){
                        if (player1.getTexture() == tex3 || player1.getTexture() == tex4){
                            player1.setTexture(tex8);
                            s1.play();
                        }else{
                            player1.setTexture(tex3);
                            s2.play();
                        }
                        player1.translateX(1);
                        player1.setKeysOff();
                    }
                    else if(player1.getKeyPressUp()){
                        player1.translateY(1);
                        if (player1.getTexture() != tex7){
                            player1.setTexture(tex7);
                        }else{
                            player1.setTexture(tex6);
                        }
                        s4.play();
                        console.log(player1.getTexture());
                        player1.setKeysOff();
                    }
                    else if(player1.getKeyPressDown()){
                        player1.translateY(-1);
                        if (player1.getTexture() != tex7){
                            player1.setTexture(tex7);
                        }else{
                            player1.setTexture(tex6);
                        }
                        s4.play();
                        console.log(player1.getTexture());
                        player1.setKeysOff();
                    }
                    else if(player1.getKeyPressSpace()){
                        let y;
                        if(player1.getTexture() == tex3 || player1.getTexture() == tex4){
                            player1.setTexture(tex4);
                            y = 0.65;
                        }
                        else if(player1.getTexture() == tex8 || player1.getTexture() == tex5){
                            player1.setTexture(tex5);
                            y = 0.6;
                        }
                        if(player1.getRight()){
                            player1.shotGun();
                            s3.play();
                            bullet1 = new bullet.Bullet(player1.getSprite().position.z-0.75,player1.getSprite().position.y+y);
                            bullet1.getSprite().position.setX(1);
                            bullet1.getSprite().scale.set(0.2,0.1,1);
                            bullet1.setTexture(tex2);
                            bulletObjects.push(bullet1);
                            scene.add(bullet1.getSprite());
                            bullet1.setRight(1);
                            bullet1.update();

                        }
                        else if(player1.getLeft){
                            player1.shotGun();
                            s3.play();
                            bullet1 = new bullet.Bullet(player1.getSprite().position.z+0.75,player1.getSprite().position.y+y);
                            bullet1.getSprite().position.setX(1);
                            bullet1.getSprite().scale.set(0.2,0.1,1);
                            bullet1.setTexture(tex2);
                            bulletObjects.push(bullet1);
                            scene.add(bullet1.getSprite());
                            bullet1.setLeft(1);
                            bullet1.update();
                        }
                        console.log(bullet1.getSprite().position);
                    }
                    player1.updateDirection();
                    p = 0;
                }
            }

            //animate
            const animate = function (timestamp) {
                let progress = timestamp - lastRender;
                for(let object of bulletObjects){
                    object.update();
                    for(let objectsZ of zombieObjects){
                        if(gamefunctions.isCollide(objectsZ, object)){
                            objectsZ.setLife(0);
                            object.setLife(0);
                        }
                        console.log(gamefunctions.isCollide(objectsZ, object));
                    }
                    if(object.getLife() == false){
                        scene.remove(object.getSprite());
                        object.getSprite().material.dispose();
                        object.setY(1000);
                        object.setX(1000);
                        object = undefined;
                    }
                }
                for (let object of zombieObjects){
                    gamefunctions.setSpriteFloor(object.getSprite(),object.getY());
                    if(object.getLife() == false){
                        scene.remove(object.getSprite());
                        object.getSprite().material.dispose();
                        object.setY(1000);
                        object.setX(1000);
                        object = undefined;
                    }
                }
                tick(progress);
                lastRender = timestamp;
                gamefunctions.setSpriteFloor(player1.getSprite(),player1.getSprite().position.y);
				renderer.render( scene, camera );
                requestAnimationFrame(animate);
			};
            animate(1);
        }

		
