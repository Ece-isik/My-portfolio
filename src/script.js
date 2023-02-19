
import * as THREE from 'three';
import {TextGeometry} from 'three/addons/geometries/TextGeometry.js'
import {FontLoader} from 'three/addons/loaders/FontLoader.js'

/** before loading scene */
let sceneReady = false
const loadingBar1 = document.querySelector('.loading-bar-left')
const loadingBar2 = document.querySelector('.loading-bar-right')
const start_btn = document.querySelector('#start_btn')
let goToScene = false;

start_btn.addEventListener("mouseover", () => 
{
    loadingBar1.classList.add("ended")
    loadingBar2.classList.add("ended")

});
start_btn.addEventListener("mouseout", () => 
{
    loadingBar1.classList.remove("ended")
    loadingBar2.classList.remove("ended")

});
start_btn.addEventListener("click", () => 
{
    goToScene = true;
    loadingBar1.classList.add("invisible")
    loadingBar2.classList.add("invisible")
    start_btn.classList.add("invisible")
});

/** canvas */
const canvas = document.querySelector('#c');
/** renderer */
const renderer = new THREE.WebGLRenderer({canvas});
document.body.appendChild( renderer.domElement );
/** camera */
const camera = new THREE.PerspectiveCamera(40, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
camera.position.z = 4;
/** scene */
const scene = new THREE.Scene();
/** light */
const light = new THREE.DirectionalLight(0xFFFFFF, 1);
light.position.set(-1, 2, 4);
scene.add(light);

const ambient = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( ambient );

/** objects */
/** 3D Text */
let texts = [];
const fontLoader = new FontLoader()
fontLoader.load(
    '../static/fonts/gentilis/gentilis_regular.typeface.json',
    (font) =>
    {
        const textGeometry = new TextGeometry(
            'E',
            {
                font: font,
                size: 0.5,
                height: 0.1,
                curveSegments: 1,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 0
            }
        )
        
        for ( let i = 0; i < 20; i ++ ) {

            const object = new THREE.Mesh( textGeometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

            object.position.x = Math.random() * 6 - 3;
            object.position.y = Math.random() * 2 - 1;
            object.position.z = Math.random() * 2 - 1;

            object.rotation.x = Math.random() * 2 * Math.PI;
            object.rotation.y = Math.random() * 2 * Math.PI;
            object.rotation.z = Math.random() * 2 * Math.PI;

            scene.add( object );
            texts[i] = object;
        }
    })


const material = new THREE.PointsMaterial({
color: 0xffffff,
sizeAttenuation: false,
size: 6,       // in pixels

});
const geometry = new THREE.SphereGeometry(7, 18, 14);

const points = new THREE.Points(geometry, material);
scene.add(points);

/** raycaster */
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerMove( event ) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}
document.addEventListener( 'mousemove', onPointerMove );
/** resize the renderer */
function resizeRendererToDisplaySize(renderer) {
const pixelRatio = window.devicePixelRatio;
const width  = canvas.clientWidth  * pixelRatio | 0;
const height = canvas.clientHeight * pixelRatio | 0;
const needResize = canvas.width !== width || canvas.height !== height;
if (needResize) {
  renderer.setSize(width, height, false);
}
return needResize;
}

/** update */
let intersected;
function animate(time) {

time *= 0.001;

texts.forEach(element => {
    element.rotation.y = time * 0.2;
    element.rotation.z = time * 0.2;
});


    
if(goToScene)
{

texts.forEach(element => {
    if(element.position.y < 3)
{

    gsap.to(element.position, {y: 3, duration: 8})
   
}
});
gsap.to(points.rotation, {x: 180, duration: 2})
}
points.position.z = Math.sin(time * 0.5) * 2;

if (resizeRendererToDisplaySize(renderer)) {
camera.aspect = canvas.clientWidth / canvas.clientHeight;
camera.updateProjectionMatrix();

 }

 raycaster.setFromCamera( pointer, camera );
 const intersects = raycaster.intersectObjects( texts );
 if ( intersects.length > 0 ) {

    if ( intersected != intersects[ 0 ].object ) {

        if ( intersected ) intersected.material.emissive.setHex( intersected.currentHex );

        intersected = intersects[ 0 ].object;
        intersected.currentHex = intersected.material.emissive.getHex();
        intersected.material.emissive.setHex( 0xff00ff );

    }

} else {

    if ( intersected ) intersected.material.emissive.setHex( intersected.currentHex );

    intersected = null;

}
 
         

requestAnimationFrame( animate );


renderer.render( scene, camera );

}
requestAnimationFrame(animate);