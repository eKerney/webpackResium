import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import { FormControlLabel, FormGroup } from '@mui/material';
import {useState, useEffect, useMemo, useCallback, useRef} from 'react';
import { GeoJsonDataSource } from 'resium';
import { Viewer, Scene, Globe, Camera, CameraLookAt, CameraFlyTo, Entity, Cesium3DTileset} from "resium";
import { Cartesian3, Color, Math, HeadingPitchRange, CheckerboardMaterialProperty, StripeMaterialProperty, IonResource} from "cesium";
import { alignProperty } from '@mui/material/styles/cssUtils';
//import CheckerboardMaterialProperty from 'cesium/Source/DataSources/CheckerboardMaterialProperty';
//import PolylineDashMaterialProperty from 'cesium';

function LayerControl(props) {
  const [buildings, setBuildings ] = useState(false);
  // const [GPS003, setGPS003 ] = useState(false);
  // const [GPS050, setGPS050 ] = useState(false);
  // const [GPS100, setGPS100 ] = useState(false);
  // const [MDOTairTraffic, setMDOTairTraffic ] = useState(false);
  const [testLayer, setTestLayer ] = useState(false);
  // const [GPSall, setGPSall ] = useState(false);
  // const [MDOTcor, setMDOTcor ] = useState(false);
  const [DETroute, setDETroute ] = useState(true);
  const [HProute, setHProute ] = useState(true);
  const [HFroute, setHFroute ] = useState(true);
  const [MDOTsurface, setMDOTsurface ] = useState(true);
  const [MDOTbuildings, setMDOTbuildings ] = useState(true);
  const [OBSTACLES, setObstacles ] = useState(true);
  const [MTR, setMTR ] = useState(false);
  const [OSM, setOSM ] = useState(true);

  const handleChange = (event) => {
    console.log(event.target.name);
    // event.target.name === 'GPS003' ? setGPS003(GPS003 => !GPS003) : setGPS003(GPS003 => GPS003);
    //event.target.name === 'GPS050' ? setGPS050(GPS050 => !GPS050) : setGPS050(GPS050 => GPS050);
    // event.target.name === 'GPS100' ? setGPS100(GPS100 => !GPS100) : setGPS100(GPS100 => GPS100);
    event.target.name === 'BUILDINGS' ? setBuildings(!buildings) : setBuildings(buildings);
    // event.target.name === 'MDOT' ? setMDOTairTraffic(!MDOTairTraffic) : setMDOTairTraffic(MDOTairTraffic);
    event.target.name === 'TEST' ? setTestLayer(!testLayer) : setTestLayer(testLayer);
    // event.target.name === 'GPSALL' ? setGPSall(!GPSall) : setGPSall(GPSall);
    // event.target.name === 'MDOTCOR' ? setMDOTcor(!MDOTcor) : setMDOTcor(MDOTcor);
    event.target.name === 'DETROUTE' ? setDETroute(!DETroute) : setDETroute(DETroute);
    event.target.name === 'HPROUTE' ? setHProute(!HProute) : setHProute(HProute);
    event.target.name === 'HFROUTE' ? setHFroute(!HFroute) : setHFroute(HFroute);
    event.target.name === 'MDOTSURFACE' ? setMDOTsurface(!MDOTsurface) : setMDOTsurface(MDOTsurface);
    event.target.name === 'OBSTACLES' ? setObstacles(!OBSTACLES) : setObstacles(OBSTACLES);
    event.target.name === 'MTR' ? setMTR(!MTR) : setMTR(MTR);
    event.target.name === 'OSM' ? setOSM(!OSM) : setOSM(OSM);
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
// https://raw.githubusercontent.com/eKerney/dataStore2/main/Insights_Data_Military_Training_Routes_Polyline.geojson

const renderOSM3Dtiles = React.useMemo(() => {
  return (
      <Cesium3DTileset 
        immediatelyLoadDesiredLevelOfDetail={true}
        url={IonResource.fromAssetId(96188)}
      /> 
  )
}, [OSM]);

const renderMTRroutes = React.useMemo(() => {
  return (
    <GeoJsonDataSource data={"https://raw.githubusercontent.com/eKerney/dataStore2/main/Insights_Data_Military_Training_Routes_Polyline.geojson"} 
    onLoad={d => {d.entities.values.forEach(d => {
      const alt1 = d.properties.CRS_ALT1.toString();
      const alt = +alt1.replace(/[^0-9.]/g,"");
      console.log(alt);
      const s = d.polyline.positions._value[0], e = d.polyline.positions._value[1]; 
      (s.z = s.z + alt*10), (e.z = e.z + alt*10);
      d.polyline.positions._value = [s, e]

      d.polyline.material = new Cesium.Color(alt/1000, 0.5 - alt/1000, 0.5, 0.5)
      d.polyline.width = 3;                 
        })
      }}
      //stroke={Color.WHEAT.withAlpha(0.5)}
    /> 
  )
}, [MTR]);

const renderObstacles = React.useMemo(() => {
  return (
    <GeoJsonDataSource data={"https://raw.githubusercontent.com/eKerney/dataStore2/main/wayneGroundObs.geojson"} 
      onLoad={d => {d.entities.values.forEach(d => {
        d.polygon.height = 0;
        d.polygon.extrudedHeight = d._properties.Obs_AGL * 2
        const h = d._properties.Obs_AGL;
        d.polygon.material = Color.GOLD.withAlpha(0.2)
        // d.polygon.material = new StripeMaterialProperty({
        //   evenColor: Color.GOLD.withAlpha(0.5),
        //   oddColor: Color.BLACK.withAlpha(0.1),
        //   repeat: 10
        // });
        // d.polygon.material = h > (90) ? Color.FIREBRICK.withAlpha(0.7) : h > (80) ? Color.ORANGERED.withAlpha(0.6) : 
        // h > (70) ? Color.CORAL.withAlpha(0.5) : h > (60) ? Color.GOLD.withAlpha(0.4) : 
        // h > (50) ? Color.LIGHTGOLDENRODYELLOW.withAlpha(0.4) : 
        // Color.LIGHTGOLDENRODYELLOW.withAlpha(0.2);                     
        })
      }}
      stroke={Color.GOLD.withAlpha(0.1)}
    /> 
  )
}, [OBSTACLES]);

const renderMDOTsurface = React.useMemo(() => {
  return (  
    <GeoJsonDataSource data={"https://raw.githubusercontent.com/eKerney/dataStore2/main/mdotSmallSurface.geojson"} 
      onLoad={d => {d.entities.values.forEach(d => {
        const h = (d._properties.population);
        d.polygon.material = h > (50000) ? Color.RED.withAlpha(0.4) : h >= (25000) ? Color.ORANGERED.withAlpha(0.3) : 
        h >= (10000) ? Color.ORANGE.withAlpha(0.2) : h >= (5000) ? Color.GREEN.withAlpha(0.1) : h >= (1000) ? Color.GREEN.withAlpha(0.0) : Color.LIGHTGREEN.withAlpha(0.0); 
        })
      }}  
      stroke={Color.BLUEVIOLET.withAlpha(0.0)}   
    />
  )
}, [MDOTsurface]);

const renderHFroute = React.useMemo(() => {
  return (  
    <>
    <GeoJsonDataSource data={"https://raw.githubusercontent.com/eKerney/dataStore2/main/MCtoHF-LCP-HEX-10-ATTR.json"} 
      onLoad={d => {d.entities.values.forEach(d => {
        // extend launch/land hexes to ground
        const hexHeight = d._properties.altitude - 25;
        const last = d.entityCollection._entities._array[1].id;
        const first = d.entityCollection._entities._array[d.entityCollection._entities._array.length-1].id;
        d.id == first ? d.polygon.height = 0 : d.id == last ? d.polygon.height = 0 : d.polygon.height = hexHeight;
        
        //console.log(d.id, first, last);
        d.polygon.extrudedHeight = hexHeight + 100;
        d.polygon.material = Color.DEEPPINK.withAlpha(0.3);
      }) 
      }}     
      stroke={Color.FUCHSIA.withAlpha(0.5)}
    />
    <GeoJsonDataSource data={"https://raw.githubusercontent.com/eKerney/dataStore2/main/MCtoHF-LCP-LINE.geojson"} 
      onLoad={d => {d.entities.values.forEach(d => {
        console.log(d.polyline);
        d.polyline.width = 5;
      })
      }}  
      stroke={Color.BLUEVIOLET.withAlpha(0.4)}  
    />
    </>
  )
}, [HFroute]);

const renderHProute = React.useMemo(() => {
  return (  
    <>
    <GeoJsonDataSource data={"https://raw.githubusercontent.com/eKerney/dataStore2/main/MDOT_MCS_HP_H3_25052022131153.geojson"} 
      onLoad={d => {d.entities.values.forEach(d => {
        // extend launch/land hexes to ground
        const hexHeight = d._properties.altitude - 25;
        const last = d.entityCollection._entities._array[1].id;
        const first = d.entityCollection._entities._array[d.entityCollection._entities._array.length-1].id;
        d.id == first ? d.polygon.height = 0 : d.id == last ? d.polygon.height = 0 : d.polygon.height = hexHeight;
        
        //console.log(d.id, first, last);
        d.polygon.extrudedHeight = hexHeight + 75
        d.polygon.material = Color.DEEPPINK.withAlpha(0.3);
      }) 
      }}     
      stroke={Color.FUCHSIA.withAlpha(0.5)}   
    />
    <GeoJsonDataSource data={"https://raw.githubusercontent.com/eKerney/dataStore2/main/MDOT_MCS_HP_GeoJSON_25052022124351.geojson"} 
      onLoad={d => {d.entities.values.forEach(d => {
        console.log(d.polyline);
        d.polyline.width = 5;
      })
      }}  
      stroke={Color.BLUEVIOLET.withAlpha(0.4)}   
    />
    </>
  )
}, [HProute]);

const renderDETroute = React.useMemo(() => {
    return (  
      <>
      <GeoJsonDataSource data={"https://raw.githubusercontent.com/eKerney/dataStore2/main/MCStoFWH-LCP-HEX-10-ATTR.json"} 
        onLoad={d => {d.entities.values.forEach(d => {
          // extend launch/land hexes to ground
          const hexHeight = d._properties.altitude - 25;
          const last = d.entityCollection._entities._array[1].id;
          const first = d.entityCollection._entities._array[d.entityCollection._entities._array.length-1].id;
          d.id == first ? d.polygon.height = 0 : d.id == last ? d.polygon.height = 0 : d.polygon.height = hexHeight;
          
          //console.log(d.id, first, last);
          d.polygon.extrudedHeight = hexHeight + 50;
          d.polygon.material = Color.DEEPPINK.withAlpha(0.3);
        }) 
        }}     
        stroke={Color.FUCHSIA.withAlpha(0.5)}  
      />
      <GeoJsonDataSource data={"https://raw.githubusercontent.com/eKerney/dataStore2/main/MDOT_MCS_FWH_LINE.geojson"} 
        onLoad={d => {d.entities.values.forEach(d => {
          console.log(d.polyline);
          d.polyline.width = 5;
        })
        }}  
        stroke={Color.BLUEVIOLET.withAlpha(0.4)}   
      />
      </>
    )
  }, [DETroute]);

  // const renderMDOTCor = React.useMemo(() => {
  //   return (  
  //     <GeoJsonDataSource data={"https://services5.arcgis.com/DzCDf9ACTMZgB0Wd/ArcGIS/rest/services/Corridor/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&returnCentroid=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&defaultSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pgeojson&token="}    
  //     />
  //   )
  // }, [MDOTcor]);

  const renderTestLayer = React.useMemo(() => {
    return (  
      <GeoJsonDataSource data={"https://raw.githubusercontent.com/eKerney/dataStore2/main/FAAUAS.geojson.json"} 
        onLoad={d => {d.entities.values.forEach(d => {
          const h = (d._properties.CEILING);
          d.polygon.height = 0;
          //d.polygon.extrudedHeight = (d._properties.CEILING);
          d.polygon.extrudedHeight = h == (0) ? 1000 : h <= (50) ? 600 : h <= (100) ? 300 : h <= (200) ? 200 : h <= (300) ? 50 : 0; 
          d.polygon.material = h == (0) ? Color.RED.withAlpha(0.4) : h <= (100) ? Color.ORANGERED.withAlpha(0.4) : 
          h <= (200) ? Color.ORANGE.withAlpha(0.3) : h <= (300) ? Color.GREEN.withAlpha(0.3) : Color.LIGHTGREEN.withAlpha(0.3); 
        })
        }}  
        stroke={Color.GREY.withAlpha(0.1)}   
      />
    )
  }, [testLayer]);

  // const renderMDOTairTraffic = React.useMemo(() => {
  //   return ( 
  //     <GeoJsonDataSource data={"https://raw.githubusercontent.com/eKerney/dataStore/main/mdotDensitySelection.geojson"} 
  //       onLoad={d => {d.entities.values.forEach(d => {
  //         const h = (d._properties.level)*.3048;
  //         const den = d._properties.density;
  //         d.polygon.height = (h) - 100;
  //         d.polygon.extrudedHeight = (h) + 100;
  //         d.polygon.material = den > (20) ? Color.DARKMAGENTA.withAlpha(0.3) : den > (10) ? Color.BLUEVIOLET.withAlpha(0.2) : den > (5) ? Color.MEDIUMPURPLE.withAlpha(0.1) : 
  //         den > (1) ? Color.PLUM.withAlpha(0.2) : den > (.5) ? Color.LIGHTSTEELBLUE.withAlpha(0.2) : Color.LAVENDER.withAlpha(0.2); 
  //       })
  //       }}  
  //       stroke={Color.AQUA.withAlpha(0.0)}   
  //     />
  //   )
  // }, [MDOTairTraffic]);

  const renderMDOTbuildings = React.useMemo(() => {
    return (
      <GeoJsonDataSource data={"https://raw.githubusercontent.com/eKerney/dataStore2/main/mdotBuildings.geojson"} 
        onLoad={d => {d.entities.values.forEach(d => {
          d.polygon.extrudedHeight = 200;
          d.polygon.material = Color.DEEPSKYBLUE.withAlpha(0.6)
          const h = d._properties.median_hgt;
        })
        }}
        stroke={Color.AQUA.withAlpha(0.0)}
      />
    )
  }, [MDOTbuildings]);

  const renderBuildings = React.useMemo(() => {
    return (
      <GeoJsonDataSource data={"https://services5.arcgis.com/UDWrEU6HdWNYIRIV/ArcGIS/rest/services/Building_Footprints_semcog/FeatureServer/0/query?where=1%3D1&geometry=-83.22%2C42.28%2C-83.02%2C42.37&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=median_hgt&returnGeometry=true&returnCentroid=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&defaultSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pgeojson&token="} 
        onLoad={d => {d.entities.values.forEach(d => {
          d.polygon.extrudedHeight = (d._properties.median_hgt * 0.3048) * 2;
          const h = d._properties.median_hgt;
          d.polygon.material = h > (700) ? Color.NAVY.withAlpha(0.5) : h > (400) ? Color.TEAL.withAlpha(0.4) : h > (200) ? Color.LIGHTSEAGREEN.withAlpha(0.3) : 
          h > (100) ? Color.MEDIUMTURQUOISE.withAlpha(0.3) : h > (50) ? Color.PALETURQUOISE.withAlpha(0.2) : Color.ALICEBLUE.withAlpha(0.1); 
        })
        }}
        stroke={Color.AQUA.withAlpha(0.0)}
      />
    )
  }, [buildings]);
  // https://raw.githubusercontent.com/eKerney/dataStore2/main/wayneGroundObs.geojson


  // const renderGPS003 = React.useMemo(() => {
  //   return (
  //     <GeoJsonDataSource data={"https://raw.githubusercontent.com/eKerney/dataStore/main/spirent_gps_202204.geojson"} 
  //       onLoad={d => {d.entities.values.forEach(d => {
  //         d.polygon.height = 0;
  //         d.polygon.extrudedHeight = 50;
  //         d.polygon.material = d._properties._dop_worst_agl003_202204._value < 1 ?
  //                               pdopColBad[d._properties._dop_worst_agl003_202204._value] :
  //                               pdopColBad[d._properties._dop_worst_agl003_202204._value] ;                      
  //         })
  //       }}
  //       stroke={Color.GRAY.withAlpha(0.0)}
  //     /> 
  //   )
  // }, [GPS003]);

  // const renderGPS050 = React.useMemo(() => {
  //   return (
  //     <GeoJsonDataSource data={"https://raw.githubusercontent.com/eKerney/dataStore/main/spirent_gps_202204.geojson"}
  //       onLoad={d => {d.entities.values.forEach(d => {
  //         d.polygon.height = 150;
  //         d.polygon.extrudedHeight = 200;
  //         d.polygon.material = d._properties._dop_worst_agl050_202204._value < 1 ?
  //                               pdopColBad[d._properties._dop_worst_agl050_202204._value] :
  //                               pdopColBad[d._properties._dop_worst_agl050_202204._value] ;
  //         })
  //       }}
  //       stroke={Color.GRAY.withAlpha(0.0)} 
  //   />
  //   )
  // }, [GPS050]);
  // const renderGPS100 = React.useMemo(() => {
  //   return (
  //     <GeoJsonDataSource data={"https://raw.githubusercontent.com/eKerney/dataStore/main/spirent_gps_202204.geojson"}
  //       onLoad={d => {d.entities.values.forEach(d => {
  //         d.polygon.height = 300;
  //         d.polygon.extrudedHeight = 350;
  //         d.polygon.material = d._properties._dop_worst_agl100_202204._value < 1 ?
  //                               pdopColBad[d._properties._dop_worst_agl100_202204._value] :
  //                               pdopColBad[d._properties._dop_worst_agl100_202204._value] ;      
  //         })
  //       }}
  //       stroke={Color.GRAY.withAlpha(0.0)}
  //     />
  //   )
  // }, [GPS100]);
  
  return  (
  <>
    
    <div className="control-panel">
    <h2>4D Data Explorer<br/>Detroit Demo</h2>
        <hr style={{width: '700px', marginLeft: '-100px', marginTop: '26px'}}/>
        <br />
      <FormGroup>          
        
        <FormControlLabel control={<Checkbox name='DETROUTE' checked={DETroute} color="secondary" onChange={handleChange}/>} label="Central to Ford HQ LC Path" />
        <FormControlLabel control={<Checkbox name='HPROUTE' checked={HProute} color="secondary" onChange={handleChange}/>} label="Central to Huntington PL LC Path" />
        <FormControlLabel control={<Checkbox name='HFROUTE' checked={HFroute} color="secondary" onChange={handleChange}/>} label="Central to Henry Ford Hosp. LC Path" />
        <FormControlLabel control={<Checkbox name='OBSTACLES' checked={OBSTACLES} color="secondary" onChange={handleChange}/>} label="Ground Obstacles > 50 ft AGL" />
        <FormControlLabel control={<Checkbox name='MDOTSURFACE' checked={MDOTsurface} color="secondary" onChange={handleChange}/>} label="MDOT Suitability Surface" />
        <FormControlLabel control={<Checkbox name='MTR' checked={MTR} color="secondary" onChange={handleChange}/>} label="Insights MTR Routes - IR,VR,SR " />
        <FormControlLabel control={<Checkbox name='BUILDINGS' checked={buildings} color="secondary" onChange={handleChange}/>} label="3D Buildings" />
        <FormControlLabel control={<Checkbox name='TEST' checked={testLayer} color="secondary" onChange={handleChange}/>} label="UAS Facility Map" />
        <FormControlLabel control={<Checkbox name='OSM' checked={OSM} color="secondary" onChange={handleChange}/>} label="OSM 3D Tile Buildings" />
        {/* <FormControlLabel control={<Checkbox name='MDOT' checked={MDOTairTraffic} color="secondary" onChange={handleChange}/>} label="MDOT AIR Traffic Density" /> */}
        
        {/* <FormControlLabel control={<Checkbox name='GPS003' checked={GPS003} color="secondary" onChange={handleChange}/>} label="GPS Signal Strength 3 meters" />
        <FormControlLabel control={<Checkbox name='GPS050' checked={GPS050} color="secondary" onChange={handleChange}/>} label="GPS Signal Strength 50 meters " />
        <FormControlLabel control={<Checkbox name='GPS100' checked={GPS100} color="secondary" onChange={handleChange}/>} label="GPS Signal Strength 100 meters " /> */}
        
        {/* <FormControlLabel control={<Checkbox name='MDOTCOR' checked={MDOTcor} color="secondary" onChange={handleChange}/>} label="MDOT Corrdior" /> */}
        
      </FormGroup>
    </div>
    {MDOTbuildings && renderMDOTbuildings}
    {/* {MDOTairTraffic && renderMDOTairTraffic}  */}
    {buildings && renderBuildings} 
    {/* { GPS003 && renderGPS003 }
    { GPS050 && renderGPS050 }
    { GPS100 && renderGPS100 } */}
    { testLayer && renderTestLayer }
    {/* { MDOTcor && renderMDOTCor } */}
    { DETroute && renderDETroute }
    { HProute && renderHProute }
    { MDOTsurface && renderMDOTsurface }
    { OBSTACLES && renderObstacles}
    { MTR && renderMTRroutes}
    { HFroute && renderHFroute }
    { OSM && renderOSM3Dtiles }
  </>
  )    
}

export default React.memo(LayerControl);