import { Injectable } from '@angular/core';
import swal, { SweetAlertType } from 'sweetalert2';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(
  ) { }

  showInfoAlert(mesg: string) {
    swal.fire(mesg);

  }
  showSuccessAlert(msg: string) {
    swal.fire({
      type: 'success',
      title: 'Success',
      text: msg,
    });
  }

  showErrorAlert(msg: string) {
    swal.fire({
      text: msg || 'error',
    });
  }

  /**used to show a btn(not 'OK') with alert to execute some task */
  showErrorAlertWithBtn(msg: string, btnText: string, clbk: Function) {
    return swal.fire({
      text: msg,
      confirmButtonText: btnText,
      preConfirm: () => clbk(),
      allowOutsideClick: false
    });
  }

  /**used to show a btn(not 'OK') and cancel with alert to execute some task */
  showErrorAlertWithTwoBtn(msg: string, btnText: string) {
    return swal.fire({
      text: msg,
      confirmButtonText: btnText,
      showCancelButton: true,
      //  preConfirm: () => clbk(),
      //  allowOutsideClick: false
    });
  }

  showSuccessToast(msg: string, type?: SweetAlertType) {
    return swal.fire({
      type: type || 'success',
      title: msg,
      position: 'top',
      showConfirmButton: false,
      timer: 1500
    });

  }

  /**
   * Prompts user a confirmation pop-up. Sends some request on confirm button and returns its response to
   * asynchronously
   */
  // tslint:disable-next-line:max-line-length
  confirmWithLoader(request: Observable<any>, Type: SweetAlertType, msg: string, text: string, cnfrmBtnText = 'Yes, Delete !', cnfrmBtnColor = '#d33') {
    return swal.fire({
      title: msg,
      type: Type,
      text: text || '',
      showCancelButton: true,
      confirmButtonText: cnfrmBtnText,
      confirmButtonColor: cnfrmBtnColor,
      cancelButtonColor: '#3085d6',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return new Promise((resolve, reject) => {

          request.subscribe(
            (res: any) => resolve(res),
            (err: any) => reject(err)
          );
        });
      },
      allowOutsideClick: () => !swal.isLoading()
    });
  }

  showLoader(msg: string) {
    swal.fire({
      title: 'Please wait...',
      html: msg,
      allowOutsideClick: () => !swal.isLoading(),
      onOpen: () => {
        swal.showLoading();
      },
    });
  }

  closeLoader() {
    swal.close();
  }
}

