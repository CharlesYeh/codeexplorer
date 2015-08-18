import Tweet from '../entities/Tweet';
import {ITweetService} from './Interfaces';

export default class TweetService implements ITweetService{
    public getAll():Array<Tweet>{
       var returnObj:Array<Tweet> = new Array<Tweet>();
        for(var i = 0; i < 5; i++){
            returnObj.push(new Tweet("@user", "Content", false));
        }
        return returnObj;
    }
}
