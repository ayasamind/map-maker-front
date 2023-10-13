export type MapParams = {
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

export type MapFormParams = {
  title: string,
  description: string,
  center_lat: number,
  center_lon: number,
  zoom_level: number,
  pins: []
}