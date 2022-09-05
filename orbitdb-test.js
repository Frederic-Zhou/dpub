const OrbitDB = require('orbit-db')

async function main() {
  const ipfsOptions = {
    url: "/ip4/127.0.0.1/tcp/5001",
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
  // } = await import('ipfs-core')


  const ipfs = await create(ipfsOptions)


  const orbitdb = await OrbitDB.createInstance(ipfs)

  const options = {
    // Give write access to ourselves
    accessController: {
      write: ['*']
    }
  }

  dbaddress = "helloworld"
  if (process.argv.slice(2).length > 0) {
    dbaddress = process.argv.slice(2)[0]
  }

  console.log("feed db creating")

  const db = await orbitdb.feed(dbaddress, options)

  console.log("feed db created")

  const queryAndRender = async (db) => {
    const result = db.iterator({
      limit: 50
    }).collect()

    if (result && Array.isArray(result) && result.length > 0) {
      const logs = result.slice().reverse().map((e) => {
        return e.payload.value.id + ":" + e.payload.value.cmd
      })


      console.clear()
      console.log(logs.reverse().join('\n'))

    }
  }


  // When the database is ready (ie. loaded), display results
  db.events.on('ready', () => queryAndRender(db))
  // When database gets replicated with a peer, display results
  db.events.on('replicated', () => queryAndRender(db))
  // When we update the database, display result
  db.events.on('write', () => queryAndRender(db))

  db.events.on('replicate.progress', () => queryAndRender(db))

  console.log(db.address.toString())

  console.log(orbitdb.id)

  await db.load()

  commandInput(orbitdb, db)

}

async function commandInput(orbitdb, db) {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  })

  readline.question(`>`, async function (cmd) {

    if (cmd.length > 0) {
      switch (cmd) {
        case '/q':
          return process.exit(0);
          break;
        case '/id':
          console.log(orbitdb.id);
          break;
        case '/addr':
          console.log(db.address.toString());
          break;
        default:
          r = await db.add({
            'id': orbitdb.id,
            'cmd': cmd
          })
          console.log('[' + r + ']')
          break;
      }
    }

    readline.close()

    commandInput(orbitdb, db)
  })

}


main()