import Layout from "@/components/layouts/Layout";
import Link from "next/link";
import axios from "@/libs/axios"
import { GetServerSideProps } from "next";
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';

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
    <Layout>
      <div>
        <h4>Recently Created Maps</h4>
        <ul className="horizontal-list">
          {props.maps.map((map) => (
            <li className="item" key={map.id}>
              <Link href={ `./maps/${map.id}` }>
                <Card key={map.id} sx={{ maxWidth: 345 }}>
                  <CardHeader
                    title={ map.title }
                  />
                  <CardMedia
                    component="img"
                    height="200"
                    image="/images/default.png"
                    alt="Paella dish"
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      { map.description }
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  )
}
