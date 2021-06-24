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
                const sound = new THREE.Audio( listener );

                // load a sound and set it as the Audio object's buffer
                const audioLoader = new THREE.AudioLoader();
                audioLoader.load( './resources/Song.mp3', function( buffer ) {
	                sound.setBuffer( buffer );
	                sound.setLoop( true );
	                sound.setVolume( 0.5 );
	                sound.play();
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
                scene.add(sound);

                //variables
                let isLeft = true;
                let isRight = false;

                window.addEventListener( 'keydown', function ( event ) {
                    switch ( event.key) {
                        case 'w': // w
                        case 'ArrowUp': //up
                            sprite1.translateY(1);
                            if (sprite1.material.map == tex6){
                                sprite1.material.map = tex7;
                            }else{
                                sprite1.material.map = tex6;
                            }
                            break;
                        case 'a': // a
                        case 'ArrowLeft': //left
                            sprite1.translateZ(1);
                            isRight = false;
                            isLeft = true;
                            if (sprite1.material.map == tex3){
                                sprite1.material.map = tex8;
                            }else{
                                sprite1.material.map = tex3;
                            }
                            break;
                        case 's': // s
                        case 'ArrowDown': //down
                            sprite1.translateY(-1);
                            if (sprite1.material.map == tex6){
                                sprite1.material.map = tex7;
                            }else{
                                sprite1.material.map = tex6;
                            }
                            break;
                        case 'd': // d
                        case 'ArrowRight': //right
                            sprite1.translateZ(-1);
                            isLeft = false;
                            isRight = true;
                            if (sprite1.material.map == tex3){
                                sprite1.material.map = tex8;
                            }else{
                                sprite1.material.map = tex3;
                            }
                            break;
                        case ' ': //space
                            sprite1.material.map = tex4;


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
				renderer.render( scene, camera );
			};
            animate();
        }

		
