import { Component } from '@angular/core';
import { NavController, NavParams, Nav } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { EditQRWallpaperPage } from '../edit_qr_wallpaper/edit_qr_wallpaper';

import { TranslateService } from '@ngx-translate/core';
import { defaultLanguage, availableLanguages, sysOptions } from '../../app/app.constants';
@Component({
  selector: 'page-qr-wallpaper',
  templateUrl: 'qr_wallpaper.html'
})
export class QRWallpaperPage {

  public base64Image:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public nav: Nav, public camera: Camera, public translate: TranslateService) {
    this.translate.use(sysOptions.systemLanguage);
  }

  goBack(){
    console.log("goBack");
    this.nav.popToRoot()
  }

  goLibrary(){
    let options:CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    }

    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
     this.base64Image = 'data:image/jpeg;base64,' + imageData;
     this.navCtrl.push(EditQRWallpaperPage, {
       base64Image : this.base64Image
     });
    }, (err) => {
     // Handle error
    });
  }

  goCamera(){
    let options1:CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      sourceType: this.camera.PictureSourceType.CAMERA,
    }

    this.camera.getPicture(options1).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
     this.base64Image = 'data:image/jpeg;base64,' + imageData;
     this.navCtrl.push(EditQRWallpaperPage, {
       base64Image : this.base64Image
     });
    }, (err) => {
     // Handle error
    });
  }
}
