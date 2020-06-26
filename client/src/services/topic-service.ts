import axios from "axios";
import Statics from '@/shared/statics';
import TopicStatistic from '@/models/TopicStatistic';

export default class TopicService {
    static getTopTenTopics() {
        return axios.get<TopicStatistic[]>(Statics.baseApiUrl + "gettoptentopics");
    }

    static getMatchingTopics(searchValue: string) {
        return axios.get<TopicStatistic[]>(Statics.baseApiUrl + "findmatchingtopics", {
            params: {
                searchValue: searchValue
            }
        })
    }
}