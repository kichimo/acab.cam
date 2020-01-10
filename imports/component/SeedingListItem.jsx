import React, {useState} from 'react'
import { ListItem } from 'react-onsenui'

export default function SeedingListItem({ vid }) {
    
    const [seedingState, setSeedingState] = useState(false)
    const [seedingSpeed, setSeedingSpeed] = useState(0)
    var client = new window.WebTorrent()
    function startseeding() {
        setSeedingState(true)
        setSeedingSpeed(0)
        var torrentId = vid.magnetUri
        client.on('error', err => {
            console.log('[+] Webtorrent error: ' + err.message);
        });

        client.add(torrentId, (torrent) => {
            console.log('Client is downloading:', torrent.infoHash)
            torrent.on('upload', function (bytes) {
                console.log(torrent.uploadSpeed)
                setSeedingSpeed(torrent.uploadSpeed )
            })
        })
    }

    if (seedingState) {
        return <ListItem
            style={{
                color: "grey"
            }}
        >
            <div className="left">{vid.title}</div>
            <div className="center"></div>
            <div className="right">{seedingSpeed / 1000} kb/s</div>
        </ListItem>
    }
    return <ListItem
        tappable
        onClick={() => {
            startseeding()
        }}
    >
        <div className="left">{vid.title}</div>
        <div className="center"></div>
        <div className="right">Not Seeding</div>

    </ListItem>
}
