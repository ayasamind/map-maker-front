import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import Layout from "@/components/layouts/Layout";
import axios from "@/libs/axios"
import { AxiosError } from "axios"
import { GetServerSideProps } from "next";
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { MapParams } from '@/types/MapParams';
import DefaultMap from '@/components/map/DefaultMap';
import Grid from '@mui/material/Unstable_Grid2';
import { Loading } from "@/contexts/LoadingContext";
import { MapState } from "@/contexts/MapStateContext";
import { defaultMapState, canAddPinMapState, editPinMapState } from "@/templates/MapStateTemplates";
import { defaultPinErrors } from '@/templates/ErrorTemplates';
import { Popup } from "@/contexts/PopupContext";
import { getSuccssPopup, getSuddenErrorPopup } from "@/templates/PopupTemplates";
import Alert from '@mui/material/Alert';

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
  const router = useRouter();
  const { id } = router.query;
  const mapId = id ? Number(id) : 0;
  const [errors, setErrors] = useState<{ map_id: string, pins: { title: string, description: string, lon: string, lat: string }[] }>(defaultPinErrors);
  const [screenType, setScreenType] = useState('start');
  const [seed, setSeed] = useState(1);
  const [pinIndex, setPinIndex] = useState(0);
  const [editPin, setEditPin] = useState<{ id: number, title: string, description: string, lon: number|null, lat: number|null } | null>(null);
  const [editPinIndex, setEditPinIndex] = useState<number | null>(null);
  const { loading, setLoading } = useContext(Loading);
  const { mapState, setMapState } = useContext(MapState);
  const { setPopup } = useContext(Popup);
  const [formData, setFormData] = useState<{ map_id: number, pins: { id: number|null, title: string, description: string, lon: number|null, lat: number|null }[] }>({
    map_id: mapId,
    pins: []
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedFormData = {
      map_id: formData.map_id,
      pins: formData.pins
    };
    updatedFormData.pins[pinIndex] = {
      ...updatedFormData.pins[pinIndex],
      [e.target.name]: e.target.value,
    };
    setFormData(updatedFormData);
  };

  const getMakerData = (index: number, lon: number, lat: number) => {
    const updatedFormData = {
      map_id: formData.map_id,
      pins: formData.pins
    };
    updatedFormData.pins[index] = {
      ...updatedFormData.pins[index],
      lon: lon,
      lat: lat,
    };
    setFormData(updatedFormData);
  };

  const getEditData = (marker: any, index: number) => {
    const lon = marker.makerObject._lngLat.lng;
    const lat = marker.makerObject._lngLat.lat;
    if (marker.id === null || marker.id === undefined) {
      const index = formData.pins.findIndex((pin) => pin.lon === lon && pin.lat === lat);
      formData.pins.splice(index, 1);
    }
    setEditPin({
      ...marker,
      lon: lon,
      lat: lat
    });
    setEditPinIndex(index);
  }

  const handleChangeEditPin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedEditPin = {
      ...editPin,
      [e.target.name]: e.target.value || '', // add a fallback value of empty string
    }
    setEditPin(updatedEditPin as { id: number, title: string; description: string; lon: number; lat: number } | null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setErrors(defaultPinErrors);
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post(`pins/save`, formData);
      setPopup(getSuccssPopup("Saved!"));
      router.push(`/maps/${res.data.map_id}`);
    } catch (error: any) {
      setErrors({ ...errors, ...error.errors });
      setLoading(false);
      setPopup(getSuddenErrorPopup("Failed to save."));
    }
  }

  const ShowAddPinScreen = () => {
    formData.pins.push({
      id: null,
      title: '',
      description: '',
      lon: null,
      lat: null,
    })
    errors.pins.push({
      title: '',
      description: '',
      lon: '',
      lat: '',
    })
    setPinIndex(formData.pins.length - 1)
    setScreenType('add')
    setMapState(canAddPinMapState)
  }

  const ShowStartScreen = () => {
    setEditPin(null);
    setSeed(Math.random());
    setScreenType('start')
    setMapState(defaultMapState)
  }

  const ShowEditScreen = () => {
    setScreenType('edit')
    setMapState(editPinMapState)
  }

  const addPinEvent = async () => {
    setErrors(defaultPinErrors);
    let error = null;
    if (formData.pins[pinIndex].lon === null || formData.pins[pinIndex].lat === null) {
      error = true;
      setErrors({ ...errors, pins: [{ ...errors.pins[pinIndex], lon: 'ピンを指定してください' }] });
    }
    if (formData.pins[pinIndex].title === '') {
      error = true;
      setErrors({ ...errors, pins: [{ ...errors.pins[pinIndex], title: 'タイトルは必須です' }] });
    }
    if (error) {
      return;
    }
    mapParams.pins.push({
      id: null,
      title: formData.pins[pinIndex].title,
      description: formData.pins[pinIndex].description,
      lon: formData.pins[pinIndex].lon ?? 0,
      lat: formData.pins[pinIndex].lat ?? 0,
    })
    ShowStartScreen();
  }

  const editPinEvent = async () => {
    let error = null;
    if (editPin === null || editPinIndex === null) {
      return;
    }
    if (editPin.title === '') {
      error = true;
      setErrors({ ...errors, pins: [{ ...errors.pins[pinIndex], title: 'タイトルは必須です' }] });
    }
    if (error) {
      return;
    }
    mapParams.pins[editPinIndex] = {
      id: editPin.id,
      title: editPin.title,
      description: editPin.description ?? '',
      lon: editPin.lon ?? 0,
      lat: editPin.lat ?? 0,
    }
    if (editPin.id !== null && editPin.id !== undefined) {
      const index = formData.pins.findIndex((pin) => pin.id === editPin.id);
      if (index !== -1) {
        formData.pins[index] = {
          id: editPin.id,
          title: editPin.title,
          description: editPin.description ?? '',
          lon: editPin.lon ?? 0,
          lat: editPin.lat ?? 0,
        };
      } else {
        formData.pins.push({
          id: editPin.id,
          title: editPin.title,
          description: editPin.description ?? '',
          lon: editPin.lon ?? 0,
          lat: editPin.lat ?? 0,
        })
      }
    } else {
      formData.pins.push({
        id: null,
        title: editPin.title,
        description: editPin.description ?? '',
        lon: editPin.lon ?? 0,
        lat: editPin.lat ?? 0,
      })
    }
    ShowStartScreen();
  }

  return (
    <Layout title="Edit Pins">
      <h3>Add / Edit Pins</h3>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <Grid container spacing={2}>
            <Grid xs={12} md={6}>
              <DefaultMap
                mapParams={mapParams}
                height="300px"
                formData={formData}
                updateFormData={getMakerData}
                key={seed}
                index={pinIndex}
                sendPinData={getEditData}
              />
              { screenType === 'add' && errors.pins[pinIndex] ? errors.pins[pinIndex].lon !== '' &&
                <Alert severity="error">{ errors.pins[pinIndex].lon }</Alert>
              : null}
            </Grid>
            <Grid xs={12} md={6}>
              {screenType === 'start' &&
                <LoadingButton
                  variant="contained"
                  size="large"
                  onClick={ShowAddPinScreen}
                  loading={loading}
                  style={{ width: '100%', marginTop: '2%' }}
                >
                  Add Pins
                </LoadingButton>
              }
              {screenType === 'start' &&
                <LoadingButton
                  variant="contained"
                  size="large"
                  onClick={ShowEditScreen}
                  loading={loading}
                  style={{ width: '100%', marginTop: '2%' }}
                >
                  Edit Pins
                </LoadingButton>
              }
              {screenType === 'add' &&
                <TextField
                  required
                  name="title"
                  id="outlined-basic"
                  label="Pin Title"
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
                  error={errors.pins[pinIndex] ? errors.pins[pinIndex].title !== '' : false}
                  helperText={errors.pins[pinIndex] ? errors.pins[pinIndex].title : ''}
                />
              }
              {screenType === 'add' &&
                <TextField
                  name="description"
                  id="outlined-multiline-basic"
                  label="Pin Description"
                  variant="outlined"
                  multiline rows={4}
                  margin="dense"
                  fullWidth
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
                  error={errors.pins[pinIndex] ? errors.pins[pinIndex].description !== '' : false}
                  helperText={errors.pins[pinIndex] ? errors.pins[pinIndex].description : ''}
                />
              }
              {editPin &&
                <TextField
                  required
                  name="title"
                  id="outlined-basic"
                  label="Pin Title"
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  value={editPin.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeEditPin(e)}
                  error={errors.pins[pinIndex] ? errors.pins[pinIndex].title !== '' : false}
                  helperText={errors.pins[pinIndex] ? errors.pins[pinIndex].title : ''}
                />
              }
              {editPin &&
                <TextField
                  name="description"
                  id="outlined-multiline-basic"
                  label="Pin Description"
                  variant="outlined"
                  multiline rows={4}
                  margin="dense"
                  fullWidth
                  value={editPin.description}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeEditPin(e)}
                  error={errors.pins[pinIndex] ? errors.pins[pinIndex].description !== '' : false}
                  helperText={errors.pins[pinIndex] ? errors.pins[pinIndex].description : ''}
                />
              }
              {screenType === 'add' &&
                <Grid xs={12} md={6}>
                  <LoadingButton
                    style={{ width: '100%', marginTop: '2%' }}
                    variant="contained"
                    size="large"
                    onClick={addPinEvent}
                    loading={loading}
                  >
                    Add
                  </LoadingButton>
                  <LoadingButton
                    style={{ width: '100%', marginTop: '2%' }}
                    variant="contained"
                    size="large"
                    onClick={ShowStartScreen}
                    loading={loading}
                    color="error"
                  >
                    Cancel
                  </LoadingButton>
                </Grid>
              }
              {screenType === 'edit' &&
                <Grid xs={12} md={6}>
                  <LoadingButton
                    style={{ width: '100%', marginTop: '2%' }}
                    variant="contained"
                    size="large"
                    onClick={editPinEvent}
                    loading={loading}
                  >
                    Edit
                  </LoadingButton>
                </Grid>
              }
              {screenType === 'edit' &&
                <Grid xs={12} md={6}>
                  <LoadingButton
                    style={{ width: '100%', marginTop: '2%' }}
                    variant="contained"
                    size="large"
                    onClick={ShowStartScreen}
                    loading={loading}
                    color="error"
                  >
                    Cancel
                  </LoadingButton>
                </Grid>
              }
            </Grid>
            <Grid xs={12}>
            {screenType === 'start' &&
              <LoadingButton
                  style={{ width: '100%', marginTop: '2%' }}
                  variant="contained"
                  size="large"
                  onClick={handleSubmit}
                  loading={loading}
                  color="success"
                >
                  Save
                </LoadingButton>
            }
            </Grid>
          </Grid>
      </Box>
    </Layout>
  )
};
