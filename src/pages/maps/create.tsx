import React, { useRef, useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { Loading } from "@/contexts/LoadingContext";
import { Popup } from "@/contexts/PopupContext";
import { getSuccssPopup, getSuddenErrorPopup } from "@/templates/PopupTemplates";
import Layout from "@/components/layouts/Layout";
import axios from "@/libs/axios"
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import mapboxgl from "@/libs/mapbox"

export default function CreateRecordForm() {
  const router = useRouter();
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(130.4017);
  const [lat, setLat] = useState(33.5959);
  const [zoom, setZoom] = useState(12);

  const { loading, setLoading } = useContext(Loading);
  const { setPopup } = useContext(Popup);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    center_lat: lat,
    center_lon: lng,
    zoom_level: zoom,
  });

  const defaultErrors = {
    title: '',
    description: '',
    center_lat: '',
    center_lon: '',
    zoom_level: '',
  }

  const [errors, setErrors] = useState(defaultErrors);

  useEffect(() => {
    if (map.current) return;
    setLng(formData.center_lat);
    setLat(formData.center_lon);
    setZoom(formData.zoom_level);
    map.current = new mapboxgl.Map({
      container: mapContainer.current as HTMLDivElement,
      style: process.env.NEXT_PUBLIC_MAPBOX_TEMPLATE,
      center: [lng, lat],
      zoom: zoom
    });
  });

  useEffect(() => {
    if (!map.current) return;
    map.current.on('move', () => {
      if (map.current) {
        let lng = parseFloat(map.current.getCenter().lng.toFixed(4))
        let lat =parseFloat(map.current.getCenter().lat.toFixed(4));
        let zoom = parseFloat(map.current.getZoom().toFixed(2));
        setFormData({
          ...formData,
          center_lat: lat,
          center_lon: lng,
          zoom_level: zoom,
        });
        setLng(lng);
        setLat(lat);
        setZoom(zoom);
      }
    });
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setErrors({ ...defaultErrors});
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post(`maps/create`, formData);
      setPopup(getSuccssPopup("Crated!"));
      router.push(`/maps/${res.data.map.id}`);
    } catch (error: any) {
      setErrors({ ...errors, ...error.errors });
      setLoading(false);
      setPopup(getSuddenErrorPopup("Failed to create"));
    }
  };

  return (
    <Layout title="Create Your Map">
      <h3>Create Your Map</h3>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <div>
            <TextField
              name="title"
              id="outlined-basic"
              label="Map Title"
              variant="outlined"
              margin="dense"
              fullWidth
              onChange={handleChange}
              error={errors.title !== ''}
              helperText={errors.title}
            />
          </div>
          <div>
            <TextField
              name="description"
              id="outlined-multiline-basic"
              label="Map Description"
              variant="outlined"
              multiline rows={4}
              margin="dense"
              fullWidth
              onChange={handleChange}
              error={errors.description !== ''}
              helperText={errors.description}
            />
          </div>
          <div className="sidebar">
            Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
          </div>
          <div ref={mapContainer} className="map-container" />
          <div>
            <LoadingButton
              style={{ width: '100%', marginTop: '2%' }}
              variant="contained"
              size="large"
              onClick={handleSubmit}
              loading={loading}
            >
              Create
            </LoadingButton>
          </div>
      </Box>
    </Layout>
  );
};