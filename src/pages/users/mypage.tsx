import React, { useContext } from 'react';
import { Loading } from "@/contexts/LoadingContext";
import { Auth } from "@/contexts/AuthContext";
import Layout from "@/components/layouts/Layout";
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Popup } from "@/contexts/PopupContext";
import { GetServerSideProps } from "next";
import { UserData } from '@/types/UserData';
import { authAxios, errorHandler } from '@/libs/authAxios';
import { requireAuthentication } from '@/middleware/auth';

export const getServerSideProps: GetServerSideProps = requireAuthentication(async (context) => {
  try {
    const res = await authAxios(context).get(`users/me`);
    const userData: UserData = res.data.user
    return { props: userData }
  } catch (error: any) {
    return errorHandler(error);
  }
});

export default function Signin(userData: UserData) {
    const { setLoading } = useContext(Loading);
    const { auth, setAuth } = useContext(Auth);
    const { setPopup } = useContext(Popup);

    return (
      <Layout title="MyPage">
        <Grid container spacing={2}>
        <Typography variant="h5" gutterBottom>
          My Page
        </Typography>
          <Grid xs={12}>
            <Typography variant="body2" color="text.secondary">
              { userData.name }
            </Typography>
          </Grid>
        </Grid>
      </Layout>
    );
}
