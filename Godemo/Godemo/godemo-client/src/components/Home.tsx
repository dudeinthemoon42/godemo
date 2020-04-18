import React from 'react';
import Form from './Form';
import WeatherDetails from './WeatherDetails';
class Home extends React.Component {
    render() {
        return (
            <div className="App">
                <WeatherDetails />
                <Form />
            </div>
        );
    }
}
export default Home;