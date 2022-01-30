

const ipChecks: any = {};
export default class UtilService {

  retryCount: number = 10;
  constructor(private moment: any) {

  }


  toDate(day: number, month: string, year: number): Date {
    return new Date(day + '-' + month + '-' + year);
  }
  toAddress(street: string, city: string, state: string): string {
    return street + ', ' + city + ', ' + state;
  }
  createResponse = (): any => {
    return { isSuccessful: false, ResponseCode: "06", ResponseDescription: "Processing", Data: null };
  }
  currencyFormatter = (value: any) => {
    return Intl.NumberFormat('yo-NG', { style: 'currency', currency: 'NGN' })
      .format(value)
  }
  replaceAll = (string: any, search: any, replace: any) => {
    return string.split(search).join(replace);
  }
  getFileExtension = (filename: string) => {
    let ext = filename.substring(filename.lastIndexOf('.') + 1, filename.length) || filename;
    return ext;//filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);//filename.substring(filename.lastIndexOf('.')+1, filename.length) || filename
  }
  convertToPlainNumber = (num: any) => {
    const value = parseInt(this.replaceAll(num.toString(), ",", "").replace('NGN', '').replace('₦', '').trim());
    return value;
  }
  amountToWords(amount: number, append?: string) {
    return this.titleCase(new Number().toWords(amount, append));
  }
  randPassword = (letters: number, numbers: number, either: number) => {
    let chars = [
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", // letters
      "0123456789", // numbers
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" // either
    ];

    return [letters, numbers, either].map(function (len, i) {
      return Array(len).fill(chars[i]).map(function (x) {
        return x[Math.floor(Math.random() * x.length)];
      }).join('');
    }).concat().join('').split('').sort(function () {
      return 0.5 - Math.random();
    }).join('')
  }
  autogenerate = ({ prefix }: any) => {
    return `${prefix}_` + this.moment().format("DDmmyyyyhhmmss");
  }
  titleCase = (str: any) => {
    try {
      if (this.hasValue(str)) {
        if (str.includes("NGN")) return str;
        str = str.toLowerCase().split(' ');
        for (let i = 0; i < str.length; i++) {
          str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
        }
        return str.join(' ');
      }
      return str;
    } catch (err) {
      console.log(err);
      return str;
    }
  }
  myEscape = (value: any) => {
    let tagsToReplace: any = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;'
    };
    value = value.replace(/[&<>]/g, function (tag: any) {
      return tagsToReplace[tag] || tag;
    });
    return value;
  }


  spamChecker = (ip: any, controller: any) => {
    try {
      if (!this.hasValue(ip) || !this.hasValue(controller)) return false;
      if (this.hasValue(ipChecks[controller])) {
        let value = ipChecks[controller][ip];
        if (this.hasValue(value)) {
          if (parseInt(value.count) >= this.retryCount && (value.datetime.getHours()) == new Date().getHours()) {
            ipChecks[controller][ip].count += 1;
            ipChecks[controller][ip].datetime = new Date();
            return false;
          } else {
            ipChecks[controller][ip].count += 1;
            ipChecks[controller][ip].datetime = new Date();
          }
        } else {
          ipChecks[controller][ip] = { count: 1, datetime: new Date() };
        }
      } else {
        ipChecks[controller] = {};
        ipChecks[controller][ip] = { count: 1, datetime: new Date() }
      }
      console.log("SPAM CHECKER:" + JSON.stringify(ipChecks));
      return true;
    } catch (err) {
      console.log("SPAM CHECKER: ERROR -" + err);
    } return false;
  }
  hasValue = (obj: any) => {
    if (!obj || Object.keys(obj).length == 0) return false;
    if (obj !== "" && obj !== null && obj !== undefined && obj !== "undefined" && obj != {}) return true;
    return false;
  }

  validateRequest = (request: any, formType: any) => {
    let payload = request.payload;
    console.log(payload)
    return JSON.parse(payload);
  }
  verifyRequest = (req: any, controller: any) => {
    if (!this.hasValue(req.body)) return false;
    if (!this.hasValue(req.ip)) return false;
    if (controller === "sendapplication") {
      if (!this.hasValue(req.body.email)) return false;

    }
    return true;
  }

  validateResponse = (response: any) => {
    if (response.status !== 200) {
      throw Error(response.statusText);
    }
    return response;
  }

  readResponseAsJSON = (response: any) => {
    return response.data;
  }//https://cors-anywhere.herokuapp.com/

}
// module.exports={
//   createResponse,verifyRequest,validateRequest,hasValue,spamChecker,myEscape,titleCase,currencyFormatter,readResponseAsJSON,validateResponse
// }


export class Number {

  // System for American Numbering 
  th_val = ['', 'thousand', 'million', 'billion', 'trillion'];

  dg_val = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  tn_val = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  tw_val = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  toWords(amount: number, append?: string): string {
    let s: string = amount.toString();
    s = s.replace(/[\, ]/g, '');
    // if (s !== parseFloat(s))
    //     return 'not a number ';
    let x_val = s.indexOf('.');
    if (x_val == -1)
      x_val = s.length;
    if (x_val > 15)
      return 'too big';
    let n_val = s.split('');
    let str_val = '';
    let sk_val = 0;
    for (let i = 0; i < x_val; i++) {
      if ((x_val - i) % 3 == 2) {
        if (n_val[i] == '1') {
          str_val += this.tn_val[(+n_val[i + 1])] + ' ';
          i++;
          sk_val = 1;
        } else if ((+n_val[i]) != 0) {
          str_val += this.tw_val[(+n_val[i]) - 2] + ' ';
          sk_val = 1;
        }
      } else if ((+n_val[i]) != 0) {
        str_val += this.dg_val[(+n_val[i])] + ' ';
        if ((x_val - i) % 3 == 0)
          str_val += 'hundred ';
        sk_val = 1;
      }
      if ((x_val - i) % 3 == 1) {
        if (sk_val)
          str_val += this.th_val[(x_val - i - 1) / 3] + ' ';
        sk_val = 0;
      }
    }
    if (x_val != s.length) {
      let y_val = s.length;
      str_val += 'point ';
      for (let i = x_val + 1; i < y_val; i++)
        str_val += this.dg_val[(+n_val[i])] + ' ';
    }
    return `${str_val.replace(/\s+/g, ' ')} ${append}`;

  }


  toCurrency = (value: number) => {
    return Intl.NumberFormat('yo-NG', { style: 'currency', currency: 'NGN' })
      .format(value)
  }
}