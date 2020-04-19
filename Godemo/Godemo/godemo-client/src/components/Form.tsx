/**
 ***************************
    Form: Class Component
 * *************************
 * */

import React from 'react';
import { Button, FormControl } from 'react-bootstrap';
import { AsyncTypeahead, Typeahead } from 'react-bootstrap-typeahead';
import { Country } from '../types/Country';
import { City } from '../types/City';

interface IState {
    city: City;
    country: Country;
    cities: City[];
    searchText: string
};

interface IProps {
    /* The http path that the form will be posted to */
    getWeather: (e: any, countryCode: string, serachText: string) => Promise<void>;
    countries: Country[];
}


class Form extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            city: {} as City,
            country: {} as Country,
            cities: [],
            searchText: ""
        }
    };

    // is there a better way to declare a static method than this?
    // let myAdd = function(x: number, y: number): number { ... }
    // ?
    // above is syntax according to typescript docs..this doesn't work with react for some reason..
    static isLetter = function(c: string): any {
        return c.toLowerCase() != c.toUpperCase();
    }

    // getting error with my API call, with string that looks like '%20%20%20AU', etc. instead of just 'AU' - so this function filters out all non-letter characters!
    static onlyLetters = function(array: string[]): string {
        let arr2 = []
        for(let i = 0; i < array.length; i++){
            if(Form.isLetter(array[i])){
              arr2.push(array[i])
            }
        }
        return arr2.join("");
    }

    static filterLetters = function(str: string): string {
        return str
            .toLowerCase()
            .split("")
            .filter(c => c >= 'a' && c <= 'z')
            .join('');
    }

    // now we define our handler for submit
    handleSubmit = async (e: any) => {
        let filteredCountryId = Form.filterLetters(this.state.country.ID);
        this.props.getWeather(e, this.state.country.ID, this.state.searchText);
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>

                <div className="container-fluid">
                    <div className="row">

                        <div className="col-sm-4 form-group">
                            <Typeahead
                                id="country"
                                labelKey="EnglishName"
                                options={ this.props.countries }
                                onChange={(s) => this.setState({ country: s[0] } as IState)}
                                placeholder="Country..."
                            />
                        </div>

                        <div className="col-sm-4 form-group field">
                            <FormControl id="city" type="text" name="city" 
                             onChange={(e: any) => this.setState
                             ({ searchText: e.target.value })} placeholder="  City... " />
                        </div>

                        <div className="col-sm-2 form-group field">
                            <Button variant="primary" type="submit"> Go </Button>
                        </div>

                    </div>
                </div>

            </form>
        );
    }
}
export default Form