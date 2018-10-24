import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  myphoto:any;

  constructor(public navCtrl: NavController, private camera: Camera, private transfer: FileTransfer, private file: File, private loadingCtrl:LoadingController) {

  }

  takePhoto(){
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.myphoto = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });
  }

  getImage() {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum:false
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.myphoto = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });
  }

  cropImage() {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      allowEdit:true,
      targetWidth:300,
      targetHeight:300
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.myphoto = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });
  }

  uploadImage(){
    //Show loading
    let loader = this.loadingCtrl.create({
      content: "Uploading..."
    });
    loader.present();
    var patientID = 3;

    //create file transfer object
    const fileTransfer: FileTransferObject = this.transfer.create();

    //random int
    let random = Math.random().toString(36).substring(7);


    //option transfer
    let options: FileUploadOptions = {
      fileKey: 'photo',
      fileName: patientID + "_" + random + ".jpg",
      chunkedMode: false,
      httpMethod: 'post',
      mimeType: "image/jpeg",
      headers: {},
      params:{'patientID':patientID}
    }


    //file transfer action
    
     fileTransfer.onProgress((progressEvent) => {
		      	//console.log(progressEvent);
				var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
        console.log(perc);
        //if (perc == 100) {loader.dismiss();}
				//this.progress = perc;
		    });

    fileTransfer.upload(this.myphoto, 'http://192.168.0.2/alice/app/api.php?task=upload_image', options)
      .then((data) => {
        //alert("Success");
        console.log('done');
        loader.dismiss();
      }, (err) => {
        console.log(err.code);
        //alert("Error");

        loader.dismiss();
      });
    
  }

 

}