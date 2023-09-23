import Mapbox, { MarkerDragEvent, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Marker, { MarkerProps } from "./Marker";
import mapboxgl from "mapbox-gl";
import { useMapPins, useSetMapPins } from "@/hooks/MapPinsContext";
import { MouseEventHandler, useState } from "react";
import Popup from "./Popup";

export interface Coordinate {
  lat: number;
  lon: number;
}

export interface MapProps {
  height: string;
  width: string;
  coord: Coordinate;
  zoom: number;
  onClick: (e: mapboxgl.MapLayerMouseEvent) => void;
  readOnlyMarkers?: MarkerProps[];
}

const Map = (props: MapProps) => {
  const mapPins = useMapPins();
  const setMapPins = useSetMapPins();
  const [menuPopupIdx, setMenuPopupIdx] = useState<number|null>(null);

  const onMarkerClick = (e: mapboxgl.MapboxEvent<MouseEvent>, idx: number) => {
    e.originalEvent.stopPropagation();
    setMenuPopupIdx(idx);
  }

  const onMarkerDragEnd = (e: MarkerDragEvent, idx: number) => {
    setMapPins((pins) => {
      const tailSlice = pins.splice(idx+1);
      const update: MarkerProps = {...pins.splice(idx, 1)[0], coord: { lat: e.lngLat.lat, lon: e.lngLat.lng }};
      const headSlice = pins;

      return [...headSlice, update, ...tailSlice];
    })
  }

  const onMenuPopupSubmit: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (menuPopupIdx === null) return;
    setMenuPopupIdx(null);    
    setMapPins((pins) => {
      const tailSlice = pins.splice(menuPopupIdx+1);
      pins.splice(menuPopupIdx, 1)
      const headSlice = pins;

      return [...headSlice, ...tailSlice];
    });
  }

  const markers = mapPins.map((markerProps, idx, array) =>
    <Marker {...markerProps} 
      text={markerProps.title}
      onClick={(e) => onMarkerClick(e, idx)}
      draggable={true}
      onDragEnd={(e) => onMarkerDragEnd(e, idx)}
      key={idx}
    />
  )

  const readOnlyMarkers = props.readOnlyMarkers?.map((markerProps, idx) => 
    <Marker {...markerProps}
      text={markerProps.title}
      onClick={(e) => {e.originalEvent.stopPropagation()}}
      key={idx}
    />
  )

  return <Mapbox
    initialViewState={{
      latitude: props.coord.lat,
      longitude: props.coord.lon,
      zoom: props.zoom,
    }}
    mapStyle="mapbox://styles/mapbox/streets-v12"
    style={{ height: props.height, width: props.width }}
    // onClick={props.onClick}
    mapboxAccessToken={"pk.eyJ1IjoibGlnaHQtbGlnaHQiLCJhIjoiY2xlcnZ1N3B3MDBuMjN4cW9qeTFjdGNvciJ9.nf9szj3A2prwaz_2NHbuuQ"}
  >
    <NavigationControl position="bottom-right" showCompass={false} />
    {markers}
    {readOnlyMarkers}
    {menuPopupIdx && <Popup
      {...(mapPins[menuPopupIdx])}
      onClose={e => setMenuPopupIdx(null)}
      onSubmit={onMenuPopupSubmit}
    />}
  </Mapbox>
}

export default Map;