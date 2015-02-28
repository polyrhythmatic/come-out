var allPhotos = [];

var numPhotos = 1500;
// function init(){
//  pageNumberLoad();
// }

var apikey = '';//put flickr api key here

function pageNumberLoad() {
    $.getJSON("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key="+apikey+"&tags=mikebrown%2C+mike+brown%2C+i+can't+breathe%2C+icantbreathe%2C+black+lives+matter%2C+blacklivesmatter%2C+ferguson%2C+ericgarner%2C+eric+garner&page=1&format=json&nojsoncallback=1").done(function(data) {
        gotData(data);
    });
}

var numCalls = 1;
var pages = 0;

function gotData(dataSet) {
    pages = dataSet.photos.pages;
    console.log(pages)
    for (var i = 1; i <= pages; i++) {
        loadAPI(i);

    }
}

function loadAPI(num) {
    setTimeout(function() {
        $.getJSON("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key="+apikey+"&tags=mikebrown%2C+mike+brown%2C+i+can't+breathe%2C+icantbreathe%2C+black+lives+matter%2C+blacklivesmatter%2C+ferguson%2C+ericgarner%2C+eric+garner&page="+num+"&format=json&nojsoncallback=1").done(function(data) {
            gotPictures(data, num);
        });
    }, num * 1);
}

function gotPictures(pictureInfo, num) {
    var perPage = pictureInfo.photos.perpage; //usually 100
    var items = pictureInfo.photos.total; //total number of releases
    var page = pictureInfo.photos.page;

    if (perPage * page <= items) {

        var countTill = perPage;

    } else {
        var countTill = perPage - ((perPage * page) - items);
    }

    console.log(countTill);
    for (var i = 0; i <= countTill - 1; i++) {
        var pic = {
            id: pictureInfo.photos.photo[i].id,
            owner: pictureInfo.photos.photo[i].owner,
            secret: pictureInfo.photos.photo[i].secret,
            server: pictureInfo.photos.photo[i].server,
            farm: pictureInfo.photos.photo[i].farm,
            title: pictureInfo.photos.photo[i].title,
        }

        allPhotos.push(pic);
    }
    if (num == pages) {
        setup();
    }
}

var photoURL = [];

function setup() {
    var audio = new Audio('Reich_Come_Out.mp3');
    audio.play();

    console.log("setup")

    for (var i = 0; i < allPhotos.length; i++) {
        photoURL[i] = "https://farm" + allPhotos[i].farm + ".staticflickr.com/" + allPhotos[i].server + "/" + allPhotos[i].id + "_" + allPhotos[i].secret + ".jpg"
    }
    //console.log(photoURL);
    for (var i = 0; i < numPhotos; i++) {
        imageMap(i);
    }
}

var container;

var camera, controls, scene, renderer;
var pickingData = [],
    pickingTexture, pickingScene;
var objects = [];
var highlightBox;


var geometry, group;

var mouseX = 0,
    mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var photoArray = new Array();

document.addEventListener('mousemove', onDocumentMouseMove, false);

function imageMap(num) {
    setTimeout(function() {
        photoArray[num] = new Image();
        photoArray[num].src = photoURL[num];
        console.log(num + "was successful");
    }, num * 1);

    if (num == numPhotos - 1) {
        setTimeout(function() {
            console.log('init');
            init();
        }, (num * 1) + 10)
    }
}

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 500;

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xffffff, 1, 10000);

    var geometry = new THREE.BoxGeometry(300, 300, 300);
    //var material = new THREE.MeshNormalMaterial();

    group = new THREE.Group();
    THREE.ImageUtils.crossOrigin = '';


    for (var i = 0; i < numPhotos; i++) {
        var texture = THREE.ImageUtils.loadTexture(photoArray[i].src);
        // texture.anisotropy = renderer.getMaxAnisotropy();

        var material = new THREE.MeshBasicMaterial({
            map: texture
        });

        var mesh = new THREE.Mesh(geometry, material);

        mesh.position.x = Math.random() * 20000 - 10000;
        mesh.position.y = Math.random() * 12000 - 6000;
        mesh.position.z = 0;

        // if (i < numPhotos / 3) {
        //     mesh.position.x = Math.round(Math.random()) * 2000 - 1000;
        //     mesh.position.y = Math.random() * 2000 - 1000;
        //     mesh.position.z = Math.random() * 2000 - 1000;
        // }
        // if (i > numPhotos / 3 && i < 2*numPhotos / 3) {
        //     mesh.position.x = Math.random() * 2000 - 1000;
        //     mesh.position.y = Math.round(Math.random()) * 2000 - 1000;
        //     mesh.position.z = Math.random() * 2000 - 1000;
        // }
        // if (i > 2*numPhotos / 3) {
        //     mesh.position.x = Math.random() * 2000 - 1000;
        //     mesh.position.y = Math.random() * 2000 - 1000;
        //     mesh.position.z = Math.round(Math.random()) * 2000 - 1000;
        // }

        mesh.rotation.x = Math.random() * 2 * Math.PI;
        mesh.rotation.y = Math.random() * 2 * Math.PI;

        mesh.matrixAutoUpdate = false;
        mesh.updateMatrix();

        scene.add(mesh);
    }

    scene.add(group);

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x808080);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.sortObjects = false;

    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);

    animate();
}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function onDocumentMouseMove(event) {

    mouseX = (event.clientX - windowHalfX) * 20;
    mouseY = (event.clientY - windowHalfY) * 20;

}

//

function animate() {

    requestAnimationFrame(animate);

    render();
    //stats.update();

}

function render() {

    var time = Date.now() * 0.001;

    var rx = Math.sin(time * 0.7) * 0.5,
        ry = Math.sin(time * 0.3) * 0.5,
        rz = Math.sin(time * 0.2) * 0.5;

    camera.position.x += (mouseX - camera.position.x) * .05;
    camera.position.y += (mouseY - camera.position.y) * .05;

    camera.lookAt(scene.position);

    group.rotation.x = rx;
    group.rotation.y = ry;
    group.rotation.z = rz;

    renderer.render(scene, camera);

}
