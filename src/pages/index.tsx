import Layout from "@/components/layouts/Layout";
import { MantineProvider } from "@mantine/core";
import Link from "next/link";
import axios from "@/libs/axios"
import { GetServerSideProps } from "next";

type Props = {
  maps: [
    {
      id: number,
      title: String,
      description: String,
      center_lat: number,
      center_lon: number,
      zoom_level: number,
      pins: [
        {
          title: String,
          lat: number,
          lon: number,
          description: String,
        }
      ]
    }
  ]
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await axios.get(`maps`);
  const maps = res.data
  return {
    props: {
      maps: maps
    }
   }
};

export default function Home(props: Props) {
  return (
    <MantineProvider>
      <Layout>
        <h1>トップページ</h1>
        <div>
          <p>トップページだよ</p>
          <p><Link href={ `./maps/create` }>マップ新規作成</Link></p>
          <ul>
            {props.maps.map((map) => (
              <li key={map.id}><Link href={ `./maps/${map.id}` }>{map.title}</Link></li>
            ))}
          </ul>
        </div>
      </Layout>
    </MantineProvider>
  )
}
