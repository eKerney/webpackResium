import { useEffect, useState, useRef} from "react";
import { Viewer, Scene, Globe, Camera, CameraLookAt, CameraFlyTo, Entity, Clock, Model, ModelGraphics, BillboardGraphics, PathGraphics} from "resium";
import { IonImageryProvider, Cartesian3, Color, HeadingPitchRange, JulianDate, ClockRange, ClockStep, Math, VelocityOrientationProperty, ImageryLayer, ArcGisMapServerImageryProvider, MapboxImageryProvider, MapboxStyleImageryProvider, UrlTemplateImageryProvider, OpenStreetMapImageryProvider, Cesium3DTileset } from "cesium";
// import { SocketProvider } from "./SocketProvider";
// import { SocketPositions } from "./SocketPositions";
import LayerControl from "./layer-control";
import React from "react";
import arrowASL from './/images/arrowASL.glb';
import AnimateRoute from "./animate-route";

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlMGY2Y2EwNy1lYjBjLTRlOTAtOTc4Yi01OGM4NTc5MTlhZWYiLCJpZCI6ODkzNTgsImlhdCI6MTY0OTcyNDM0OH0.d3owTfwWertUVKZyZ99sH-cWZJaPosgpJaotB5qmzJk';
// const imageryProvider = new OpenStreetMapImageryProvider({
//   url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/'
// });
const imageryProvider = new OpenStreetMapImageryProvider({
  url: 'https://{s}.basemaps.cartocdn.com/dark_all/'
});


const cameraStart = Cartesian3.fromDegrees(-83.00, 42.25, 1500);
const cameraInit = Cartesian3.fromDegrees(-83.03, 42.33, 1500);
//const cameraInitFly = Cartesian3.fromDegrees(-83.17, 42.36, 20000);
const heading = Math.toRadians(-100.0);
const pitch = Math.toRadians(-15.0); 
const range = 1000.0;
const headPitchRange = new HeadingPitchRange(heading, pitch, range);

