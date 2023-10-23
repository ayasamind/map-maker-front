import mapboxgl from "@/libs/mapbox"
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import MapboxLanguage from "@mapbox/mapbox-gl-language";

const addDefaultControls = (map: mapboxgl.Map) => {
    map.addControl(
        new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl,
            placeholder: "Search",
            marker: false,
        }), "top-left"
    );
    const language = new MapboxLanguage({
        defaultLanguage: "ja",
    });
    map.addControl(language);
    map.addControl(new mapboxgl.NavigationControl());
    map.addControl(new mapboxgl.FullscreenControl());
    return map
}

export { addDefaultControls }