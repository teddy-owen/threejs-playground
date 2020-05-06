
import React, { Component } from "react";
import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { Water } from 'three/examples/jsm/objects/Water.js';

// import DatGui, { DatBoolean, DatColor, DatNumber, DatString } from 'react-dat-gui';
// import * as dat from 'dat.gui';
import * as dg from 'dis-gui';
import Brick from "./assets/brick.jpeg";
import WaterNormals from "./assets/waternormals.jpg";

// import Skull from "./assets/models/scene.gltf"

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      rate:0.02,
      distance:5,
      shininess:150,
    };
    this.time=1;

    this.animate=this.animate.bind(this);
    this.loaderCallback = this.loaderCallback.bind(this);
    this.addTorusKnot = this.addTorusKnot.bind(this);
    this.initSky = this.initSky.bind(this);
    this.initWater = this.initWater.bind(this);
    // const gui = new dat.GUI();
    // gui.add(App,'state');
  }

  componentDidMount() {
    var loader = new GLTFLoader();
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xAAAAAA);
    this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth/window.innerHeight,  10, 2000000 );
    // this.camera.position.set(0,0,50);
    this.camera.position.set( 0, 70, 200 );
    this.camera.up.set(0, 1, 0);
    this.camera.lookAt(0, 0, 0);
    // this.camera = new THREE.OrthographicCamera( window.innerWidth/ - 2, window.innerWidth / 2, window.innerHeight/ 2, window.innerHeight/ - 2, 1, 1000 );
    // this.camera = new THREE.CubeCamera( 1, 100000, 128 );
    this.renderer = new THREE.WebGLRenderer();
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    // this.controls = new FlyControls( this.camera, this.renderer.domElement );
    // this.controls = new TransformControls( this.camera, this.renderer.domElement );
    
    // this.camera.position.set( 0, 20, 100 );
    // this.controls.autoRotate=true;
    // this.controls.update();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.mount.appendChild( this.renderer.domElement );
    this.geometry = new THREE.BoxGeometry( 1, 1, 5 );
    // this.material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    this.material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    this.cube = new THREE.Mesh( this.geometry, this.material );
    this.cube.position.set(2, 0, 0 );
    this.ambiantLight = new THREE.AmbientLight( 0xffffff,0.5 );
    this.light = new THREE.DirectionalLight( 0xffffff, 2 );
    // this.light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    // this.light = new THREE.PointLight( 0xffffff, 10 );
    // this.light = new THREE.SpotLight( 0xffffff,10,100 );
    this.light.position.set(0, 0, 10 );
    // this.light.target.x = 100;
    // this.light.target.y = 100;
    // this.light.target.z = 100;
    // this.light.castShadow = true;

    
    this.scene.add( 
      this.ambiantLight,
      this.light, 
      this.cube,
      );
    // console.log(Skull);
    loader.load("models/skull/scene.gltf",this.loaderCallback, 
    // called while loading is progressing
    function ( xhr ) {

      console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

    },
    function ( error ) {
    
      console.error( error );
    
    } );
    
    // Load boat
    loader.load("models/boat/scene.gltf",(gltf)=>{
      console.log(gltf);
      this.boat = gltf.scene;
      this.boat.position.set(40,5,0);
      this.boat.scale.set(20,20,20);
      this.scene.add(this.boat);
    });

    // this.camera.position.z = this.state.distance;
    this.addTorusKnot();
    this.initSky();
    this.initWater();
    // this.dragControls = new DragControls([this.torusKnot,this.skull], this.camera, this.renderer.domElement );
    this.animate();
  }

  animate(){
      requestAnimationFrame( this.animate );
      this.controls.update();
      
      this.time+=1

      this.torusKnot.rotation.x += this.state.rate;
      this.torusKnot.rotation.y += this.state.rate;
      this.torusKnot.material.shininess=this.state.shininess;

      
      // this.cube.rotation.x += this.state.rate;
      // this.cube.rotation.y += this.state.rate;
      // this.camera.position.z = 2;
      this.water.material.uniforms.time.value += 1.0 / 60.0;
      let rate = 0.05; //0.05
      let depth = 0.5; //0.5
      let xTilt = 0.005; //0.005
      let zTilt = 0.01; //0.005
      let yRotate=0.005;
      let boatHeight = Math.sin(this.time*rate)*depth;
      if(this.boat){
        this.boat.position.set(40,4,0);
        this.boat.translateY(boatHeight);
        this.boat.rotateX(boatHeight*xTilt);
        this.boat.rotateZ(boatHeight*zTilt);
        this.boat.rotateY(yRotate);
      }
      // console.log(boatHeight);
      this.renderer.render( this.scene, this.camera );
  }

  loaderCallback(gltf){
    this.skull = gltf.scene;
    this.skull.position.set(0,0,0);
    // this.light.target=this.skull;
    this.scene.add(this.skull);
    this.torusKnot.add(this.skull);
    // this.skull.lookAt();
  }

  addTorusKnot(){
    let loader = new THREE.TextureLoader();
    let brickTexture = loader.load(Brick);
    brickTexture.wrapS="RepeatWrapping";
    brickTexture.wrapT="RepeatWrapping";
    brickTexture.repeat.x=5;
    // brickTexture.repeat.y=2;
    let geometry = new THREE.TorusKnotGeometry( 5, 1.5, 100, 16 );
    let material = new THREE.MeshPhongMaterial( { 
      // color: 0xecf542,
      // emissive: 0xecf542,
      shininess: this.state.shininess,
      map:brickTexture,
    } );
    // const hue = Math.random();
    // const saturation = 0.5;
    // const luminance = 0.5;
    // material.color.setHSL(hue, saturation, luminance);    
    this.torusKnot = new THREE.Mesh( geometry, material );
    this.torusKnot.position.set(0,0,0);
    this.torusKnot.scale.set(2,2,2);    
    let axes = new THREE.AxesHelper();
    axes.material.depthTest = false;
    axes.renderOrder = 1;
    this.torusKnot.add(axes);
    this.scene.add(this.torusKnot);
  }

  initSky() {

    // Add Sky
    this.sky = new Sky();
    this.sky.scale.setScalar( 450000 );

    // Add Sun Helper
    this.sunSphere = new THREE.Mesh(
      new THREE.SphereBufferGeometry( 20000, 16, 8 ),
      new THREE.MeshBasicMaterial( { color: 0xffffff } )
    );
    this.sunSphere.position.y = - 700000;
    this.sunSphere.visible = false;
    this.scene.add( this.sunSphere );

    this.scene.add( this.sky );
    this.sky.material.uniforms.turbidity.value = 10;
    this.sky.material.uniforms.rayleigh.value = 2;
    this.sky.material.uniforms.mieCoefficient.value = 0.005;
    this.sky.material.uniforms.mieDirectionalG.value = 0.8;
    this.sky.material.uniforms.luminance.value = 1;
    
    let distance = 400000;
    let inclination = 0.49; //0-0.5 
    let azimuth = 0.205;
    
    var theta = Math.PI * ( inclination - 0.5 );
    var phi = 2 * Math.PI * ( azimuth - 0.5 );

    this.sunSphere.position.x = distance * Math.cos( phi );
    this.sunSphere.position.y = distance * Math.sin( phi ) * Math.sin( theta );
    this.sunSphere.position.z = distance * Math.sin( phi ) * Math.cos( theta );
    this.sunSphere.visible=false;

    this.sky.material.uniforms.sunPosition.value.copy(this.sunSphere.position);
  }

  initWater(){
    this.waterGeometry = new THREE.PlaneBufferGeometry( 10000, 10000 );
    this.water = new Water(
      this.waterGeometry,
      {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load( WaterNormals, function ( texture ) {

          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

        } ),
        alpha: 1.0,
        sunDirection: this.light.position.clone().normalize(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 3.7,
        fog: this.scene.fog !== undefined
      }
    );
    this.water.rotation.x = - Math.PI / 2;
    this.scene.add(this.water);
  }

  handleUpdate = newData => this.setState(prevState => ({
    ...prevState, 
    ...newData,
  }));

  render() {
    return (
      <div>
        <div ref={ref => (this.mount = ref)} ></div>
        <dg.GUI>
          <dg.Number label='Rate' 
          min={0}
          max={0.3}
          step={0.001}
          value={this.state.rate} 
          onChange={value=>this.setState({rate:value})}/>
          <dg.Number label='Shininess' 
          min={0}
          max={200}
          step={1}
          value={this.state.shininess} 
          onChange={value=>this.setState({shininess:value})}/>
        </dg.GUI>
        <button onClick={()=>this.setState((prevState)=>({rate:prevState.rate+0.01}))}
        style={{
          position:"absolute",
          top:10,
          left:10,
        }}
        >
          Faster
        </button>
        {/* <button onClick={()=>this.setState((prevState)=>({distance:prevState.distance-0.8}))}>
          Zoom in
        </button>
        <button onClick={()=>this.setState((prevState)=>({distance:prevState.distance+0.8}))}>
          Zoom out
        </button> */}
        <button onClick={this.addTorusKnot}
                style={{
                  position:"absolute",
                  top:10,
                  left:100,
                }}
        >
          Add Torus
        </button>
      </div>
    )
  }
}

export default App;
