import { render } from 'react-dom'
import React, { Suspense } from 'react'
import { useEffect } from "react";
import { Canvas } from 'react-three-fiber'
import { useProgress, Html } from '@react-three/drei'
import { HashRouter as Router, Switch, Route, NavLink, Redirect } from 'react-router-dom'

//import Scene1 from './scene1/scene1'
// import MazeScene from './maze/mazeScene'
import Scene2 from './start/Scene2'
import Start from './start/StartScene'

import "./start/base.css"

function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <span style={{ color: '#FFFFFF' }}>{progress} % loaded</span>
    </Html>
  )
}

function Input() {
  useEffect(() => {
    var script = document.createElement("script");
    script.src = "./maze/Box2dWeb.min.js";
    script.async = true;
    document.body.appendChild(script);
    script.src = "./maze/Three.js";
    script.async = true;
    document.body.appendChild(script);
    script.src = "./maze/keyboard.js";
    script.async = true;
    document.body.appendChild(script);
    script.src = "./maze/jquery.js";
    script.async = true;
    document.body.appendChild(script);
    script.src = "./maze/maze.js";
    script.async = true;
    document.body.appendChild(script);
    script.src = "./maze/index.js";
    script.async = true;
    document.body.appendChild(script);
  });

  return <Input />
}

function App(props) {
  const { scene = 1 } = props
  if (scene >= 0) {
    // useEffect(() => {
    var script = document.createElement("script");
    script.src = "./start/temp.js";
    script.async = true;
    document.head.appendChild(script);
    // })
    return (
      <Canvas concurrent shadowMap camera={{ position: [0, 0, 5], fov: 70 }}>
        <color attach="background" args={['#000']} />
        <Suspense fallback={<Loader />}>
          {/* {scene === 1 && <Scene1 />} */}
          {scene === 2 && <Scene2 />}
          {/* {scene === 3 && <MazeScene />} */}
          {scene === 0 && <Start />}
        </Suspense>
        <ambientLight intensity={0.4} />
      </Canvas>
    )
  } else {
    script = document.createElement("script");
    script.src = "./maze/Box2dWeb.min.js";
    script.async = true;
    document.head.appendChild(script);
    script.src = "./maze/Three.js";
    script.async = true;
    document.head.appendChild(script);
    script.src = "./maze/keyboard.js";
    script.async = true;
    document.head.appendChild(script);
    script.src = "./maze/jquery.js";
    script.async = true;
    document.head.appendChild(script);
    script.src = "./maze/maze.js";
    script.async = true;
    document.head.appendChild(script);
    script.src = "./maze/index.js";
    script.async = true;
    document.head.appendChild(script);

    return (
      <NavLink to="/pedro" activeClassName="frame__demo--current" className="frame__demo">
        PEDRO
      </NavLink>
    )
  }
}

function Body() {
  return (
    <Router>
      <main>
        <div className="frame">
          {/* <div className="frame__title-wrap">
            <h1 className="frame__title">Awesome Mirror Effect</h1>
            <p className="frame__tagline">A react-three-fiber based demo</p>
          </div> */}
          {/* <div className="frame__links">
            <a href="https://tympanus.net/Development/MenuFullGrid/">Previous demo</a>
            <a href="https://tympanus.net/codrops/?p=51167">Article</a>
            <a href="https://github.com/emmelleppi/codrops-r3f-mirrors">GitHub</a>
          </div> */}
          <div className="frame__demos">
            {/* <NavLink to="/panna" activeClassName="frame__demo--current" className="frame__demo">
              PANNA
            </NavLink> */}
            <NavLink to="/olga" activeClassName="frame__demo--current" className="frame__demo">
              OLGA
            </NavLink>
            {/* <NavLink to="/pedro" activeClassName="frame__demo--current" className="frame__demo">
              PEDRO
            </NavLink> */}
          </div>
        </div>
        <div className="content">
          <Switch>
            <Route exact path="/">
              <Redirect to="/start" />
            </Route>
            {/* <Route exact path="/scene1">
              <App scene={1} />
            </Route> */}
            <Route exact path="/olga">
              <App scene={2} />
            </Route>
            <Route exact path="/maze">
              <App scene={-1} />
            </Route>
            <Route exact path="/start">
              <App scene={0} />
            </Route>
          </Switch>
        </div>
      </main>
    </Router>
  )
}

render(<Body />, document.querySelector('#root'))
