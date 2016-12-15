//import 'babel-polyfill';
import { getCache, put, get, getEdit, evict, reset, uuid, print } from './cache';

(function () {
    if (window) {
        (window as any).One = {
            getCache, put, get, getEdit, evict, reset, uuid, print
        };
    }
})();

export {
    getCache, put, get, getEdit, evict, reset, uuid, print
}
