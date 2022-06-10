import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment as env } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  constructor(private http: HttpClient) {}

  profileInfo(): Observable<HttpResponse<any>> {
    let prepareUrl: string = `${env.api.profileService}`;
    let userSession = JSON.parse(sessionStorage.getItem("userSession") || "{}");
    let prepareJson = {
      userSub: userSession.accessToken.payload.username,
    };
    return this.http.post<any>(prepareUrl, prepareJson);
  }

  claimBonus(claimCode: any, socialMedia: any): Observable<HttpResponse<any>> {
    let prepareUrl: string = `${env.api.claimBonus}`;
    let userSession = JSON.parse(sessionStorage.getItem("userSession") || "{}");
    let prepareJson = {
      userSub: userSession.accessToken.payload.username,
      claimCode: claimCode,
      socialMedia: socialMedia,
    };
    return this.http.post<any>(prepareUrl, prepareJson);
  }

  rewardHistory(): Observable<HttpResponse<any>> {
    let prepareUrl: string = `${env.api.rewardHistory}`;
    let userSession = JSON.parse(sessionStorage.getItem("userSession") || "{}");
    let prepareJson = {
      userSub: userSession.accessToken.payload.username,
    };
    return this.http.post<any>(prepareUrl, prepareJson);
  }

  updateProfile(formData: any): Observable<HttpResponse<any>> {
    let prepareUrl: string = `${env.api.updateProfile}`;
    return this.http.post<any>(prepareUrl, formData);
  }
}
