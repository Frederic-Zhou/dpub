// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
let refreshPeersInterval
let AKA = ''
const main = async () => {

    window.db.onUpdated(async (event, value) => {
        console.log('updated', event, value)
        let messages = await window.db.query(50)

        window.document.getElementById("txta-messages").value = ''
        for (var i = 0; i < messages.length; i++) {
            let prefix = messages[i].id == await window.db.id() ? "[YOU]" : ''
            window.document.getElementById("txta-messages").value += `${prefix}${messages[i].AKA}(${messages[i].id.slice(-4)}):${messages[i].txt} \n`
        }

        window.document.getElementById("txta-messages").scrollTop = window.document.getElementById("txta-messages").scrollHeight;
    })

    window.document.getElementById("li-open").addEventListener("click", async () => {
        clearInterval(refreshPeersInterval)
        let addr = document.getElementById("ipt-message").value
        window.db.open(addr)

        document.getElementById("ipt-message").value = ''


        refreshPeersInterval = setInterval(refreshPeers, 3000)

    });

    window.document.getElementById("li-aka").addEventListener("click", async () => {
        AKA = document.getElementById("ipt-message").value == '' ? AKA : document.getElementById("ipt-message").value
        document.getElementById("ipt-message").value = ''
    });

    window.document.getElementById("btn-send").addEventListener("click", async () => {
        send()
    });

    window.document.getElementById("ipt-message").addEventListener("keydown", async (e) => {
        if (e.key === 'Enter') {
            send()
        }
    });
}


send = async () => {

    try {
        let txt = document.getElementById("ipt-message").value
        if (txt.length > 1) {
            window.db.add({ "txt": txt, "id": await window.db.id(), "AKA": AKA })
        }
    } catch (error) {
        document.getElementById("alert-warning").innerText = `fail:${error}
        Link or Create first!!`
    }
    document.getElementById("ipt-message").value = ''
}

refreshPeers = async () => {
    const nd = await window.db.peers()
    document.getElementById("alert-warning").innerText = `connected peers ${nd[0]} / topic peers ${nd[1]} 
        address: ${await window.db.addr()}
        id:${await window.db.id()} `
}

main()