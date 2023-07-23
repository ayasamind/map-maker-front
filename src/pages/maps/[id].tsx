import React, { useRef, useEffect, useState } from 'react';
import Layout from "@/components/layouts/Layout";
import Link from "next/link";
import axios from "@/libs/axios"
import { GetServerSideProps } from "next";
import mapboxgl from 'mapbox-gl';
mapboxgl.accessToken = 'pk.eyJ1IjoiYXlhc2FtaW5kIiwiYSI6ImNsa2UydWozNzEwOW0zbHB1OW03b2NuNHYifQ.zIym42cNwKNhEd0LmIDl8w';

type MapParams = {
  title: String,
  description: String,
  center_lat: number,
  center_lon: number,
  zoom_level: number,
  pins: [
    {
      title: String,
      lat: number,
      lon: number,
      description: String,
    }
  ]
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await axios.get(`${process.env.API_BASE_URL}/maps/1`);
  const mapParams: MapParams = res.data
  return { props: mapParams }
};

export default function ShowMap(mapParams: MapParams) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(130.4017);
  const [lat, setLat] = useState(33.5959);
  const [zoom, setZoom] = useState(12);

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current as HTMLDivElement,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom
    });
    for (const pin of mapParams.pins) {
      new mapboxgl.Marker().setLngLat([pin.lon, pin.lat]).addTo(map.current);
    }
  });

  useEffect(() => {
    if (!map.current) return;
    map.current.on('move', () => {
      if (map.current) {
        setLng(parseFloat(map.current.getCenter().lng.toFixed(4)));
        setLat(parseFloat(map.current.getCenter().lat.toFixed(4)));
        setZoom(parseFloat(map.current.getZoom().toFixed(2)));
      }
    });
  });

  return (
    <Layout title="地図詳細">
      <h1>{ mapParams.title }地図詳細</h1>
      <div>
        <p>{ mapParams.description }</p>
        <div className="sidebar">
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>  
        <div ref={mapContainer} className="map-container" />
        <ul>
          {
            mapParams.pins.map((pin, index) => (
              <li key={index}>{pin.title} ({pin.lat}, {pin.lon})</li>
            ))
          }
        </ul>
        <Link href="/">トップに戻る</Link>
      </div>
    </Layout>
  )
};
