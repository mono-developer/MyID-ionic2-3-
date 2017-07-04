import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/Storage';
import { UserService } from "../../providers/user-service";

@Component({
  selector: 'page-passcode',
  templateUrl: 'passcode.html'
})
export class PasscodePage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public userService: UserService,
    public loadingCtrl: LoadingController
  ) {

  }



}