function App() {  

  const [getAuth, setAuth] = useState(null);
  const ref = useRef(null);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);   
  
  const positions = [[-83.07773394886657,42.32870383650818,0], [-83.07773394886657,42.32870383650818,25], [-83.07773394886657,42.32870383650818,50], [-83.07773394886657,42.32870383650818,75], [-83.07773394886657,42.32870383650818,100], [-83.07773394886657,42.32870383650818,177.38],[-83.10470699965535,42.31577970171769,175.78],[-83.11071802176723,42.316707032117215,177.38],[-83.11137572380132,42.31639168239277,177.67999999999998],[-83.11246864928418,42.316560246336145,180.07999999999998],[-83.11312633987258,42.31624488559678,179.48],[-83.11367280247501,42.31632916017912,179.17999999999998],[-83.11454329734,42.317296982588964,177.67999999999998],[-83.11618272012578,42.31754977829637,178.28],[-83.11748854722816,42.319001482531164,179.48],[-83.11912802248324,42.319254236176704,177.07999999999998],[-83.12173991627661,42.32215756756402,177.98],[-83.12665865687315,42.32291557610308,175.78],[-83.13389280746074,42.3194454352036,176.07999999999998],[-83.13662537325355,42.31986627196219,174.88],[-83.13859813793299,42.318919729574084,176.07999999999998],[-83.13914464876409,42.319003878778666,176.38],[-83.14045978425891,42.31837282240554,175.17999999999998],[-83.14483188373902,42.3190458656391,177.07999999999998],[-83.1454894241062,42.318730304096476,177.07999999999998],[-83.14986158806782,42.319403148800255,175.17999999999998],[-83.15183411594816,42.31845635769776,176.07999999999998],[-83.15456672883741,42.31887674798658,175.78],[-83.1552242131744,42.31856112556553,175.17999999999998],[-83.15533516911498,42.31816143290991,175.78],[-83.15599264073995,42.317845805308124,175.48],[-83.16091135696603,42.31860227212338,181.88],[-83.16551332319625,42.31639254710483,175.48],[-83.1660598392361,42.31647656199672,175.17999999999998],[-83.16737461625893,42.3158451667984,176.07999999999998],[-83.16792893361364,42.31384662060128,175.17999999999998],[-83.16858628439185,42.31353091206366,175.17999999999998],[-83.16891883443209,42.31233177898769,175.48],[-83.17220539769787,42.31075315862835,175.78],[-83.17275187224077,42.31083713841913,175.48],[-83.17362320025399,42.31180452539801,175.78],[-83.17416968518165,42.31188849851691,176.07999999999998],[-83.17547673465096,42.313339561524344,174.38],[-83.17602323452655,42.31342352597545,175.28],[-83.17645893391642,42.3139072085889,176.78],[-83.17700543961479,42.3139911683632,175.57999999999998],[-83.177876865028,42.314958525008365,176.48],[-83.17896989845624,42.315126428530284,176.48],[-83.18094179010016,42.31417908538376,176.78],[-83.18105256339184,42.313779358837586,178.07999999999998],[-83.18170984052135,42.313463568340595,177.48],[-83.1828028560346,42.31363143283487,177.17999999999998],[-83.18543187444352,42.31236820120306,178.07999999999998],[-83.19253649176878,42.31345888394849,174.67999999999998],[-83.19845111249946,42.31061596911101,178.07999999999998],[-83.19954411262223,42.31078366565058,179.28],[-83.20348683664928,42.3088881565654,183.57999999999998],[-83.20457981725781,42.30905580199266,179.88],[-83.20523690802297,42.308739862138594,180.48],[-83.20578339816792,42.30882367746495,178.67999999999998],[-83.20970670327802,42.313175775343154,178.98],[-83.21025323573282,42.3132595700136,178.67999999999998],[-83.21068919228127,42.313743126786015,178.38],[-83.21035744863269,42.31494241982173,178.98], [-83.21035744863269,42.31494241982173,100], [-83.21035744863269,42.31494241982173,50],[-83.21035744863269,42.31494241982173,25], [-83.21035744863269,42.31494241982173,0]];  
  //Clock related animation config
  const timeStepInSeconds = 20;
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
//console.log(positionProperty);
  const airplaneEntity = <React.Fragment>
    <Entity
      name="airplaneEntity"
      availability={new Cesium.TimeIntervalCollection([ new Cesium.TimeInterval({ start: start, stop: stop }) ])}
      position={positionProperty}
      orientation={new VelocityOrientationProperty(positionProperty)}
    >
      <PathGraphics 
        width={0}
        leadTime={100}
        trailTime={500}
        material={new Cesium.PolylineGlowMaterialProperty({ glowPower: 0.2, color: Color.YELLOW})}
      />
      <ModelGraphics
      uri={arrowASL}
      minimumPixelSize={0}
      maximumScale={0}
      />
      {/* <BillboardGraphics image={arrow} scale={0.1} /> */}
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
        multiplier={30} // how much time to advance each tick
        shouldAnimate={true} // Animation on by default
      />
      { airplaneEntity }
    
    
      <Camera position={cameraInit}>
         <LayerControl />
         <AnimateRoute 
            url={"https://raw.githubusercontent.com/eKerney/dataStore2/main/MDOT_MCS_HP_PTS_25052022125628.geojson"}
            timeStepSec={320} width={10} color={Color.AQUA}
            />
           <AnimateRoute 
            url={"https://raw.githubusercontent.com/eKerney/dataStore2/main/MDOT_MCS_FWH_PTS.geojson"}
            timeStepSec={25} width={10} color={Color.YELLOW}
            />
            <AnimateRoute 
            url={"https://raw.githubusercontent.com/eKerney/dataStore2/main/MCtoHF-LCP-10-PTS.geojson"}
            timeStepSec={100} width={10} color={Color.BLUEVIOLET}
            />
            
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
