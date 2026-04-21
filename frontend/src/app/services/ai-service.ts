import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdviceResponse {
  advice: string;
}

@Injectable({
  providedIn: 'root',
})
export class AiService {
  private apiUrl = 'http://localhost:8000/api/advice/';

  constructor(private http: HttpClient) {}

  getAdvice(prompt: string): Observable<AdviceResponse> {
    return this.http.post<AdviceResponse>(this.apiUrl, { prompt });
  }
}
