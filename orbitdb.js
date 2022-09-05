
const OrbitDB = require('orbit-db')
let db, orbitdb

const run = async (e, dbaddress) => {
    const ipfsOptions = {
        relay: {
            enabled: true
        },
        hop: {
            enabled: true,
            active: true
        },
        EXPERIMENTAL: {
            pubsub: true
        },

    }

    const {
        create
    } = await import('ipfs-http-client')


    const ipfs = await create(ipfsOptions)
    orbitdb = await OrbitDB.createInstance(ipfs)
    const options = {
        // Give write access to ourselves
        accessController: {
            write: ['*']
        }
    }

    db = await orbitdb.feed(dbaddress || "helloworld", options)

    // const queryAndRender = async (db) => {
    //     const result = db.iterator({
    //         limit: 50
    //     }).collect()

    //     if (result && Array.isArray(result) && result.length > 0) {
    //         const logs = result.slice().reverse().map((e) => {
    //             return e.payload.value
    //         })
    //         console.clear()
    //         console.log(logs.reverse().join('\n'))
    //     }
    // }

    // When the database is ready(ie.loaded), display results
    db.events.on('ready', () => { updateEvent(e, 'ready') })
    // When database gets replicated with a peer, display results
    db.events.on('replicated', () => { updateEvent(e, 'replicated') })
    // When we update the database, display result
    db.events.on('write', () => { updateEvent(e, 'write') })
    db.events.on('replicate.progress', () => { updateEvent(e, 'replicate.progress') })

    console.log('set update event over')

    await db.load()

    return db.address.toString()
}


const add = async (e, obj) => {
    return await db.add(obj)
}

const updateEvent = async (e, act) => {
    console.log('updated event ', act)
    e.sender.send('updated', act)
}

module.exports = {
    run: run,
    db: db,
    orbitdb: orbitdb,
    add: add,
}