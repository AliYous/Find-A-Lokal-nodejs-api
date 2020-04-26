module.exports = {
    localProfileIsComplete(local) {
            var isComplete = false
            if (local.name && local.localCity && local.hourlyRate && local.quote) {
                isComplete = true
            }
            return isComplete
    }
}
