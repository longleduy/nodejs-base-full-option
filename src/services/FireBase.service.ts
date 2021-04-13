// Commons
import FireBaseUtil from '../utils/FireBase.util';
import {MyRequest} from "../models/MyRequest.model";
import {ServerError} from "../utils/errors/ServerError.error";

class FireBaseService {
    errorName = 'FireBaseError'
    public async pushData(req: MyRequest, ref: string, child: string, data: object): Promise<any> {
        const pushData = {
            ...data,
            create_at: new Date().toISOString(),
            update_at: new Date().toISOString()
        }
        const reference = FireBaseUtil.fireBaseDB.ref(ref);
        const childRef = reference.child(child);
        childRef.push(pushData, (err) => {
            if (err) throw new ServerError({name: this.errorName})
            else console.log('SUCCESS');
        })
    }
    public async findAll(ref: string): Promise<any> {
        const reference = FireBaseUtil.fireBaseDB.ref(ref);
        const data = await reference.once('value',function(snap){
            return snap.val();
        },(err) => {
            if (err) throw new ServerError({name: this.errorName})
        });
        return data;
    }
    public async findById(ref: string, child: string, idKey: string): Promise<any[]> {
        const reference = FireBaseUtil.fireBaseDB.ref(ref);
        const childRef = reference.child(child);
        let data: any[] = []
        await childRef.once('value',snap => {
            if(snap.val()){
                data = this.convertObjectToArray(snap.val(), idKey);
            }
        });
        return data;
    };
    public convertObjectToArray(data: any, idKey: string): any[]{
        const keys = Object.keys(data);
        const arr: any[] = [];
        keys.forEach(key => {
            const object = data[key];
            object[idKey] = key;
            arr.unshift(object);
        });
        return arr;
    }
}
export default new FireBaseService();