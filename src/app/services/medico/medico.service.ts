import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from '../usuario/usuario.service';
import { URL_SERVICIOS } from 'src/app/config/config';
import { map } from 'rxjs/operators';
import { Medico } from '../../models/medico.model';

declare var swal: any;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  usuario: Usuario;
  token: string;

  constructor(
    public http:HttpClient,
    public _usuarioServices: UsuarioService
  ) {
    this.usuario = _usuarioServices.usuario;
    this.token = _usuarioServices.token;
  }

  cargarMedicos( desde: number = 0) {
    const url = `${ URL_SERVICIOS }/medico?desde=${ desde }`;
    return this.http.get( url );
  }

  buscarMedico( termino: string ) {
    const url = `${ URL_SERVICIOS }/busqueda/coleccion/medicos/${ termino }`;
    return this.http.get( url )
    .pipe(
      map( (resp: any) => resp.medicos )
    );
  }

  borrarMedico( id: string ) {
    const url = `${ URL_SERVICIOS }/medico/${ id }?token=${ this.token }`;
    return this.http.delete( url )
    .pipe(
      map( () => swal( 'Medico borrado', 'El médico ha sido eliminado', 'success' ) )
    );
  }

  guardarMedico( medico: Medico ) {

    let url = `${ URL_SERVICIOS }/medico`;

    if ( medico._id ) {
      // Actulizando
      url += `/${ medico._id }?token=${ this.token }`;
      return this.http.put( url, medico )
      .pipe(
        map( (resp: any ) => {
          swal('Medico actualizado', medico.nombre, 'success');
          return resp.medico;
        })
      );
    } else {
      // Creando
      url += `?token=${ this.token }`;
      return this.http.post( url, medico )
      .pipe(
        map( (resp: any) => {
          swal('Medico creado', medico.nombre, 'success');
          return resp.body;
        })
      );

    }

  }

  cargarMedico( id: string ) {
    const url = `${ URL_SERVICIOS }/medico/${ id }`;
    return this.http.get( url )
    .pipe(
      map( ( resp: any ) => resp.medico )
    );
  }

}
