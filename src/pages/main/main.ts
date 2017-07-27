import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, ModalController, LoadingController,  ActionSheetController, Config} from 'ionic-angular';
import { NewProfilePage } from '../new_profile/new_profile';
import { ProfilePage } from '../profile/profile';
import { EditProfilePage } from '../edit_profile/edit_profile';
import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/Storage';
import { UserService } from "../../providers/user-service";
import { Flags } from "../../providers/flag";

import { TranslateService } from '@ngx-translate/core';
import { defaultLanguage, availableLanguages, sysOptions } from '../../app/app.constants';

@Component({
  selector: 'page-main',
  templateUrl: 'main.html'
})
export class MainPage {

  profiles: any;
  id:number;
  email: string;
  auth_token: string;
  update:string;
  wifiValue:boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public storage: Storage,
    public userService: UserService,
    private flagService: Flags,
    public loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public translate: TranslateService,
    public config: Config
  ) {
    this.email = "";
    this.auth_token = "";
    this.translate.use(sysOptions.systemLanguage);
    this.config.set('ios', 'backButtonText', this.translate.get('ui.general.back')['value']);
  }

  ngOnInit(){
    this.flagService.setChangedFlag(false);
    this.getData();
    }
  ionViewDidEnter(){
    if(this.flagService.getChangedFlag()){
      this.getData();
    }
  }
  getData(){
    let loading = this.loadingCtrl.create();
    loading.present();

    this.storage.get('email').then(val=>{
      this.email = val;
      this.storage.get('auth_token').then(val=>{
        this.auth_token = val;
        this.userService.getProfiles(this.email, this.auth_token)
          .subscribe(
            (data) => {
              loading.dismiss();
              if(data.success == false){
             }else{
               this.profiles = data.profiles;
               if (data.profiles.length == 0){
                 this.update = "aaa";
               }
               else{
                 this.update = "bbb";
               }
             }
            },
            (data) => {
              loading.dismiss();
              console.log('internet Fails');
            });
      });
    });
  }

  addProfile(){
    this.navCtrl.push(NewProfilePage);
  }

  gotoProfile(event, profile){
      console.log("Go ProfolePage");

      this.navCtrl.push(ProfilePage, {
        profile: profile
      });
  }
  presentActionSheet(event, profile) {
    let actionSheet = this.actionSheetCtrl.create({
      title: '',
      buttons: [
        {
          text: this.translate.get('Upgrade')['value'],
          handler: () => {
            console.log('Upgrade clicked');
          }
        },{
          text: this.translate.get('Link A MyID Product')['value'],
          handler: () => {
            console.log('MyID Product clicked');
          }
        },{
          text: this.translate.get('Create QR Code Wallpaper')['value'],
          handler: () => {
            console.log('QRCode clicked');
          }
        },{
          text: this.translate.get('Delete Profile')['value'],
          role: 'destructive',
          handler: () => {
            console.log('Delete clicked');

            this.confirmAlert(profile);
          }
        },{
          text: this.translate.get('Cancel')['value'],
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
  confirmAlert(profile){
    let alert = this.alertCtrl.create({
      title: 'Are you sure?',
      subTitle: 'Do you want to delete this Profile?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: () => {
            console.log('Buy clicked');
            this.deleteProfile(profile);
            }
          }
        ]
      });
      alert.present();
    }
  deleteProfile(profile){
    let loading = this.loadingCtrl.create();
    loading.present();

    this.userService.deleteProfile( this.auth_token, this.email, profile.id)
      .subscribe(
        (data) => {
          loading.dismiss();
          if(data.success == false){
            console.log(data);
         }else{
           console.log("login result", data);
           this.getData();
         }
        },
        (data) => {
          loading.dismiss();
          console.log("Login error");
        });
    }
}
