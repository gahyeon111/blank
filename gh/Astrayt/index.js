// import { Box2D } from './Box2dWeb.min.js';

var camera = undefined,
    scene = undefined,
    renderer = undefined,
    light = undefined,
    mouseX = undefined,
    mouseY = undefined,
    maze = undefined,
    mazeMesh = undefined,
    mazeDimension = 21, // should always be an odd
    portalX = undefined,
    portalY = undefined,
    planeMesh = undefined,
    ballMesh = undefined,
    ballRadius = 0.25,
    keyAxis = [0, 0],
    ironTexture = THREE.ImageUtils.loadTexture('/ball.png'),
    planeTexture = THREE.ImageUtils.loadTexture('/brick.png'),
    brickTexture = THREE.ImageUtils.loadTexture('/brick.png'),
    gameState = undefined,
    // trace
    colorIndex = 0x000000,
    ascending = true,
    trace = [],
    clock = [],
    index = 0,
    // ending object
    appearance = false,
    endingClock = undefined,
    size = 1,
    // for easter egg
    visit = 0,

    // Add the easter object
    geometryE = new THREE.SphereGeometry(0.5, 32, 16);
// geometryE = new THREE.TorusKnotGeometry(0.3, 0.3, 100, 10);
// const material = new THREE.MeshPhongMaterial({ map: ironTexture });
const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
const eMesh = new THREE.Mesh(geometryE, material);

// Box2D shortcuts
b2World = Box2D.Dynamics.b2World,
    b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
    b2BodyDef = Box2D.Dynamics.b2BodyDef,
    b2Body = Box2D.Dynamics.b2Body,
    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
    b2Settings = Box2D.Common.b2Settings,
    b2Vec2 = Box2D.Common.Math.b2Vec2,

    // Box2D world variables 
    wWorld = undefined,
    wBall = undefined;
// wPortal = undefined;



function createPhysicsWorld() {
    // Create the world object.
    wWorld = new b2World(new b2Vec2(0, 0), true);

    // Create the ball.
    var bodyDef = new b2BodyDef();
    bodyDef.type = b2Body.b2_dynamicBody;
    bodyDef.position.Set(1, 1);
    wBall = wWorld.CreateBody(bodyDef);
    var fixDef = new b2FixtureDef();
    fixDef.density = 1.0;
    fixDef.friction = 0.0;
    fixDef.restitution = 0.25;
    fixDef.shape = new b2CircleShape(ballRadius);
    wBall.CreateFixture(fixDef);

    // Create the portal
    // var bodyDefp = new b2BodyDef();
    // bodyDefp.type = b2Body.b2_dynamicBody;
    // bodyDefp.position.Set(1, 1);
    // wPortal = wWorld.CreateBody(bodyDefp);
    // var fixDefp = new b2FixtureDef();
    // fixDefp.shape = new b2CircleShape(ballRadius);
    // wPortal.CreateFixture(fixDefp);

    // Create the maze.
    bodyDef.type = b2Body.b2_staticBody;
    fixDef.shape = new b2PolygonShape();
    fixDef.shape.SetAsBox(0.5, 0.5);
    for (var i = 0; i < maze.dimension; i++) {
        for (var j = 0; j < maze.dimension; j++) {
            if (maze[i][j]) {
                bodyDef.position.x = i;
                bodyDef.position.y = j;
                wWorld.CreateBody(bodyDef).CreateFixture(fixDef);
            }
        }
    }
}


function generate_maze_mesh(field) {
    var dummy = new THREE.Geometry();
    for (var i = 0; i < field.dimension; i++) {
        for (var j = 0; j < field.dimension; j++) {
            if (field[i][j]) {
                var geometry = new THREE.CubeGeometry(1, 1, 1, 1, 1, 1);
                var mesh_ij = new THREE.Mesh(geometry);
                mesh_ij.position.x = i;
                mesh_ij.position.y = j;
                mesh_ij.position.z = 0.5;
                THREE.GeometryUtils.merge(dummy, mesh_ij);
            }
        }
    }
    var material = new THREE.MeshPhongMaterial({ map: brickTexture });
    var mesh = new THREE.Mesh(dummy, material)
    return mesh;
}


