import {getDomain} from './utils';

import {GET_LOGIN_INFO, SAVE_SUBMIT_INFO} from "../action-names";

export class Messages {
    static saveSubmitInfo(hash, callback) {
        chrome.extension.sendRequest({
            action: SAVE_SUBMIT_INFO,
            domain : getDomain(),
            hash
        }, callback);
    }

    static getLoginInfo(callback) {
        chrome.runtime.sendMessage({
            action: GET_LOGIN_INFO,
            url: document.location.toString(),
            domain : getDomain()
        }, callback);
    }
}

