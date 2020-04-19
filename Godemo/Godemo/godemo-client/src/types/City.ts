/**
 ************************
    City: Model
    - JSON model coming from weather API according to documentation (must match exactly)
 * **********************
 **/

import { Country } from './Country';

export interface City {
    Key: string;
    EnglishName: string;
    Type: string;
    Country: Country;
};