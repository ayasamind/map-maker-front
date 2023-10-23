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
import { defaultPinErrors } from '@/templates/ErrorTemplates';
import { Popup } from "@/contexts/PopupContext";
import { getSuccssPopup, getSuddenErrorPopup } from "@/templates/PopupTemplates";

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
  const { loading, setLoading } = useContext(Loading);
  const { mapState, setMapState } = useContext(MapState);
  const { setPopup } = useContext(Popup);
  const [formData, setFormData] = useState<{ map_id: number, pins: { title: string, description: string, lon: number|null, lat: number|null }[] }>({
    map_id: mapId,
    pins: [{ title: '', description: '', lon: null, lat: null }]
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const updatedFormData = {
      map_id: formData.map_id,
      pins: formData.pins
    };
    updatedFormData.pins[index] = {
      ...updatedFormData.pins[index],
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
    console.log(errors);
    e.preventDefault();

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
    setScreenType('add')
    setMapState({ canAddPin: true })
  }

  const ShowStartScreen = () => {
    setScreenType('start')
    setMapState({ canAddPin: false })
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
                index={0}
            />
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
                  name="title"
                  id="outlined-basic"
                  label="Pin Title"
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, 0)}
                  error={errors.pins[0].title !== ''}
                  helperText={errors.pins[0].title}
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, 0)}
                  error={errors.pins[0].description !== ''}
                  helperText={errors.pins[0].description}
                />
              }
              {screenType === 'add' &&
                <LoadingButton
                  style={{ width: '100%', marginTop: '2%' }}
                  variant="contained"
                  size="large"
                  onClick={ShowStartScreen}
                  loading={loading}
                >
                  Cancel
                </LoadingButton>
              }
            </Grid>
            <Grid xs={12}>
              <LoadingButton
                style={{ width: '100%', marginTop: '2%' }}
                variant="contained"
                size="large"
                onClick={handleSubmit}
                loading={loading}
              >
                Add / Edit Pins
              </LoadingButton>
            </Grid>
          </Grid>
      </Box>
    </Layout>
  )
};
