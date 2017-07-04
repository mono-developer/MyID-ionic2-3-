import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { PopoverContentPage } from '../pages/popover/popover';
import { HttpModule} from '@angular/http';
import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { MainPage } from '../pages/main/main';
import { NewProfilePage } from '../pages/new_profile/new_profile';
import { ProfilePage } from '../pages/profile/profile';
import { SignupPage } from '../pages/signup/signup';
import { ForgotPage } from '../pages/forgot/forgot';
import { AgreePage } from '../pages/agree/agree';
import { EditProfilePage } from '../pages/edit_profile/edit_profile';
import { LinkProductPage } from '../pages/link_product/link_product';
import { PreviewProfilePage } from '../pages/preview_profile/preview_profile';
import { DocumentsPage } from '../pages/documents/documents';
import { DetailDocumentPage } from '../pages/detail_document/detail_document';
import { QRWallpaperPage } from '../pages/qr_wallpaper/qr_wallpaper';
import { ReviewPage } from '../pages/review/review';
import { SettingsPage } from '../pages/settings/settings';
import { PasscodePage } from '../pages/passcode/passcode'
import { UpgradeAccountPage } from '../pages/upgrade_account/upgrade_account'
import { BillingPage } from '../pages/billing/billing'
import { EditVitalConditionsPage } from '../pages/edit_vital_conditions/edit_vital_conditions';
import { EditVitalConditionsAddPage } from '../pages/edit_vital_conditions_add/edit_vital_conditions_add';
import { EditPersonalInformationPage } from '../pages/edit_personalinfo/edit_personalinfo';
import { EditAddressPage } from '../pages/edit_address/edit_address';
import { EditEmergencyPage } from '../pages/edit_emergency/edit_emergency';
import { EditEmergencyAddPage } from '../pages/edit_emergency_add/edit_emergency_add';
import { EditAllergiesPage } from '../pages/edit_allergies/edit_allergies';
import { EditAllergiesAddPage } from '../pages/edit_allergies_add/edit_allergies_add';
import { EditMedicationsPage } from '../pages/edit_medications/edit_medications';
import { EditMedicationsAddPage } from '../pages/edit_medications_add/edit_medications_add'
import { EditPhysiciansPage } from '../pages/edit_physicians/edit_physicians';
import { EditPhysiciansAddPage } from '../pages/edit_physicians_add/edit_physicians_add';
import { EditInsuranceInfoPage } from '../pages/edit_insurance_info/edit_insurance_info';
import { EditInsuranceInfoAddPage } from '../pages/edit_insurance_info_add/edit_insurance_info_add'
import { EditOtherInfoPage } from '../pages/edit_other_info/edit_other_info';
import { EditOtherInfoAddPage } from '../pages/edit_other_info_add/edit_other_info_add';
import { EditLinkedMyIDPage } from '../pages/edit_linked_myid/edit_linked_myid';
import { EditQRWallpaperPage } from '../pages/edit_qr_wallpaper/edit_qr_wallpaper';
import { SharingPage } from '../pages/sharing/sharing';
import { SuccessLinkPage } from '../pages/success_link/success_link';
import { EditLinkedMyIDAddPage } from '../pages/edit_linked_myid_add/edit_linked_myid_add';
import { ShareProfilePage } from '../pages/share_profile/share_profile';

import { Flags } from "../providers/flag";
import { UserService } from '../providers/user-service';
import { BaseService } from "../providers/base-service";
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
//import { Rollbar } from '@ionic-native/rollbar';
//import { RollbarService } from 'angular-rollbar';
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera } from '@ionic-native/camera';
import { ActionSheet } from '@ionic-native/action-sheet';
import { DatePicker } from '@ionic-native/date-picker';
import { Transfer } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
import { IonAlphaScrollModule } from '../components/ionic2-alpha-scroll';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { MultipartItem } from '../providers/multipart-upload/multipart-item';
import { MultipartUploader } from '../providers/multipart-upload/multipart-uploader';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { PillReminderPage } from '../pages/pill_reminder/pill_reminder';
import { AddMedicinePage } from '../pages/add_medicine/add_medicine';
import { SchedulePage } from '../pages/schedule/schedule';
import { RefillReminderPage } from '../pages/refill_reminder/refill_reminder';
import { ViewReminderPage } from '../pages/view_reminder/view_reminder';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PopoverContentPage,
    ListPage,
    LoginPage,
    MainPage,
    NewProfilePage,
    ProfilePage,
    SignupPage,
    ForgotPage,
    AgreePage,
    EditProfilePage,
    LinkProductPage,
    PreviewProfilePage,
    DocumentsPage,
    DetailDocumentPage,
    QRWallpaperPage,
    ReviewPage,
    SettingsPage,
    PasscodePage,
    UpgradeAccountPage,
    BillingPage,
    SharingPage,
    SuccessLinkPage,
    EditLinkedMyIDAddPage,

    EditVitalConditionsPage,
    EditVitalConditionsAddPage,
    EditPersonalInformationPage,
    EditAddressPage,
    EditEmergencyPage,
    EditEmergencyAddPage,
    EditAllergiesPage,
    EditAllergiesAddPage,
    EditMedicationsPage,
    EditMedicationsAddPage,
    EditPhysiciansPage,
    EditPhysiciansAddPage,
    EditInsuranceInfoPage,
    EditInsuranceInfoAddPage,
    EditOtherInfoPage,
    EditOtherInfoAddPage,
    EditLinkedMyIDPage,
    EditQRWallpaperPage,
    ShareProfilePage,
    PillReminderPage,
    AddMedicinePage,
    SchedulePage,
    RefillReminderPage,
    ViewReminderPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonAlphaScrollModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    PopoverContentPage,
    ListPage,
    LoginPage,
    MainPage,
    NewProfilePage,
    ProfilePage,
    SignupPage,
    ForgotPage,
    AgreePage,
    EditProfilePage,
    LinkProductPage,
    PreviewProfilePage,
    DocumentsPage,
    DetailDocumentPage,
    QRWallpaperPage,
    ReviewPage,
    SettingsPage,
    PasscodePage,
    UpgradeAccountPage,
    BillingPage,
    SharingPage,
    SuccessLinkPage,
    EditLinkedMyIDAddPage,

    EditVitalConditionsPage,
    EditVitalConditionsAddPage,
    EditPersonalInformationPage,
    EditAddressPage,
    EditEmergencyPage,
    EditEmergencyAddPage,
    EditAllergiesPage,
    EditAllergiesAddPage,
    EditMedicationsPage,
    EditMedicationsAddPage,
    EditPhysiciansPage,
    EditPhysiciansAddPage,
    EditInsuranceInfoPage,
    EditInsuranceInfoAddPage,
    EditOtherInfoPage,
    EditOtherInfoAddPage,
    EditLinkedMyIDPage,
    EditQRWallpaperPage,
    ShareProfilePage,
    PillReminderPage,
    AddMedicinePage,
    SchedulePage,
    RefillReminderPage,
    ViewReminderPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    UserService,
    BaseService,
    Flags,
    //Rollbar,
    //RollbarService,
    ImagePicker,
    Camera,
    ActionSheet,
    DatePicker,
    Transfer,
    File,
    BarcodeScanner,
    InAppBrowser,
    // MultipartItem,
    // MultipartUploader,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
