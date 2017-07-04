import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ActionSheetController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserService } from "../../providers/user-service";
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet';

@Component({
  selector: 'page-sharing',
  templateUrl: 'sharing.html'
})
export class SharingPage {

  public relationship: any;
  public email: any;
  public auth_token: any;
  public data: any;
  public others_profiles:any;
  public others_documents:any;
  public me_data:any;
  public others_profiles_count:any;
  public others_documents_count:any;
  public me_count:any;
  todayTime:string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    public userService: UserService,
    public actionSheet: ActionSheet,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
  ) {
      this.relationship="others";
      this.todayTime = new Date().getTime().toString();
    }

  ngOnInit(){
    this.gettingData();
  }

  gettingData(){
    let loading = this.loadingCtrl.create();
    loading.present();
    this.storage.get('email').then(val=>{
      this.email = val;
      this.storage.get('auth_token').then(val=>{
        this.auth_token = val;
        this.userService.getShares(this.email, this.auth_token)
          .subscribe(
            (data) => {
              loading.dismiss();
              if(data.success == false){
              }else{
                this.data=data;
                this.others_profiles = data.sharing.shared_with_others.profiles;
                this.others_profiles_count = this.others_profiles.length;
                // console.log("get Shareed_with_me:" + JSON.stringify(data));
                this.others_documents = data.sharing.shared_with_others.documents;
                this.others_documents_count = this.others_documents.length;
                this.me_data = data.sharing.shared_with_me.profiles;
                this.me_count = this.me_data.length;
              }
            },
            (data) => {
              loading.dismiss();
            });
      });
    });
  }
  gotoProfile(event, profile){

    let actionSheet = this.actionSheetCtrl.create({

          title: profile.shareable.person.first_name + " " + profile.shareable.person.last_name + "'s Profile",
          subTitle: "Shared " + profile.updated_at.substr(0, 10) + " with\n" + profile.shared_email,
          cssClass: 'title-img',
          buttons: [
            {
              text: 'Set Password ',
              handler: () => {
                console.log('SetPassword clicked');
                // this.setPassword(profile.id);
                this.showPassword(profile.id);
              }
            },{
              text: 'Set Expiration',
              handler: () => {
                console.log('SetExpiration clicked');
                this.showExpire(profile.id);
              }
            },{
              text: 'Delete Shared Link',
              role: 'destructive',
              handler: () => {
                console.log('Archive clicked');
                this.deleteItem(profile.id);
              }
            },{
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            }
          ]
        });
      actionSheet.present();
  }

  gotoDocument(event, document){

      let actionSheet = this.actionSheetCtrl.create({

            title: document.shareable.file_name ,
            subTitle:"Shared " + document.updated_at.substr(0, 10) + " with " + document.shared_email,
            cssClass: 'title-img',
            buttons: [
              {
                text: 'Set Password ',
                handler: () => {
                  console.log('SetPassword clicked');
                  this.showPassword(document.id);
                }
              },{
                text: 'Set Expiration',
                handler: () => {
                  console.log('SetExpiration clicked');
                  this.showExpire(document.id);
                }
              },{
                text: 'Delete Shared Link',
                role: 'destructive',
                handler: () => {
                  console.log('Archive clicked');
                  this.deleteItem(document.id);
                }
              },{
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                  console.log('Cancel clicked');
                }
              }
            ]
          });
        actionSheet.present();
  }

  deleteItem(id){
    let loading = this.loadingCtrl.create();
    loading.present();

    this.storage.get('email').then(val=>{
      this.email = val;
      this.storage.get('auth_token').then(val=>{
        this.auth_token = val;
        this.userService.deleteShares(this.email, this.auth_token, id)
          .subscribe(
            (data) => {
              loading.dismiss();
              console.log(JSON.stringify(data));
              if(data.success == false){
              }else{
                  this.gettingData();
              }
            },
            (data) => {
              loading.dismiss();
            });
      });
    });
  }
  
  showPassword(id) {
      let prompt = this.alertCtrl.create({
        title: 'Set Password',
        cssClass:'alert-position',
        inputs: [
          {
            type: 'password',
            name: 'value',
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Save',
            handler: data => {
              console.log('Saved clicked');
              console.log(id + " " + data.value);
              this.setPassword(id, data.value);
            }
          }
        ]
      });
      prompt.present();
    }

    showExpire(id) {
        let today = new Date();
        let prompt = this.alertCtrl.create({
          title: 'Set Expiration',
          cssClass:'alert-position',
          inputs: [
            {
              type: 'date',
              name: 'date',
            },
          ],
          buttons: [
            {
              text: 'Cancel',
              handler: data => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'Save',
              handler: data => {
                console.log('Saved clicked');
                console.log(id + " " + data.date);
                var newDate = new Date(data.date);
                var getDate = newDate.getTime().toString();
                console.log(getDate);
                console.log(this.todayTime);
                var dateNumber = this.todayTime;
                if( getDate.localeCompare(this.todayTime) <0){
                  let alert = this.alertCtrl.create({
                      title: 'Error!',
                      subTitle: "Expiration date must be greater than today's date",
                      buttons: ['OK']
                    });
                    alert.present();
                } else{
                  this.setExpiration(id, getDate);
                }

              }
            }
          ]
        });
        prompt.present();
      }

  setPassword(id, value){
    let loading = this.loadingCtrl.create();
    loading.present();
    var body =  {"id":id, "share":{"password": value}}
    this.storage.get('email').then(val=>{
      this.email = val;
      this.storage.get('auth_token').then(val=>{
        this.auth_token = val;
        this.userService.ShareSetPass(this.email, this.auth_token, id, body)
          .subscribe(
            (data) => {
              loading.dismiss();
              console.log(JSON.stringify(data));
              if(data.success == false){
              }else{
                  this.gettingData();
              }
            },
            (data) => {
              loading.dismiss();
            });
      });
    });
  }
  setExpiration(id, value){
      let loading = this.loadingCtrl.create();
      loading.present();
      var body =  {"id":id, "share":{"expired_at": value}}
      this.storage.get('email').then(val=>{
        this.email = val;
        this.storage.get('auth_token').then(val=>{
          this.auth_token = val;
          this.userService.ShareSetPass(this.email, this.auth_token, id, body)
            .subscribe(
              (data) => {
                loading.dismiss();
                console.log(JSON.stringify(data));
                if(data.success == false){
                }else{
                    this.gettingData();
                }
              },
              (data) => {
                loading.dismiss();
              });
        });
      });
    }

  gotoMeData(event, profile){

  }
}
