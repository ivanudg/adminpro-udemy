import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

declare var swal: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor( 
    public _usuarioServices: UsuarioService,
    public _modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarUsuarios();
    this._modalUploadService.notificacion.subscribe( resp => this.cargarUsuarios() );
  }

  mostrarModal( id: string ) {
    this._modalUploadService.mostrarModal( 'usuarios', id );
  }

  cargarUsuarios() {
    this.cargando = true;
    this._usuarioServices.cargarUsuarios( this.desde ).subscribe( (resp: any) => {
      this.totalRegistros = resp.total;
      this.usuarios = resp.usuarios;
      this.cargando = false;
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
    this.cargarUsuarios();
  }

  buscarUsuario( termino: string ) {
    if ( !termino ) {
      this.cargarUsuarios();
      return;
    }

    this.cargando = true;
    this._usuarioServices.buscarUsuarios( termino ).subscribe( (usuarios: Usuario[]) => {
      this.usuarios = usuarios;
      this.cargando = false;
    });
  }

  borrarUsuario( usuario: Usuario ) {
    if ( usuario._id === this._usuarioServices.usuario._id ) {
      swal('No puede borrar el usuario', 'No se peude borrar su usuario', 'error');
      return;
    }

    swal({
      title: '¿Esta seguro?',
      text: 'Esta apunto de borrar a ' + usuario.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
    .then( borrar => {
      if (borrar) {
        this._usuarioServices.borrarUsuario( usuario._id ).subscribe( borrado => {
          this.desde = 0;
          this.cargarUsuarios();
        });
      }
    });

  }

  actualizarUsuario( usuario: Usuario ) {
    this._usuarioServices.actualizarUsuario( usuario ).subscribe();
  }

}
