import mapboxgl from "mapbox-gl";
import { ReactElement } from "react";
import { Marker as MapboxMarker, MarkerDragEvent } from "react-map-gl";
import { Coordinate } from "./Map";
import styles from './Marker.module.css';

export interface MarkerProps {
  coord: Coordinate;
  title: string;
  img?: ReactElement;
  text?: React.ReactNode;
  draggable?: boolean;
  onDragStart?: (e: MarkerDragEvent) => void;
  onDrag?: (e: MarkerDragEvent) => void;
  onDragEnd?: (e: MarkerDragEvent) => void;
}

interface MarkerComponentProps extends MarkerProps {
  onClick: (e: mapboxgl.MapboxEvent<MouseEvent>) => void;
}

const Marker = (props: MarkerComponentProps) => 
  <MapboxMarker
    latitude={props.coord.lat} longitude={props.coord.lon}
    // onClick={props.onClick}
    draggable={props.draggable}
    onDragStart={props.onDragStart}
    onDrag={props.onDrag}
    onDragEnd={props.onDragEnd}
  >
    <div className={styles.markerContainer}>
      <div>{props.text}</div>
      {props.img != null ? props.img : '●'}
    </div>
  </MapboxMarker>

export default Marker;