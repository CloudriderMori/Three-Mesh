
import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry.js';

import ThreeMeshUI from '../src/three-mesh-ui.js';

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

let scene, camera, renderer, controls,
	scrollableContainer, textContainer;

window.addEventListener('load', init );
window.addEventListener('resize', onWindowResize );

//

function init() {

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x505050 );

	camera = new THREE.PerspectiveCamera( 60, WIDTH / HEIGHT, 0.1, 100 );
	camera.position.set( 0, 1.6, 0 );
	camera.lookAt( 0, 1, -1.8 );

	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.localClippingEnabled = true;
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( WIDTH, HEIGHT );
	renderer.xr.enabled = true;
	document.body.appendChild(VRButton.createButton(renderer));
	document.body.appendChild( renderer.domElement );

	controls = new OrbitControls( camera, renderer.domElement );
	camera.position.set( 0, 1.6, 0 );
	controls.target = new THREE.Vector3( 0, 1, -1.8 );
	controls.update();

	// ROOM

	const room = new THREE.LineSegments(
		new BoxLineGeometry( 6, 6, 6, 10, 10, 10 ).translate( 0, 3, 0 ),
		new THREE.LineBasicMaterial( { color: 0x808080 } )
	);

	scene.add( room );

	// TEXT PANEL

	makeTextPanel();

	//

	renderer.setAnimationLoop( loop );

};

//

function makeTextPanel() {

	scrollableContainer = ThreeMeshUI.Block({
		height: 0.7,
		width: 0.6,
		padding: 0.05,
		justifyContent: 'center',
		alignContent: 'center',
		backgroundOpacity: 1,
		backgroundColor: new THREE.Color( 'grey' ),
		fontFamily: './assets/Roboto-msdf.json',
		fontTexture: './assets/Roboto-msdf.png'
	});

	scrollableContainer.setupState({
		state: "hidden-on",
		attributes: { hiddenOverflow: true }
	});

	scrollableContainer.setupState({
		state: "hidden-off",
		attributes: { hiddenOverflow: false }
	});

	scrollableContainer.setState( "hidden-on" );

	scrollableContainer.position.set( 0, 1, -1.8 );
	scrollableContainer.rotation.x = -0.55;
	scene.add( scrollableContainer );

	//

	textContainer = ThreeMeshUI.Block({
		width: 1.2,
		height: 1.2,
		padding: 0.09,
		backgroundColor: new THREE.Color( 'blue' ),
		backgroundOpacity: 0.2,
		alignContent: 'left'
	});

	scrollableContainer.add( textContainer );

	let counter = 0;

	//

	const text = ThreeMeshUI.Text({
		content: "hiddenOverflow = true ".repeat( 11 ),
		fontSize: 0.1
	});

	textContainer.add( text );

	setInterval( ()=> {

		if ( scrollableContainer.currentState === "hidden-on" ) {

			scrollableContainer.setState( "hidden-off" );

			text.set({ content: "hiddenOverflow = false ".repeat( 11 ) });

		} else {

			scrollableContainer.setState( "hidden-on" );

			text.set({ content: "hiddenOverflow = true ".repeat( 11 ) });

		};

	}, 1500 );

};

// handles resizing the renderer when the viewport is resized

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
};

//

function loop() {

	// animate user interface

	const x = Math.sin( Date.now() / 2000 ) * 0.25;
	const y = (Math.cos( Date.now() / 2000 ) * 0.25);

	scrollableContainer.position.x = x;
	scrollableContainer.position.y = y + 1;

	textContainer.position.x = x;
	textContainer.position.y = y;

	// Don't forget, ThreeMeshUI must be updated manually.
	// This has been introduced in version 3.0.0 in order
	// to improve performance
	ThreeMeshUI.update();

	//

	controls.update();
	renderer.render( scene, camera );

};
