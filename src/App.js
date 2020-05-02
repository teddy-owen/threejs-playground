
import React, { Component } from "react";
import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import Skull from "./assets/models/scene.gltf"

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      rate:0.02,
      distance:5,
    };

    this.animate=this.animate.bind(this);
    this.loaderCallback = this.loaderCallback.bind(this);
  }

  componentDidMount() {
    var loader = new GLTFLoader();
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth/window.innerHeight, 0.1, 1000 );
    this.renderer = new THREE.WebGLRenderer();
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    // this.camera.position.set( 0, 20, 100 );
    // this.controls.autoRotate=true;
    // this.controls.update();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.mount.appendChild( this.renderer.domElement );
    this.geometry = new THREE.BoxGeometry( 1, 1, 5 );
    this.material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    this.cube = new THREE.Mesh( this.geometry, this.material );
    // var light = new THREE.AmbientLight( 0x404040,10 );
    // this.light = new THREE.DirectionalLight( 0xffffff, 10 );
    // this.light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    // this.light = new THREE.PointLight( 0xff0000, 10, 100 );
    this.light = new THREE.SpotLight( 0xffffff,10,100 );
    this.light.position.set(10, 10, 10 );
    this.light.castShadow = true;
    
    this.scene.add( this.light );
    // console.log(Skull);
    loader.load("models/scene.gltf",this.loaderCallback, 
    // called while loading is progressing
    function ( xhr ) {

      console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

    },
    function ( error ) {
    
      console.error( error );
    
    } );

    this.camera.position.z = this.state.distance;
    this.animate();
  }

  animate(){
      requestAnimationFrame( this.animate );
      this.controls.update();
      // this.cube.rotation.x += this.state.rate;
      // this.cube.rotation.y += this.state.rate;
      // this.camera.position.z = 2;
      this.renderer.render( this.scene, this.camera );
  }

  loaderCallback(gltf){
    this.skull = gltf.scene;
    this.skull.position.set(0,0,0);
    // this.light.target=this.skull;
    this.scene.add(this.skull);
  }

  render() {
    return (
      <div>
        <div ref={ref => (this.mount = ref)} />
        <button onClick={()=>this.setState((prevState)=>({rate:prevState.rate+0.01}))}>
          Faster
        </button>
        <button onClick={()=>this.setState((prevState)=>({distance:prevState.distance-0.8}))}>
          Zoom in
        </button>
        <button onClick={()=>this.setState((prevState)=>({distance:prevState.distance+0.8}))}>
          Zoom out
        </button>
      </div>
    )
  }
}

export default App;
