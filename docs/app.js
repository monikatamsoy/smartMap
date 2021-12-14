import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.122/examples/jsm/controls/OrbitControls.js';


class App{
	constructor(){
		const container = document.createElement( 'div' );
		document.body.appendChild( container );
        
		this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
		this.camera.position.set( 0, 20, 50 );
        // this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        
		this.scene = new THREE.Scene();
        
        

		const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 0.1);
		this.scene.add(ambient);
        
        const light = new THREE.DirectionalLight(0xffffff, 0.5);
        light.position.set( 0, 10, 1);
        // this.scene.add(light);

        var ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(ambientLight);
        this.models = [];

		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.shadowMap.enabled = true;
        
		container.appendChild( this.renderer.domElement );
		
        
        
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        // this.controls.target.set(0, 1, 0);
        
        
		this.controls.minPolarAngle = 0;
		this.controls.maxPolarAngle =  Math.PI * 0.5;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 80;
        this.controls.enablePan = true;
        this.controls.screenSpacePanning = true;
        this.controls.update();
        
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
            
        // this.sprite = new THREE.TextSprite({
        //     text: 'Hello World!',
        //     fontFamily: 'Arial, Helvetica, sans-serif',
        //     fontSize: 12,
        //     color: '#ffbbff',
        //   });
        //   this.scene.add(this.sprite);
          
        const map = new THREE.TextureLoader().load( 'assets/sky.jpg' );
        const material = new THREE.SpriteMaterial( { map: map } );

        this.sprite = new THREE.Sprite( material );
        this.sprite.visible = false;

        
        this.initScene();
        this.render()
        
        
        this.controls.addEventListener( 'change', this.render );
        window.addEventListener('resize', this.resize.bind(this) );
       
        
	}	
    
    resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );  
    }

    getRaycaster(mouse) {

        // calculate objects intersecting the picking ray
        this.raycaster.setFromCamera( mouse,this.camera );
        const intersects = this.raycaster.intersectObjects( this.scene.children );

        for ( let i = 0; i < intersects.length; i ++ ) {

            intersects[ i ].object.material.color.set( 0xff0000 );
            // console.log(intersects[i].object.position)
        }
    }
    onMouseMove( event ) {
        const mouse = new THREE.Vector2();
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        console.log(mouse.x, mouse.y)
        
    }   

    initScene(){

        this.loadGLTF('desertCity', 0.2, 0,-10,0);
        this.loadGLTF('pin',1, 30,-5,5);
        
        window.addEventListener( 'mousemove', this.onMouseMove);
                
    }

    loadGLTF(model, scale, x,y , z) {
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
                    self.model.position.set(x,y,z);
                    if(model=='pin') {
                        // self.sprite.position.copy(self.model.position);
                        self.sprite.scale.set(4,4,4);
                        self.sprite.position.set(x+4,y,z)
                    }
                    self.scene.add( self.model );
                    self.scene.add( self.sprite );
                    self.models.push(self.model)
                    console.log(self.sprite)
                    self.renderer.setAnimationLoop( self.render.bind(self) );
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

    
	render() {   
        
        console.log(this.raycaster, "mouse:" +`${this.mouse.position}`)
        this.raycaster.setFromCamera( this.mouse,this.camera );
        const intersects = this.raycaster.intersectObjects( this.scene.children );

        for ( let i = 0; i < intersects.length; i ++ ) {

            intersects[ i ].object.material.color.set( 0xff0000 );
            console.log(intersects[i].object.position)
        }
        this.models[0].rotateY(0.01);
        
        this.renderer.render( this.scene, this.camera );
        
    }
}

export { App };