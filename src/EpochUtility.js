export const generate_epoch_from_date = (date) => {
    return Math.floor(date / 1000)
}

export const add_month_to_epoch = (epoch) => {
    let starting_date = new Date(epoch)
    let starting_month = starting_date.getMonth()
    if (starting_month < 11) {
        let ending_date = new Date(starting_date.getUTCFullYear(), starting_month + 1, 1)
        return ending_date.epoch
    }
    let ending_date = new Date(starting_date.getUTCFullYear() + 1, 0, 1)
    return ending_date.epoch
}