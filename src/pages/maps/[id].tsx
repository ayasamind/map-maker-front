import React, { useRef, useEffect, useState } from 'react';
import Layout from "@/components/layouts/Layout";
import Link from "next/link";
import axios from "@/libs/axios"
import { AxiosError } from "axios"
import { GetServerSideProps } from "next";
import mapboxgl from "@/libs/mapbox"

type MapParams = {
  id: number,
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
  const id = context.params?.id
  if (!id) {
    return { notFound: true };
  }
  try {
    const res = await axios.get(`maps/${id}`);
    const mapParams: MapParams = res.data
    return { props: mapParams }
  } catch (error) {
    const axiosError = error as AxiosError
    if (axiosError.response && axiosError.response.status === 404) {
      return { notFound: true };
    }
    throw error;
  }
};

export default function ShowMap(mapParams: MapParams) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(130.4017);
  const [lat, setLat] = useState(33.5959);
  const [zoom, setZoom] = useState(12);

  useEffect(() => {
    if (map.current) return;
    setLng(mapParams.center_lon);
    setLat(mapParams.center_lat);
    setZoom(mapParams.zoom_level);
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
          new mapboxgl.Popup({ offset: 25 }) // add popups
            .setHTML(
              `<h3>${pin.title}</h3><p>${pin.description}</p>`
            )
        )
        .addTo(map.current);
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
      <h1>{ mapParams.title }</h1>
      <div>
        <p>{ mapParams.description }</p>
        <div className="sidebar">
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
        <div ref={mapContainer} className="map-container" />
        <Link href="/">トップに戻る</Link>
      </div>
    </Layout>
  )
};
