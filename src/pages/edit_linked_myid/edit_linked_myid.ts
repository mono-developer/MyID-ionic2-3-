import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Tabs } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserService } from "../../providers/user-service";
import { Flags } from "../../providers/flag";
import { EditLinkedMyIDAddPage } from "../edit_linked_myid_add/edit_linked_myid_add";

import { TranslateService } from '@ngx-translate/core';
import { defaultLanguage, availableLanguages, sysOptions } from '../../app/app.constants';
@Component({
  selector: 'page-edit-linked-myid',
  templateUrl: 'edit_linked_myid.html'
})
export class EditLinkedMyIDPage {

  tab:Tabs;
  linkData: any;
  email:string;
  auth_token:string;
  public profile_id;
  updated:string;
  linkItems: Array<{label: string, id: string, pin: string}>;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public userService: UserService,
    public storage: Storage,
    private flagService: Flags,
    public translate: TranslateService
  ) {
    this.translate.use(sysOptions.systemLanguage);
    this.tab = this.navCtrl.parent;

    this.profile_id = navParams.get("profile_id");
    this.email = "";
    this.auth_token = "";
  }

  ngOnInit(){
    this.flagService.setChangedFlag(false);
    this.gettingdata();
  }

  ionViewDidEnter(){
    if(this.flagService.getChangedFlag()){
      this.gettingdata();
    }
  }

  gettingdata(){
    let loading = this.loadingCtrl.create();
    var endValue = "/id_bands"
    loading.present();
    this.storage.get('email').then(val=>{
      this.email = val;
      this.storage.get('auth_token').then(val=>{
        this.auth_token = val;
        this.userService.dataGet(this.email, this.auth_token, this.profile_id, endValue)
          .subscribe(
            (data) => {
              loading.dismiss();
              console.log("Vital Data: ", data);
              if(data.success == false){
                let alert = this.alertCtrl.create({
                  title: "Error", subTitle: "Get Data Error", buttons: ['OK']
                });
                alert.present();
                this.navCtrl.pop();
              } else{
                this.linkData = data.id_bands;
                this.updated = data.last_updated_at;

                console.log(data);
              }
          });
      });
    });
  }

  gotoLinkedProduct(){
      this.tab.select(1);
  }

  gotoEditLinkedProducts(event, link){
      this.navCtrl.push(EditLinkedMyIDAddPage, {
        link:link,
        profile_id: this.profile_id
      })
  }
}
