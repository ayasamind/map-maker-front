import mapboxgl from "mapbox-gl";
import { Marker as MapboxMarker } from "react-map-gl";
import { Coordinate } from "./Map";

export interface MarkerTextProps {
  coord: Coordinate;
  title: string;
}

interface MarkerComponentProps extends MarkerTextProps {
  onClick: (e: mapboxgl.MapboxEvent<MouseEvent>) => void;
}

const MarkerText = (props: MarkerComponentProps) => 
  <MapboxMarker
    latitude={props.coord.lat} longitude={props.coord.lon}
    offset={[0, -30]}
    // onClick={props.onClick}
  >
    {props.title}
  </MapboxMarker>

export default MarkerText;