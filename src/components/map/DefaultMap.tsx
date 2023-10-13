import React, { useRef, useEffect, useState } from 'react';
import { addDefaultControls } from "@/templates/MapBoxTemplates";
import { MapParams } from '@/types/MapParams';
import mapboxgl from "@/libs/mapbox"
import delay from '@/libs/deplay';

export default function DefaultMap(props: any) {
  const { mapParams, canAddPin, handleMapChange, sidebar, height, formData, updateFormData, index } = props;
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(mapParams.center_lon);
  const [lat, setLat] = useState(mapParams.center_lat);
  const [zoom, setZoom] = useState(mapParams.zoom_level);

  useEffect(() => {
    function setAddPinEvent() {
      if (map.current) {
        map.current.once('click', (e) => {
          if (map.current) {
            if (canAddPin) {
              addPin(e);
            }
          }
        });
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
      }
    }

    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current as HTMLDivElement,
        style: process.env.NEXT_PUBLIC_MAPBOX_TEMPLATE,
        center: [mapParams.center_lon, mapParams.center_lat],
        zoom: mapParams.zoom_level
      });
      for (const pin of mapParams.pins) {
        new mapboxgl.Marker()
          .setLngLat([pin.lon, pin.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(
                `<h3>${pin.title}</h3><p>${pin.description}</p>`
              )
          )
          .addTo(map.current);
      }
      addDefaultControls(map.current);
      setAddPinEvent();
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
  }, [canAddPin, handleMapChange, mapParams.center_lat, mapParams.center_lon, mapParams.pins, mapParams.zoom_level, mapParams]);

  return (
    <>
      { sidebar && <div className="sidebar">Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}</div>}
      <div ref={mapContainer} style={{ height: height ?? '600px' }} />
    </>
  )
}