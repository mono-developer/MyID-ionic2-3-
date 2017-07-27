import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ModalController, Config} from 'ionic-angular';
import { Network }  from '@ionic-native/network';
import { Subscription } from 'rxjs';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { MainPage } from '../pages/main/main';
import { SignupPage } from '../pages/signup/signup';
import { ForgotPage } from '../pages/forgot/forgot';
import { AgreePage } from '../pages/agree/agree';
//import { Rollbar } from '@ionic-native/rollbar';
import { ReviewPage } from '../pages/review/review';
import { SettingsPage } from '../pages/settings/settings';
import { SharingPage } from '../pages/sharing/sharing';
import { PillReminderPage } from '../pages/pill_reminder/pill_reminder';
import { PasscodeSettingPage } from '../pages/passcode-setting/passcode-setting';

// import { TranslateModule } from 'ng2-translate/ng2-translate';
import { TranslateModule } from '@ngx-translate/core';
// import { TranslateService } from 'ng2-translate';
import { TranslateService } from '@ngx-translate/core';
import { Globalization } from '@ionic-native/globalization';
import { defaultLanguage, availableLanguages, sysOptions } from './app.constants';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  private onResumeSubscription: Subscription;

  @ViewChild(Nav) nav: Nav;


  rootPage: any = HomePage;
  passValue:any;

  pages: Array<{title: string, component: any}>;
  email: string;
  wifiFlag:boolean;
  constructor(
    public platform: Platform,
    public modalCtrl: ModalController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    //public rollbar: Rollbar,
    public storage: Storage,
    public translate: TranslateService,
    public globalization: Globalization,
    public config: Config,
    private network: Network,
  ) {

    this.onResumeSubscription = platform.resume.subscribe(() => {
       // do something meaningful when the app is put in the foreground
       console.log("ResumeSubscription");
       let profileModal = this.modalCtrl.create(PasscodeSettingPage, {
         val: 'background'
       });
       this.storage.get('passcode').then(val=>{
         if(val == null){
           console.log("go on");
         } else {
           console.log("run passcode page")
           profileModal.present();
         }
       });
    });

    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Manage Profiles', component: MainPage },
      { title: 'Pill Reminders', component: PillReminderPage},
      { title: 'Sharing', component: SharingPage},
      { title: 'Review Community', component: ReviewPage},
      { title: 'Account Setting', component: SettingsPage}
    ];

    this.storage.get('email').then(val=>{
      this.email = val;
    });
  }

  getSuitableLanguage(language){
    language = language.substring(0,2).toLowerCase();
    return availableLanguages.some(x=>x.code == language)?language:defaultLanguage;
  }

  initializeApp() {
    this.platform.ready().then(() => {

      console.log('network type',this.network.type);

      let disconnectSubscription = this.network.onDisconnect().subscribe(() => {

        this.wifiFlag = !this.wifiFlag;
        console.log('wifi-connect',this.wifiFlag);
        this.storage.set('wifi', this.wifiFlag);
      });
      //disconnectSubscription.unsubscribe();

      let connectSubscription = this.network.onConnect().subscribe(() => {
        setTimeout(() => {
          if (this.network.type === 'wifi') {
            this.wifiFlag = !this.wifiFlag;
            console.log('wifi-connect',this.wifiFlag);
            this.storage.set('wifi', this.wifiFlag);
          }
        }, 3000);
      });
      //connectSubscription.unsubscribe();
      if (this.network.type == 'wifi' ) {
        this.wifiFlag = true;
        console.log('wifi-type',this.wifiFlag);
        this.storage.set('wifi', this.wifiFlag);

      } else {
        this.wifiFlag = false;
        console.log('wifi-type',this.wifiFlag);
        this.storage.set('wifi', this.wifiFlag);
      }

      this.translate.setDefaultLang(defaultLanguage);

      if ((<any>window).cordova){
        this.globalization.getPreferredLanguage().then(result =>{
          let language = this.getSuitableLanguage(result.value);
          this.translate.use(language);
          sysOptions.systemLanguage = language;
          console.log("language" + language);
        });
      }
      else{
        let browserLanguage = this.translate.getBrowserLang() || defaultLanguage;
        let language = this.getSuitableLanguage(browserLanguage);
        this.translate.use(language);
        sysOptions.systemLanguage = language;
        console.log("language" + language);
      }

      this.statusBar.styleDefault();
      this.splashScreen.hide();
      //this.rollbar.init();
      // Enable to debug issues.
      // window["plugins"].OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});

    var notificationOpenedCallback = function(jsonData) {
     console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
    };

    window["plugins"].OneSignal
     .startInit("ec246da9-a218-4444-8510-4d4db110a89b", "")
     .handleNotificationOpened(notificationOpenedCallback)
     .endInit();


    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
