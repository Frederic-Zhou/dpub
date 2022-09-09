
const OrbitDB = require('orbit-db')
let db, orbitdb, ipfs

const open = async (e, dbaddress) => {
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


    ipfs = await create(ipfsOptions)
    orbitdb = await OrbitDB.createInstance(ipfs)
    const options = {
        // Give write access to ourselves
        accessController: {
            write: ['*']
        }
    }

    db = await orbitdb.feed(dbaddress || "helloworld", options)
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

const add = async (_, obj) => {
    return await db.add(obj)
}

const query = async (_, size) => {
    const result = db.iterator({
        limit: size || 10
    }).collect()

    if (result && Array.isArray(result) && result.length > 0) {
        const logs = result.slice().reverse().map((e) => {
            return e.payload.value
        })

        return logs.reverse()
    }

    return []

}

const updateEvent = async (e, act) => {
    console.log('updated event ', act)
    e.sender.send('updated', act)
}

const id = async (e) => {
    return orbitdb.id
}

const addr = async (e) => {
    return db.address.toString()
}

const peers = async (e) => {
    const networkPeers = await ipfs.swarm.peers()
    const databasePeers = await ipfs.pubsub.peers(db.address.toString())

    console.log([networkPeers.length, databasePeers.length])

    return [networkPeers.length, databasePeers.length]
}

module.exports = {
    open: open,
    add: add,
    query: query,
    id: id,
    addr: addr,
    peers: peers
}