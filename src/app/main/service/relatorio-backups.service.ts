import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/@api/service/auth.service';
import { DataService } from 'src/app/@api/service/data.service';

@Injectable({
  providedIn: 'root'
})
export class RelatorioBackupsService extends DataService {

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {
    super('/relatorio-backup');
  }

  geraRelatorioBackup(filtros: any): Observable<any> {
    return this.http.post(`${this.url}`, filtros, {
      responseType: 'blob',
      headers: this.getDefaultHeaderOptions()
    });
  }

  protected getAuthorizationToken(): string | null {
    return this.auth.getAuthorizationToken();
  }
}
