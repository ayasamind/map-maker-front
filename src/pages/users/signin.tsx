import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { Loading } from "@/contexts/LoadingContext";
import { Auth } from "@/contexts/AuthContext";
import Layout from "@/components/layouts/Layout";
import firebaseAuth from '@/libs/firebaseAuth';
import Image from 'next/image'
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { signInWithRedirect, GoogleAuthProvider, getRedirectResult } from "firebase/auth";
import axios from "@/libs/axios"
import { Popup } from "@/contexts/PopupContext";
import { getSuddenSuccessPopup, getSuddenErrorPopup } from "@/templates/PopupTemplates";
import { AxiosResponse, AxiosError } from 'axios'

export default function Signin() {
    const { setLoading } = useContext(Loading);
    const { auth, setAuth } = useContext(Auth);
    const { setPopup } = useContext(Popup);
    const router = useRouter();

    const signInWithGoogle = async () => {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      signInWithRedirect(firebaseAuth, provider);
    }

    getRedirectResult(firebaseAuth)
      .then(async (result) => {
        if (!result) {return null;}
        setLoading(true);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (!credential) {
          throw new Error("credential is null");
        }
        const idToken = await result.user.getIdToken();
        await axios.get("/users/me", {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }).then((res: AxiosResponse) => {
          setAuth({
            ...auth,
            user: {
              name: res.data.user.name,
              email: res.data.user.email,
              image_url: res.data.user.image_url,
            }
          })
          setLoading(false);
          setPopup(getSuddenSuccessPopup("Login!"));
        }).catch(async (error: AxiosError) => {
          if (error.response!.status === 401) {
            await registerUserData(result.user);
          } else {
            setPopup(getSuddenErrorPopup("Error!"));
          }
          setLoading(false);
        });
      });

    const registerUserData = async (user: any) => {
      const res = await axios.post(`/users/register`, {
        firebase_uid: user.uid,
        name: user.displayName,
        email: user.email,
        image_url: user.photoURL,
      }).then((res: AxiosResponse) => {
        setPopup(getSuddenSuccessPopup("Registered!"));
        router.replace(`/users/mypage`);
      }).catch((error: AxiosError) => {
        setPopup(getSuddenErrorPopup("Register Error!"));
      });
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
