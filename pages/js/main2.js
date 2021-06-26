import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

            let scene, camera, renderer;
            const startButton = document.getElementById('startButton');
            startButton.addEventListener('click', init);
            
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
                const tex9 = new THREE.TextureLoader().load( './resources/zombie.png' );
                const tex10 = new THREE.TextureLoader().load( './resources/zombieWalk.png' );

                //sprite loading
                const mBackground = new THREE.SpriteMaterial( {map: tex1} );
                const bgSprite = new THREE.Sprite(mBackground);
                bgSprite.scale.set(48,36,1);

                let mPlayer = new THREE.SpriteMaterial ( {map: tex3});
			    const sprite1 = new THREE.Sprite( mPlayer);
			    sprite1.position.set( 1, 0, 0 );
                sprite1.scale.set(5,4,1);
                scene.add(bgSprite);
                scene.add(sprite1);

                //variables
                let isLeft = true;
                let isRight = false;

                window.addEventListener( 'keydown', function ( event ) {
                    switch ( event.key) {
                        case 'w': // w
                        case 'ArrowUp': //up
                            if(ladderUpCollision(sprite1.position.z,sprite1.position.y) == true){
                                sprite1.translateY(1);
                                if (sprite1.material.map == tex6){
                                    sprite1.material.map = tex7;
                                }else{
                                    sprite1.material.map = tex6;
                                }
                                s4.play();
                            }
                            console.log(sprite1.position);
                            console.log(ladderUpCollision(sprite1.position.z,sprite1.position.y))
                            break;
                        case 'a': // a
                        case 'ArrowLeft': //left
                            if(usingLadder(sprite1.position.y) == false){
                                sprite1.translateZ(1);
                                isRight = false;
                                isLeft = true;
                                if (sprite1.material.map == tex3){
                                    sprite1.material.map = tex8;
                                    s1.play();
                                }else{
                                    sprite1.material.map = tex3;
                                    s2.play();
                                }
                                setPlayerFloor(sprite1, sprite1.position.y);
                            }
                            break;
                        case 's': // s
                        case 'ArrowDown': //down
                            if(ladderDownCollision(sprite1.position.z,sprite1.position.y) == true){
                                sprite1.translateY(-1);
                                if (sprite1.material.map == tex6){
                                    sprite1.material.map = tex7;
                                }else{
                                    sprite1.material.map = tex6;
                                }
                                s4.play();
                            }
                            console.log(sprite1.position);
                            break;
                        case 'd': // d
                        case 'ArrowRight': //right
                            if(usingLadder(sprite1.position.y) == false){
                                sprite1.translateZ(-1);
                                isRight = true;
                                isLeft = false;
                                if (sprite1.material.map == tex3){
                                    sprite1.material.map = tex8;
                                    s1.play();
                                }else{
                                    sprite1.material.map = tex3;
                                    s2.play();
                                }
                            }
                            break;
                        case ' ': //space
                            sprite1.material.map = tex4;
                            s3.play();


                    }
                }
                );

            //animate
            const animate = function () {
				requestAnimationFrame( animate );
                if(isLeft == true){
                    sprite1.material.map.center.set( 0.5, 0.5 );
                    sprite1.material.map.repeat.set( 1, 1 );
                }
                else if(isRight == true){
                    sprite1.material.map.center.set( 0.5, 0.5 );
                    sprite1.material.map.repeat.set( -1, 1 );
                }
                setPlayerFloor(sprite1,sprite1.position.y);
                setPlayerBounds(sprite1, sprite1.position.z)
				renderer.render( scene, camera );
			};

            const setPlayerBounds = function(sprite, x){
                if (x > 21.5){
                    sprite.position.setZ(21.5);
                }
                else if (x < -21.5){
                    sprite.position.setZ(-21.5);
                }
            }

            const setPlayerFloor = function(sprite, y){
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

		
