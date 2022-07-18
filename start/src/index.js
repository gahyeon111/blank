import { render } from 'react-dom'
import React, { Suspense } from 'react'
import { Canvas } from 'react-three-fiber'
import { useProgress, Html } from '@react-three/drei'
import { HashRouter as Router, Switch, Route, NavLink, Redirect } from 'react-router-dom'

import Scene1 from './Scene1'
import Scene2 from './Scene2'
import Scene3 from './Scene3'

import "./base.css"

function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <span style={{ color: '#FFFFFF' }}>{progress} % loaded</span>
    </Html>
  )
}

function App(props) {
  const { scene = 1 } = props
  return (
    <Canvas concurrent shadowMap camera={{ position: [0, 0, 5], fov: 70 }}>
      <color attach="background" args={['#000']} />
      <Suspense fallback={<Loader />}>
        {scene === 1 && <Scene1 />}
        {scene === 2 && <Scene2 />}
        {scene === 3 && <Scene3 />}
      </Suspense>
      <ambientLight intensity={0.4} />
    </Canvas>
  )
}

function Body() {
  const newLocal = "frame__demo--current"
  const newLocal_1 = "frame__demo"
  const newLocal_2 = "/pedro"
  return (
    <Router>
      <main>
        <div className="frame">
          <div className="frame__title-wrap">
            <h1 className="frame__title">Awesome Mirror Effect</h1>
            <p className="frame__tagline">A react-three-fiber based demo</p>
          </div>
          <div className="frame__demos">
            <NavLink to="/panna" activeClassName="frame__demo--current" className="frame__demo">
              PANNA
            </NavLink>
            <NavLink to="/olga" activeClassName="frame__demo--current" className="frame__demo">
              OLGA
            </NavLink>
            <NavLink to={newLocal_2} activeClassName={newLocal} className={newLocal_1}>
              PEDRO
            </NavLink>
          </div>
        </div>
        <div className="content">
          <Switch>
            <Route exact path="/">
              <Redirect to="/panna" />
            </Route>
            <Route exact path="/panna">
              <App scene={1} />
            </Route>
            <Route exact path="/olga">
              <App scene={2} />
            </Route>
            <Route exact path="/pedro">
              <App scene={3} />
            </Route>
          </Switch>
        </div>
      </main>
    </Router>
  )
}

render(<Body />, document.querySelector('#root'))
