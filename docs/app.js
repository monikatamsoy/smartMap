import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.122/examples/jsm/controls/OrbitControls.js';


class App{
	constructor(){
		const container = document.createElement( 'div' );
		document.body.appendChild( container );
        
		this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 100 );
		this.camera.position.set( 0, 20, 20 );
        
		this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0xaaaaaa );

		const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 0.1);
		this.scene.add(ambient);
        
        const light = new THREE.DirectionalLight(0xffffff, 0.5);
        light.position.set( 0, 10, 1);
        // this.scene.add(light);

        var ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(ambientLight);

			
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.outputEncoding = THREE.sRGBEncoding;
		container.appendChild( this.renderer.domElement );
		

        
        const controls = new OrbitControls( this.camera, this.renderer.domElement );
        // this.controls.target.set(0, 1, 0);
        // this.controls.update();

        
        this.initScene();
        
        
        this.renderer.setAnimationLoop(this.render.bind(this));
    
        window.addEventListener('resize', this.resize.bind(this) );
	}	
    
    resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );  
    }

    initScene(){
        this.loadGLTF('desertCity', 0.2);
        this.loadGLTF('pin',1);
        
                
    }

    loadGLTF(model, scale) {
        const self = this;
        let loader = new THREE.GLTFLoader( );
            loader.setPath('./assets/');
            loader.load(
                // resource URL
                `${model}.glb`,
                // called when the resource is loaded
                function ( gltf ) {
                    const bbox = new THREE.Box3().setFromObject( gltf.scene );
                    console.log(`min:${bbox.min.x.toFixed(2)},${bbox.min.y.toFixed(2)},${bbox.min.z.toFixed(2)} -  max:${bbox.max.x.toFixed(2)},${bbox.max.y.toFixed(2)},${bbox.max.z.toFixed(2)}`);
                    
                    self.model = gltf.scene;
                    self.model.scale.set(scale,scale,scale);
                    self.model.position.set(0,0,0);
                    self.scene.add( self.model );
                    
                },
                // called while loading is progressing
                function ( xhr ) {

                    // loadingBar.progress = (xhr.loaded / xhr.total);
                    
                },
                // called when loading has errors
                function ( error ) {

                    console.log( 'An error happened' );

                }  
                
            );
            
    }
    
	render( ) {   
        
        this.renderer.render( this.scene, this.camera );
    }
}

export { App };