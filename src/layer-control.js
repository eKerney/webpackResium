
import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import { FormControlLabel, FormGroup } from '@mui/material';
import {useState, useEffect, useMemo, useCallback, useRef} from 'react';
import { GeoJsonDataSource, Viewer } from 'resium';
import { Color } from "cesium";

function LayerControl(props) {
  const [buildings, setBuildings ] = useState(false);
  const [GPS003, setGPS003 ] = useState(false);
  const [GPS050, setGPS050 ] = useState(false);
  const [GPS100, setGPS100 ] = useState(false);
  const [MDOTairTraffic, setMDOTairTraffic ] = useState(false);
  const [testLayer, setTestLayer ] = useState(false);
  const [GPSall, setGPSall ] = useState(false);

  const handleChange = (event) => {
    console.log('In handleChange()');
    console.log(event.target.name);
    event.target.name === 'GPS003' ? setGPS003(GPS003 => !GPS003) : setGPS003(GPS003 => GPS003);
    event.target.name === 'GPS050' ? setGPS050(GPS050 => !GPS050) : setGPS050(GPS050 => GPS050);
    event.target.name === 'GPS100' ? setGPS100(GPS100 => !GPS100) : setGPS100(GPS100 => GPS100);
    event.target.name === 'BUILDINGS' ? setBuildings(!buildings) : setBuildings(buildings);
    event.target.name === 'MDOT' ? setMDOTairTraffic(!MDOTairTraffic) : setMDOTairTraffic(MDOTairTraffic);
    event.target.name === 'TEST' ? setTestLayer(!testLayer) : setTestLayer(testLayer);
    event.target.name === 'GPSALL' ? setGPSall(!GPSall) : setGPSall(GPSall);
  };
  const pdopColor = {
    1:Color.GREEN, 2:Color.CHARTREUSE, 3:Color.GREENYELLOW, 4:Color.YELLOW, 5:Color.DARKORANGE, 6:Color.RED
  };
  const pdopColAll = {
    1:Color.GREEN.withAlpha(0.1), 2:Color.CHARTREUSE.withAlpha(0.2), 3:Color.GREENYELLOW.withAlpha(0.3), 
    4:Color.YELLOW.withAlpha(0.3), 5:Color.DARKORANGE.withAlpha(0.3), 6:Color.RED.withAlpha(0.3),
    '-99999':Color.BLACK.withAlpha(0.5)
  };
  const pdopColBad = {
    1:Color.GREEN.withAlpha(0.05), 2:Color.CHARTREUSE.withAlpha(0.2), 3:Color.GREENYELLOW.withAlpha(0.3), 
    4:Color.YELLOW.withAlpha(0.3), 5:Color.DARKORANGE.withAlpha(0.3), 6:Color.RED.withAlpha(0.3),
    '-99999':Color.GREY.withAlpha(0.3)
  };

  const renderTestLayer = React.useMemo(() => {
    return (  
      <GeoJsonDataSource data={"https://raw.githubusercontent.com/eKerney/dataStore2/main/FAAUAS.geojson.json"} 
        onLoad={d => {d.entities.values.forEach(d => {
          //console.log(d._properties);
          const h = (d._properties.CEILING);
          d.polygon.height = 0;
          d.polygon.extrudedHeight = (d._properties.CEILING);
          d.polygon.material = h == (0) ? Color.RED.withAlpha(0.5) : h <= (100) ? Color.ORANGERED.withAlpha(0.4) : 
          h <= (200) ? Color.ORANGE.withAlpha(0.3) : h <= (300) ? Color.GREEN.withAlpha(0.2) : Color.LIGHTGREEN.withAlpha(0.2); 
        })
        }}  
        stroke={Color.GREY.withAlpha(0.1)}   
      />
    )
  }, [testLayer]);

  const renderMDOTairTraffic = React.useMemo(() => {
    return ( 
      <GeoJsonDataSource data={"https://raw.githubusercontent.com/eKerney/dataStore/main/mdotDensitySelection.geojson"} 
        onLoad={d => {d.entities.values.forEach(d => {
          const h = (d._properties.level)*.3048;
          const den = d._properties.density;
          d.polygon.height = (h) - 100;
          d.polygon.extrudedHeight = (h) + 100;
          d.polygon.material = den > (20) ? Color.DARKMAGENTA.withAlpha(0.3) : den > (10) ? Color.BLUEVIOLET.withAlpha(0.2) : den > (5) ? Color.MEDIUMPURPLE.withAlpha(0.1) : 
          den > (1) ? Color.PLUM.withAlpha(0.2) : den > (.5) ? Color.LIGHTSTEELBLUE.withAlpha(0.2) : Color.LAVENDER.withAlpha(0.2); 
        })
        }}  
        stroke={Color.AQUA.withAlpha(0.0)}   
      />
    )
  }, [MDOTairTraffic]);

  const renderBuildings = React.useMemo(() => {
    return (
      <GeoJsonDataSource data={"https://services5.arcgis.com/UDWrEU6HdWNYIRIV/ArcGIS/rest/services/buildingsClippedDet/FeatureServer/0/query?where=1%3D1&geometry=-83.12%2C+42.23%2C+-83.01%2C+42.39&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&returnCentroid=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&sqlFormat=none&f=pgeojson&token="} 
        onLoad={d => {d.entities.values.forEach(d => {
          d.polygon.extrudedHeight = (d._properties.median_hgt * 2);
          const h = d._properties.median_hgt;
          d.polygon.material = h > (700) ? Color.NAVY.withAlpha(0.5) : h > (400) ? Color.TEAL.withAlpha(0.5) : h > (200) ? Color.LIGHTSEAGREEN.withAlpha(0.5) : 
          h > (100) ? Color.MEDIUMTURQUOISE.withAlpha(0.6) : h > (50) ? Color.PALETURQUOISE.withAlpha(0.6) : Color.ALICEBLUE.withAlpha(0.5); 
        })
        }}
        stroke={Color.AQUA.withAlpha(0.0)}
      />
    )
  }, [buildings]);

  const renderGPS003 = React.useMemo(() => {
    return (
      <GeoJsonDataSource data={"https://raw.githubusercontent.com/eKerney/dataStore/main/spirent_gps_202204.geojson"} 
        onLoad={d => {d.entities.values.forEach(d => {
          d.polygon.height = 0;
          d.polygon.extrudedHeight = 50;
          d.polygon.material = d._properties._dop_worst_agl003_202204._value < 1 ?
                                pdopColBad[d._properties._dop_worst_agl003_202204._value] :
                                pdopColBad[d._properties._dop_worst_agl003_202204._value] ;                      
          })
        }}
        stroke={Color.GRAY.withAlpha(0.0)}
      /> 
    )
  }, [GPS003]);

  const renderGPS050 = React.useMemo(() => {
    return (
      <GeoJsonDataSource data={"https://raw.githubusercontent.com/eKerney/dataStore/main/spirent_gps_202204.geojson"}
        onLoad={d => {d.entities.values.forEach(d => {
          d.polygon.height = 150;
          d.polygon.extrudedHeight = 200;
          d.polygon.material = d._properties._dop_worst_agl050_202204._value < 1 ?
                                pdopColBad[d._properties._dop_worst_agl050_202204._value] :
                                pdopColBad[d._properties._dop_worst_agl050_202204._value] ;
          })
        }}
        stroke={Color.GRAY.withAlpha(0.0)} 
    />
    )
  }, [GPS050]);

  const renderGPS100 = React.useMemo(() => {
    return (
      <GeoJsonDataSource data={"https://raw.githubusercontent.com/eKerney/dataStore/main/spirent_gps_202204.geojson"}
        onLoad={d => {d.entities.values.forEach(d => {
          d.polygon.height = 300;
          d.polygon.extrudedHeight = 350;
          d.polygon.material = d._properties._dop_worst_agl100_202204._value < 1 ?
                                pdopColBad[d._properties._dop_worst_agl100_202204._value] :
                                pdopColBad[d._properties._dop_worst_agl100_202204._value] ;      
          })
        }}
        stroke={Color.GRAY.withAlpha(0.0)}
      />
    )
  }, [GPS100]);
  
  return  (
  <>
    
    <div className="control-panel">
    <h2>AIRHUB SPHERE <br/> **DRAFT**</h2>
        <hr style={{width: '800px', marginLeft: '-100px', marginTop: '26px'}}/>
        <br />
      <FormGroup>
        <FormControlLabel control={<Checkbox name='BUILDINGS' checked={buildings} color="secondary" onChange={handleChange}/>} label="3D Buildings" />
        <FormControlLabel control={<Checkbox name='TEST' checked={testLayer} color="secondary" onChange={handleChange}/>} label="UAS Facility Map" />
        <FormControlLabel control={<Checkbox name='MDOT' checked={MDOTairTraffic} color="secondary" onChange={handleChange}/>} label="MDOT AIR Traffic Density" />
        {/* <FormControlLabel control={<Checkbox name='MDOT' checked={MDOTairTraffic} color="secondary" onChange={handleChange}/>} label="MDOT Air Traffic Density" /> */}
        <FormControlLabel control={<Checkbox name='GPS003' checked={GPS003} color="secondary" onChange={handleChange}/>} label="GPS Signal Strength 3 meters" />
        <FormControlLabel control={<Checkbox name='GPS050' checked={GPS050} color="secondary" onChange={handleChange}/>} label="GPS Signal Strength 50 meters " />
        <FormControlLabel control={<Checkbox name='GPS100' checked={GPS100} color="secondary" onChange={handleChange}/>} label="GPS Signal Strength 100 meters " />

        {/* <FormControlLabel control={<Checkbox name='GPSALL' checked={GPSall} color="secondary" onChange={handleChange}/>} label="GPS ALL" /> */}
      </FormGroup>
    </div>
    {MDOTairTraffic && renderMDOTairTraffic} 
    {buildings && renderBuildings} 
    { GPS003 && renderGPS003 }
    { GPS050 && renderGPS050 }
    { GPS100 && renderGPS100 }
    { testLayer && renderTestLayer }
      {/* { MDOTairTraffic && 
      <GeoJSON dataURL={'https://raw.githubusercontent.com/eKerney/dataStore/main/mdotDensitySelection.geojson'} 
        symbolObj={pdopColor} heightExtrude={[0,100]} symbolProp={'density'} />
     } */}
  </>
  )    
}

export default React.memo(LayerControl);

