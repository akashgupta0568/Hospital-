import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonserviceService {

  // private http = inject(HttpClient);

  private showHeaderSubject = new BehaviorSubject<boolean>(false);
  showHeader$ = this.showHeaderSubject.asObservable();

  private hospitals = new BehaviorSubject<any[]>([]);
  hospitals$ = this.hospitals.asObservable();
  constructor(private http: HttpClient,private messageService: MessageService) { }

   private apiUrl = 'https://localhost:7161/api/'; // Replace with your API URL

  showSuccess(summary: string, detail: string) {
    this.messageService.add({ severity: 'success', summary, detail });
  }

  showError(summary: string, detail: string) {
    this.messageService.add({ severity: 'error', summary, detail });
  }

  showInfo(summary: string, detail: string) {
    this.messageService.add({ severity: 'info', summary, detail });
  }

  showWarning(summary: string, detail: string) {
    this.messageService.add({ severity: 'warn', summary, detail });
  }
   showHeader() {
    this.showHeaderSubject.next(true);
  }


  // Hide header after logout
  hideHeader() {
    this.showHeaderSubject.next(false);
  }
  // GET request
  getData(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getRoles(){
    return this.http.get(this.apiUrl + 'Auth/roles-hospitals');
  }
  // POST request
  sendData(payload: any): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }
  login(payload: any): Observable<any> {
    console.log(payload);
    return this.http.post<any>(this.apiUrl + "Auth/login", payload);
  }

  register(payload: any): Observable<any> {
    return this.http.post(  this.apiUrl + 'Auth/register', payload);
  }

  addHospital(hospital: any): Observable<any> {
    return this.http.post(this.apiUrl + 'Hospital/add', hospital);
  }

  getHospitals(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'Hospital/list');
  }
  getHospitalsByCreatedBy(createdBy: any): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}Hospital/createdBy/${createdBy}`);
  }

  getHospitalById(id: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}Hospital/${id}`);
  }
  getDoctorHospitalById(id: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}Hospital/createdBy/${id}`);
  }
  updateHospital(id: any, hospital: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}Hospital/update-hospital/${id}`, hospital);
  }
  addDoctorByHospitalId(payload:any){
    return this.http.post(this.apiUrl + 'doctors/add', payload);
  }

  getDoctorsByHospital(hospitalId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}doctors/by-hospital/${hospitalId}`);
  }

  getDoctorByID(doctorId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}doctors/${doctorId}`);
  }

  updateDoctorById(doctorId: number, doctorData: any) {
    return this.http.put(`${this.apiUrl}doctors/update/${doctorId}`, doctorData);
  }
  // Delete a Hospital
  // deleteHospital(id: number): Observable<any> {
  //   return this.http.delete<any>(`${this.baseUrl}/hospitals/${id}`);
  // }
}
