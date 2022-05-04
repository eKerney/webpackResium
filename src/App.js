import { useEffect, useState, useRef} from "react";
import { Viewer, Scene, Globe, Camera, CameraLookAt, CameraFlyTo} from "resium";
import { Cartesian3, Color, Math, HeadingPitchRange } from "cesium";
import axios from 'axios';
// import { SocketProvider } from "./SocketProvider";
// import { SocketPositions } from "./SocketPositions";
import LayerControl from "./layer-control";
import React from "react";

//Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlMGY2Y2EwNy1lYjBjLTRlOTAtOTc4Yi01OGM4NTc5MTlhZWYiLCJpZCI6ODkzNTgsImlhdCI6MTY0OTcyNDM0OH0.d3owTfwWertUVKZyZ99sH-cWZJaPosgpJaotB5qmzJk';

const cameraStart = Cartesian3.fromDegrees(-83.08, 40.31, 60000);
const cameraInit = Cartesian3.fromDegrees(-83.18, 42.35, 2000);
const heading = Math.toRadians(100.0);
const pitch = Math.toRadians(-20.0); 
const range = 5000.0;
const headPitchRange = new HeadingPitchRange(heading, pitch, range);

function App() {  

  const [getAuth, setAuth] = useState(null);
  const ref = useRef(null);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);   
     
  return (
    
    <Viewer full
        ref={ref}
        baseLayerPicker={true}
        infoBox={true}
        homeButton={false}
        timeline={false}
        scene3DOnly={true}
        shadows={true}
        fullscreenButton={false}
        animation={false}  
    >
      <Camera position={cameraStart}>
         <LayerControl />
        {/*
        {isLoaded ? <SocketProvider auth={getAuth}>
        <SocketPositions></SocketPositions>
        <Scene backgroundColor={Color.CORNFLOWERBLUE} />
        <Globe />
        </SocketProvider> : <div>STILL WAITING...</div>} */}
  
      </Camera>
      <CameraFlyTo destination={cameraInit} orientation={headPitchRange}/>
    </Viewer> 
  
  );
}

export default App;