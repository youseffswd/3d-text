import {
    AxesHelper,
    Mesh,
    MeshBasicMaterial,
    MeshMatcapMaterial,
    PerspectiveCamera,
    Scene,
    SRGBColorSpace,
    TextureLoader,
    TorusGeometry,
    WebGLRenderer,
} from "three";
import {
    FontLoader,
    OrbitControls,
    TextGeometry,
} from "three/examples/jsm/Addons.js";

const canvas = document.querySelector("canvas.webgl");

const scene = new Scene();



const textureLoader = new TextureLoader();
const matcap = textureLoader.load("/matcaps/8.png")
matcap.colorSpace = SRGBColorSpace

const fontLoader = new FontLoader();
fontLoader.load("/fonts/helvetiker_regular.typeface.json", font => {
    const textGeometry = new TextGeometry("Yousef Sayed", {
        font: font,
        size: 0.5,
        height: 0.2,
        curveSegments: 6,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 4,
    });
    textGeometry.computeBoundingBox();
    const minX = textGeometry.boundingBox.min.x;
    const minY = textGeometry.boundingBox.min.y;
    const minZ = textGeometry.boundingBox.min.z;

    console.log(minX,minY,minZ);

    textGeometry.translate(
        // -1,
        -(textGeometry.boundingBox.max.x + minX) / 2,
        -(textGeometry.boundingBox.max.y + minY) / 2,
        -(textGeometry.boundingBox.max.z + minZ) / 2
    );
    // textGeometry.center()
    textGeometry.computeBoundingBox();
    console.log(textGeometry.boundingBox)
    const material = new MeshMatcapMaterial({
        matcap
    });
    const text = new Mesh(textGeometry, material);
    // text.position.x = -2.5
    scene.add(text);

    const dounatGeometry = new TorusGeometry(.3,.2,20,45)
    const dounatMaterial = new MeshMatcapMaterial({matcap})
    for(let i = 0; i < 500; i++){
        const dounat = new Mesh(dounatGeometry,dounatMaterial);
        dounat.position.x = (Math.random() - .5) * 10
        dounat.position.y = (Math.random() - .5) * 10
        dounat.position.z = (Math.random() - .5) * 10;

        const scale = Math.random()
        dounat.scale.set(scale,scale,scale);

        dounat.rotation.x = Math.random() * Math.PI
        dounat.rotation.y = Math.random() * Math.PI


        scene.add(dounat) 
    }
});

const sizes = {
    with: window.innerWidth,
    height: window.innerHeight,
};

const camera = new PerspectiveCamera(75, sizes.with / sizes.height, 0.1, 100);
camera.position.z = 3;
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

const tick = () => {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};

tick();
