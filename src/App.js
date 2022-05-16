import { useEffect, useState, useRef} from "react";
import { Viewer, Scene, Globe, Camera, CameraLookAt, CameraFlyTo, Entity, Clock, Model, ModelGraphics, BillboardGraphics, PathGraphics} from "resium";
import { IonImageryProvider, Cartesian3, Color, HeadingPitchRange, JulianDate, ClockRange, ClockStep, Math, VelocityOrientationProperty, ImageryLayer, ArcGisMapServerImageryProvider, MapboxImageryProvider, MapboxStyleImageryProvider, UrlTemplateImageryProvider, OpenStreetMapImageryProvider } from "cesium";
import axios from 'axios';
// import { SocketProvider } from "./SocketProvider";
// import { SocketPositions } from "./SocketPositions";
import LayerControl from "./layer-control";
import React from "react";
import drone from './/images/uav4.png';
import plane3D from './/images/Cesium_Air.glb';
import drone3D from './/images/drone.glb';
import { color } from "@mui/system";
//import droneTrans from 'https://raw.githubusercontent.com/eKerney/reactResiumSocket/main/src/uav4.png';
//Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlMGY2Y2EwNy1lYjBjLTRlOTAtOTc4Yi01OGM4NTc5MTlhZWYiLCJpZCI6ODkzNTgsImlhdCI6MTY0OTcyNDM0OH0.d3owTfwWertUVKZyZ99sH-cWZJaPosgpJaotB5qmzJk';

// var streetsLayer = new MapboxStyleImageryProvider({
//   styleId: 'satellite-streets-v11',
//   accessToken: 'pk.eyJ1IjoiZXJpY2tlcm5leSIsImEiOiJja2FjbTNiMXcwMXp1MzVueDFjdDNtcW92In0.LW0qdB-2FmA3UK51M67fAQ'
// });

// const streetsLayer = new UrlTemplateImageryProvider({
//   url: `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZXJpY2tlcm5leSIsImEiOiJja2FjbTNiMXcwMXp1MzVueDFjdDNtcW92In0.LW0qdB-2FmA3UK51M67fAQ`
// });

const imageryProvider = new OpenStreetMapImageryProvider({
  url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/'
});

// //Mapbox style provider
// const mapbox = MapboxImageryProvider({
//   styleId: 'streets-v11',
//   accessToken: 'pk.eyJ1IjoiZXJpY2tlcm5leSIsImEiOiJja2FjbTNiMXcwMXp1MzVueDFjdDNtcW92In0.LW0qdB-2FmA3UK51M67fAQ',
//   defaultAlpha: '0.5'
// }); 


const cameraStart = Cartesian3.fromDegrees(-83.08, 40.31, 60000);
const cameraInit = Cartesian3.fromDegrees(-83.12, 42.32, 1500);
const cameraInitFly = Cartesian3.fromDegrees(-83.17, 42.34, 20000);
const heading = Math.toRadians(50.0);
const pitch = Math.toRadians(-15.0); 
const range = 1000.0;
const headPitchRange = new HeadingPitchRange(heading, pitch, range);

function App() {  

  const [getAuth, setAuth] = useState(null);
  const ref = useRef(null);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);   
  
  const positions = [[-83.07773394886657,42.32870383650818,177.38,177.38],[-83.07903908157921,42.330155968730395,178.57999999999998,178.57999999999998],[-83.07892758683879,42.33055556072482,178.88,178.88],[-83.07936264398988,42.33103960221938,179.78,179.78],[-83.07925114846532,42.33143919445963,179.48,179.48],[-83.08577772407307,42.33869964103634,180.07999999999998,180.07999999999998],[-83.08432834191889,42.34389441119713,181.88,181.88],[-83.08955074362231,42.349702594548724,182.48,182.48],[-83.08464324517657,42.36728486281246,188.57999999999998,188.57999999999998],[-83.08507853873675,42.367768888789136,188.88,188.88]];
  //Clock related animation config
  const timeStepInSeconds = 30;
  const totalSeconds = timeStepInSeconds * (positions.length - 1);
  const start = Cesium.JulianDate.fromIso8601("2020-03-09T23:10:00Z");
  const stop = Cesium.JulianDate.addSeconds(start, totalSeconds, new Cesium.JulianDate());

  const positionProperty = new Cesium.SampledPositionProperty();   

  for (let i = 0; i < positions.length; i++) {
    const dataPoint = positions[i];
    // Declare the time for this individual sample and store it in a new JulianDate instance.
    const time = Cesium.JulianDate.addSeconds(start, i * timeStepInSeconds, new Cesium.JulianDate());
    const position = Cesium.Cartesian3.fromDegrees(dataPoint[0], dataPoint[1], dataPoint[2]);
    // Store the position along with its timestamp.
    // Here we add the positions all upfront, but these can be added at run-time as samples are received from a server.
    positionProperty.addSample(time, position);

  // add flight points to map if needed
  //   if (ref.current) {
  //     ref.current.cesiumElement.entities.add({
  //     description: `Location: (${dataPoint[0]}, ${dataPoint[1]}, ${dataPoint[2]})`,
  //     position: position,
  //     point: { pixelSize: 10, color: Color.PURPLE.withAlpha(0.5) }
  //   });
  // }
};
  const airplaneEntity = <React.Fragment>
    <Entity
      name="airplaneEntity"
      availability={new Cesium.TimeIntervalCollection([ new Cesium.TimeInterval({ start: start, stop: stop }) ])}
      position={positionProperty}
      orientation={new VelocityOrientationProperty(positionProperty)}
    >
      <PathGraphics 
        width={8}
        leadTime={20}
        trailTime={100}
        material={new Cesium.PolylineGlowMaterialProperty({ glowPower: 0.2, color: Color.YELLOW})}
      />
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
        imageryProvider={imageryProvider}
    >
        <Clock 
        startTime={start.clone()}
        currentTime={start.clone()}
        stopTime={stop.clone()}
        clockRange={ClockRange.LOOP_STOP} // loop when we hit the end time
        clockStep={ClockStep.SYSTEM_CLOCK_MULTIPLIER}
        multiplier={5} // how much time to advance each tick
        shouldAnimate={true} // Animation on by default
      />

     
      {airplaneEntity}
    
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
