import * as actionTypes from './../actions';

const initialState = {
    type: '',
    logs: [
        {
            type: 'step',
            date: '2020-11-15'
        },
        {
            title: 'Proceso iniciado',
            comments:'Tu proceso de titulacion a comenzado',
            date: '2020-11-15 05:34:33',
            type: 'start process',
            icon: 'fas fa-star bg-green',
            extra: ''
        },
        {
            type: 'step',
            date: '2020-11-16'
        },
        {
            title: 'Proceso detenido',
            comments: 'Faltan documentos',
            date: '2020-11-16 05:34:33',
            type: 'pause',
            icon: 'fas fa-exclamation bg-yellow',
        },
        {
            type: 'step',
            date: '2020-11-17'
        },
        {
            title: '',
            comments: 'comment',
            date: '2020-11-17 05:34:33',
            type: 'first step',
            icon: 'fas fa-exclamation bg-yellow',
        },
        {
            title: '',
            comments: 'comment',
            date: '2020-11-17 06:34:33',
            type: 'second step',
            icon: 'fas fa-exclamation bg-yellow',
        },
        {
            title: '',
            comments: 'comment',
            date: '2020-11-17 07:34:33',
            type: 'third step',
            icon: 'fas fa-exclamation bg-yellow',
        },
        {
            type: 'step',
            date: '2020-11-18'
        },
        {
            title: '',
            comments: 'El proceso ha sido completado',
            date: '2020-11-18 05:34:33',
            type: 'complete',
            icon: 'fas fa-exclamation bg-yellow',
        },
        {
            title: '',
            comments: 'el proceso ha sido rechazado por ...',
            date: '2020-11-18 05:34:33',
            type: 'reject',
            icon: 'fas fa-exclamation bg-yellow',
        },
        {
            title: '',
            comments: 'El proceso ha sido cancelado por ...',
            date: '2020-11-18 05:34:33',
            type: 'cancel',
            icon: 'fas fa-exclamation bg-yellow',
        },
    ]
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_PROCESS_TITULATION:
            return action.titulation;
        default: return state;
    }
};

export default reducer;