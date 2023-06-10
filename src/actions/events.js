import Swal  from 'sweetalert2';
import {types}  from '../types/types';
import {fetchConToken}  from '../helpers/fetch';
import {prepareEvents}  from '../helpers/prepareEvents';

export const eventStartAddNew = (event) => {
    return async (dispatch, getState) => {
        const {uid, name} = getState().auth;
        try {
            const resp = await fetchConToken('events', event, 'POST');
            const body = await resp.json();
            if (body.ok) {
                event._id = body.evento.id;
                event.user = {
                    _id: uid,
                    name: name
                }
                dispatch(eventAddNew(event));
            }
        } catch (error) {
            console.log(error);
        }        
    }
}

// Se dispara cuando efectivamente se ha grabado en la DB
const eventAddNew = (event) => ({
    type: types.eventAddNew,
    payload: event
});

export const eventSetActive = (event) => ({
    type: types.eventSetActive,
    payload: event
});

export const eventClearActiveEvent = () => ({
    type: types.eventClearActiveEvent
});

export const eventStartUpdate = (event) => {
    return async (dispatch) => {
        console.log(event._id)
        try {
            const resp = await fetchConToken(`events/${event._id}`, event, 'PUT')
            const body = await resp.json();
            if (body.ok) {
                dispatch(eventUpdated(event));
                //volver a cargar todos los eventos:
                dispatch(eventStartLoading());
            } else {
                Swal.fire('Error', body.msg, 'error');
            }
        } catch (error) {
            console.log(error);
        }
    }
}

const eventUpdated = (event) => ({
    type: types.eventUpdated,
    payload: event,
});

export const eventStartDelete = () => {
    return async (dispatch, getState) => {
        const {_id} = getState().calendar.activeEvent;
        try {
            const resp = await fetchConToken(`events/${_id}`,{},'DELETE');
            const body = await resp.json();
            if (body.ok) {
                dispatch(eventDeleted());
                //volver a cargar todos los eventos:
                dispatch(eventStartLoading());
            } else {
                Swal.fire('Error', body.msg, 'error');
            }            
        } catch (error) {
            console.log(error);
        }
    }
}

const eventDeleted = () => ({
    type: types.eventDeleted
});

export const eventStartLoading = () => {
    return async (dispatch) => {
        try {
            const resp = await fetchConToken('events');
            const body = await resp.json();
            const events = prepareEvents(body.eventos);
            dispatch(eventLoaded(events));
        } catch (error) {
            console.log(error);
        }
    }
}

const eventLoaded = (events) => ({
    type: types.eventLoaded,
    payload: events
});

export const eventLogout = () => ({
    type: types.eventLogout,
});