import { Component, OnInit } from '@angular/core';
import { Medico } from 'src/app/models/medico.model';
import { MedicoService } from '../../services/medico/medico.service';

declare var swal: any;

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];
  cargando: boolean = true;
  desde: number = 0;
  totalRegistros: number = 0;

  constructor(
    public _medicoSevices: MedicoService
  ) { }

  ngOnInit() {
    this.cargarMedicos();
  }

  cargarMedicos() {
    this.cargando = true;
    this._medicoSevices.cargarMedicos( this.desde )
    .subscribe( ( resp: any) => {
      this.medicos = resp.medicos;
      this.totalRegistros = resp.total;
      this.cargando = false;
    });
  }

  buscarMedico( termino: string ) {

    if ( !termino ){
      this.cargarMedicos();
      return;
    }

    this.cargando = true;
    this._medicoSevices.buscarMedico( termino ).subscribe( medicos => {
      this.medicos = medicos;
      this.cargando = false;
    });
  }

  borrarMedico( medico: Medico ) {
    swal({
      Title: '¿Esta seguro?',
      text: `Esta seguro de borrar al medico ${ medico.nombre }?`,
      icon: 'warning',
      buttons: true,
      dangerMode: true
    })
    .then( borrar => {
      if ( borrar ) {
        this._medicoSevices.borrarMedico( medico._id ).subscribe( () => {
          this.desde = 0;
          this.cargarMedicos();
        });
      }
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
    this.cargarMedicos();
  }

}
