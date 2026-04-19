import {Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable, tap} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  private accessKey = 'auth_token';
  private refreshKey = 'refresh_token';

  constructor(private http: HttpClient, private router: Router) { }

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register/`, userData).pipe(
      tap(res => {
        this.setAccessToken(res.access);
        this.setRefreshToken(res['refresh']);
        this.isLoggedIn.set(true);
      })
    )
  }

  login(credentials: any): Observable<any> {
    return this.http.post<{access: string, refresh: string}>(`${this.apiUrl}/login/`, credentials).pipe(
      tap(res => {
        this.setAccessToken(res.access);
        this.setRefreshToken(res['refresh']);
        this.isLoggedIn.set(true);
      })
    )
  }

  logout(): void {
    localStorage.removeItem(this.accessKey);
    localStorage.removeItem(this.refreshKey);
    this.isLoggedIn.set(false);
    void this.router.navigate(['login']);
  }

  public setAccessToken(token: string): void {
    localStorage.setItem(this.accessKey, token);
  }

  public getToken(): string | null {
  return localStorage.getItem(this.accessKey);
  }

  public setRefreshToken(refreshToken: string): void {
    localStorage.setItem(this.refreshKey, refreshToken);
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshKey);
  }

  private checkInitialLoginState(): boolean {
    return localStorage.getItem(this.accessKey) !== null;
  }

  public isLoggedIn = signal<boolean>(this.checkInitialLoginState());

}
