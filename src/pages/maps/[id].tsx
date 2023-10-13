import React, { useRef, useEffect, useState } from 'react';
import Layout from "@/components/layouts/Layout";
import axios from "@/libs/axios"
import { AxiosError } from "axios"
import { GetServerSideProps } from "next";
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { useRouter } from 'next/router';
import { MapParams } from '@/types/MapParams';
import DefaultMap from '@/components/map/DefaultMap';

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
  return (
    <Layout title="Map Details">
      <h3>{ mapParams.title }</h3>
      <div>
        <Typography variant="body2" color="text.secondary">
          { mapParams.description }
        </Typography>
        <LoadingButton
          style={{  margin: '2%' }}
          variant="contained"
          size="large"
          onClick={() => router.push(`/maps/${mapParams.id}/pins/edit`)}
        >
          Edit Pins
        </LoadingButton>
        <LoadingButton
          style={{  margin: '2%' }}
          variant="contained"
          size="large"
          onClick={() => router.push(`/maps/${mapParams.id}/pins/edit`)}
        >
          Edit Map
        </LoadingButton>
        <DefaultMap
          mapParams={mapParams}
          canAddPin={false}
          sidebar={true}
        />
      </div>
    </Layout>
  )
};
