import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-edit-qr-wallpaper',
  templateUrl: 'edit_qr_wallpaper.html'
})

export class EditQRWallpaperPage {

  public base64Image:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.base64Image = navParams.get('base64Image');
    console.log("base64Image"+this.base64Image);
  }
}
