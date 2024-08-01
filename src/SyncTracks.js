import { get_most_recent_track_with_date } from './FetchData.js'
import { get_all_tracks_after_epoch } from './LastFmAPI.js'
import { insert_tracks } from './SupabaseWrapper.js'

export const sync_tracks = async () => {
    console.log(`Starting sync at ${new Date().toISOString()}`)
    const most_recent_track_with_date = await get_most_recent_track_with_date()
    const starting_epoch_time =  most_recent_track_with_date.at(0)?.date ?? 0
    
    let recent_tracks = await get_all_tracks_after_epoch(starting_epoch_time)
    let insertable_tracks = get_insertable_tracks(recent_tracks, starting_epoch_time)

    // persist data
    insert_tracks(insertable_tracks)
    console.log(`Sync completed at ${new Date().toISOString()}`)
}


const get_insertable_tracks = (tracks, starting_epoch_time) => {
    let ordered_tracks = tracks
    .sort(compare_track_data)
    let filtered_tracks = ordered_tracks.filter((track) => track.date?.uts !== undefined ? Number(track.date.uts) > starting_epoch_time : true)
    return filtered_tracks
    .map((track) => {
        return {
            "artist": track.artist["#text"],
            "album": track.album["#text"],
            "name": track.name,
            "date": Number(track.date?.uts ?? Date.now()),
            "album_art_url": track.image[0]["#text"],
        }
    })
}

const compare_track_data = (track1, track2) => {
    if (track1?.date?.uts === undefined || track2?.date?.uts === undefined) {
        return 0
    }
    
    return Number(track1.date.uts) - Number(track2.date.uts)
}