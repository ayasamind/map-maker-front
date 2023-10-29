const defaultMapState = {
    canAddPin: false,
    canEditPin: false,
}

const canAddPinMapState = {
    canAddPin: true,
    canEditPin: false,
}

const editPinMapState = {
    canAddPin: false,
    canEditPin: true,
}

export { defaultMapState, canAddPinMapState, editPinMapState }