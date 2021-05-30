import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { TextureLoader, MeshStandardMaterial} from 'three'

export const objLoader = (objPath, texturePath, textureWrapping, materials, callbackFunc) => {
    const loader = new OBJLoader();
    loader.load(
        objPath, // The path of the obj to be loaded 
        function(object) { // Function called when the mesh is loaded
            
            if(texturePath !== undefined) {

                for(let child = 0; child < texturePath.length; ++child) {
                    if(typeof(texturePath[child]) === 'number') {
                        object.children[child].material = materials[child];
                        object.children[child].material.setValues({color: texturePath[child]});
                    } else if(typeof(texturePath[child]) === 'string') {
                        textureLoader(texturePath[child], (texture) => {
                            texture.wrapS = textureWrapping[child];
                            texture.wrapT = textureWrapping[child];
                            object.children[child].material = materials[child];
                            object.children[child].material.setValues({map: texture});
                        })
                    }else {
                        console.log("type not supported");
                    }
                }
            }
            callbackFunc(object);
        },
        function(xhr) { // Called when loading is in progress
            console.log((xhr.loaded/xhr.total * 100) + '% loaded');
        },
        function(error) { // called when an error occur
            console.log('An error happened: ' + error);
        }
    )
}

export const glbLoader = (glbPath, texturePath, callbackFunc) => {
    const loader = new GLTFLoader();
    loader.load(
        glbPath, // The path of the mtl to be loaded 
        function(object) { // Function called when the mesh is loaded
            callbackFunc(object);
            if(texturePath !== undefined) {
                textureLoader(texturePath, (texture) => {
                    object.children[0].material = new MeshStandardMaterial({map: texture}); // Creates a material for the mesh
                })
            }
        },
        function(xhr) { // Called when loading is in progress
            console.log((xhr.loaded/xhr.total * 100) + '% loaded');
        },
        function(error) { // called when an error occur
            console.log('An error happened: ' + error);
        }
    )
}

export const textureLoader = (path, callbackFunc) => {
    const loader = new TextureLoader();

    loader.load(
        path, 
        function(texture) { // Called when the mesh is loaded
            callbackFunc(texture);
        },
        undefined, // Loading is in progress, not currently supported for texture loading
        function(error) { // Called when an error occur
            console.log("An error happened: " + error);
        })
}