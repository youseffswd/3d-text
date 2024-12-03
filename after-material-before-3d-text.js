import {
    AmbientLight,
    Clock,
    Color,
    DoubleSide,
    EquirectangularReflectionMapping,
    Mesh,
    MeshBasicMaterial,
    MeshDepthMaterial,
    MeshLambertMaterial,
    MeshMatcapMaterial,
    MeshNormalMaterial,
    MeshPhongMaterial,
    MeshPhysicalMaterial,
    MeshStandardMaterial,
    MeshToonMaterial,
    NearestFilter,
    PerspectiveCamera,
    PlaneGeometry,
    PointLight,
    PointLightHelper,
    Scene,
    SphereGeometry,
    SRGBColorSpace,
    TextureLoader,
    TorusGeometry,
    WebGLRenderer,
} from "three";
import { OrbitControls, RGBELoader } from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";

const textureLoader = new TextureLoader();

const doorColorTexture = textureLoader.load("/color.jpg");
const doorAlphaTexture = textureLoader.load("/alpha.jpg");
const doorAmbientOcculusionTexture = textureLoader.load("/ambientOcclusion.jpg");
// const doorHeightTexture = textureLoader.load("/height.jpg");
const doorHeightTexture = textureLoader.load("/height.jpg")
const doorMetalnessTexture = textureLoader.load("/metalness.jpg");
const doorNormalTexture = textureLoader.load("/normal.jpg");
const doorRoughnessTexture = textureLoader.load("/roughness.jpg");
const matcapTexture = textureLoader.load("/matcaps/1.png")
const gradientTexture = textureLoader.load("/gradients/5.jpg")


doorColorTexture.colorSpace = SRGBColorSpace;
matcapTexture.colorSpace = SRGBColorSpace;

const gui = new GUI({
    closeFolders: true,
});

const canvas = document.querySelector("canvas.webgl");

const scene = new Scene();

console.log(doorColorTexture)
// const material = new MeshBasicMaterial();
// material.map = doorColorTexture
// material.color = new Color("green")
// material.transparent = true;
// material.opacity = .2
// material.alphaMap = doorAlphaTexture
// material.side =  DoubleSide // there is also frontside and it is the defualt and backside


// const material = new MeshNormalMaterial() // are useful for debug the normals
//                                           normals are used to make the lights and deep and shadow
// material.flatShading = true

// const material = new MeshMatcapMaterial() // for making fake lights
// material.matcap = matcapTexture

// const material = new MeshDepthMaterial();// when you are close the camera it is light and when it is far it is black
                                        // mostly used internally by threejs


// const material = new MeshLambertMaterial({color:"white"}) // first material require light supports the same properties as the MeshBasicMaterial
                                            // most performant material for using lights
                                            // and the replacment and better result is MeshPhongMaterial
                                            
// const material = new MeshPhongMaterial();
// material.shininess = 30;
// material.specular = new Color("red")



// const material = new MeshToonMaterial(); // for the gradient of the light of the material
// gradientTexture.minFilter = NearestFilter;
// gradientTexture.magFilter = NearestFilter;
// gradientTexture.generateMipmaps = false
// material.gradientMap = gradientTexture


// const material = new MeshStandardMaterial(); 
// material.metalness = 1
// material.roughness = .05;
// material.map = doorColorTexture
// material.aoMap = doorAmbientOcculusionTexture
// material.aoMapIntensity = 1
// material.displacementMap = doorHeightTexture
// material.displacementScale = 5;
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.normalScale.set(0.5,0.5)
// material.transparent = true
// material.alphaMap = doorAlphaTexture






// MeshPhysicalMaterial is the same as the MeshStandardMaterial + more features

const material = new MeshPhysicalMaterial(); 
material.metalness = .03
material.roughness = .00;
// material.map = doorColorTexture
// material.aoMap = doorAmbientOcculusionTexture
// material.aoMapIntensity = 1
// material.displacementMap = doorHeightTexture
// material.displacementScale = 5;
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.normalScale.set(0.5,0.5)
// material.alphaMap = doorAlphaTexture

const materialFolder = gui.addFolder("material")

 // ClearCoat
// material.clearcoat = 1;
// material.clearcoatRoughness = 1

// materialFolder.add(material,"clearcoat").min(0).max(1).step(.01)
// materialFolder.add(material,"clearcoatRoughness").min(0).max(1).step(.01)

// // sheen
// material.sheen = 1;
// material.sheenRoughness = 1
// material.sheenColor.set(1,1,1)

// materialFolder.add(material,"sheen").min(0).max(1).step(.01)
// materialFolder.add(material,"sheenRoughness").min(0).max(1).step(.01)



// for soab bubble light reflection
// material.iridescence = 1
// material.iridescenceIOR = 1
// material.iridescenceThicknessRange = [100,800]


// tranmission is the think make a light go throw the object the a cup of glass
material.transmission = 1
material.ior = 1.333
material.thickness = .5

materialFolder.add(material,"transmission").min(0).max(100).step(.001)
materialFolder.add(material,"ior").min(0).max(100).step(.001)
materialFolder.add(material,"thickness").min(0).max(100).step(.001)

