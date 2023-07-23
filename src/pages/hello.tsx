import React from "react";
import Layout from "@/components/layouts/Layout";
import axios from "../libs/axios"
import { GetServerSideProps } from "next";

interface HelloProps {
  message: string;
}

const Hello: React.FC<HelloProps> = (props: HelloProps) => {
  const message = props.message;
  return (
    <Layout>
      <h1>{message}</h1>
    </Layout>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await axios.get(`${process.env.API_BASE_URL}/hello`);
  const props: HelloProps = {
    message: res.data.message,
  }
  return { props: props }
};

export default Hello;