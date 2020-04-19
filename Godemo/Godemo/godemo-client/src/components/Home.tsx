/**
 ***************************
    Home: Class Component
 * *************************
 **/

import React from 'react';
import Form from './Form';
import WeatherDetails from './WeatherDetails';
import { Country } from '../types/Country';
import { City } from '../types/City';
import { Weather } from '../types/Weather';
import { Constants } from '../Constants';
import { CurrentCondition } from '../types/CurrentCondition';

interface IProp { }

interface IState {
    weather: Weather,
    countries: Country[],
    city?: City
};

class Home extends React.Component<IProp, IState> {

    constructor(props: IProp) {
        super(props);
        this.state = {
            weather: { error: "" } as Weather,
            countries: [],
            city: undefined
        }
    };

    /* FUNCTION DECLARATION FORMAT
     * 
     * NORMAL
     * -------------
       function fnName(params: any): returnType { 
            var result = doLogic();
            return result as returnType;
       }
     * -------------
     *
     * ASYNC
     * -------------
     * 
       async otherFunc(params: any): Promise<returnType> {
            var result = await fetch(url); // fetch async some data
            return await result as returnType;
       }
     * -------------
       (use await for fetch to resolve Promise)
     *
    **/

    async filterLetters(str: string): Promise<string> {
        return str
            .toLowerCase()
            .split("")
            .filter(c => c >= 'a' && c <= 'z')
            .join('');
    }

    // async GetCountries() method 
    // return type: a promise for a list of Countries
    async getCountries(): Promise<Country[]> {
        try {
            const result = await fetch(Constants.locationAPIUrl + '/countries?apikey=' + Constants.apiKey);

            // cast as actual array of Country from promise.await() (this awaits the promise being resolved before casting the result)
            // assume service we call returns a JSON encoded string which contains our data (refer to weather API docs)
            return await result.json() as Country[];

        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async getCity(searchText: string, countryCode: string): Promise<City> {
        let filteredCountryCode = await this.filterLetters(countryCode);
        // turns out the issue was the `${countryCode} ` format - creating codes like '%20%20%20AU' etc. instead of 'AU'
        // don't use the shortcut substitution, just to the manual string concatenation
        const res = await fetch(Constants.locationAPIUrl + /cities/ +
                countryCode + '/search?apikey=' + Constants.apiKey + '&q=' + searchText);
        const cities = await res.json() as City[];
        if (cities.length > 0)
            return cities[0];
        return {} as City;
    }

    async getCurrentConditions(city: City) {
        try {
            const res = await fetch(Constants.currentConditionsAPIUrl + '/' +
                                 city.Key + '?apikey=' + Constants.apiKey);
            const currentConditions = await res.json() as CurrentCondition[];
            if (currentConditions.length > 0) {
                const weather = new Weather(currentConditions[0], city);
                await this.setStateAsync({
                    weather: weather,
                    city: city
                } as IState);
            }
        } catch (error) {
            console.log(error);
        }
        return {} as Weather;
    }

    getWeather = async (e: any, countryCode: string, searchText: string) => {
        e.preventDefault();
        if (!countryCode && !searchText) {
            await this.setStateAsync
                ({ weather: { error: "Please enter the value." } } as IState);
            return;
        }
        try {
            const city = await this.getCity(searchText, countryCode);
            if (city.Key) {
                await this.getCurrentConditions(city);
            }
        } catch (err) {
            await this.setStateAsync({ weather: { error: err } } as IState);
        }
    };

    // use DidMount() to call GetCountries()
    async componentDidMount() {
        try {
            const countries = await this.getCountries();
            await this.setStateAsync({ countries: countries } as IState);
        } catch (error) { }
    }

    // replaces React.Component's SetState method which is not asynchronous by default
    async setStateAsync(state: IState) {
        return new Promise((resolve: any) => {
            this.setState(state, resolve);
        });
    }

    render() {
        return (
            <div className="container content panel">
                <div className="container">
                    <div className="row">
                        <div className="form-container">

                            <WeatherDetails weather={this.state.weather} />

                            <Form getWeather={this.getWeather} countries={this.state.countries} />

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Home;