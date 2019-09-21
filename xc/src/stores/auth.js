import {observable, action} from 'mobx'
import {Toast} from 'antd-mobile'
import {COUNTRIES_LIST} from '../utils/constants'
import PersonApi from '../api/person'
import {compressorImg} from "../utils/file"

class AuthStore {
  @observable authInfo = {
    country: COUNTRIES_LIST[0],
    cardType: '', // 身份证
    firstName: '', // 张
    lastName: '', // 宁
    cardId: '' // 370205621219253
  }

  @observable photo = {
    cardFront: '',
    cardBack: '',
    cardHold: ''
  }

  @action
  setStorage() {
    try {
      const authInfo = JSON.stringify(this.authInfo)
      localStorage.setItem('AUTH_INFO', authInfo)
    } catch (e) {
      console.log(e)
    }
  }

  @action
  getStorage() {
    try {
      const authInfo = localStorage.getItem('AUTH_INFO')
      this.authInfo = JSON.parse(authInfo)
    } catch (e) {
      console.log(e)
    }
  }

  @action
  changeInfoItem(value, key) {
    this.authInfo[key] = value
    this.setStorage()
    this.getStorage()
  }

  @action
  changePhotoItem(e, key) {
    const image = e.target.files[0]
    const type = this.getPhotoType(key)

    compressorImg(image, (result) => {
      let file = new window.File([result], result.name, {type: result.type})
      PersonApi.uploadPhoto({
        image: file,
        type
      }).then(res => {
        if (res.status !== 1) {
          Toast.info(res.msg)
          return
        }
        Toast.info('上传成功')
        this.getPhotoItem(image, key)
      })
    })
  }

  @action
  submitAuthentication() {
    return PersonApi.submitAuthentication(this.authInfo)
  }

  @action
  submitAuthAudit() {
    return PersonApi.submitAuthAudit({})
  }

  @action
  getPhotoType(name) {
    return name === 'cardFront' ? '1' : name === 'cardBack' ? '2' : '3'
  }

  @action
  getPhotoItem(image, key) {
    const _this = this
    try {
      const reads = new FileReader()
      reads.onload = function () {
        let img = new Image();
        img.src = this.result;

        if (img.complete) {
          _this.photo[key] = this.result

        } else {
          img.onload = () => {
            _this.photo[key] = this.result
          }
        }
      }

      reads.readAsDataURL(image)
    } catch (err) {
      console.log(err)
    }
  }
}

export default AuthStore
