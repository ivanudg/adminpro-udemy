import { Injectable } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { UsuarioService } from '../usuario/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { map } from 'rxjs/operators';

declare var swal: any;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  usuario: Usuario;
  token: string;

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) {
    this.usuario = this._usuarioService.usuario;
    this.token = this._usuarioService.token;
  }

  cargarHospitales( desde: number = 0 ) {
    const url = `${ URL_SERVICIOS }/hospital?desde=${ desde }`;
    return this.http.get( url );
  }

  obtenerHospital( id: string ) {
    const url = `${ URL_SERVICIOS }/hospital/${ id }`;
    return this.http.get( url ).
    pipe(
      map( (resp: any ) => resp.hospital )
    );
  }

  borrarHospital( id: string ) {
    const url = `${ URL_SERVICIOS }/hospital/${ id }?token=${ this.token }`;
    return this.http.delete( url )
    .pipe(
      map( resp => {
        swal('Hospital borrado', 'El hospital ha sido borrado correctamente', 'success');
        return true;
      })
    );
  }

  crearHospital( nombre: string ) {
    const url = `${ URL_SERVICIOS }/hospital?token=${ this.token }`
    const hospital: Hospital = { nombre };
    return this.http.post( url, hospital )
    .pipe(
      map( (resp: any) => {
        swal('Hospital creado', nombre, 'success');
        return resp.body;
      })
    );
  }

  buscarHospital( termino: string ) {
    const url = `${ URL_SERVICIOS }/busqueda/coleccion/hospitales/${ termino }`;
    return this.http.get( url )
    .pipe(
      map( ( resp: any ) => resp.hospitales )
    );
  }

  actualizarHospital( hospital: Hospital ) {
    const url = `${ URL_SERVICIOS }/hospital/${ hospital._id }?token=${ this.token }`;
    return this.http.put( url, hospital )
    .pipe(
      map( (resp: any) => {
        swal( 'Hospital actualizado', hospital.nombre, 'success' );
      })
    );
  }
}


