import React, {useEffect, useState} from 'react';
import moment from 'moment';
import Modal from 'react-modal';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import Swal from 'sweetalert2';
import {useDispatch, useSelector}  from 'react-redux';
import {uiCloseModal}  from '../../actions/ui';
import {eventStartAddNew, eventClearActiveEvent, eventStartUpdate}  
      from '../../actions/events'

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
};

//enlazado 
Modal.setAppElement('#root');

//fecha inicial
const now = moment().minutes(0).seconds(0).add(1,'hours');
//fecha final
const nowPlus1 = now.clone().add(1,'hours');

const initEvent = {
  title: '',
  notes: '',
  start: now.toDate(),
  end: nowPlus1.toDate()
}

export const CalendarModal = () => {

  const {modalOpen} = useSelector(state => state.ui);
  const {activeEvent} = useSelector(state => state.calendar);

  const dispatch = useDispatch();

  const [dateStart, setDateStart] = useState(now.toDate());

  const [dateEnd, setDateEnd] = useState(nowPlus1.toDate());

  const [titleValid, setTitleValid] = useState(true);

  const [formValues, setFormValues] = useState(initEvent);

  const {title, notes, start, end} = formValues;

  useEffect(() => {
    if (activeEvent){
      setFormValues(activeEvent);
    } else {
      setFormValues(initEvent);
    }
  }, [activeEvent, setFormValues]);
  
  const handleInputChange = ({target}) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value
    })
  }

  const handleSubmitForm = (evento) => {
    evento.preventDefault();
    const momentStart = moment(start);
    const momentEnd = moment(end);
    if(momentStart.isSameOrAfter(momentEnd)){
      return Swal.fire('Error', 'La fecha fin debe ser mayor a la fecha de inicio',
                'error');
    }
    if(title.trim().length < 2) {
      return setTitleValid(false);
    }
    
    if (activeEvent) {
      dispatch(eventStartUpdate(formValues));
    } else {
      //agregar nuevo evento
      dispatch(eventStartAddNew(formValues));
    }    

    setTitleValid(true);
    closeModal();
  }

  const closeModal = () => {
    dispatch(uiCloseModal());
    dispatch(eventClearActiveEvent());
    setFormValues(initEvent);
  }

  const handleStartDateChange = (evento) => {
    setDateStart(evento);
    setFormValues({
      ...formValues,
      start: evento
    })
  }
  
  const handleEndDateChange = (evento) => {
    setDateEnd(evento);
    setFormValues({
      ...formValues,
      end: evento
    })
  }

  return (
    <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        style={customStyles}
        closeTimeoutMS={200}
        className='modal'
        overlayClassName='modal-fondo'
    >
      <h1> {(activeEvent) ? 'Editar Evento' : 'Nuevo evento' } </h1>
      <hr />
      <form 
          className="container"
          onSubmit={handleSubmitForm}
      >

          <div className="form-group mb-2">
              <label>Fecha y hora inicio</label>
              <DateTimePicker 
                onChange={handleStartDateChange} 
                value={dateStart}
                className='form-control' 
              />
          </div>

          <div className="form-group mb-2">
              <label>Fecha y hora fin</label>
              <DateTimePicker 
                onChange={handleEndDateChange} 
                value={dateEnd}
                minDate={dateStart}
                className='form-control' 
              />
          </div>

          <hr />
          <div className="form-group mb-2">
              <label>Titulo y notas</label>
              <input 
                  type="text" 
                  className={`form-control ${!titleValid && 'is-invalid'}`}
                  placeholder="Título del evento"
                  name="title"
                  autoComplete="off"
                  value={title}
                  onChange={handleInputChange}
              />
              <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
          </div>

          <div className="form-group mb-2">
              <textarea 
                  type="text" 
                  className="form-control"
                  placeholder="Notas"
                  rows="5"
                  name="notes"
                  value={notes}
                  onChange={handleInputChange}
              ></textarea>
              <small id="emailHelp" className="form-text text-muted">Información adicional</small>
          </div>

          <button
              type="submit"
              className="btn btn-outline-primary btn-block"
          >
              <i className="far fa-save"></i>
              <span> Guardar</span>
          </button>
      </form>
    </Modal>
  )
}
