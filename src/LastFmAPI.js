import { Client } from 'node-rest-client';

class LastFMApi{
    url = ""
    default_user = process.env.last_fm_user
    last_event_epoch_time = null

    constructor(last_event_epoch_time) {
        this.last_event_epoch_time = last_event_epoch_time === undefined ? null : last_event_epoch_time
    }

    base_url = () => {
        this.url = "https://ws.audioscrobbler.com/2.0/";
        return this;
    }
    
    user = (user) => {
        this.url = `${this.format_url_for_query_param(this.url)}user=${user}`;
        return this;
    }
    
    format_url_for_query_param = () => {
        if (this.url.endsWith("?") || this.url.endsWith("&"))
            return this.url

        if (this.url == null || this.url == "")
            baseUrl()
        
        if (!this.url.includes("?"))
            this.url = `${this.url}?`;
        else
            this.url = `${this.url}&`;

        return this.url
    }
    
    method = (method) => {
        if (method == null || method == "")
            method = `user.getrecenttracks`
        this.url = `${this.format_url_for_query_param(this.url)}method=${method}`;
        return this
    }
    
    api_key = () => {
        let key = process.env.last_fm_api_key
        this.url = `${this.format_url_for_query_param(this.url)}api_key=${key}`;
        return this
    }
    
    json_format = () => {
        this.url = `${this.format_url_for_query_param(this.url)}format=json`;
        return this
    }
    
    now_playing = () => {
        this.url = `${this.format_url_for_query_param(this.url)}nowplaying=true`;
        return this
    }

    returnUrl = () => this.url
    get_recent_tracks_url = () => {
        return this.base_url().method().user().api_key().json_format().now_playing().returnUrl()
    }
}

export async function getRecentTracks(last_epoch_event_time) {
    var client = new Client();
    const last_fm = new LastFMApi(last_epoch_event_time)
    let request = new Promise((resolve, reject) => {
        client.get(last_fm.get_recent_tracks_url(), function (data, response) {
            resolve(data.recenttracks);
        });
    });
    return request.then((data) => {
        return data
    })
}