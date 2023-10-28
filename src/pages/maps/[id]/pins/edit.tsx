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
import { defaultMapState, canAddPinMapState } from "@/templates/MapStateTemplates";
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
  const { loading, setLoading } = useContext(Loading);
  const { mapState, setMapState } = useContext(MapState);
  const { setPopup } = useContext(Popup);
  const [formData, setFormData] = useState<{ map_id: number, pins: { title: string, description: string, lon: number|null, lat: number|null }[] }>({
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

  const handleSubmit = async (e: React.FormEvent) => {
    setErrors(defaultPinErrors);
    e.preventDefault();
    console.log(formData)

    try {
      setLoading(true);
      const res = await axios.post(`pins/create`, formData);
      setPopup(getSuccssPopup("Created!"));
      router.push(`/maps/${res.data.map_id}`);
    } catch (error: any) {
      setErrors({ ...errors, ...error.errors });
      setLoading(false);
      setPopup(getSuddenErrorPopup("Failed to create"));
    }
  }

  const ShowAddPinScreen = () => {
    formData.pins.push({
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
    setSeed(Math.random());
    setScreenType('start')
    setMapState(defaultMapState)
  }

  const addPin = async () => {
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
      title: formData.pins[pinIndex].title,
      description: formData.pins[pinIndex].description,
      lon: formData.pins[pinIndex].lon ?? 0,
      lat: formData.pins[pinIndex].lat ?? 0,
    })
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
              />
              { errors.pins[pinIndex] ? errors.pins[pinIndex].lon !== '' &&
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
                >
                  Add Pins
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
              {screenType === 'add' &&
                <Grid xs={12} md={6}>
                  <LoadingButton
                    style={{ width: '100%', marginTop: '2%' }}
                    variant="contained"
                    size="large"
                    onClick={addPin}
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
            </Grid>
            <Grid xs={12}>
            {screenType === 'start' &&
              <LoadingButton
                  style={{ width: '100%', marginTop: '2%' }}
                  variant="contained"
                  size="large"
                  onClick={handleSubmit}
                  loading={loading}
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
