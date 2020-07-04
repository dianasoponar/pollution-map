import * as Icon from 'react-bootstrap-icons';
import React from 'react';


export const addEmoji = (airQuality) => {
    if (airQuality <= 300)
        return <Icon.EmojiLaughing style={{color: "#28CE5B", width: "2em", height: "2em"}}/>
    else if (airQuality > 300 && airQuality <= 600)    
        return <Icon.EmojiSmile style={{color: "#C7DB35", width: "2em", height: "2em"}}/>
    else if (airQuality > 600 && airQuality <= 900)
        return <Icon.EmojiNeutral style={{color: "orange", width: "2em", height: "2em"}}/>
    else if (airQuality > 900 && airQuality <= 1200)
        return <Icon.EmojiFrown style={{color: "#ED4034", width: "2em", height: "2em"}}/>
    else if (airQuality > 1200 )
        return <Icon.EmojiAngry style={{color: "#8B1EE0", width: "2em", height: "2em"}}/>
}

// export const markersList = [{
//     latitude: 55.6813442,
//     longitude: 12.5837843,
//     address: 'Ny Adelgade 6-12, 1107 København',
//     info: 'Enjoy your usual outdoor activities.',
//     pollutionIndex: 211.5,
//   },
//   {
//     latitude: 55.6863442,
//     longitude: 12.5937843,
//     address: 'Amaliegade 29B, 1256 København',
//     info: 'Air quality is  acceptable.',
//     pollutionIndex: 314.25,
//   },
//   {
//     latitude: 55.6873442,
//     longitude: 12.5737843,
//     address: 'Indre By, 1353 Copenhagen Municipality',
//     info: 'Air quality is  acceptable.',
//     pollutionIndex: 356.5,
//   },
//   {
//     latitude: 55.6763442,
//     longitude: 12.5946843,
//     address: 'Wilders Pl. 13, 1403 København',
//     info: 'Enjoy your usual outdoor activities.',
//     pollutionIndex: 279.2,
//   },
//   {
//     latitude: 55.6713442,
//     longitude: 12.5737843,
//     address: 'Anker Heegaards Gade 7-1, 1572 København',
//     info: 'May be unhealty for sensitive groups.',
//     pollutionIndex: 604.11,
//   },
//   {
//     latitude: 55.6773442,
//     longitude: 12.6137843,
//     address: 'Lindegang, 2300 København',
//     info: 'Unhealty. Try to reduce your outdoor activities.',
//     pollutionIndex: 945.84,
//   },
//   {
//     latitude: 55.668492,
//     longitude: 12.626053,
//     address: 'Yderlandsvej 27-3 2300 København ',
//     info: 'May be unhealty for sensitive groups.',
//     pollutionIndex: 701.7,
//   },
//   {
//     latitude: 55.6743442,
//     longitude: 12.5935842,
//     address: 'Overgaden Neden Vandet 51B, 1414 København',
//     info: 'Enjoy your usual outdoor activities.',
//     pollutionIndex: 210.23,
//   },
//   {
//     latitude: 55.6908152,
//     longitude: 12.5323703,
//     address: 'Mariendalsvej 57, 2000 Frederiksberg',
//     info: 'Enjoy your usual outdoor activities.',
//     pollutionIndex: 201.3,
//   },
//   {
//     latitude: 55.6961966,
//     longitude: 12.5354282,
//     address: 'Lundtoftegade 77, 2200 København',
//     info: 'Air quality is  acceptable.',
//     pollutionIndex: 345.9,
//   },
//   {
//     latitude: 55.690216, 
//     longitude: 12.517390,
//     address: 'Godthåbsvej 176 2000 Frederiksberg',
//     info: 'Air quality is  acceptable.',
//     pollutionIndex: 501.6,
//   },
// ];
