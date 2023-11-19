import  connectedKnex  from './db.js'

function createQueueElement(queueElement) {
    return connectedKnex("queue").insert(queueElement)
}

function deleteQueueElement(id) {
    return connectedKnex("queue").where("id", id).del()
}

function getNextQueueElement() {
    return connectedKnex("queue").limit(1)
}

function createTask(task) {
    return connectedKnex("tasks").insert(task)
}

function deleteTask(id) {
    return connectedKnex("tasks").where("id", id).del()
}

function getNexTask() {
    return connectedKnex("tasks").limit(1)
}

function createHistoryElement(historyElement) {
    return connectedKnex("history").insert(historyElement)
}

function getHistory() {
    return connectedKnex("history").limit(20).orderBy("id", "desc")
}

function getQueueStats() {
    return connectedKnex("tasks").select(connectedKnex.raw("coalesce(sum(total_tracks), 0) as numsongs, count(id) as numalbums"))
}

export {createQueueElement, deleteQueueElement, getNextQueueElement, createTask, deleteTask, getNexTask, createHistoryElement, getHistory, getQueueStats}