import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

			const scene = new THREE.Scene();
            scene.background = new THREE.Color( 0x0000 );
			const camera = new THREE.PerspectiveCamera( 100, 960 / 720, 1, 1000 );
            camera.position.set( 15, 0, 0 );
			camera.lookAt( scene.position );

			const renderer = new THREE.WebGLRenderer();
			renderer.setSize( 960, 720 );
			document.body.appendChild( renderer.domElement );

            //texture loading
            const tex1 = new THREE.TextureLoader().load( './resources/OBbackground.png' );
            const text2 = new THREE.TextureLoader().load( 'bullet.png' );
            const text3 = new THREE.TextureLoader().load( 'pC.png' );
            const text4 = new THREE.TextureLoader().load( 'pCGun.png' );
            const text5 = new THREE.TextureLoader().load( 'pCGun2.png' );
            const text6 = new THREE.TextureLoader().load( 'pCJump.png' );
            const text7 = new THREE.TextureLoader().load( 'pCJump2.png' );
            const text8 = new THREE.TextureLoader().load( 'pCWalk.png' );
            const text9 = new THREE.TextureLoader().load( 'zombie.png' );
            const text10 = new THREE.TextureLoader().load( 'zombieWalk.png' );

            const mBackground = new THREE.SpriteMaterial( {map: tex1} );
            const bgSprite = new THREE.Sprite(mBackground);
            bgSprite.scale.set(48,36,1);



			const sprite1 = new THREE.Sprite( new THREE.SpriteMaterial( { color: '#69f' } ) );
			sprite1.position.set( 1, 0, 0 );
            scene.add(bgSprite);
            scene.add(sprite1);
            
            window.addEventListener( 'keydown', function ( event ) {
                switch ( event.key) {
                    case 'w': // w
                    case 'ArrowUp': //up
                        sprite1.translateY(1);
                        break;
                    case 'a': // a
                    case 'ArrowLeft': //left
                        sprite1.translateZ(1);
                        break;
                    case 's': // s
                    case 'ArrowDown': //down
                        sprite1.translateY(-1);
                        break;
                    case 'd': // d
                    case 'ArrowRight': //right
                        sprite1.translateZ(-1);
                        break;
                    case ' ': //space
                        sprite1.material.color.set(0xffffff)

                }
            }
            ); 

            const animate = function () {
				requestAnimationFrame( animate );

				renderer.render( scene, camera );
			};

			animate();
