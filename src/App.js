import { useEffect, useState, useRef} from "react";
import { Viewer, Scene, Globe, Camera, CameraLookAt, CameraFlyTo, Entity, Clock, Model, ModelGraphics, BillboardGraphics} from "resium";
import { Cartesian3, Color, HeadingPitchRange, JulianDate, ClockRange, ClockStep, Math, VelocityOrientationProperty } from "cesium";
import axios from 'axios';
// import { SocketProvider } from "./SocketProvider";
// import { SocketPositions } from "./SocketPositions";
import LayerControl from "./layer-control";
import React from "react";
import drone from './/images/uav4.png';
import drone3D from './/images/Cesium_Air.glb';
//import droneTrans from 'https://raw.githubusercontent.com/eKerney/reactResiumSocket/main/src/uav4.png';

//Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlMGY2Y2EwNy1lYjBjLTRlOTAtOTc4Yi01OGM4NTc5MTlhZWYiLCJpZCI6ODkzNTgsImlhdCI6MTY0OTcyNDM0OH0.d3owTfwWertUVKZyZ99sH-cWZJaPosgpJaotB5qmzJk';

const cameraStart = Cartesian3.fromDegrees(-83.08, 40.31, 60000);
const cameraInit = Cartesian3.fromDegrees(-83.18, 42.35, 2000);
const cameraInitFly = Cartesian3.fromDegrees(-83.18, 42.35, 20000);
const heading = Math.toRadians(100.0);
const pitch = Math.toRadians(-20.0); 
const range = 5000.0;
const headPitchRange = new HeadingPitchRange(heading, pitch, range);

function App() {  

  const [getAuth, setAuth] = useState(null);
  const ref = useRef(null);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);   
  
  const position2 = Cartesian3.fromDegrees(-83.087383, 42.3317244, 100);
  const pointGraphics = { pixelSize: 10 };

  const positions = [[-83.08507853873675,42.367768888789136,188.88],[-83.08464324517657,42.36728486281246,188.57999999999998],[-83.08955074362231,42.349702594548724,182.48],[-83.08432834191889,42.34389441119713,181.88],[-83.08577772407307,42.33869964103634,180.07999999999998],[-83.07925114846532,42.33143919445963,179.48],[-83.07936264398988,42.33103960221938,179.78],[-83.07892758683879,42.33055556072482,178.88],[-83.07903908157921,42.330155968730395,178.57999999999998],[-83.07773394886657,42.32870383650818,177.38]];
  
  
  const timeStepInSeconds = 30;
  const totalSeconds = timeStepInSeconds * (positions.length - 1);
  const start = Cesium.JulianDate.fromIso8601("2020-03-09T23:10:00Z");
  const stop = Cesium.JulianDate.addSeconds(start, totalSeconds, new Cesium.JulianDate());

  if (ref.current) {
    ref.current.cesiumElement.zoomTo(start, stop);
    console.log(ref.current.cesiumElement);
  };

  const positionProperty = new Cesium.SampledPositionProperty();   

  for (let i = 0; i < positions.length; i++) {
    //const dataPoint = flightData[i];
    const dataPoint = positions[i];
    // Declare the time for this individual sample and store it in a new JulianDate instance.
    const time = Cesium.JulianDate.addSeconds(start, i * timeStepInSeconds, new Cesium.JulianDate());
    const position = Cesium.Cartesian3.fromDegrees(dataPoint[0], dataPoint[1], dataPoint[2]);
    // Store the position along with its timestamp.
    // Here we add the positions all upfront, but these can be added at run-time as samples are received from a server.
    positionProperty.addSample(time, position);
  
    if (ref.current) {
      ref.current.cesiumElement.entities.add({
      description: `Location: (${dataPoint[0]}, ${dataPoint[1]}, ${dataPoint[2]})`,
      position: position,
      point: { pixelSize: 10, color: Color.PURPLE.withAlpha(0.5) }
    });
  }
};

  const airplaneEntity = <React.Fragment>
    <Entity
      name="airplaneEntity"
      availability={new Cesium.TimeIntervalCollection([ new Cesium.TimeInterval({ start: start, stop: stop }) ])}
      position={positionProperty}
      orientation={new VelocityOrientationProperty(positionProperty)}
      //point={{ pixelSize: 30, color: Cesium.Color.GREEN }}
      //path={new Cesium.PathGraphics({ width: 3 })}    
    >
      {/* <BillboardGraphics
        image={drone}
        scale={0.2}
      /> */}
      <ModelGraphics
      uri={drone3D}
      minimumPixelSize={128}
      />
    </Entity>
  </React.Fragment>

  return (
    
    <Viewer full
        ref={ref}
        baseLayerPicker={true}
        infoBox={true}
        // homeButton={false}
        // timeline={false}
        scene3DOnly={true}
        shadows={true}
        fullscreenButton={false}
        animation={true}
        trackedEntity={airplaneEntity}  
    >
      
        <Clock 
        startTime={start.clone()}
        currentTime={start.clone()}
        stopTime={stop.clone()}
        clockRange={ClockRange.LOOP_STOP} // loop when we hit the end time
        clockStep={ClockStep.SYSTEM_CLOCK_MULTIPLIER}
        multiplier={10} // how much time to advance each tick
        shouldAnimate={true} // Animation on by default
      />
      {airplaneEntity}
      

      <Camera position={cameraInitFly}>
         <LayerControl />
        {/*
        {isLoaded ? <SocketProvider auth={getAuth}>
        <SocketPositions></SocketPositions>
        <Scene backgroundColor={Color.CORNFLOWERBLUE} />
        <Globe />
        </SocketProvider> : <div>STILL WAITING...</div>} */}
  
      </Camera>
      {/* <CameraFlyTo destination={cameraInit} orientation={headPitchRange}/> */}
    </Viewer> 
  
  );
}

export default App;
