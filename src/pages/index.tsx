import Layout from "@/components/layouts/Layout";
import { MantineProvider } from "@mantine/core";
import Link from "next/link";

export default function Home() {
  return (
    <MantineProvider>
      <Layout>
        <h1>トップページ</h1>
        <div>
          <p>トップページだよ</p>
          <ul>
            <li><Link href="./maps/show">地図詳細</Link></li>
          </ul>
        </div>
      </Layout>
    </MantineProvider>
  )
}
