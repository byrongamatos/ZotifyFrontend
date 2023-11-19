import  connectedKnex  from './db.js'

export function setZotipyStatus(value){
    return connectedKnex("settings").update({value: value}).where('name', '=', 'status')
}

export function getZotipyStatus(){
   return connectedKnex("settings").select('value').where('name', '=', 'status')
}