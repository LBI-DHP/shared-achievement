import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

export default class dataManager {
    /*
     * Usage:
     *  import DataManager: import dataManager from "../components/DataManager"
     *  call getUserId (returns a promise): dataManager.getUserId()
     *
     * TODO:
     *  some more error handling
     */

    static getUserId = async () => {
        let id = await AsyncStorage.getItem('uuid')
        if(id == null){
            console.log("generate UUID")
            id = uuid.v4().toString(); // something like '11edc52b-2918-4d71-9058-f7285e29d894'
            await AsyncStorage.setItem('uuid', id)
        }
        return id.toString()
    }

}