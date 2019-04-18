import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { environment } from 'src/environments/environment';
import { GeolocationService } from '../core/geolocation.service';
import { ThfPageFilter, ThfTableColumn, ThfTableAction, ThfPageAction } from '@totvs/thf-ui';
import { map, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  readonly pageActions: Array<ThfPageAction> = [
    { label: 'Salvar configuração', action: this.save }
  ];
  locationFilter = 'totvs';

  readonly filterSettings: ThfPageFilter = {
    action: this.findLocations.bind(this),
    ngModel: 'locationFilter',
    placeholder: 'Procure uma localização',
  };

  readonly locationColumns: Array<ThfTableColumn> = [
    { property: 'lat', label: 'Latitude' },
    { property: 'lon', label: 'Longitude' },
    { property: 'name', label: 'Nome' }
  ];

  readonly locationTableActions: Array<ThfTableAction> = [
    {
      label: 'Ir para',
      action: this.goToLocation.bind(this),
      icon: 'thf-icon thf-icon-map',
    }
  ];

  options = {
    layers: [
      L.tileLayer(environment.tileLayerURI, environment.tileLayerOptions)
    ],
    zoom: 19,
    center: L.latLng(-26.329583, -48.846110)
  };

  drawOptions = {
    position: 'topright',
    draw: {
      marker: {
        icon: L.icon({
          iconSize: [25, 41],
          iconAnchor: [13, 41],
          iconUrl: 'assets/marker-icon.png',
          shadowUrl: 'assets/marker-shadow.png'
        })
      },
      polyline: true
    }
  };

  locations = [];

  loadingLocations = false;

  map: any;

  mapProperties: any;

  constructor(private geolocationService: GeolocationService) { }

  ngOnInit(): void {
    this.findLocations();
  }

  onMapReady(mapReady: any) {

    this.map = mapReady;

    // const geojsonFeature = {
    //   'center':
    //     { 'lat': -26.32958327075016, 'lon': -48.846109360456474, 'zoom': 19 },
    //   'layers': [
    //     {
    //       'type': 'Feature', 'properties': {}, 'geometry': {
    //         'type': 'Polygon', 'coordinates':
    //           [[[-48.846151, -26.329615], [-48.846151, -26.329381], [-48.845724, -26.329381],
    //           [-48.845724, -26.329615], [-48.846151, -26.329615]]]
    //       }
    //     }]
    // };

    // const editableLayers = L.featureGroup().addTo(this.map);
    // const drawControl = new L.Control.Draw({
    //   edit: {
    //     featureGroup: editableLayers
    //   },
    //   draw: false
    // }).addTo(this.map);

    // L.geoJSON(geojsonFeature.layers[0]).addTo(editableLayers);
  }

  onDrawReady(drawControl: any) {
    /*console.log('drawControl');
    console.log(drawControl);
    const geojsonFeature = {
      'center':
        { 'lat': -26.32958327075016, 'lon': -48.846109360456474, 'zoom': 19 },
      'layers': [
        {
          'type': 'Feature', 'properties': {}, 'geometry': {
            'type': 'Polygon', 'coordinates':
              [[[-48.846151, -26.329615], [-48.846151, -26.329381], [-48.845724, -26.329381],
              [-48.845724, -26.329615], [-48.846151, -26.329615]]]
          }
        }]
    };*/
    // drawControl.options.edit.featureGroup.addLayer(L.geoJSON(geojsonFeature.layers[0]));
    // const editableLayers = L.featureGroup().addTo(this.map);
    // const drawControls = new L.Control.Draw({
    //   edit: {
    //     featureGroup: editableLayers
    //   },
    //   draw: true
    // }).addTo(this.map);

    // L.geoJSON(geojsonFeature.layers[0]).addTo(editableLayers);
  }

  onDrawCreated(event) {
    const type = event.layerType;
    const layer = event.layer;
    const locationName = prompt('Informe o nome da área');
    layer.bindPopup(`<input type="text" name="locationName" value=${locationName}>`);
    layer.on('popupclose', (popup: any) => {
      layer.bindPopup(popup.content);
    });
    // const shape = layer.toGeoJSON();
    // const shape_for_db = JSON.stringify(shape);
  }

  findLocations(filter = this.locationFilter) {
    this.startLoadingLocations();
    this.geolocationService
      .getLocations(filter)
      .pipe(map((locations: any) =>
        locations.map(location => {
          return {
            'lat': location.lat,
            'lon': location.lon,
            'name': location.display_name,
          };
        })
      ),
        finalize(() => { this.stopLoadingLocations(); }))
      .subscribe(locations => {
        this.locations = locations;
      });
  }

  goToLocation(location) {
    if (this.map) {
      this.map.setView([location.lat, location.lon], 19);
    }
  }

  startLoadingLocations() {
    this.loadingLocations = true;
  }
  stopLoadingLocations() {
    this.loadingLocations = false;
  }

  save() {
    const center = this.map.getCenter();
    const zoom = this.map.getZoom();
    this.mapProperties = {
      lat: center.lat,
      lon: center.lng,
      zoom: zoom
    };

    const geoJsons = [];
    this.map.eachLayer(layer => {
      if (layer instanceof L.CircleMarker) {
        geoJsons.push(this.layerToGeoJson(layer));
      } else if (layer instanceof L.Circle) {
        geoJsons.push(this.layerToGeoJson(layer));
      } else if (layer instanceof L.Marker) {
        geoJsons.push(this.layerToGeoJson(layer));
      } else if (layer instanceof L.Rectangle) {
        geoJsons.push(this.layerToGeoJson(layer));
      } else if (layer instanceof L.Polygon) {
        geoJsons.push(this.layerToGeoJson(layer));
      } else if (layer instanceof L.Polyline) {
        geoJsons.push(this.layerToGeoJson(layer));
      } else if (layer instanceof L.Path) {
        geoJsons.push(this.layerToGeoJson(layer));
      }
    });
    const mapConfig = {
      center: {
        lat: this.mapProperties.lat,
        lon: this.mapProperties.lon,
        zoom: this.mapProperties.zoom
      },
      layers: geoJsons
    };
    console.log(JSON.stringify(mapConfig));
  }

  private layerToGeoJson(layer: any) {
    const shape = layer.toGeoJSON();
    shape.properties['popupContent'] = layer.getPopup().getContent();
    return shape;
  }
}
