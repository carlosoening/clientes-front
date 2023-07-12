import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/@api/service/auth.service';
import { HeaderService } from 'src/app/layout/components/header/header.service';
import { LoggerService } from 'src/app/shared/loggers/logger.service';

import { ClienteDto } from '../../dto/cliente.dto';
import { ClienteService } from '../../service/cliente.service';
import { RelatorioBackupsService } from '../../service/relatorio-backups.service';

@Component({
  selector: 'app-relatorio-backups',
  templateUrl: './relatorio-backups.component.html',
  styleUrls: ['./relatorio-backups.component.scss']
})
export class RelatorioBackupsComponent implements OnInit {

  filtrosForm: FormGroup;
  clientes: ClienteDto[] = [];
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private headerService: HeaderService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private clienteService: ClienteService,
    private logger: LoggerService,
    private relatorioBackupsService: RelatorioBackupsService,
  ) { 
    this.headerService.headerData = {
      title: 'Relatório Backups',
      buttonType: null,
      icon: '',
      route: this.route,
      searchInput: false,
    };

    this.filtrosForm = this.formBuilder.group({
      idCliente: [0],
      dataInicial: [this.getDataPrimeiroDiaDoMes(), Validators.required],
      dataFinal: [this.getDataUltimoDiaDoMes(), Validators.required],
      opcao: ['ambos', Validators.required],
    });
  }

  ngOnInit(): void {
    this.clienteService.getAll().subscribe({
      next: res => {
        this.clientes = res;
      },
      error: error => {
        this.logger.error(error?.error?.message);
      }
    });
  }

  getDataPrimeiroDiaDoMes() {
    const date = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month <= 9 ? `0${month}` : month}-${day <= 9 ? `0${day}` : day}`;
  }

  getDataUltimoDiaDoMes() {
    const date = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month <= 9 ? `0${month}` : month}-${day <= 9 ? `0${day}` : day}`;
  }

  gerarRelatorio() {
    this.loading = true;
    this.relatorioBackupsService.geraRelatorioBackup(this.filtrosForm.getRawValue()).subscribe({
      next: res => {
        const file = new Blob([res], { type: 'application/pdf' });
        let fileURL = URL.createObjectURL(file);
        window.open(fileURL);
        this.loading = false; 
        // let a = document.createElement('a');
        // a.href = fileURL; 
        // a.target = '_blank';
        // a.download = 'relatorio.pdf';
        // document.body.appendChild(a);
        // a.click();
      },
      error: error => {
        if (error.status === 401) {
          this.logger.error('A sua sessão expirou! Faça login novamente.');
          this.authService.doLogout().subscribe(() => {
            this.router.navigate(['login']);
          });
        } else {
          this.logger.error(error?.error?.message);
        }
        this.loading = false;
      }
    })
  }
}
