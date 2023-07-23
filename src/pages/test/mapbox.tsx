import Layout from "@/components/layouts/Layout";
import Map from "@/components/map/Map";
import { MarkerProps } from "@/components/map/Marker";
import PinList from "@/components/map/PinList";
import { MapPinsProvider, useMapPins, useSetMapPins } from "@/hooks/MapPinsContext";
import mapboxgl from "mapbox-gl";
import { useCallback, useEffect } from "react";
import styles from "./mapbox.module.css";

interface MapResponse {
  title: string;
  description: string;
  pins: PinResponse[];
  center_lat: number;
  center_lon: number;
  zoom_level: number;
}
interface PinResponse {
  title: string;
  descriptoin: string;
  lat: number;
  lon: number;
}

const MapComponent = () => {
  const mapPins = useMapPins();  // こっちは編集可能なピンを入れるイメージ
  const setMapPins = useSetMapPins();

  const getPinsData = useCallback(async () => {
    try {
      const res = await fetch('https://map-maker.fusic.co.jp/api/maps/1', {method: 'GET'});
      const mapData: MapResponse = await res.json();
      const pins: PinResponse[] = mapData.pins;
      console.log(mapData);

      setMapPins(pins.map((pin) => { return {
        coord: { lat: pin.lat, lon: pin.lon },
        title: pin.title
      };}))
    } catch (err) {
      console.error(err);
    }
  }, [setMapPins]);

  useEffect(() => { getPinsData(); }, [getPinsData]);
  useEffect(() => console.log(mapPins), [mapPins]);

  const onMapClick = (e: mapboxgl.MapLayerMouseEvent) => {
    const pin: MarkerProps = {
      coord: { lat: e.lngLat.lat, lon: e.lngLat.lng },
      title: `(${e.lngLat.lat}, ${e.lngLat.lng})`,
      img: <img src="/map_icons/location-dot-solid.svg" className={`${styles.mapIcon} ${styles.red}`} />
    }
    setMapPins([...mapPins, pin]);
  }

  const onSubmitClick = () => {
    console.log(mapPins);
  }

  // もともとあって編集できないやつのイメージ（他ユーザが立てたピンとか）
  const readOnlyMarkers: MarkerProps[] = [
    { coord: { lat: 33.5934146, lon: 130.4010231 }, title: "hoge1", img: <img src="/map_icons/location-dot-solid.svg" className={`${styles.mapIcon} ${styles.blue}`} /> },
    { coord: { lat: 33.5944146, lon: 130.4010231 }, title: "hoge2", img: <img src="/map_icons/location-dot-solid.svg" className={`${styles.mapIcon} ${styles.blue}`} /> },
    { coord: { lat: 33.5954146, lon: 130.4010231 }, title: "hoge3", img: <img src="/map_icons/location-dot-solid.svg" className={`${styles.mapIcon} ${styles.blue}`} /> },
    { coord: { lat: 33.5934146, lon: 130.4020231 }, title: "hoge4", img: <img src="/map_icons/location-dot-solid.svg" className={`${styles.mapIcon} ${styles.blue}`} /> },
    { coord: { lat: 33.5944146, lon: 130.4030231 }, title: "hoge5", img: <img src="/map_icons/location-dot-solid.svg" className={`${styles.mapIcon} ${styles.blue}`} /> },
    { coord: { lat: 33.5954146, lon: 130.4040231 }, title: "hoge6", img: <img src="/map_icons/location-dot-solid.svg" className={`${styles.mapIcon} ${styles.blue}`} /> },
  ]

  return (<>
    <Map
      height="50vh" width="100%"
      coord={{ lat: 33.5934146, lon: 130.4010231 }} zoom={15}
      readOnlyMarkers={readOnlyMarkers}
      onClick={onMapClick}
    />
    <PinList />
    <button type="submit" onClick={onSubmitClick}>Submit</button>
  </>)
}

const MapboxTest = () => {

  return <Layout title="Mapboxテスト">
    <MapPinsProvider>
      <MapComponent />
    </MapPinsProvider>
  </Layout>;
};

export default MapboxTest;
