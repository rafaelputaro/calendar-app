import React from 'react';
import ReactDOM from 'react-dom/client';
import {CalendarApp}   from './CalendarApp';
import './styles.css'

console.log(process.env.REACT_APP_API_URL);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <CalendarApp />
);
