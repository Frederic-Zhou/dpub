// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const func = async () => {

    let response = await window.db.run('hello111')
    console.log('response', response) // prints out 'pong'
    response = await window.db.add({ 'txt': 'hello world' })
    console.log('response', response) // prints out 'pong'

    response = await window.db.query()
    console.log('list', response)

    response = await window.db.id()
    console.log('id', response)

    response = await window.db.addr()
    console.log('addr', response)
}


window.db.onUpdated((event, value) => {
    console.log('updated', event, value)
})

func()