import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarcadorColor {
  color : string;
  marker : mapboxgl.Marker;
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styleUrls: ['./marcadores.component.css']
})
export class MarcadoresComponent implements AfterViewInit, OnDestroy {

  @ViewChild('mapa') divMapa!: ElementRef;

  mapa!: mapboxgl.Map;

  zoomLevel: number = 10;

  center: [number, number] = [ -96.93502201658089, 19.55348705510175];

  // Arreglo de marcadores
  marcadores: MarcadorColor[] = [];

  constructor() { }
  
  ngOnDestroy(): void {
    this.mapa.off('zoom', ()=>{});
    this.mapa.off('zoomend', ()=>{});
    this.mapa.off('move', ()=>{});

  }

  ngAfterViewInit(): void {

    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom : this.zoomLevel
    });

    /*
    const markerHtml: HTMLElement = document.createElement('div');
    markerHtml.innerHTML = 'Hola mundo';

    const maker = new mapboxgl.Marker({
      element : markerHtml
    })
    .setLngLat(this.center)
    .addTo( this.mapa );
    */



  }


  agregarMarcador(){

    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));

    const nuevoMarcador = new mapboxgl.Marker({
      draggable: true,
      color
    }).setLngLat(this.mapa.getCenter()).addTo(this.mapa);

    this.marcadores.push({
      marker : nuevoMarcador,
      color
    });
  }

  irMarcador( marcador : MarcadorColor ){
      this.mapa.flyTo({
        center : marcador.marker.getLngLat(),
        zoom: 18
      });
  }



}
