import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector}  from 'react-redux';
import {Calendar, momentLocalizer}  from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import {Navbar}   from '../ui/Navbar';
import {messages}   from '../../helpers/calendar-messages-es';
import {CalendarEvent}  from './CalendarEvent';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {CalendarModal} from './CalendarModal';
import {uiOpenModal} from '../../actions/ui';
import {eventClearActiveEvent, eventSetActive, eventStartLoading}  from '../../actions/events';
import { AddNewFab } from '../ui/AddNewFab';
import { DeleteEventFab } from '../ui/DeleteEventFab';

//configurar moment en español:
moment.locale('es');

const localizer = momentLocalizer(moment);

export const CalendarScreen = () => {
  
  const dispatch = useDispatch();

  const {events, activeEvent} = useSelector(state => state.calendar);

  const {uid} = useSelector(state => state.auth);
  
  const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'month');

  useEffect(() => {
    dispatch(eventStartLoading());
  }, [dispatch]);  

  const onDoubleClick = (evento) => {
    dispatch(uiOpenModal());
  }

  const onSelectEvent = (evento) => {
    dispatch(eventSetActive(evento));
  }

  //almacenamiento en el storage de la view (day, week, month, agenda)
  const onViewChange = (evento) => {
    setLastView(evento);
    localStorage.setItem('lastView', evento);
  }

  const onSelectSlot = (evento) => {
    dispatch(eventClearActiveEvent());
  }

  const eventStyleGetter = (event, start, end, isSelected) => {
    return { style : {
      backgroundColor: (uid === event.user._id) ? '#367CF7' : '#465660',
      borderRadius: '0px',
      opacity: 0.8,
      display: 'block',
      color: 'white'
    }};
  };
  
  return (
    <div className='calendar-screen'>
        <Navbar/>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          messages={messages}
          eventPropGetter={eventStyleGetter}
          onDoubleClickEvent={onDoubleClick}
          onSelectEvent={onSelectEvent}
          onView={onViewChange}
          onSelectSlot={onSelectSlot}
          selectable={true}
          view={lastView}
          components={{
            event: CalendarEvent
          }}
        />
        <AddNewFab/>
        {
          (activeEvent) && <DeleteEventFab/>
        }
        <CalendarModal/>
    </div>
  )
}
