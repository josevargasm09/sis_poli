import React, { useState, useEffect, useRef } from 'react';
import { geocodeByAddress,geocodeByPlaceId,getLatLng } from 'react-places-autocomplete';
import PlacesAutocomplete from 'react-places-autocomplete';
import { InputText } from 'primereact/inputtext';
import '../../../css/app.css';

function AutoCompleteMap (props) {

    const [address, setAdress] = useState(props.complaint.direccionHecho);
    const [coordinates, setCoordinates] = useState({
        lat: null,
        lng: null
    });
  
    const handleSelect = async value => {
        const results = await geocodeByAddress(value);
        const ll = await getLatLng(results[0]);
        console.log(ll);

        const autoCompleteMap=props.onAutoCompleteMap;
        autoCompleteMap(value,ll)
        setAdress(value);
        setCoordinates(ll);
    };
    const onInputChangeAutoComplete = (e) => {
        setAdress(e);
        const onInputChangeAutoComplete=props.onInputChangeAutoComplete;
        onInputChangeAutoComplete(e)
        // let _complaint = { ...complaint };
        // _complaint[`${name}`] = val;

        // setComplaint(_complaint);
    }
    const onchangeAdress=(e)=>{
        
    }
    // onInputChangeAutoComplete
  return (
    // Important! Always set the container height explicitly
    <div >

<PlacesAutocomplete
                value={address}
                onChange={e => onInputChangeAutoComplete(e)}
                onSelect={handleSelect}

            >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div
                        key={suggestions.description}

                    >
                        <InputText
                            {...getInputProps({
                                placeholder: 'Buscar Ubicacion ...',
                                className: 'location-search-input',
                            })}
                           
                        />
                        <div className="autocomplete-dropdown-container">
                            {suggestions.map(suggestion => {
                                const className = suggestion.active
                                    ? 'suggestion-item--active'
                                    : 'suggestion-item';
                                // inline style for demonstration purpose
                                const style = suggestion.active
                                    ? { backgroundColor: '#fafafa', cursor: 'pointer'}
                                    : { backgroundColor: '#ffffff', cursor: 'pointer'};
                                return (
                                    <div key={suggestion.index}
                                        {...getSuggestionItemProps(suggestion, {
                                            className,
                                            style,
                                        })}
                                    >
                                        <div className='result-search'>{suggestion.description} </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

            </PlacesAutocomplete>



        </div>
  );
}
export default AutoCompleteMap;
