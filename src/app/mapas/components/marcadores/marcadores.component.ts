import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';

interface MarcadorColor {
  color : string;
  marker? : mapboxgl.Marker;
  centro? : [number,number];
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
    this.mapa.off('dragend', ()=>{});


  }

  ngAfterViewInit(): void {

    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom : this.zoomLevel
    });


    this.leerLocalStorage();
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

    this.guardarMarcadoresLocalStorage();

    nuevoMarcador.on('dragend', ()=> {
      this.guardarMarcadoresLocalStorage();
    });


  }

  irMarcador( marcador : MarcadorColor ){
      this.mapa.flyTo({
        center : marcador.marker!.getLngLat(),
        zoom: 18
      });
  }


  guardarMarcadoresLocalStorage(){

    const lngLatArr: MarcadorColor[] = [];

    this.marcadores.forEach( m => {
      const color = m.color;
      const { lng, lat } = m.marker!.getLngLat();
      
      lngLatArr.push({
        color : color,
        centro : [ lng, lat]
      });

    });

    localStorage.setItem('marcadores', JSON.stringify(lngLatArr))
  }


  leerLocalStorage(){
    if ( !localStorage.getItem('marcadores') ){
      return;
    }

    const lngLatArr: MarcadorColor[] =  JSON.parse(localStorage.getItem('marcadores')!);

    lngLatArr.forEach( m => {
      
      const newMarker = new mapboxgl.Marker({
        draggable: true,
        color: m.color
      }).setLngLat(m.centro!).addTo(this.mapa);
      
      this.marcadores.push({
        marker : newMarker,
        color: m.color
      });

      newMarker.on('dragend', ()=> {
        this.guardarMarcadoresLocalStorage();
      });

    });    

  }

  borrarMarcador(i : number) {
    console.log( 'Borrando marcador' + i );
    this.marcadores[i].marker?.remove();
    this.marcadores.splice(i,1);
    this.guardarMarcadoresLocalStorage();
  }

}
