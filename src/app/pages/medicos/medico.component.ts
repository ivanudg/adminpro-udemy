import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Hospital } from 'src/app/models/hospital.model';
import { MedicoService, HospitalService } from 'src/app/services/service.index';
import { Medico } from '../../models/medico.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {

  hospitales: Hospital[] = [];
  hospital: Hospital = new Hospital( '' );
  medico: Medico = new Medico('', '', '', '', '');

  constructor(
    public router: Router,
    public _medicoService: MedicoService,
    public _hospitalService: HospitalService,
    public _modalUploadService: ModalUploadService,
    public activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.params.subscribe( params => {
      const id = params[ 'id' ];
      if ( id !== 'nuevo') {
        this.cargarMedico( id );
      }

    });
  }

  ngOnInit() {
    this.cargarHospitales();
    this._modalUploadService.notificacion.subscribe( resp => {
      this.medico.img = resp.medico.img;
    });
  }

  cambiarFoto() {
    this._modalUploadService.mostrarModal( 'medicos', this.medico._id );
  }

  cargarMedico( id: string ) {
    this._medicoService.cargarMedico( id ).subscribe( medico => {
      this.medico = medico;
      this.hospital = medico.hospital;
      this.medico.hospital = medico.hospital._id;
    });
  }

  cargarHospitales() {
    this._hospitalService.cargarHospitales().subscribe( (resp: any) => {
      this.hospitales = resp.hospitales;
    });
  }

  guardarMedico( forma: NgForm ) {
    if ( forma.invalid ) {
      return;
    }

    this._medicoService.guardarMedico( this.medico ).subscribe( medico => {
      this.medico = medico;
      this.router.navigate(['/medico', this.medico._id]);
    });
  }

  cambioHospital( id: string ) {
    this._hospitalService.obtenerHospital( id ).subscribe( hospital => this.hospital = hospital );
  }

}
