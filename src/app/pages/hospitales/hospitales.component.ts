import { Component, OnInit } from '@angular/core';
import { HospitalService } from '../../services/hospital/hospital.service';
import { Hospital } from 'src/app/models/hospital.model';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

declare var swal: any;

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];
  desde: number = 0;
  cargando: boolean = true;
  totalRegistros: number = 0;

  constructor(
    public _hospitalService: HospitalService,
    public _modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarHospitales();
    this._modalUploadService.notificacion.subscribe( () => this.cargarHospitales() );
  }

  mostrarModal( id: string ) {
    this._modalUploadService.mostrarModal( 'hospitales', id );
  }

  cargarHospitales() {
    this.cargando = true;
    this._hospitalService.cargarHospitales( this.desde ).subscribe( (resp: any ) => {
      this.totalRegistros = resp.total;
      this.hospitales = resp.hospitales;
      this.cargando = false;
    });
  }

  borrarHospital( hospital: Hospital ) {

    swal({
      Title: '¿Esta seguro?',
      text: `Esta seguro de borrar el ${ hospital.nombre }?`,
      icon: 'warning',
      buttons: true,
      dangerMode: true
    })
    .then( borrar => {
      if ( borrar ) {
        this._hospitalService.borrarHospital( hospital._id ).subscribe( borrado => {
          this.desde = 0;
          this.cargarHospitales();
        });
      }
    });
  }

  buscarHospital( termino: string ) {

    if ( !termino ) {
      this.cargarHospitales();
      return;
    }

    this.cargando = true;
    this._hospitalService.buscarHospital( termino ).subscribe( ( hospitales: Hospital[] ) => {
      this.hospitales = hospitales;
      this.cargando = false;
    });

  }

  actualizarHospital( hospital: Hospital ) {
    this._hospitalService.actualizarHospital( hospital ).subscribe();
  }

  crearHospital() {
    swal({
      title: 'Crear Hospital',
      text: 'Ingrese el nombre del hospital',
      content: 'input',
      icon: 'info',
      buttons: ['Cerrar', 'Crear'],
      dangerMode: true
    })
    .then( ( valor: string ) => {

      if ( valor === null ) {
        return;
      } else if ( valor === '' ) {
        swal('El nombre es obligatorio', 'Favor de ingresar el nombre del hospital', 'warning');
        return;
      }

      this._hospitalService.crearHospital( valor ).subscribe( () => this.cargarHospitales() );

    });
  }

  cambiarDesde( valor: number ) {
    const desde = this.desde + valor;
    if ( desde >= this.totalRegistros ){
      return;
    } else if ( desde < 0 ) {
      return;
    }
    this.desde += valor;
    this.cargarHospitales();
  }
}