materialFolder.add(material,"metalness").min(0).max(1).step(.01)
materialFolder.add(material,"roughness").min(0).max(1).step(.01)



const ambientLight = new AmbientLight(0xffffff,1)
// scene.add(ambientLight)


const pointLight = new PointLight(0xffffff, 10000)
pointLight.position.set(10,20,100)
// scene.add(pointLight)


gui.add(material, "wireframe");
let sphereDebug = {};
sphereDebug.radius = 50;
sphereDebug.widthSegments = 32;
sphereDebug.heightSegments = 32;
const sphereGeometry = new SphereGeometry(
    sphereDebug.radius,
    sphereDebug.widthSegments,
    sphereDebug.heightSegments
);
const sphere = new Mesh(sphereGeometry, material);

const sphereFolder = gui.addFolder("sphere");
sphereFolder.add(sphereDebug, "radius").min(50).max(100);
sphereFolder.add(sphereDebug, "widthSegments").min(1).max(64);
sphereFolder.add(sphereDebug, "heightSegments").min(1).max(64);
sphereFolder.add(sphere.position, "x").min(1).max(10);
sphereFolder.add(sphere.position, "y").min(1).max(10);
sphereFolder.add(sphere.position, "z").min(1).max(10);
sphereFolder.onChange(data => {
    sphere.geometry.dispose();
    sphereDebug = { ...sphereDebug, ...data.object };
    sphere.geometry = new SphereGeometry(
        sphereDebug.radius,
        sphereDebug.widthSegments,
        sphereDebug.heightSegments
    );
});
scene.add(sphere);
let planeDebug = {
    width: 100,
    height: 100,
    widthSegments: 1000,
    heightSegments: 1000,
};
const planeGeometry = new PlaneGeometry(
    planeDebug.width,
    planeDebug.height,
    planeDebug.widthSegments,
    planeDebug.heightSegments
);
const plane = new Mesh(planeGeometry, material);
plane.position.x = -150;
const planeFolder = gui.addFolder("plane");
planeFolder.add(planeDebug, "width").min(1).max(200);
planeFolder.add(planeDebug, "height").min(1).max(200);
planeFolder.add(planeDebug, "widthSegments").min(1).max(64);
planeFolder.add(planeDebug, "heightSegments").min(1).max(64);
planeFolder.onChange(data => {
    plane.geometry.dispose();
    planeDebug = { ...planeDebug, ...data.object };
    plane.geometry = new PlaneGeometry(
        planeDebug.width,
        planeDebug.height,
        planeDebug.widthSegments,
        planeDebug.heightSegments
    );
});

scene.add(plane);

let torusDebug = {
    radius: 30,
    tube: 20,
    radialSegments: 10,
    tubularSegments: 10,
};
const torusGeometry = new TorusGeometry(
    torusDebug.radius,
    torusDebug.tube,
    torusDebug.radialSegments,
    torusDebug.tubularSegments
);
const torus = new Mesh(torusGeometry, material);
torus.position.x = 150;
const torusFolder = gui.addFolder("torus");
torusFolder.add(torusDebug, "radius").min(1).max(50);
torusFolder.add(torusDebug, "tube").min(1).max(50);
torusFolder.add(torusDebug, "radialSegments").min(1).max(64);
torusFolder.add(torusDebug, "tubularSegments").min(1).max(64);
torusFolder.onChange(data => {
    torus.geometry.dispose();
    torusDebug = { ...torusDebug, ...data.object };
    torus.geometry = new TorusGeometry(
        torusDebug.radius,
        torusDebug.tube,
        torusDebug.radialSegments,
        torusDebug.tubularSegments
    );
});
scene.add(torus);


// Environment map
const rgbeLoader = new RGBELoader();
rgbeLoader.load("/2k.hdr",(environmentMap) => {
    environmentMap.mapping = EquirectangularReflectionMapping
    scene.background = environmentMap
    scene.environment = environmentMap
})



const sizes = {
    with: window.innerWidth,
    height: window.innerHeight,
};

const camera = new PerspectiveCamera(75, sizes.with / sizes.height, 1, 1000);
camera.position.z = 300;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.update();

window.addEventListener("resize", _ => {
    sizes.with = innerWidth;
    sizes.height = innerHeight;

    camera.aspect = sizes.with / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.with, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
window.addEventListener("dblclick", () => {
    const fullscreenElement =
        document.fullscreenElement || document.webkitFullscreenElement;

    if (!fullscreenElement) {
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen();
        } else if (canvas.webkitRequestFullscreen) {
            canvas.webkitRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
});

const renderer = new WebGLRenderer({
    canvas,
});
renderer.setSize(sizes.with, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);

const clock = new Clock();
const tick = () => {
    sphere.rotation.x = 0.1 * clock.getElapsedTime();
    sphere.rotation.y = -0.15 * clock.getElapsedTime();

    torus.rotation.x = 0.1 * clock.getElapsedTime();
    torus.rotation.y = -0.15 * clock.getElapsedTime();

    plane.rotation.x = 0.1 * clock.getElapsedTime();
    plane.rotation.y = -0.15 * clock.getElapsedTime();
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};

tick();
