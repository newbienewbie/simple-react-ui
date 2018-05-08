
export function throttle(f, timeout,thisObj)  {
    let canRun = true;
    return function () {
        let args = arguments;
        if (!canRun) {
            return;
        } else {
            canRun = false;
            setTimeout(()=>{ canRun = true; f.call(thisObj,args); }, timeout);
        }
    };
}
