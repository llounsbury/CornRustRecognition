import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})


export class UsersComponent {
  selectedFile: File = null;
  result: String = '';
  dataText: String = '';
  imageUploaded: Boolean = false;
  showResults: Boolean = false;
  showValidate: Boolean = false;
  invalidClassification: Boolean = false;
  validClassification: Boolean = false;
  showUpload: Boolean = true;
  showChooseFile: Boolean = false;
  showCheckButton: Boolean = false;
  url: any = null;

  constructor(private http: HttpClient) {}


  onFileChanged(event) {
    this.selectedFile = <File>event.target.files[0];
    console.log(event);
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e) => {
        this.url = e.target['result'];
      };
    }
    this.imageUploaded = true;
    this.invalidClassification = false;
    this.validClassification = false;
    this.showCheckButton = true;
    this.showUpload = false;
    this.showChooseFile = true;
    this.showValidate = false;
    this.showResults = false;
    this.result = null;
  }


  onUpload() {
    const uploadData = new FormData();
    // uploadData.append('myFile', this.selectedFile, this.selectedFile.name);
    uploadData.append('file', this.selectedFile, this.selectedFile.name);
    console.log(uploadData);
    this.http.post('http://localhost:5000/examine', uploadData)
      .subscribe(res => {
        console.log(res);
        this.result = res['result'].toString();
        this.dataText = res['data'].toString();
      });
    this.showResults = true;
    this.showValidate = true;
    this.showCheckButton = false;
    this.showUpload = true;
  }


  uploadNewFile() {

  }


  isCorrect() {
    this.http.get('http://localhost:5000/correct').subscribe(res => {
      console.log(res);
    });
    console.log('has Been Hit');
    this.showValidate = false;
    this.validClassification = true;
    this.showUpload = true;

  }


  notCorrect() {
    this.http.get('http://localhost:5000/notcorrect').subscribe(res => {
      console.log(res);
    });
    this.showValidate = false;
    this.invalidClassification = true;
    this.showUpload = true;
  }
}
