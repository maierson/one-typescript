//import 'babel-polyfill';
import { getCache, put, get, getEdit, evict, print } from './cache';

(function () {
    if (window) {
        (window as any).One = {
            getCache, put, get, getEdit, evict, print
        };
    }
})();

export {
    getCache, put, get, getEdit, evict, print
}
