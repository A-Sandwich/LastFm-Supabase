import { sync_tracks } from "./src/SyncTracks.js";
import { ErrorModel } from "./src/ErrorModel.js";
let sync_errors = [];

const sync_tracks_without_overlap = async () => {
    try{
        if (!isPreviousSyncRunning) {
            isPreviousSyncRunning = true
            await sync_tracks()
            isPreviousSyncRunning = false
        } else {
            console.log("Previous sync is still running. Skipping this sync.")
        }

        let current_time = new Date()
        sync_errors = sync_errors.filter(error =>  current_time - error.timestamp > 600000)
        console.log(`${sync_errors.length} errors in the last 60 minutes`)
    } catch (e) {
        console.log(`Error: ${e}`)
        isPreviousSyncRunning = false
        sync_errors.push(new ErrorModel(e))
        console.log("Error occurred. Skipping this sync.")
    }
}

let isPreviousSyncRunning = false
let sync_interval = 60000
console.log("outputting env vars to ensure proper settings")
console.log(`supabase_url: ${process.env.supabase_url}`)
console.log(`last_fm_user: ${process.env.last_fm_user}`)
console.log(`Syncing every ${sync_interval / 1000} seconds starting in ${sync_interval / 1000} seconds`)
setInterval(sync_tracks_without_overlap, sync_interval)