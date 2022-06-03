import React from 'react';
import useFetch from "react-fetch-hook";
import arrowASL from './/images/arrowASL.glb';
import { GeoJsonDataSource, PathGraphics, Entity, ModelGraphics } from 'resium';
import { TimeInterval, Cartesian3, Color, JulianDate, ClockRange, ClockStep, VelocityOrientationProperty, SampledPositionProperty, TimeIntervalCollection} from "cesium";

function AnimateRoute(props) {
    const { isLoading, data, error } = useFetch(
        props.url
      );

    //const getPositions = (features) => features.map(d => [d.geometry.coordinates[0], d.geometry.coordinates[1], d.properties.altitude] );
    const getPositions = (features) => {
      const timeStepSec = props.timeStepSec, totalSec = timeStepSec * (features.length - 1);
      const start = JulianDate.fromIso8601("2020-03-09T23:10:00Z"), stop = JulianDate.addSeconds(start, totalSec, new JulianDate());
      const positionProperty = new SampledPositionProperty();
      // reverse array to start from Michigan Central Station
      features.reverse()
      features.forEach((d,i) => positionProperty.addSample(JulianDate.addSeconds(start,i*timeStepSec,new JulianDate()), 
      Cartesian3.fromDegrees(d.geometry.coordinates[0], d.geometry.coordinates[1], d.properties.altitude) ));
      return (
      <React.Fragment>
        <Entity
          name="animatedArrow"
          availability={new TimeIntervalCollection([ new TimeInterval({ start: start, stop: stop }) ])}
          position={positionProperty}
          orientation={new VelocityOrientationProperty(positionProperty)}
        >
          <PathGraphics 
            width={props.width}
            leadTime={100}
            trailTime={500}
            material={new Cesium.PolylineGlowMaterialProperty({ glowPower: 0.2, color: props.color})}
          />
          <ModelGraphics
          uri={arrowASL}
          minimumPixelSize={164}
          maximumScale={6000}
          />
        </Entity>
      </React.Fragment>
      )
    };
  
    return (
        <>
            { !isLoading && getPositions(data.features) }
        </>
    )
};

export default React.memo(AnimateRoute);
