import { MouseEventHandler } from "react";
import { Popup as MapboxPopup, PopupEvent } from "react-map-gl";
import { Coordinate } from "./Map";

interface PopupComponentProps {
  coord: Coordinate;
  title: string;
  onSubmit: MouseEventHandler<HTMLButtonElement>;
  onClose: (e: PopupEvent) => void;
}

const Popup = (props: PopupComponentProps) => 
  <MapboxPopup
    latitude={props.coord.lat} longitude={props.coord.lon}
    onClose={props.onClose}
  >
    <div>
      <button type="submit" onClick={props.onSubmit}>Delete</button>
    </div>
  </MapboxPopup>

export default Popup
