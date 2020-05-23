
/* Import everything we need from Three.js */

import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import ThreeMeshUI from '../../src/three-mesh-ui.js';

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

let scene, camera, renderer, controls ;

window.addEventListener('load', ()=> {
	init();
});

window.addEventListener('resize', ()=> {
	onWindowResize();
});


function init() {

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x505050 );

	camera = new THREE.PerspectiveCamera( 60, WIDTH / HEIGHT, 0.1, 100 );

	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
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

	makePanels();

	//

	renderer.setAnimationLoop( loop );

};

//

function makePanels() {

	const container = ThreeMeshUI.Block({
		height: 1.6,
		width: 2,
		contentDirection: 'row',
		justifyContent: 'center'
	});

	container.position.set( 0, 1, -1.8 );
	container.rotation.x = -0.55;
	scene.add( container );

	//

	const loader = new THREE.TextureLoader();

	loader.load( './assets/uv_grid.jpg', (texture)=> {

		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;

		const textureMaterial = new THREE.MeshBasicMaterial({
			map: texture
		});

		const stretchSection = makeSection(
			textureMaterial,
			'stretch',
			'backgroundSize: "stretch"',
			" stretches each size of the image's texture to fit the borders of the Block."
		);

		const containSection = makeSection(
			textureMaterial,
			'contain',
			'backgroundSize: "contain"',
			" fits the texture inside a Block, while keeping its aspect ratio and showing all of its surface."
		);

		const coverSection = makeSection(
			textureMaterial,
			'cover',
			'backgroundSize: "cover"',
			" extends the texture while keeping its aspect ratio, so that it covers the Block entirely."
		);

		container.add( stretchSection, containSection, coverSection );

	});

};

//

function makeSection( textureMaterial, backgroundSize, text1, text2 ) {

	const block = ThreeMeshUI.Block({
		height: 1.6,
		width: 0.6,
		margin: 0.05
	});

	const imageBlock = ThreeMeshUI.Block({
		height: 1.1,
		width: 0.6,
		borderRadius: 0.05,
		backgroundMaterial: textureMaterial,
		backgroundSize
	});

	const textBlock = ThreeMeshUI.Block({
		height: 0.45,
		width: 0.6,
		margin: 0.05,
		padding: 0.03,
		justifyContent: 'center',
		fontFamily: './assets/Roboto-msdf.json',
		fontTexture: './assets/Roboto-msdf.png',
		fontSize: 0.04
	});

	textBlock.add(

		ThreeMeshUI.Text({
			content: text1,
			fontColor: new THREE.Color(0x96ffba)
		}),

		ThreeMeshUI.Text({
			content: text2
		})

	);

	block.add( imageBlock, textBlock );

	return block

};

/* Render loop (called ~60 times/second, or more in VR) */

function loop() {
	controls.update();
	renderer.render( scene, camera );
};
