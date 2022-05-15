import { useEffect, useState, useRef} from "react";
import { Viewer, Scene, Globe, Camera, CameraLookAt, CameraFlyTo, Entity, Clock} from "resium";
import { Cartesian3, Color, Math, HeadingPitchRange, JulianDate, ClockRange, ClockStep } from "cesium";
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
  
  const position = Cartesian3.fromDegrees(-83.087383, 42.3317244, 100);
  const pointGraphics = { pixelSize: 10 };

  Cesium.Math.setRandomNumberSeed(3);
  const start = Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16));
  const stop = Cesium.JulianDate.addSeconds(start,36000,new Cesium.JulianDate());
  console.log(start, stop, ClockStep.SYSTEM_CLOCK_MULTIPLIER);

  function computeCirclularFlight(lon, lat, radius) {
    const property = new Cesium.SampledPositionProperty();
    for (let i = 0; i <= 360; i += 45) {
      const radians = Cesium.Math.toRadians(i);
      const time = Cesium.JulianDate.addSeconds(
        start,
        i,
        new Cesium.JulianDate()
      );
      const position = Cesium.Cartesian3.fromDegrees(
        lon + radius * 1.5 * Math.cos(radians),
        lat + radius * Math.sin(radians),
        Cesium.Math.nextRandomNumber() * 500 + 1750
      );
      property.addSample(time, position);
  
      //Also create a point for each sample we generate.
      viewer.entities.add({
        position: position,
        point: {
          pixelSize: 8,
          color: Cesium.Color.TRANSPARENT,
          outlineColor: Cesium.Color.YELLOW,
          outlineWidth: 3,
        },
      });
    }
    return property;
  }

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
    >
        <Clock 
        startTime={start.clone()}
        currentTime={start.clone()}
        stopTime={stop.clone()}
        clockRange={ClockRange.LOOP_STOP} // loop when we hit the end time
        clockStep={ClockStep.SYSTEM_CLOCK_MULTIPLIER}
        multiplier={1000} // how much time to advance each tick
        shouldAnimate={true} // Animation on by default
      />
       <Entity position={position} point={pointGraphics} />

      <Camera position={cameraInit}>
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