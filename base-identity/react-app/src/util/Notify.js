import { notification } from 'antd';
import { Messaging } from "util/LangProvider/locales/en_US_notifications";

export const notify = {
    success,
    error
};

function success(m) {
    notification.success({
        message: Messaging.success(),
        description: m
    });    
}

function error(m) {
    console.log(m);
    notification.error({
        message: Messaging.error(),
        description: m
    });
}