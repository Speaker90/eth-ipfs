import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Http, RequestOptions, RequestOptionsArgs, RequestMethod, ResponseContentType, Headers, Request} from '@angular/http';
import { Response } from '@angular/http';
//import { FinalReport } from '../../model/finalReport'
const ipfs = require('ipfs-js');

@Injectable()
export class IpfsService {

  ipfsEndpoint = 'http://localhost:4201/upload/ipfs';
  
   constructor(private http: Http) { }

   private formatErrors(error: any) {
    return Observable.throw(error.json());
 }

  fileChange(fileList: FileList) {
    if (fileList.length > 0) {
      const file: File = fileList[0];
      const formData: FormData = new FormData();
      formData.append('uploadFile', file);
      const headers = new Headers();
      headers.append('Accept', 'application/json');

      const basicOptions: RequestOptionsArgs = {
        url: this.ipfsEndpoint,
        method: RequestMethod.Post,
        headers: headers,
        body: formData
      };

      const options = new RequestOptions(basicOptions);
      return this.http.request(new Request(options))
        .map(res => res.json());
    }
  }

  getBase64(files, callback) {
    const file = files[0];
    const reader = new FileReader();
    reader.onload = function (readerEvt) {
      callback(reader.result);
    };
    reader.readAsDataURL(file);
  }

  downloadFile(hash) : Observable<any> {
    if (hash!="") {
      const formData: FormData = new FormData();
      const ipfsStartpoint = 'http://localhost:8080/ipfs/' + hash;
      //formData.append('downloadFile', hash);
      const headers = new Headers();
      //headers.append('Content-Type', 'text/html');
      headers.append('Accept', 'text/html');

      const basicOptions: RequestOptionsArgs = {
        url: ipfsStartpoint,
        method: RequestMethod.Get,
        headers: headers,
        //body: formData
      };

      //const options = new RequestOptions(basicOptions);
      //return this.http.request(new Request(options));
      const options = new RequestOptions(basicOptions);
      return this.http.request(new Request(options))
      .catch(this.formatErrors)
       
      /*.pipe(
        tap( // Log the result or error
          data => this.log(filename, data),
          error => this.logError(filename, error)
        )*/
      
            //.map(FinalReport=> {FinalReport.toString()})
           // .catch((err) => this.handleError(err));
    };
  
    
 
  /* private handleError (error: any) {
       let errMsg = error.message || 'Server error';
       console.error(errMsg); // log to console instead
       return Observable.throw(errMsg);
   }
  
  */
  
  }

}

  

