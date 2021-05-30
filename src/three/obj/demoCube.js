import * as THREE from 'three';

export default class DemoCube {
    constructor() {
        var geometry = new THREE.BoxGeometry(1,1,1); // Creates a geometry for the mesh
        var material = new THREE.MeshStandardMaterial({color: 0x7e31eb}); // Creates a material for the mesh
        this.mesh = new THREE.Mesh(geometry, material); // Creates a mesh by combining the geometry and the mesh
    }
}