function createRenderWorld() {

    // Create the scene object.
    scene = new THREE.Scene();

    // Add the light.
    light = new THREE.PointLight(0xffffff, 1);
    light.position.set(1, 1, 1.3);
    scene.add(light);

    // Add the ball.
    g = new THREE.SphereGeometry(ballRadius, 32, 16);
    m = new THREE.MeshPhongMaterial({ map: ironTexture });
    ballMesh = new THREE.Mesh(g, m);
    ballMesh.position.set(1, 1, ballRadius);
    scene.add(ballMesh);

    // Add the camera.
    var aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(60, aspect, 1, 1000);
    camera.position.set(1, 1, 5);
    scene.add(camera);

    // Add the maze.
    mazeMesh = generate_maze_mesh(maze);
    scene.add(mazeMesh);

    // Add portal
    var portalG = new THREE.CubeGeometry(0.4, 0.4, 0.4, 1, 1, 1);
    portalM = new THREE.MeshPhongMaterial({ map: ironTexture });
    portalMesh = new THREE.Mesh(portalG, portalM);
    for (var i = 0; i < 5; i++) {
        for (var j = 12; j < 15; j++) {
            // for (var i = 0; i < 5; i++) {
            //     for (var j = 4; j < 9; j++) {
            if (!maze[i][j]) {
                portalMesh.position.set(i, j, 0.5);
                portalX = i;
                portalY = j;
                break;
            }
        }
    }
    portalMesh.rotation.set(Math.PI / 4, Math.PI / 4, Math.PI * 2);
    scene.add(portalMesh);

    // Add the ground.
    g = new THREE.PlaneGeometry(mazeDimension * 10, mazeDimension * 10, mazeDimension, mazeDimension);
    planeTexture.wrapS = planeTexture.wrapT = THREE.RepeatWrapping;
    planeTexture.repeat.set(mazeDimension * 5, mazeDimension * 5);
    m = new THREE.MeshPhongMaterial({ map: planeTexture });
    planeMesh = new THREE.Mesh(g, m);
    planeMesh.position.set((mazeDimension - 1) / 2, (mazeDimension - 1) / 2, 0);
    planeMesh.rotation.set(Math.PI / 2, 0, 0);
    scene.add(planeMesh);

}


function updatePhysicsWorld() {

    // Apply "friction". 
    var lv = wBall.GetLinearVelocity();
    lv.Multiply(0.95);
    wBall.SetLinearVelocity(lv);

    // Apply user-directed force.
    var f = new b2Vec2(keyAxis[0] * wBall.GetMass() * 0.25, keyAxis[1] * wBall.GetMass() * 0.25);
    wBall.ApplyImpulse(f, wBall.GetPosition());
    keyAxis = [0, 0];

    // Take a time step.
    wWorld.Step(1 / 60, 8, 3);
}


