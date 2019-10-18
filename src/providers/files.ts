import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class FilesApi {
  constructor(public http: HttpClient) {}

  public uploadCatalog(formData: FormData): Observable<any> {
    return this.http.post(
      'Files/upload-catalog',
      formData
    );
  }

  public uploadProfilePicture(formData: FormData): Observable<any> {
    return this.http.post(
      'Files/upload-profile-picture',
      formData
    );
  }

  // public sendInvoice(conversationId: number, data: any, file: FormData): Observable<any> {
  //   return this.http.post(
  //     `Conversations/send-invoice/${conversationId}`,
  //     {
  //       commision: data.commision,
  //       totalAmount: data.totalAmount,
  //       commisionAmount: data.commisionAmount,
  //       file: file
  //     }
  //   );
  // }
}
