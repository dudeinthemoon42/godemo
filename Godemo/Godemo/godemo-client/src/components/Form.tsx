import React from 'react';
class Form extends React.Component {
    render() {
        return (
            <div>
                <input id="country" type="text" name="country" placeholder="  Country... " />
                <input id="city" type="text" name="city" placeholder="  City... " />
            </div>
        );
    }
}
export default Form