function updateRenderWorld(bool) {

    if (bool) {
        // Update ball position.
        var stepX = wBall.GetPosition().x - ballMesh.position.x;
        var stepY = wBall.GetPosition().y - ballMesh.position.y;
        ballMesh.position.x += stepX;
        ballMesh.position.y += stepY;

        // Update ball rotation.
        var tempMat = new THREE.Matrix4();
        tempMat.makeRotationAxis(new THREE.Vector3(0, 1, 0), stepX / ballRadius);
        tempMat.multiplySelf(ballMesh.matrix);
        ballMesh.matrix = tempMat;
        tempMat = new THREE.Matrix4();
        tempMat.makeRotationAxis(new THREE.Vector3(1, 0, 0), -stepY / ballRadius);
        tempMat.multiplySelf(ballMesh.matrix);
        ballMesh.matrix = tempMat;
        ballMesh.rotation.getRotationFromMatrix(ballMesh.matrix);

        // Trace effect
        if ((stepX != 0) || (stepY != 0)) {
            // console.log('HI');
            // Add to scene (rendering)
            index++;
            traceG = new THREE.CylinderGeometry(ballRadius, ballRadius, 0.01, 20);
            // traceG = new THREE.PlaneGeometry(ballRadius * 2, ballRadius * 2, 1, 1);
            if (ascending) {
                colorIndex = colorIndex + 0x100;
                if (colorIndex >= 30000) {
                    ascending = false;
                }
            }
            else {
                colorIndex = colorIndex - 0x100;
                if (colorIndex <= 256) {
                    ascending = true;
                }
            }
            // console.log(colorIndex);
            traceM = new THREE.MeshBasicMaterial({ color: colorIndex });
            // traceM = new THREE.MeshBasicMaterial({ color: 0xa2a6a1, opacity: 1.0 });
            trace[index] = new THREE.Mesh(traceG, traceM);
            trace[index].position.set(ballMesh.position.x, ballMesh.position.y, 0);
            trace[index].rotation.set(Math.PI / 2, 0, 0);
            scene.add(trace[index]);
            // clock for removing the trace objects
            clock[index] = new THREE.Clock();

            // Update portal rotation
            var tempMat = new THREE.Matrix4();
            tempMat.makeRotationAxis(new THREE.Vector3(0, 0, 1), stepX / ballRadius);
            tempMat.multiplySelf(portalMesh.matrix);
            portalMesh.matrix = tempMat;
            tempMat = new THREE.Matrix4();
            tempMat.makeRotationAxis(new THREE.Vector3(0, 0, 1), -stepY / ballRadius);
            tempMat.multiplySelf(portalMesh.matrix);
            portalMesh.matrix = tempMat;
            portalMesh.rotation.getRotationFromMatrix(portalMesh.matrix);

            // Update portal position
            // console.log(endingClock.getElapsedTime());
            portalMesh.position.z = 0.2 + Math.abs(Math.sin(endingClock.getElapsedTime() * 2));
        }
    } else {
        ballMesh.position.x = ballMesh.position.x
        ballMesh.position.y = ballMesh.position.y;
    }

    // Update camera and light positions.
    camera.position.x += (ballMesh.position.x - camera.position.x) * 0.1;
    camera.position.y += (ballMesh.position.y - camera.position.y) * 0.1;
    camera.position.z += (5 - camera.position.z) * 0.1;
    light.position.x = camera.position.x;
    light.position.y = camera.position.y;
    light.position.z = camera.position.z - 3.7;
}

function removeTrace() {
    for (var i = 1; i < index + 1; i++) {
        // console.log(clock[i].getElapsedTime());
        if (clock[i].getElapsedTime() > 0.7) {
            clock[i].stop();
            scene.remove(trace[i]);
        }
    }
}

function createEaster() {

    // if (!appearance) {
    // console.log(endingClock.getElapsedTime());
    // // Add the easter object
    // const geometry = new THREE.TorusKnotGeometry(0.3, 0.3, 100, 10);
    // // const material = new THREE.MeshPhongMaterial({ map: ironTexture });
    // const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    // const eMesh = new THREE.Mesh(geometry, material);
    eMesh.position.set(ballMesh.position.x, ballMesh.position.y, 1.3);
    scene.add(eMesh);
    appearance = true;
    // }
}

function updateEaster() {
    // Update easter rotation.
    eMesh.scale.set(size, size, 1);
    // ran = Math.random();
    if (eMesh.scale.x < 1.5) {
        size += 0.015;
    } else if (eMesh.scale.x < 2.5) {
        size += 0.03;
    } else { size += 0.06; }
    var tempMat = new THREE.Matrix4();
    // tempMat.makeRotationAxis(new THREE.Vector3(0, 0, 1), endingClock.getElapsedTime() / 100);

    // rotation
    // tempMat.makeRotationAxis(new THREE.Vector3(0, 0, 1), 0.4);
    // tempMat.multiplySelf(eMesh.matrix);
    // eMesh.matrix = tempMat;
    // eMesh.rotation.getRotationFromMatrix(eMesh.matrix);
    // console.log(eMesh.scale);
}

// function createText() {
//     parameters = {
//         // font: font,
//         // size: 80,
//         // height: 5,
//         // curveSegments: 12,
//         bevelEnabled: true,
//         bevelThickness: 10,
//         bevelSize: 8,
//         // bevelOffset: 0,
//         // bevelSegments: 5
//     };
//     textG = new THREE.TextGeometry('Hello', parameters);
//     textM = new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true });
//     easter = new THREE.Mesh(textG, textM);
//     easter.position.set(ballMesh.position.x, ballMesh.position.y, 2.0);
//     scene.add(easter);
// }

