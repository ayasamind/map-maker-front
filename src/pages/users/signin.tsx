import React, { useContext } from 'react';
import { Loading } from "@/contexts/LoadingContext";
import { Auth } from "@/contexts/AuthContext";
import Layout from "@/components/layouts/Layout";
import firebaseAuth from '@/libs/firebaseAuth';
import Image from 'next/image'
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import axios from "@/libs/axios"
import useAuthAxios from "@/libs/useAuthAxios";
import { Popup } from "@/contexts/PopupContext";
import { getSuddenSuccessPopup, getSuddenErrorPopup } from "@/templates/PopupTemplates";

export default function Signin() {
    const { setLoading } = useContext(Loading);
    const { auth, setAuth } = useContext(Auth);
    const { setPopup } = useContext(Popup);
    const authAxios = useAuthAxios();

    const signInWithGoogle = async () => {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      signInWithPopup(firebaseAuth, provider)
        .then(async (result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          if (!credential) {
            throw new Error("credential is null");
          }
          try {
            const idToken = await result.user.getIdToken(); // アクセストークンを取得
            const response = await axios.get("/users/me", {
              headers: {
                Authorization: `Bearer ${idToken}`,
              },
            });
            setAuth({
              ...auth,
              user: {
                name: response.data.user.name,
                email: response.data.user.email,
                image_url: response.data.user.image_url,
              }
            })
            console.log(auth)
            setLoading(false);
            setPopup(getSuddenSuccessPopup("Login!"));
          } catch (error: any) {
            if (error.status === 401) {
              await registerUserData({
                firebase_uid: result.user.uid,
                name: result.user.displayName,
                email: result.user.email,
                image_url: result.user.photoURL,
              });
              setPopup(getSuddenSuccessPopup("Registered!"));
            }
            setLoading(false);
          }
        }).catch((error) => {
          const credential = GoogleAuthProvider.credentialFromError(error);
          console.log(credential)
      });
    }

    const registerUserData = async (params: any) => {
      const res = await axios.post(`/users/register`, params);
    }

    return (
      <Layout title="SignIn">
        <Grid container spacing={2}>
        <Typography variant="h5" gutterBottom>
          SignIn
        </Typography>
        <h3></h3>
          <Grid xs={12}>
            <Button
              onClick={()=>signInWithGoogle()}
              variant="outlined"
              color="primary"
              style={{  width: '100%' }}
            >
              <Image
                src="/images/google_signin.png"
                width={50}
                height={50}
                alt="Picture of the author"
                style={{  marginRight: '8px' }}
              />
              Sign In with Google
            </Button>
          </Grid>
        </Grid>
      </Layout>
    );
}
