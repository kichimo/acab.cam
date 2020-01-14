import React, { useState, useEffect } from 'react'
import { ListItem, Icon } from 'react-onsenui'

export default function SeedingListItem({ vid, client }) {

    const [seedingState, setSeedingState] = useState(false)
    const [uploadSpeed, setUploadSpeed] = useState(0)
    const [downloadSpeed, setDownloadSpeed] = useState(0)
    const [torrent, setTorrent] = useState(undefined)
    useEffect(() => {
        const interval = setInterval(() => {
            if (seedingState) {
                if (torrent != undefined) {
                    if (torrent.downloadSpeed == 0) {
                        console.log("check!")
                        setDownloadSpeed(0)
                    }
                    if (torrent.uploadSpeed == 0) {
                        console.log("check!2")
                        setUploadSpeed(0)
                    }
                }
            }
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    function startseeding() {
        setSeedingState(true)
        setUploadSpeed(0)
        setDownloadSpeed(0)
        var torrentId = vid.magnetUri
        client.on('error', err => {
            console.log('[+] Webtorrent error: ' + err.message);
        });

        client.add(torrentId, (torrent) => {
            setTorrent(torrent)
            console.log('Client is downloading:', torrent.infoHash)
            torrent.on('upload', function (bytes) {
                setUploadSpeed(torrent.uploadSpeed)
            })
            torrent.on('download', function (bytes) {
                setDownloadSpeed(torrent.downloadSpeed)
            })
        })
    }
    function stopSeeding() {
        setSeedingState(false)
        setUploadSpeed(0)
        setDownloadSpeed(0)
        client.remove(vid.magnetUri, () => {
            console.log('stop seeding ' + vid.title)
        })
    }

    if (seedingState) {
        return <ListItem
            tappable
            style={{
                color: "grey"
            }}
            onClick={() =>
                stopSeeding()
            }
        >
            <div className="left">{vid.title}</div>
            <div className="center"></div>
            <div className="right">
                <Icon icon="arrow-down" />
                {(downloadSpeed / 1024).toFixed(2)} kb/s
            <Icon icon="arrow-up" />
                {(uploadSpeed / 1024).toFixed(2)} kb/s
            </div>
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
