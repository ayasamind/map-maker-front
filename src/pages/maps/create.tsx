import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { Loading } from "@/contexts/LoadingContext";
import { Popup } from "@/contexts/PopupContext";
import { getSuccssPopup, getSuddenErrorPopup } from "@/templates/PopupTemplates";
import Layout from "@/components/layouts/Layout";
import axios from "@/libs/axios"
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import DefaultMap from '@/components/map/DefaultMap';
import { MapFormParams } from '@/types/MapParams';
import { defaultMapErrors } from '@/templates/ErrorTemplates';
import Typography from '@mui/material/Typography';

export default function CreateRecordForm() {
  const router = useRouter();
  const { loading, setLoading } = useContext(Loading);
  const { setPopup } = useContext(Popup);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    center_lat: 33.5959,
    center_lon: 130.4017,
    zoom_level: 12,
    pins: [],
  });

  const defaultErrors = defaultMapErrors;

  const [errors, setErrors] = useState(defaultErrors);

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
      setPopup(getSuccssPopup("Created!"));
      router.push(`/maps/${res.data.map.id}`);
    } catch (error: any) {
      setErrors({ ...errors, ...error.errors });
      setLoading(false);
      setPopup(getSuddenErrorPopup("Failed to create"));
    }
  };

  return (
    <Layout title="Create Your Map">
      <Typography variant="h5" gutterBottom>
        Create Your Map
      </Typography>
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
          <DefaultMap
            mapParams={formData}
            canAddPin={false}
            handleMapChange={(mapParams: MapFormParams) => setFormData(mapParams)}
            sidebar={true}
          />
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