const defaultPopup = {
    display: false,
    suddenDisplay: false,
    message: "",
    type: "success",
    displayed: false,
}

const getSuccssPopup = (message: string) => {
    return {
        display: true,
        suddenDisplay: false,
        message: message,
        type: "success",
        displayed: false,
    }
}

const getErrorPopup = (message: string) => {
    return {
        display: true,
        suddenDisplay: false,
        message: message,
        type: "error",
        displayed: false,
    }
}

const getSuddenSuccessPopup = (message: string) => {
    return {
        display: true,
        suddenDisplay: true,
        message: message,
        type: "success",
        displayed: false,
    }
}

const getSuddenErrorPopup = (message: string) => {
    return {
        display: true,
        suddenDisplay: true,
        message: message,
        type: "error",
        displayed: false,
    }
}

const getDisplyedPopup = (popup: any) => {
    return {
        display: popup.display,
        suddenDisplay: popup.suddenDisplay,
        message: popup.message,
        type: popup.type,
        displayed: true,
    }
}

export { defaultPopup, getSuccssPopup, getErrorPopup, getSuddenSuccessPopup, getSuddenErrorPopup, getDisplyedPopup }