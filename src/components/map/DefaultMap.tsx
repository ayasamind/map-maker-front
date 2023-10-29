import React, { useRef, useEffect, useState, useContext } from 'react';
import { addDefaultControls } from "@/templates/MapBoxTemplates";
import mapboxgl from "@/libs/mapbox"
import delay from '@/libs/deplay';
import { MapState } from "@/contexts/MapStateContext";
import { LngLat } from 'react-map-gl';
import { forEachChild } from 'typescript';

export default function DefaultMap(props: any) {
  const { mapParams, handleMapChange, sidebar, height, formData, updateFormData, index, sendPinData } = props;
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { mapState, setMapState } = useContext(MapState);
  const [lng, setLng] = useState(mapParams.center_lon);
  const [lat, setLat] = useState(mapParams.center_lat);
  const [zoom, setZoom] = useState(mapParams.zoom_level);
  const [markers, setMarkers] = useState<any[]>([]);

  useEffect(() => {
    if (map.current) {
      if (mapState.canAddPin) {
        setAddPinEvent();
      } else {
        removeAddPinEvent();
      }

      if (mapState.canEditPin) {
        markers.forEach((existMarker, index) => {
          const lon = existMarker.makerObject._lngLat.lng;
          const lat = existMarker.makerObject._lngLat.lat;
          if (map.current) {
            const marker = new mapboxgl.Marker()
              .setLngLat([lon, lat])
              .addTo(map.current);
            marker.getElement().addEventListener('click', () => {
              sendPinData(markers[index], index);
            });
          }
        })
        markers.map(maker => maker.makerObject.remove());
      }
    }

    function setAddPinEvent() {
      if (map.current) {
        map.current.once('click', addPin);
      }
    }

    function removeAddPinEvent() {
      if (map.current) {
        map.current.off('click', addPin);
      }
    }

    function addPin(e: any) {
      if (map.current) {
        const marker = new mapboxgl.Marker({
            draggable: true
          })
          .setLngLat([e.lngLat.lng, e.lngLat.lat])
          .addTo(map.current as mapboxgl.Map);
        updateFormData(index, e.lngLat.lng, e.lngLat.lat);
        marker.getElement().addEventListener('click', async () => {
          marker.remove();
          await delay(10)
          setAddPinEvent();
        });
        setMarkers([...markers, marker]);
        setMapState({ canAddPin: false });
      }
    }

    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current as HTMLDivElement,
        style: process.env.NEXT_PUBLIC_MAPBOX_TEMPLATE,
        center: [mapParams.center_lon, mapParams.center_lat],
        zoom: mapParams.zoom_level
      });
      const makerList: any[] = [];
      for (const pin of mapParams.pins) {
        const marker = new mapboxgl.Marker()
          .setLngLat([pin.lon, pin.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(
                `<h3>${pin.title}</h3><p>${pin.description}</p>`
              )
          )
          .addTo(map.current);
        makerList.push({
          makerObject: marker,
          id: pin.id,
          title: pin.title,
          description: pin.description,
        });
      }
      setMarkers(makerList);
      addDefaultControls(map.current);
    }

    map.current.on('move', () => {
      if (map.current) {
        let lng = parseFloat(map.current.getCenter().lng.toFixed(4))
        let lat = parseFloat(map.current.getCenter().lat.toFixed(4));
        let zoom = parseFloat(map.current.getZoom().toFixed(2));
        setLng(lng);
        setLat(lat);
        setZoom(zoom);
        if (handleMapChange) {
          handleMapChange({
            ...mapParams,
            center_lat: lat,
            center_lon: lng,
            zoom_level: zoom,
          });
        }
      }
    });
  }, [formData, setMapState, markers, mapState.canAddPin, mapState.canEditPin, handleMapChange, mapParams.center_lat, mapParams.center_lon, mapParams.pins, mapParams.zoom_level, mapParams, index, updateFormData]);

  return (
    <>
      { sidebar && <div className="sidebar">Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}</div>}
      <div ref={mapContainer} style={{ height: height ?? '350px' }} />
    </>
  )
}