function gameLoop() {

    switch (gameState) {

        case 'initialize':
            appearance = false;
            maze = generateSquareMaze(mazeDimension);
            maze[mazeDimension - 1][mazeDimension - 2] = false;
            createPhysicsWorld();
            createRenderWorld();
            camera.position.set(1, 1, 5);
            light.position.set(1, 1, 1.3);
            light.intensity = 0;
            // var level = Math.floor((mazeDimension - 1) / 2 - 4);
            // $('#level').html('Level ' + level);
            gameState = 'fade in';
            break;

        case 'fade in':
            light.intensity += 0.1 * (1.0 - light.intensity);
            renderer.render(scene, camera);
            if (Math.abs(light.intensity - 1.0) < 0.05) {
                light.intensity = 1.0;
                gameState = 'play'
            }
            break;

        case 'play':
            updatePhysicsWorld();
            updateRenderWorld(true);
            // remove trace
            removeTrace();
            renderer.render(scene, camera);

            // Check for ending
            var mazeX = Math.floor(ballMesh.position.x + 0.5);
            var mazeY = Math.floor(ballMesh.position.y + 0.5);
            if (mazeX == mazeDimension && mazeY == mazeDimension - 2) {
                mazeDimension += 2;
                gameState = 'end';
            }
            // Check for easter egg
            // document.addEventListener("mousedown", function (e) {
            //     console.log(e);
            //     console.log(wBall.GetPosition().x);
            //     console.log(wBall.getBoundingClientRect());
            //     if ((e.screenX == portalX) && ((e.screenY == portalY))) {
            //         console.log('djfklsj');
            //     }
            // })
            // if (portalMesh.onclick) {
            //     console.log('djfklsj');
            // }
            if (mazeX == portalMesh.position.x && mazeY == portalMesh.position.y) {
                gameState = 'easter';
                // console.log("hi");
            }
            break;

        case 'easter':
            // updatePhysicsWorld();
            updateRenderWorld(false);
            // remove trace
            removeTrace();
            renderer.render(scene, camera);
            // light.intensity += 0.1 * (0.0 - light.intensity);
            // if (Math.abs(light.intensity - 0.0) < 0.1) {
            //     light.intensity = 0.0;
            // }
            if (!appearance) {
                createEaster();
                // appearance = true;
            } else {
                if (eMesh.scale.x <= 7) {
                    updateEaster();
                } else {
                    if (visit == 0) {
                        visit++;
                        document.location.href = 'http://localhost:3001/Tutorials/Mirrors#/mazeaster';
                    } else {
                        scene.remove(eMesh);
                        gameState = "play";
                    }
                    // createText();
                    // renderer.render(scene, camera);
                }
            }
            break;

        case 'end':
            updatePhysicsWorld();
            updateRenderWorld(true);
            removeTrace();
            light.intensity += 0.1 * (0.0 - light.intensity);
            renderer.render(scene, camera);
            if (Math.abs(light.intensity - 0.0) < 0.1) {
                light.intensity = 0.0;
                renderer.render(scene, camera);
                // scene.remove();
                // renderer.render(scene, camera);
                // gameState = 'initialize'
                document.location.href = 'http://localhost:55365/';
            }
            break;

    }

    requestAnimationFrame(gameLoop);

}


function onResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}


function onMoveKey(axis) {
    keyAxis = axis.slice(0);
}


jQuery.fn.centerv = function () {
    wh = window.innerHeight;
    h = this.outerHeight();
    this.css("position", "absolute");
    this.css("top", Math.max(0, (wh - h) / 2) + "px");
    return this;
}


jQuery.fn.centerh = function () {
    ww = window.innerWidth;
    w = this.outerWidth();
    this.css("position", "absolute");
    this.css("left", Math.max(0, (ww - w) / 2) + "px");
    return this;
}


jQuery.fn.center = function () {
    this.centerv();
    this.centerh();
    return this;
}

$(document).ready(function () {

    // Prepare the instructions.
    // $('#instructions').center();
    // $('#instructions').hide();
    // KeyboardJS.bind.key('i', function () { $('#instructions').show() },
    //     function () { $('#instructions').hide() });

    // Create the renderer.
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Bind keyboard and resize events.
    KeyboardJS.bind.axis('left', 'right', 'down', 'up', onMoveKey);
    KeyboardJS.bind.axis('h', 'l', 'j', 'k', onMoveKey);
    $(window).resize(onResize);

    // if (onmousedown) {
    //     console.log('djfklsj');
    // }

    // Set the initial game state.
    gameState = 'initialize';

    // Start the game loop.
    endingClock = new THREE.Clock();
    requestAnimationFrame(gameLoop);

})