import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './@api/guard/auth.guard';

const routes: Routes = [
  
  {
    path: 'login',
    loadChildren: () => import('./main/views/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'recuperar-senha',
    loadChildren: () => import('./main/views/recuperar-senha/recuperar-senha.module').then(m => m.RecuperarSenhaModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./main/views/home/home.module').then(m => m.HomeModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'clientes',
    loadChildren: () => import('./main/views/clientes/clientes.module').then(m => m.ClientesModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./main/views/usuarios/usuarios.module').then(m => m.UsuariosModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'sqls',
    loadChildren: () => import('./main/views/sqls/sqls.module').then(m => m.SqlsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'tipos-conexao',
    loadChildren: () => import('./main/views/tipos-conexao/tipos-conexao.module').then(m => m.TiposConexaoModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'tipos-servidor',
    loadChildren: () => import('./main/views/tipos-servidor/tipos-servidor.module').then(m => m.TiposServidorModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'alterar-senha',
    loadChildren: () => import('./main/views/alterar-senha/alterar-senha.module').then(m => m.AlterarSenhaModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'relatorio-backups',
    loadChildren: () => import('./main/views/relatorio-backups/relatorio-backups.module').then(m => m.RelatorioBackupsModule),
    canActivate: [AuthGuard]
  },
  {
    path: '', 
    redirectTo: '/home', 
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
