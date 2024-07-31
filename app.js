import { sync_tracks } from "./src/SyncTracks.js";

const sync_tracks_without_overlap = async () => {
    if (!isPreviousSyncRunning) {
        isPreviousSyncRunning = true
        await sync_tracks()
        isPreviousSyncRunning = false
    } else {
        console.log("Previous sync is still running. Skipping this sync.")
    }
}

let isPreviousSyncRunning = false
let sync_interval = 60000
console.log(`Syncing every ${sync_interval / 1000} seconds starting in ${sync_interval / 1000} seconds`)
setInterval(sync_tracks_without_overlap, 60000)