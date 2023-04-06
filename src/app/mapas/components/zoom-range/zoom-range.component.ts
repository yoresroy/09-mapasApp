import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';


@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styleUrls: ['./zoom-range.component.css']
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {

  @ViewChild('mapa') divMapa!: ElementRef;

  mapa!: mapboxgl.Map;

  zoomLevel: number = 10;

  center: [number, number] = [ -96.93502201658089, 19.55348705510175];

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

    this.mapa.on('zoom', (ev)=>{
      this.zoomLevel = this.mapa.getZoom();
      console.log(this.zoomLevel);
    });


    this.mapa.on('zoomend', (ev)=>{
      if ( this.mapa.getZoom() > 18 ) {
        this.mapa.zoomTo(18);
      }
    });

    this.mapa.on('move', (ev)=>{
      const { lng, lat } = ev.target.getCenter();
      this.center = [lng, lat];
      console.log(this.center);
      
    });
  }

  zoomCambio( valor : string ){
    this.mapa.zoomTo(Number(valor));
    console.log(valor);
  }

  zoomOut(){
    this.mapa.zoomOut();
    console.log('Zoom out');
  }

  zoomIn(){
    this.mapa.zoomIn();
    console.log('Zoom in');
  }

}
