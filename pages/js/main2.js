import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import {player} from './Player.js'
import {bullet} from './Bullet.js'
import {zombie} from './Zombie.js'

            let scene, camera, renderer;
            const startButton = document.getElementById('startButton');
            startButton.addEventListener('click', init);
            let player1 = new player.Player();
            let bullet1;
            let zombie1;
            let bulletObjects = new Array();
            let zombieObjects = new Array();
            
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
                            if(ladderUpCollision(player1.getSprite().position.z,player1.getSprite().position.y) == true){
                                player1.setUp(1);
                                player1.update();
                                if (player1.getTexture() == tex6){
                                    player1.setTexture(tex7);
                                }else{
                                    player1.setTexture(tex6);
                                }
                                s4.play();
                            }
                            console.log(player1.getSprite().position);
                            console.log(ladderUpCollision(player1.getSprite().position.z,player1.getSprite().position.y))
                            break;
                        case 'a': // a
                        case 'ArrowLeft': //left
                            if(usingLadder(player1.getSprite().position.y) == false){
                                player1.setLeft(1);
                                player1.update();
                                if (player1.getTexture() == tex3 || player1.getTexture() == tex4){
                                    player1.setTexture(tex8);
                                    s1.play();
                                }else{
                                    player1.setTexture(tex3);
                                    s2.play();
                                }
                            }
                            break;
                        case 's': // s
                        case 'ArrowDown': //down
                            if(ladderDownCollision(player1.getSprite().position.z,player1.getSprite().position.y) == true){
                                player1.setDown(1);
                                player1.update();
                                if (player1.getTexture()== tex6){
                                    player1.setTexture(tex7);
                                }else{
                                    player1.setTexture(tex6);
                                }
                                s4.play();
                            }
                            console.log(player1.getSprite().position);
                            break;
                        case 'd': // d
                        case 'ArrowRight': //right
                            if(usingLadder(player1.getSprite().position.y) == false){
                                player1.setRight(1);
                                player1.update()
                                if (player1.getTexture() == tex3 || player1.getTexture() == tex4){
                                    player1.setTexture(tex8);
                                    s1.play();
                                }else{
                                    player1.setTexture(tex3);
                                    s2.play();
                                }
                            }
                            break;
                        case ' ': //space
                            if(player1.getAmmo() != 0){
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
                                    s3.play()
                                    bullet1 = new bullet.Bullet(player1.getSprite().position.z+0.75,player1.getSprite().position.y+y);
                                    bullet1.getSprite().position.setX(1);
                                    bullet1.getSprite().scale.set(0.2,0.1,1);
                                    bullet1.setTexture(tex2);
                                    bulletObjects.push(bullet1);
                                    scene.add(bullet1.getSprite());
                                    bullet1.setLeft(1);
                                    bullet1.update();
                                }
                                player1.shotGun();
                                console.log(bullet1.getSprite().position);
                            }


                    }
                }
                );

            //animate
            const animate = function () {
                requestAnimationFrame(animate);
                player1.updateDirection();
                for(let object of bulletObjects){
                    object.update();
                }
                for(let object of zombieObjects){
                    object.update();
                    object.updateDirection();
                    object.setState(!object.getState());
                    console.log(object.getState());
                }
                setSpriteFloor(player1.getSprite(),player1.getSprite().position.y);
				renderer.render( scene, camera );
			};


            const setSpriteFloor = function(sprite, y){
                //get y positions of all floors
                const firstFloor=-7, secondFloor=-0.3, thirdFloor=6.5, fourthFloor=13.2, groundFloor=-14;
                if(y >= fourthFloor){
                    sprite.position.setY(fourthFloor);
                }
                else if ((y >= thirdFloor && y < thirdFloor + 0.5) || (y <= thirdFloor && y > thirdFloor - 0.5)){
                    sprite.position.setY(thirdFloor);
                }
                else if((y >= secondFloor && y < secondFloor + 0.5) || (y <= secondFloor && y > secondFloor - 0.5)){
                    sprite.position.setY(secondFloor);
                }
                else if((y >= firstFloor && y < firstFloor + 0.5) || (y <= firstFloor && y > firstFloor - 0.5)){
                    sprite.position.setY(firstFloor);
                }
                else if((y >= groundFloor && y < groundFloor + 0.5) || y <= groundFloor){
                    sprite.position.setY(groundFloor);
                }
                else{
                    //do nothing
                }
            }

            //check to see if player character is using a ladder, very simple. If he isnt currently on any of the floors then he is using a ladder
            //used in game to not allow horizontal movement or the use of a gun.
            const usingLadder = function(y){
                const firstFloor=-7, secondFloor=-0.3, thirdFloor=6.5, fourthFloor=13.2, groundFloor=-14;
                if (y > groundFloor && y < firstFloor){
                    return true;
                }
                else if (y > firstFloor && y < secondFloor){
                    return true;
                }
                else if (y > secondFloor && y < thirdFloor){
                    return true;
                }
                else if (y > thirdFloor && y < fourthFloor){
                    return true;
                }
                else {
                    return false;
                }
            }
            
            const ladderUpCollision = function(x, y){
                //get y positions of all floors
                const firstFloor=-7, secondFloor=-0.3, thirdFloor=6.5, fourthFloor=13.2, groundFloor=-14;
                //check to see where player currently is, let him move accordingly
                if (y >= groundFloor && y < firstFloor){
                    //first floor ladders position
                    if (x <= 4.8 && x >= 3){
                        return true;
                    }else{
                    return false;
                    }
                }else if (y >= firstFloor && y < secondFloor){
                    //second floor ladders position
                    if ((x <= -9.8 && x >= -11) || (x >= 17.8 && x<= 19)){
                        return true;
                    }else{
                        return false;
                    }
                }else if (y >= secondFloor && y < thirdFloor){
                    //third floor ladders position
                    if ((x >= -21 && x<= -19.8) || (x >= 7 && x <= 8)){
                        return true;
                    }else{
                        return false;
                    }
                }else if (y >= thirdFloor && y < fourthFloor){
                    //fourth floor's ladders position
                    if ((x >= -7 && x<= -5) || (x >= 14 && x <= 16)){
                        return true;
                    }else{
                        return false;
                    }
                //cant go up if youre on fourth floor
                }else if (y == fourthFloor){
                    return false;
                }
                else{
                    return false;
                }
            }

            const ladderDownCollision = function(x, y){
                //get y positions of all floors
                const firstFloor=-7, secondFloor=-0.3, thirdFloor=6.5, fourthFloor=13.2, groundFloor=-14;
                //check to see where player currently is, let him move accordingly
                if (y == groundFloor){
                    return false;
                }else if (y > groundFloor && y <= firstFloor){
                    if (x >= 3 && x <= 4.8){
                        return true;
                    }else{
                        return false;
                    }
                }else if (y > firstFloor && y <= secondFloor){
                    if ((x <= -9.8 && x >= -11) || (x >= 17.8 && x<= 19)){
                        return true;
                    }else{
                        return false;
                    }
                }else if (y > secondFloor && y <= thirdFloor){
                    if ((x >= 7 && x<= 8) || (x >= -21 && x <= -19.8)){
                        return true;
                    }else{
                        return false;
                    }
                }else if (y > thirdFloor && y <= fourthFloor){
                    if ((x >= -7 && x<= -5) || (x >= 14 && x <= 16)){
                        return true;
                    }else{
                        return false;
                    }
                }
                else{
                    return false;
                }
            }

            animate();
        }

		
