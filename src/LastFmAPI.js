import { Client } from 'node-rest-client';
import { sleep } from './SleepUtil.js';

class LastFMApi{
    url = ""
    last_fm_user = process.env.last_fm_user
    last_event_epoch_time = null

    constructor(last_event_epoch_time) {
        this.last_event_epoch_time = last_event_epoch_time === undefined ? null : last_event_epoch_time
    }

    base_url = () => {
        this.url = "https://ws.audioscrobbler.com/2.0/";
        return this;
    }
    
    user = (last_fm_user) => {
        this.url = `${this.format_url_for_query_param(this.url)}user=${last_fm_user}`;
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
    from = (epoch_time) => {
        if (epoch_time == null || epoch_time == undefined)
            epoch_time = 0
        this.url = `${this.format_url_for_query_param(this.url)}from=${epoch_time}`;
        return this
    }

    returnUrl = () => this.url
    get_recent_tracks_url = () => {
        return this.base_url().method().user(this.last_fm_user).api_key().json_format().now_playing().returnUrl()
    }
    get_recent_tracks_with_paging_url = (page, epoch_start_time) => {
        return this.base_url().method().user(this.last_fm_user).api_key().json_format().now_playing().page(page).from(epoch_start_time).returnUrl()
    }
    page = (page) => {
        this.url = `${this.format_url_for_query_param(this.url)}page=${page}`;
        return this
    }
}

class SyncState {
    page = 1
    page_count = 1
    all_tracks = []
    errors = []

    push_error = (error_message) => {
        console.log(`Error: ${error_message}`)
        this.errors.push({
            "page": this.page,
            "error": error_message,
            "url": this.url
        })
    }
}

export const get_all_tracks_after_epoch = async (epoch_time) => {
    var client = new Client();
    const last_fm = new LastFMApi()
    let sync_state = new SyncState()
    while (sync_state.page <= sync_state.page_count){
        try {
            let request = generate_recent_track_request(client, last_fm, sync_state.page, epoch_time)
            sync_state = await process_request(request, sync_state)
            await sleep(125)
        } catch (error) {
            sync_state.push_error(error)
        }
    }
    console.log(`Errors: ${JSON.stringify(sync_state.errors)}`)
    return sync_state.all_tracks
}

const process_request = async (request, sync_state) => {
    await request.then((data, raw_data) => {
        if (data !== undefined) {
            console.log(`Processed page ${sync_state.page} of ${sync_state.page_count}. ${sync_state.errors.length} errors.`)
            sync_state.all_tracks = sync_state.all_tracks.concat(data.track)
            sync_state.page_count = Number(data["@attr"].totalPages)
            sync_state.page += 1
        } else {
            sync_state.push_error(`Potential error: ${raw_data}`)  
        }
    })
    return sync_state
}

const generate_recent_track_request = async (client, last_fm, page, epoch_time) => {
    return new Promise((resolve, _) => {
        client.get(last_fm.get_recent_tracks_with_paging_url(page, epoch_time), function (data, _) {
            resolve(data.recenttracks, data);
        });
    });
}