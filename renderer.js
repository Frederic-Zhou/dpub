// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const func = async () => {

    let response = await window.orbitdb.run('hello111')
    console.log('response', response) // prints out 'pong'
    response = await window.orbitdb.add({ 'txt': 'hello world' })
    console.log('response', response) // prints out 'pong'

}


window.orbitdb.handleUpdated((event, value) => {
    console.log('updated', value)
})

func()